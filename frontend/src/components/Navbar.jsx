import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { clearAuth } from '../store/slices/authSlice'

export default function Navbar(){
  const user = useSelector(s => s.auth.user)
  const dispatch = useDispatch()
  const nav = useNavigate()
  function logout(){
    dispatch(clearAuth())
    nav('/login')
  }
  return (
    <nav className="bg-white shadow-sm">
      <div className="container flex items-center justify-between py-3">
        <Link to="/" className="text-xl font-bold">ExcelCharts</Link>
        <div className="flex items-center gap-3">
          <Link to="/" className="px-3 py-2 rounded hover:bg-gray-100">Dashboard</Link>
          <Link to="/upload" className="px-3 py-2 rounded hover:bg-gray-100">Upload</Link>
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">Hi, {user.name || user.email}</div>
              <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
            </div>
          ) : (
            <div>
              <Link to="/login" className="px-3 py-2 rounded">Login</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
