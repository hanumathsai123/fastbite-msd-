import React, {useState} from 'react'
import { motion } from 'framer-motion'

export default function Signup(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [city, setCity] = useState('')
  const [msg, setMsg] = useState('')

  async function submit(e){
    e.preventDefault()
    setMsg('')
    try{
      console.log('Sending signup request...');
      // use relative path so dev proxy or the same-origin setup will work
      const res = await fetch('/api/auth/signup', {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ name, email, password, city })
      })

      // Safely parse JSON only when response has JSON content-type
      let body = null
      const ct = res.headers.get('content-type') || ''
      if(ct.includes('application/json')){
        body = await res.json()
      } else {
        // try text or leave as null
        try{ body = await res.text() }catch(e){ body = null }
      }

      if(!res.ok){
        console.log('Signup failed:', body);
        const msg = body && body.error ? body.error : (typeof body === 'string' ? body : 'Signup failed')
        throw new Error(msg)
      }
      setMsg('Signup successful — you can now sign in')
    }catch(err){
      setMsg(err.message || 'Signup error')
    }
  }

  return (
    <div className="signup-root auth-root">
      <motion.div className="auth-card" initial={{opacity:0, y:10}} animate={{opacity:1,y:0}} transition={{duration:0.45}}>
        <form className="login-form" onSubmit={submit}>
          <h2>Create account</h2>
          <label>
            Name
            <input value={name} onChange={e=>setName(e.target.value)} type="text" required />
          </label>
          <label>
            Email
            <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
          </label>
          <label>
            Password
            <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
          </label>
          <label>
            City (optional)
            <input value={city} onChange={e=>setCity(e.target.value)} type="text" />
          </label>
          {msg && (
            <div className={`form-msg ${msg.includes('successful') ? 'success' : 'error'}`}>
              {msg}
              {msg.includes('error') && (
                <div className="auth-actions">
                  <button type="button" onClick={() => setMsg('')}>Try Again</button>
                </div>
              )}
            </div>
          )}
          <button className="btn primary" type="submit">Create account</button>
          {msg && <p className="form-msg">{msg}</p>}
        </form>
      </motion.div>

      <div className="food-anim" aria-hidden>
        <div className="food food-1">🍕</div>
        <div className="food food-2">🍛</div>
        <div className="food food-3">🍩</div>
      </div>
    </div>
  )
}
