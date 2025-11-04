// db.js - exports a small compatibility layer that uses MySQL (mysql2) by default
// but can fallback to a file-based SQLite DB when DB_FALLBACK=sqlite is set.
const useSqlite = (process.env.DB_FALLBACK || '').toLowerCase() === 'sqlite';

if(!useSqlite){
  const mysql = require('mysql2/promise');
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'fastbite',
    waitForConnections: true,
    connectionLimit: 10
  });
  module.exports = pool;
} else {
  // Lightweight sqlite wrapper that provides a .query(sql, params) -> Promise<[rows]>
  const Database = require('better-sqlite3');
  const path = require('path');
  const fs = require('fs');
  const dbPath = path.join(__dirname, '..', 'data', 'fastbite.sqlite');
  const dbDir = path.dirname(dbPath);
  if(!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
  const db = new Database(dbPath);

  // Ensure users table exists (schema compatible with MySQL users table)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      city TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Export a minimal promise-based API that mirrors mysql2 pool.query returning [rows]
  module.exports = {
    query: (sql, params=[]) => {
      return new Promise((resolve, reject) => {
        try{
          const stmt = db.prepare(sql);
          // Determine statement type
          const lower = sql.trim().toLowerCase();
          if(lower.startsWith('select')){
            const rows = stmt.all(Array.isArray(params) ? params : [params]);
            resolve([rows, undefined]);
          } else if(lower.startsWith('insert')){
            const info = stmt.run(Array.isArray(params) ? params : [params]);
            // mimic mysql2 insert result shape where insertId is in result.insertId
            resolve([{ insertId: info.lastInsertRowid }, undefined]);
          } else {
            const info = stmt.run(Array.isArray(params) ? params : [params]);
            resolve([{ affectedRows: info.changes }, undefined]);
          }
        }catch(err){
          reject(err);
        }
      });
    },
    // helper for closing in tests
    close: () => db.close()
  };
}
