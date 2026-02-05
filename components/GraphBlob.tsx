"use client"

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { embeddingNodes, cosineSimilarity } from '@/lib/embeddings-mock-data'

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

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // Smooth rendering
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    // Add lighting for 3D effect
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight1.position.set(5, 5, 5)
    scene.add(directionalLight1)

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4)
    directionalLight2.position.set(-5, -5, -5)
    scene.add(directionalLight2)

    // Create nodes from embeddings data
    const nodes: THREE.Mesh[] = []
    const nodePositions: THREE.Vector3[] = []

    embeddingNodes.forEach((embeddingNode) => {
      const geometry = new THREE.SphereGeometry(0.08, 32, 32) // Higher segments for smoother spheres
      const material = new THREE.MeshStandardMaterial({
        color: embeddingNode.color,
        metalness: 0.3,
        roughness: 0.4,
        transparent: true,
        opacity: 0.9
      })
      const node = new THREE.Mesh(geometry, material)

      // Use pre-defined positions from embeddings data
      const [x, y, z] = embeddingNode.position
      node.position.set(x, y, z)

      nodePositions.push(node.position.clone())
      nodes.push(node)
      scene.add(node)
    })

    // Create edges based on cosine similarity
    const edges: THREE.Line[] = []
    const SIMILARITY_THRESHOLD = 0.5 // Only show connections above this threshold

    // Calculate similarities and create connections
    embeddingNodes.forEach((node1, i) => {
      embeddingNodes.forEach((node2, j) => {
        if (j <= i) return // Avoid duplicate edges and self-connections

        const similarity = cosineSimilarity(node1.embedding, node2.embedding)

        if (similarity >= SIMILARITY_THRESHOLD) {
          // Create line with opacity based on similarity strength
          const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: (similarity - SIMILARITY_THRESHOLD) * 0.4 // Scale opacity
          })

          const points = [nodes[i].position, nodes[j].position]
          const geometry = new THREE.BufferGeometry().setFromPoints(points)
          const line = new THREE.Line(geometry, lineMaterial)
          edges.push(line)
          scene.add(line)
        }
      })
    })

    // Animation with smooth timing
    let frame = 0
    let lastTime = 0

    const animate = (currentTime: number) => {
      requestAnimationFrame(animate)

      const deltaTime = currentTime - lastTime
      lastTime = currentTime

      // Smooth frame increment (capped for consistency)
      frame += Math.min(deltaTime * 0.001, 0.016) // ~60fps max

      // Rotate entire graph slowly and smoothly
      scene.rotation.y = frame * 0.15
      scene.rotation.x = Math.sin(frame * 0.25) * 0.08

      // Very subtle node movement for organic feel
      nodes.forEach((node, i) => {
        const originalPos = nodePositions[i]
        node.position.x = originalPos.x + Math.sin(frame + i) * 0.05
        node.position.y = originalPos.y + Math.cos(frame + i * 0.7) * 0.05
        node.position.z = originalPos.z + Math.sin(frame * 0.8 + i) * 0.05
      })

      // Update edge positions
      edges.forEach((edge) => {
        edge.geometry.attributes.position.needsUpdate = true
      })

      renderer.render(scene, camera)
    }

    animate(0)

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
