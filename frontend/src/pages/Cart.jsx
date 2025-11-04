import React from 'react'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

export default function Cart(){
  const { items, removeItem, changeQty, clear, total } = useCart()
  const navigate = useNavigate()

  return (
    <div style={{padding:20}}>
      <h2>Your cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div style={{maxWidth:900}}>
          {items.map(i=> (
            <div key={i.id} style={{display:'flex', alignItems:'center', gap:12, background:'#fff', padding:12, borderRadius:8, marginBottom:10}}>
              {i.img && <img src={i.img} alt={i.name} style={{width:72, height:56, objectFit:'cover', borderRadius:6}} />}
              <div style={{flex:1}}>
                <div style={{fontWeight:700}}>{i.name}</div>
                <div style={{color:'#666'}}>₹{i.price}</div>
              </div>
              <div style={{display:'flex', alignItems:'center', gap:8}}>
                <input type="number" value={i.qty} min={1} onChange={e=> changeQty(i.id, Math.max(1, Number(e.target.value)||1))} style={{width:60}} />
                <button className="btn" onClick={()=> removeItem(i.id)}>Remove</button>
              </div>
            </div>
          ))}

          <div style={{display:'flex', justifyContent:'space-between', marginTop:12, alignItems:'center'}}>
            <div style={{fontWeight:800}}>Total: ₹{total}</div>
            <div>
              <button className="btn" onClick={()=> clear()}>Clear</button>
              <button className="btn primary" style={{marginLeft:8}} onClick={()=> navigate('/checkout')}>Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
