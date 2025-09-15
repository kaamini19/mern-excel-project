import React, { useEffect, useState } from 'react'
import API from '../utils/api'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function Dashboard(){
  const [uploads, setUploads] = useState([])
  const token = useSelector(s => s.auth.token)

  useEffect(()=>{
    if (!token) return
    API.get('/upload').then(r=>setUploads(r.data)).catch(e=>console.error(e))
  }, [token])

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-6 rounded shadow-md">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-600">Upload Excel files and generate interactive charts & 3D views.</p>
          </div>
          <div>
            <Link to="/upload" className="bg-blue-600 text-white px-4 py-2 rounded shadow">Upload Excel</Link>
          </div>
        </div>
        <div>
          <h2 className="text-xl mb-2">Your uploads</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uploads.length===0 && <div className="text-gray-500">No uploads yet.</div>}
            {uploads.map(u => (
              <div key={u._id} className="border p-4 rounded shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{u.originalName}</div>
                    <div className="text-sm text-gray-600">{new Date(u.createdAt).toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-2">{u.columns.slice(0,4).join(', ')}{u.columns.length>4?'...':''}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link to={`/chart/${u._id}`} className="px-3 py-1 border rounded text-sm">Open</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
