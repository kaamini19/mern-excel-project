import React, { useRef } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Bar, Line, Pie } from 'react-chartjs-2'
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement)

export default function ChartComponent({ type='bar', labels=[], data=[], title='' }){
  const chartRef = useRef()
  const chartData = {
    labels,
    datasets: [{ label: title, data, backgroundColor: 'rgba(54,162,235,0.6)' }]
  }

  function download(){
    const chart = chartRef.current
    if (!chart) return
    const url = chart.toBase64Image()
    const a = document.createElement('a')
    a.href = url
    a.download = `${title || 'chart'}.png`
    a.click()
  }

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold">{title}</h2>
        <button onClick={download} className="px-3 py-1 border rounded text-sm">Download PNG</button>
      </div>
      {type === 'bar' && <Bar ref={chartRef} data={chartData} />}
      {type === 'line' && <Line ref={chartRef} data={chartData} />}
      {type === 'pie' && <Pie ref={chartRef} data={chartData} />}
    </div>
  )
}
