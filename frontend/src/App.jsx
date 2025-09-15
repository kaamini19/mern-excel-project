import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import UploadPage from './pages/UploadPage'
import ChartPage from './pages/ChartPage'
import { useSelector } from 'react-redux'
import Navbar from './components/Navbar'

function RequireAuth({ children }){
  const token = useSelector(s => s.auth.token)
  if (!token) return <Navigate to="/login" />
  return children
}

export default function App(){
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/" element={<RequireAuth><Dashboard/></RequireAuth>} />
        <Route path="/upload" element={<RequireAuth><UploadPage/></RequireAuth>} />
        <Route path="/chart/:id" element={<RequireAuth><ChartPage/></RequireAuth>} />
      </Routes>
    </div>
  )
}
