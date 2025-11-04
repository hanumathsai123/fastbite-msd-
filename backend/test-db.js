require('dotenv').config();
const pool = require('./src/db');
(async ()=>{
  try{
    const [rows] = await pool.query('SELECT 1 as ok');
    console.log('DB OK', rows);
    process.exit(0);
  }catch(err){
    console.error('DB ERROR');
    console.error(err);
    process.exit(1);
  }
})();
