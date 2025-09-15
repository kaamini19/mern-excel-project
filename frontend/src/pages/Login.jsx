import React, { useState } from 'react'
import API, { setAuthToken } from '../utils/api'
import { useDispatch } from 'react-redux'
import { setAuth } from '../store/slices/authSlice'
import { useNavigate, Link } from 'react-router-dom'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    try{
      const { data } = await API.post('/auth/login', { email, password })
      dispatch(setAuth({ token: data.token, user: data.user }))
      setAuthToken(data.token)
      nav('/')
    }catch(err){
      alert(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="container mx-auto p-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <form onSubmit={submit} className="space-y-3">
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 border rounded" />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full p-3 border rounded" />
          <button className="w-full bg-blue-600 text-white px-4 py-3 rounded">Login</button>
        </form>
        <p className="mt-4 text-center">No account? <Link to="/register" className="text-blue-600">Register</Link></p>
      </div>
    </div>
  )
}
