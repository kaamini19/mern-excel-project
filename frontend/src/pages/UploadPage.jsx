import React, { useState } from 'react'
import API from '../utils/api'
import { useNavigate } from 'react-router-dom'

export default function UploadPage(){
  const [file, setFile] = useState(null)
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    if (!file) return alert('Select a file')
    const form = new FormData()
    form.append('file', file)
    try{
      const { data } = await API.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      alert('Uploaded')
      nav('/')
    }catch(err){
      alert(err.response?.data?.message || 'Upload failed')
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-6 rounded shadow-md max-w-lg mx-auto">
        <h1 className="text-2xl mb-4">Upload Excel</h1>
        <form onSubmit={submit} className="space-y-3">
          <input type="file" accept=".xls,.xlsx,.csv" onChange={e=>setFile(e.target.files[0])} className="w-full" />
          <button className="w-full bg-blue-600 text-white px-3 py-2 rounded">Upload</button>
        </form>
        <p className="text-sm text-gray-500 mt-3">Tip: first row should be column names. Use numeric values for Y-axis.</p>
      </div>
    </div>
  )
}
