import React, {useState} from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import restaurants from '../data/restaurants.json'

function shuffleArr(a){
  const arr = [...a]
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1))
    ;[arr[i],arr[j]] = [arr[j],arr[i]]
  }
  return arr
}

// ensure each restaurant has a menu at runtime (shuffled if empty)
const baseMenu = restaurants[0] && restaurants[0].menu ? restaurants[0].menu : []
const displayRestaurants = restaurants.map((r, idx) => ({
  ...r,
  menu: r.menu && r.menu.length ? r.menu : shuffleArr(baseMenu)
}))

export default function Home(){
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('')
  const navigate = useNavigate()

  const results = displayRestaurants.filter(r => {
    const q = query.trim().toLowerCase()
    if(!q && !filter) return true
    const matchesQ = !q || r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q)
    const matchesFilter = !filter || r.cuisine === filter
    return matchesQ && matchesFilter
  })

  return (
    <div className="page-root">
      <motion.header className="site-header" initial={{y:-30, opacity:0}} animate={{y:0, opacity:1}} transition={{duration:0.4}}>
        <div className="logo">FastBite</div>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/restaurants">Restaurants</Link>
          <Link to="/login">Sign in</Link>
        </nav>
      </motion.header>

      <main>
        <section className="hero">
          <motion.h1 initial={{opacity:0, y:10}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>Order from the best local restaurants</motion.h1>
          <p className="lead">Fast delivery, curated for you. Browse and order in a few clicks.</p>

          <div className="search-row">
            <input aria-label="Search restaurants" className="search" placeholder="Search restaurants or cuisine (e.g. sushi, pizza)" value={query} onChange={e=>setQuery(e.target.value)} />
            <select value={filter} onChange={e=>setFilter(e.target.value)} aria-label="Filter by cuisine">
              <option value="">All cuisines</option>
              <option>Italian</option>
              <option>Indian</option>
              <option>Japanese</option>
              <option>Mexican</option>
            </select>
          </div>
        </section>

        <section id="restaurants" className="restaurants">
          <h2>Popular near you</h2>
          <div className="grid">
            {results.map(r => (
              <motion.article className="card" key={r.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.99 }}>
                <div className="thumb" aria-hidden>
                  {r.menu && r.menu[0] && r.menu[0].img ? (
                    <img src={r.menu[0].img} alt={`${r.name} thumbnail`} className="thumb-img" />
                  ) : (
                    <div className="thumb-placeholder">{r.name.split(' ')[0]}</div>
                  )}
                </div>
                <div className="card-body">
                  <h3 className="rest-name">{r.name} {r.badge && <span className="badge small">{r.badge}</span>}</h3>
                  <div className="meta">{r.cuisine} · {r.price}</div>
                  <div className="meta small">{r.rating} ★ · {r.time}</div>
                  {r.description && <div className="meta small" style={{marginTop:6}}>{r.description}</div>}
                </div>
                <div className="card-actions">
                  <button className="btn" onClick={() => navigate(`/restaurants/${r.id}`)}>View menu</button>
                </div>
              </motion.article>
            ))}
          </div>
          {results.length === 0 && <p className="empty">No restaurants match your search.</p>}
        </section>
      </main>

      <footer className="site-footer">© {new Date().getFullYear()} FastBite — Demo</footer>
    </div>
  )
}
