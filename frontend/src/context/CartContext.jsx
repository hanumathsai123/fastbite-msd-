import React, { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()

export function useCart(){
  return useContext(CartContext)
}

export function CartProvider({ children }){
  const [items, setItems] = useState(()=>{
    try{
      const raw = localStorage.getItem('fb_cart')
      return raw ? JSON.parse(raw) : []
    }catch(e){
      return []
    }
  })

  useEffect(()=>{
    try{ localStorage.setItem('fb_cart', JSON.stringify(items)) }catch(e){}
  },[items])

  function addItem(product){
    // if item exists, increment quantity
    setItems(prev => {
      const found = prev.find(i=>i.id === product.id)
      if(found){
        return prev.map(i=> i.id===product.id ? {...i, qty: i.qty+1} : i)
      }
      return [...prev, {...product, qty:1}]
    })
  }

  function removeItem(productId){
    setItems(prev => prev.filter(i=>i.id !== productId))
  }

  function changeQty(productId, qty){
    setItems(prev => prev.map(i=> i.id===productId ? {...i, qty} : i))
  }

  function clear(){ setItems([]) }

  const total = items.reduce((s,i)=> s + (i.price||0) * (i.qty||1), 0)

  return (
    <CartContext.Provider value={{items, addItem, removeItem, changeQty, clear, total}}>
      {children}
    </CartContext.Provider>
  )
}
