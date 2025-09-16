import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

export default function ThreeDChart({ labels = [], values = [] }) {
  const mountRef = useRef(null)

  useEffect(() => {
    if (!mountRef.current) return
    const width = mountRef.current.clientWidth
    const height = 700 // 
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    mountRef.current.innerHTML = ''
    mountRef.current.appendChild(renderer.domElement)

    
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(1, 1, 1).normalize()
    scene.add(light)

    
    const group = new THREE.Group()

    
    const maxVal = Math.max(...values.map(v => Number(v) || 0), 1)

   
    const loader = new FontLoader()
    loader.load(
      'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
      font => {
        values.forEach((val, i) => {
          const h = (Number(val) || 0) / maxVal * 5 + 0.1
          const xPos = i * 1 - (values.length * 1) / 2 

          //BAR
          const geometry = new THREE.BoxGeometry(0.6, h, 0.6)
          const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(`hsl(${(i / values.length) * 360},70%,50%)`)
          })
          const cube = new THREE.Mesh(geometry, material)
          cube.position.set(xPos, h / 2, 0)
          group.add(cube)

          // VALUE- TOP 
          const valueGeo = new TextGeometry(String(val), {
            font,
            size: 0.25,
            height: 0.02
          })
          const valueMat = new THREE.MeshBasicMaterial({ color: 0x000000 })
          const valueMesh = new THREE.Mesh(valueGeo, valueMat)
          valueMesh.position.set(xPos - 0.2, h + 0.3, 0)
          group.add(valueMesh)

          // NAMES
          const labelGeo = new TextGeometry(labels[i] || '', {
            font,
            size: 0.2,
            height: 0.01
          })
          const labelMat = new THREE.MeshBasicMaterial({ color: 0x333333 })
          const labelMesh = new THREE.Mesh(labelGeo, labelMat)
          labelMesh.position.set(xPos - 0.3, -0.5, 0)
          group.add(labelMesh)
        })
      }
    )

    scene.add(group)

    camera.position.z = 9
    camera.position.y = 4
    camera.lookAt(0, 0, 0)

    function animate() {
      requestAnimationFrame(animate)
      group.rotation.y += 0.005
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      renderer.dispose()
    }
  }, [labels, values])

  return <div ref={mountRef} style={{ width: '100%', height: 500 }} />
}
