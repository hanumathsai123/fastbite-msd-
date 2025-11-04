import React from 'react'
import { useParams, Link } from 'react-router-dom'
import restaurants from '../data/restaurants.json'
function shuffleArr(a){
  const arr = [...a]
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1))
    ;[arr[i],arr[j]] = [arr[j],arr[i]]
  }
  return arr
}
const baseMenu = restaurants[0] && restaurants[0].menu ? restaurants[0].menu : []
const displayRestaurants = restaurants.map(r => ({ ...r, menu: r.menu && r.menu.length ? r.menu : shuffleArr(baseMenu) }))
import { useCart } from '../context/CartContext'

function AddToCartButton({ item, restaurantId }){
  const { addItem } = useCart()
  function onAdd(){
    const payload = { ...item, id: `${restaurantId}-${item.id}`, restaurantId }
    addItem(payload)
  }
  return <button className="btn primary" onClick={onAdd}>Add</button>
}

export default function Restaurants(){
  const { id } = useParams()
  const restId = id ? Number(id) : null

  if(restId){
  const r = displayRestaurants.find(x => x.id === restId)
    if(!r) return (
      <div style={{padding:20}}>
        <h2>Restaurant not found</h2>
        <p><Link to="/restaurants">Back to list</Link></p>
      </div>
    )

    return (
      <div style={{padding:20, maxWidth:900, margin:'0 auto'}}>
        <h2>{r.name}</h2>
        <p className="meta">{r.cuisine} · {r.price} · {r.rating} ★</p>
        <p style={{marginTop:12}}>{r.description}</p>

        <h3 style={{marginTop:18}}>Menu</h3>
        <div className="menu-list">
          {r.menu.map(item => (
            <div key={item.id} className="menu-item">
              <img src={item.img} alt={item.name} className="menu-img" />
              <div className="menu-info">
                <div className="menu-title">{item.name}</div>
                <div className="menu-desc">{item.desc || item.description || ''}</div>
                <div className="menu-tags">{(item.tags||[]).map(t=> <span className="tag" key={t}>{t}</span>)}</div>
              </div>
              <div className="menu-meta">
                <div className="menu-price">₹{item.price}</div>
                <AddToCartButton item={item} restaurantId={r.id} />
              </div>
            </div>
          ))}
        </div>

        <p style={{marginTop:18}}><Link to="/restaurants">Back to restaurants</Link></p>
      </div>
    )
  }

  return (
    <div style={{padding:20}}>
      <h2>Restaurants</h2>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:12}}>
        {displayRestaurants.map(r => (
          <div key={r.id} style={{background:'#fff', padding:12, borderRadius:10, boxShadow:'0 6px 12px rgba(0,0,0,0.06)'}}>
            <h3 style={{margin:'0 0 6px 0'}}>{r.name}{r.badge && <span className="badge small" style={{marginLeft:8}}>{r.badge}</span>}</h3>
            <div style={{color:'#666'}}>{r.cuisine} · {r.price}</div>
            {r.description && <div style={{color:'#666', fontSize:13, marginTop:6}}>{r.description}</div>}
            <div style={{marginTop:8}}>
              <Link to={`/restaurants/${r.id}`} className="btn">View</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
