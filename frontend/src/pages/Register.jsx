import React, { useState } from 'react'
import API, { setAuthToken } from '../utils/api'
import { useDispatch } from 'react-redux'
import { setAuth } from '../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    try{
      const { data } = await API.post('/auth/register', { name, email, password })
      dispatch(setAuth({ token: data.token, user: data.user }))
      setAuthToken(data.token)
      nav('/')
    }catch(err){
      alert(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="container mx-auto p-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
        <form onSubmit={submit} className="space-y-3">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="w-full p-3 border rounded" />
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 border rounded" />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full p-3 border rounded" />
          <button className="w-full bg-green-600 text-white px-4 py-3 rounded">Register</button>
        </form>
      </div>
    </div>
  )
}
