const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req,res)=>{
  const city = req.query.city || '';
  const [rows] = await pool.query('SELECT id,name,city,cuisine,avg_rating,cover_image FROM restaurants WHERE city LIKE ? LIMIT 100',['%'+city+'%']);
  res.json({ data: rows });
});

router.get('/:id', async (req,res)=>{
  const id = req.params.id;
  const [[r]] = await pool.query('SELECT * FROM restaurants WHERE id=?',[id]);
  const [menu] = await pool.query('SELECT * FROM menu_items WHERE restaurant_id=?',[id]);
  res.json({ restaurant: r, menu });
});

module.exports = router;
