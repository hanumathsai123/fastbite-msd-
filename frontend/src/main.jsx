import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Restaurants from './pages/Restaurants'
import Layout from './components/Layout'
import { CartProvider } from './context/CartContext'
import './styles.css'

function App(){
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout/>}>
            <Route path='/' element={<Home/>}/>
            <Route path='/restaurants' element={<Restaurants/>} />
            <Route path='/restaurants/:id' element={<Restaurants/>} />
            <Route path='/cart' element={<Cart/>} />
            <Route path='/checkout' element={<Checkout/>} />
            <Route path='/login' element={<Login/>}/>
            <Route path='/signup' element={<Signup/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

createRoot(document.getElementById('root')).render(<App/>)
