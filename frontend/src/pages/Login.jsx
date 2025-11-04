import React, {useState} from 'react'
import { motion } from 'framer-motion'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  async function submit(e){
    e.preventDefault()
    setMsg('')
    try{
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      let body = null
      const ct = res.headers.get('content-type') || ''
      if(ct.includes('application/json')){
        body = await res.json()
      } else {
        try{ body = await res.text() }catch(e){ body = null }
      }

      if(!res.ok){
        const msg = body && body.message ? body.message : (typeof body === 'string' ? body : 'Login failed')
        throw new Error(msg)
      }

      setMsg('Login successful — token received')
      // In a real app you'd save the token and redirect
    }catch(err){
      setMsg(err.message || 'Login error')
    }
  }

  return (
    <div className="login-root auth-root">
      <motion.div className="auth-card" initial={{opacity:0, y:8}} animate={{opacity:1,y:0}} transition={{duration:0.4}}>
        <form className="login-form" onSubmit={submit}>
          <h2>Sign in</h2>
          <label>
            Email
            <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
          </label>
          <label>
            Password
            <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
          </label>
          <button className="btn primary" type="submit">Sign in</button>
          {msg && <p className="form-msg">{msg}</p>}
        </form>
      </motion.div>

      <div className="food-anim" aria-hidden>
        <div className="food food-1">🍔</div>
        <div className="food food-2">🍣</div>
      </div>
    </div>
  )
}
