import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Sidebar(){
  const { items } = useCart()
  const count = items.reduce((s,i)=> s + (i.qty||1), 0)
  const navigate = useNavigate()
  const [tokenPresent, setTokenPresent] = useState(false)

  useEffect(()=>{
    try{ setTokenPresent(!!localStorage.getItem('fb_token')) }catch(e){ setTokenPresent(false) }
    // also listen for storage events if sign in/out happens in another tab
    function onStorage(e){ if(e.key === 'fb_token') setTokenPresent(!!e.newValue) }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  },[])

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="logo">FastBite</div>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>Home</NavLink>
        <NavLink to="/restaurants" className={({isActive}) => isActive ? 'active' : ''}>Restaurants</NavLink>
        <NavLink to="/cart" className={({isActive}) => isActive ? 'active' : ''}>Cart <span className="cart-badge">{count}</span></NavLink>
        {!tokenPresent ? (
          <>
            <NavLink to="/login" className={({isActive}) => isActive ? 'active' : ''}>Sign in</NavLink>
            <NavLink to="/signup" className={({isActive}) => isActive ? 'active' : ''}>Sign up</NavLink>
          </>
        ) : (
          <button className="btn link" onClick={() => { try{ localStorage.removeItem('fb_token') }catch(e){}; setTokenPresent(false); navigate('/login') }}>Sign out</button>
        )}
      </nav>
      <div className="sidebar-footer">© {new Date().getFullYear()} FastBite</div>
    </aside>
  )
}
