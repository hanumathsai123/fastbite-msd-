const express = require('express');
const router = express.Router();
const pool = require('../db');

// NOTE: This is a minimal placeholder cart implementation keyed by userId in header 'x-user-id' for submission.
router.post('/', async (req,res)=>{
  try {
    const userId = req.header('x-user-id');
    if(!userId) return res.status(401).json({error:'x-user-id header required (for demo)'});
    const { menuItemId, quantity } = req.body;
    // find or create cart
    const [[cart]] = await pool.query('SELECT * FROM carts WHERE user_id=?',[userId]);
    let cartId = cart ? cart.id : null;
    if(!cartId){
      const [r] = await pool.query('INSERT INTO carts (user_id) VALUES (?)',[userId]);
      cartId = r.insertId;
    }
    await pool.query('INSERT INTO cart_items (cart_id,menu_item_id,quantity) VALUES (?,?,?)',[cartId,menuItemId,quantity||1]);
    res.json({ success:true });
  } catch(err){ console.error(err); res.status(500).json({error:'server error'}); }
});

router.get('/', async (req,res)=>{
  try {
    const userId = req.header('x-user-id');
    if(!userId) return res.status(401).json({error:'x-user-id header required (for demo)'});
    const [[cart]] = await pool.query('SELECT * FROM carts WHERE user_id=?',[userId]);
    if(!cart) return res.json({ cart: { items: [] } });
    const [items] = await pool.query('SELECT ci.id,mi.name,mi.price,ci.quantity FROM cart_items ci JOIN menu_items mi ON ci.menu_item_id=mi.id WHERE ci.cart_id=?',[cart.id]);
    res.json({ cart: { id: cart.id, items } });
  } catch(err){ console.error(err); res.status(500).json({error:'server error'}); }
});

module.exports = router;
