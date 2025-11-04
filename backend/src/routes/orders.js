const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req,res)=>{
  try {
    const userId = req.header('x-user-id');
    if(!userId) return res.status(401).json({error:'x-user-id header required (for demo)'});
    const { address } = req.body;
    // Very simple: take cart items and create an order
    const [[cart]] = await pool.query('SELECT * FROM carts WHERE user_id=?',[userId]);
    if(!cart) return res.status(400).json({error:'cart empty'});
    const [items] = await pool.query('SELECT ci.id,mi.id as menu_item_id,mi.price,ci.quantity FROM cart_items ci JOIN menu_items mi ON ci.menu_item_id=mi.id WHERE ci.cart_id=?',[cart.id]);
    let total = 0;
    for(const it of items) total += Number(it.price) * it.quantity;
    const [ord] = await pool.query('INSERT INTO orders (user_id,restaurant_id,total,status,address) VALUES (?,?,?,?,?)',[userId,cart.restaurant_id||null,total,'placed',address||'']);
    const orderId = ord.insertId;
    for(const it of items){
      await pool.query('INSERT INTO order_items (order_id,menu_item_id,quantity,price) VALUES (?,?,?,?)',[orderId,it.menu_item_id,it.quantity,it.price]);
    }
    // clear cart
    await pool.query('DELETE FROM cart_items WHERE cart_id=?',[cart.id]);
    res.json({ orderId, total });
  } catch(err){ console.error(err); res.status(500).json({error:'server error'}); }
});

router.get('/', async (req,res)=>{
  try{
    const userId = req.header('x-user-id');
    if(!userId) return res.status(401).json({error:'x-user-id header required (for demo)'});
    const [orders] = await pool.query('SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC',[userId]);
    res.json({ orders });
  }catch(err){ console.error(err); res.status(500).json({error:'server error'}); }
});

module.exports = router;
