import React, { useEffect, useState } from 'react'
import API from '../utils/api'
import { useParams } from 'react-router-dom'
import ChartComponent from '../components/ChartComponent'
import ThreeDChart from '../components/ThreeDChart'

export default function ChartPage(){
  const { id } = useParams()
  const [upload, setUpload] = useState(null)
  const [xAxis, setXAxis] = useState('')
  const [yAxis, setYAxis] = useState('')
  const [chartType, setChartType] = useState('bar')
  const [chartData, setChartData] = useState(null)

  useEffect(()=>{
    API.get(`/upload/${id}`).then(r=>{
      setUpload(r.data)
      if (r.data.columns && r.data.columns.length>0){
        setXAxis(r.data.columns[0])
        setYAxis(r.data.columns[1] || r.data.columns[0])
      }
    }).catch(console.error)
  }, [id])

  async function generate(){
    if (!xAxis || !yAxis) return alert('Select axes')
    const res = await API.get(`/upload/chart/${id}?xAxis=${encodeURIComponent(xAxis)}&yAxis=${encodeURIComponent(yAxis)}`)
    setChartData(res.data)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl mb-4">Chart Builder</h1>
        {upload && (
          <>
            <div className="flex gap-2 mb-4 flex-wrap">
              <select value={xAxis} onChange={e=>setXAxis(e.target.value)} className="border p-2 rounded">
                {upload.columns.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={yAxis} onChange={e=>setYAxis(e.target.value)} className="border p-2 rounded">
                {upload.columns.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={chartType} onChange={e=>setChartType(e.target.value)} className="border p-2 rounded">
                <option value="bar">Bar</option>
                <option value="line">Line</option>
                <option value="pie">Pie</option>
              </select>
              <button onClick={generate} className="bg-blue-600 text-white px-3 py-2 rounded">Generate</button>
            </div>
            {chartData && (
              <div>
                <ChartComponent type={chartType} labels={chartData.x} data={chartData.y} title={`${yAxis} vs ${xAxis}`} />
                <h3 className="mt-8 text-lg">3D view</h3>
                <ThreeDChart labels={chartData.x} values={chartData.y} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
