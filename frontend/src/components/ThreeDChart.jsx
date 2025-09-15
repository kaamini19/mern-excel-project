import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeDChart({ labels=[], values=[] }){
  const mountRef = useRef(null)

  useEffect(()=>{
    if (!mountRef.current) return
    const width = mountRef.current.clientWidth
    const height = 400
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    mountRef.current.innerHTML = ''
    mountRef.current.appendChild(renderer.domElement)

    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(1,1,1).normalize()
    scene.add(light)

    const maxVal = Math.max(...values.map(v=>Number(v)||0), 1)
    const group = new THREE.Group()
    values.forEach((val, i) => {
      const h = (Number(val) || 0) / maxVal * 5 + 0.1
      const geometry = new THREE.BoxGeometry(0.4, h, 0.4)
      const material = new THREE.MeshPhongMaterial({ color: new THREE.Color(`hsl(${(i/values.length)*360},70%,50%)`) })
      const cube = new THREE.Mesh(geometry, material)
      cube.position.set(i*0.6 - (values.length*0.6)/2, h/2, 0)
      group.add(cube)
    })
    scene.add(group)
    camera.position.z = 8
    camera.position.y = 3
    camera.lookAt(0,0,0)

    function animate(){
      requestAnimationFrame(animate)
      group.rotation.y += 0.005
      renderer.render(scene, camera)
    }
    animate()

    return ()=>{ renderer.dispose() }
  }, [labels, values])

  return <div ref={mountRef} style={{ width: '100%', height: 400 }} />
}
