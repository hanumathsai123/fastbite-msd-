import React from 'react'
import { NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Sidebar(){
  const { items } = useCart()
  const count = items.reduce((s,i)=> s + (i.qty||1), 0)

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="logo">FastBite</div>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>Home</NavLink>
        <NavLink to="/restaurants" className={({isActive}) => isActive ? 'active' : ''}>Restaurants</NavLink>
        <NavLink to="/cart" className={({isActive}) => isActive ? 'active' : ''}>Cart <span className="cart-badge">{count}</span></NavLink>
        <NavLink to="/login" className={({isActive}) => isActive ? 'active' : ''}>Sign in</NavLink>
        <NavLink to="/signup" className={({isActive}) => isActive ? 'active' : ''}>Sign up</NavLink>
      </nav>
      <div className="sidebar-footer">© {new Date().getFullYear()} FastBite</div>
    </aside>
  )
}
