"use client"

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function GraphBlob() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    // Create nodes (spheres)
    const nodeCount = 12
    const nodes: THREE.Mesh[] = []
    const nodePositions: THREE.Vector3[] = []

    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.6
    })

    for (let i = 0; i < nodeCount; i++) {
      const geometry = new THREE.SphereGeometry(0.08, 16, 16)
      const node = new THREE.Mesh(geometry, nodeMaterial)

      // Position nodes in a rough sphere
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const radius = 2 + Math.random() * 0.5

      node.position.x = radius * Math.sin(phi) * Math.cos(theta)
      node.position.y = radius * Math.sin(phi) * Math.sin(theta)
      node.position.z = radius * Math.cos(phi)

      nodePositions.push(node.position.clone())
      nodes.push(node)
      scene.add(node)
    }

    // Create edges (lines between nodes)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.2
    })

    const edges: THREE.Line[] = []

    // Connect each node to 2-3 nearby nodes
    nodes.forEach((node, i) => {
      const distances = nodes.map((otherNode, j) => ({
        index: j,
        distance: node.position.distanceTo(otherNode.position)
      }))

      distances.sort((a, b) => a.distance - b.distance)

      // Connect to 2-3 nearest neighbors (skip self at index 0)
      const connectionCount = 2 + Math.floor(Math.random() * 2)
      for (let k = 1; k <= connectionCount && k < distances.length; k++) {
        const targetIndex = distances[k].index
        if (targetIndex > i) { // Avoid duplicate edges
          const points = [node.position, nodes[targetIndex].position]
          const geometry = new THREE.BufferGeometry().setFromPoints(points)
          const line = new THREE.Line(geometry, lineMaterial)
          edges.push(line)
          scene.add(line)
        }
      }
    })

    // Animation
    let frame = 0
    const animate = () => {
      requestAnimationFrame(animate)
      frame += 0.005

      // Rotate entire graph slowly
      scene.rotation.y = frame * 0.2
      scene.rotation.x = Math.sin(frame * 0.3) * 0.1

      // Subtle node movement
      nodes.forEach((node, i) => {
        const originalPos = nodePositions[i]
        node.position.x = originalPos.x + Math.sin(frame + i) * 0.1
        node.position.y = originalPos.y + Math.cos(frame + i * 0.7) * 0.1
        node.position.z = originalPos.z + Math.sin(frame * 0.8 + i) * 0.1
      })

      // Update edge positions
      edges.forEach((edge) => {
        const positions = edge.geometry.attributes.position.array as Float32Array
        edge.geometry.attributes.position.needsUpdate = true
      })

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      container.removeChild(renderer.domElement)
      scene.clear()
      renderer.dispose()
    }
  }, [])

  return <div ref={containerRef} className="w-full h-full" />
}
