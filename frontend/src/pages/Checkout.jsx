import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Checkout(){
  const { items, total, clear } = useCart()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [card, setCard] = useState('')
  const [exp, setExp] = useState('')
  const [cvv, setCvv] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    if(items.length === 0){ setMsg('Cart is empty'); return }
    setLoading(true)
    setMsg('')
    try{
      // Build order payload
      const order = {
        customer: { name, email },
        items: items.map(i=>({ name: i.name, price: i.price, qty: i.qty })),
        total
      }

      // Try sending to backend (if available). If the endpoint is not available this will fail and we'll still simulate success.
      let resOk = false
      try{
        const res = await fetch('/api/orders', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(order) })
        resOk = res.ok
      }catch(e){
        // ignore network errors for mock
        resOk = false
      }

      // Simulate payment processing delay
      await new Promise(r => setTimeout(r, 1200))

      setLoading(false)
      setMsg('Payment successful — order placed' + (resOk ? '' : ' (mock)'))
      clear()
      // Optionally navigate to a success page
      setTimeout(()=> navigate('/'), 1400)
    }catch(err){
      setLoading(false)
      setMsg('Payment failed: ' + (err.message || 'Unknown'))
    }
  }

  return (
    <div style={{padding:20, maxWidth:980}}>
      <h2>Checkout</h2>
      <div style={{display:'flex', gap:20, alignItems:'flex-start'}}>
        <form className="checkout-form" onSubmit={submit} style={{flex:1, background:'#fff', padding:16, borderRadius:8}}>
          <h3>Payment details</h3>
          <label>Name on card
            <input value={name} onChange={e=>setName(e.target.value)} required />
          </label>
          <label>Email
            <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
          </label>
          <label>Card number
            <input value={card} onChange={e=>setCard(e.target.value)} placeholder="4242 4242 4242 4242" />
          </label>
          <div style={{display:'flex', gap:8}}>
            <label style={{flex:1}}>Expiry
              <input value={exp} onChange={e=>setExp(e.target.value)} placeholder="MM/YY" />
            </label>
            <label style={{width:120}}>CVV
              <input value={cvv} onChange={e=>setCvv(e.target.value)} placeholder="123" />
            </label>
          </div>

          <button className="btn primary" type="submit" disabled={loading} style={{marginTop:12}}>{loading ? 'Processing...' : 'Pay & place order'}</button>
          {msg && <p className="form-msg">{msg}</p>}
        </form>

        <aside style={{width:340}}>
          <div style={{background:'#fff', padding:12, borderRadius:8}}>
            <h3>Order summary</h3>
            {items.length === 0 ? <p>Cart is empty</p> : (
              <div>
                {items.map(i=> (
                  <div key={i.id} style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
                    <div>{i.name} x{i.qty}</div>
                    <div>₹{(i.price||0) * (i.qty||1)}</div>
                  </div>
                ))}
                <hr />
                <div style={{display:'flex', justifyContent:'space-between', fontWeight:800}}>Total <div>₹{total}</div></div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
