import React, { useRef } from 'react'
import { Download } from "lucide-react" 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Bar, Line, Pie } from 'react-chartjs-2'
import imageCompression from 'browser-image-compression'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export default function ChartComponent({ type='bar', labels=[], data=[], title='' }) {
  const chartRef = useRef()

  const backgroundColors = type === 'pie'
    ? [
        "rgba(255, 99, 132, 0.6)",
        "rgba(54, 162, 235, 0.6)",
        "rgba(255, 206, 86, 0.6)",
        "rgba(75, 192, 192, 0.6)",
        "rgba(153, 102, 255, 0.6)",
        "rgba(255, 159, 64, 0.6)"
      ]
    : "rgba(54,162,235,0.6)"

  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        backgroundColor: backgroundColors,
        borderColor: type === 'pie' ? "#fff" : "rgba(54,162,235,1)",
        borderWidth: 1
      }
    ]
  }

  async function download() {
    const chart = chartRef.current
    if (!chart) return

    const url = chart.canvas.toDataURL("image/png")
    const blob = await (await fetch(url)).blob()

    const compressed = await imageCompression(blob, {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 600,
      useWebWorker: true
    })

    const compressedUrl = URL.createObjectURL(compressed)
    const a = document.createElement('a')
    a.href = compressedUrl
    a.download = `${title || 'chart'}.jpg`
    a.click()
  }

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold">{title}</h2>
      </div>

      <button
        onClick={download}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-white 
        bg-gradient-to-r from-blue-500 to-indigo-600 
        hover:from-blue-600 hover:to-indigo-700 
        shadow-md transition-all duration-200 ease-in-out 
        transform hover:scale-105 active:scale-95"
      >
        <Download className="w-4 h-4" />
        Download
      </button>

      {type === 'bar' && (
        <div style={{ width: "600px", height: "400px" }}>
          <Bar
            ref={chartRef}
            data={chartData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      )}
      {type === 'line' && (
        <div style={{ width: "600px", height: "400px" }}>
          <Line
            ref={chartRef}
            data={chartData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      )}
      {type === 'pie' && (
        <div style={{ width: "400px", height: "400px", margin: "auto" }}>
          <Pie
            ref={chartRef}
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "right" }
              }
            }}
          />
        </div>
      )}
    </div>
  )
}
