"use client"

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { embeddingNodes, cosineSimilarity } from '@/lib/embeddings-mock-data'

export function GraphBlob() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [highlightedNode1, setHighlightedNode1] = useState(1)
  const [highlightedNode2, setHighlightedNode2] = useState(2)
  const [similarity, setSimilarity] = useState(0)
  const [dotProduct, setDotProduct] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [hoveredNode, setHoveredNode] = useState<{ label: string; x: number; y: number } | null>(null)

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
      const geometry = new THREE.SphereGeometry(0.05, 32, 32) // Smaller, smoother spheres
      const material = new THREE.MeshStandardMaterial({
        color: 0x000000, // All nodes start as black
        metalness: 0.3,
        roughness: 0.4,
        transparent: true,
        opacity: 0.9
      })
      const node = new THREE.Mesh(geometry, material)

      // Use pre-defined positions from embeddings data at original scale
      const scale = 1.0
      const [x, y, z] = embeddingNode.position
      node.position.set(x * scale, y * scale, z * scale)

      nodePositions.push(node.position.clone())
      nodes.push(node)
      scene.add(node)
    })

    // Create edges based on cosine similarity
    const edges: { line: THREE.Line; fromIndex: number; toIndex: number }[] = []
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

          const points = [nodes[i].position.clone(), nodes[j].position.clone()]
          const geometry = new THREE.BufferGeometry().setFromPoints(points)
          const line = new THREE.Line(geometry, lineMaterial)
          edges.push({ line, fromIndex: i, toIndex: j })
          scene.add(line)
        }
      })
    })

    // Create two highlighted lines (center to two different nodes) with thicker appearance
    const highlightMaterial1 = new THREE.LineBasicMaterial({
      color: 0xef4444, // red-500
      transparent: true,
      opacity: 1.0,
      linewidth: 5
    })
    const highlightGeometry1 = new THREE.BufferGeometry()
    const highlightLine1 = new THREE.Line(highlightGeometry1, highlightMaterial1)
    scene.add(highlightLine1)

    const highlightMaterial2 = new THREE.LineBasicMaterial({
      color: 0x3b82f6, // blue-500
      transparent: true,
      opacity: 1.0,
      linewidth: 5
    })
    const highlightGeometry2 = new THREE.BufferGeometry()
    const highlightLine2 = new THREE.Line(highlightGeometry2, highlightMaterial2)
    scene.add(highlightLine2)

    // Track time for rotating through nodes
    let nodeRotateTimer = 0

    // Animation with smooth timing
    let frame = 0
    let lastTime = 0
    let currentHighlightIndex1 = 1
    let currentHighlightIndex2 = 2

    // Set initial highlighted node colors
    const initialMaterial1 = nodes[currentHighlightIndex1].material as THREE.MeshStandardMaterial
    const initialMaterial2 = nodes[currentHighlightIndex2].material as THREE.MeshStandardMaterial
    initialMaterial1.color.setHex(0xef4444) // red-500
    initialMaterial2.color.setHex(0x3b82f6) // blue-500

    const animate = (currentTime: number) => {
      requestAnimationFrame(animate)

      const deltaTime = currentTime - lastTime
      lastTime = currentTime

      // Smooth frame increment (capped for consistency)
      frame += Math.min(deltaTime * 0.001, 0.016) // ~60fps max

      // Rotate through highlighted nodes every 4 seconds
      nodeRotateTimer += deltaTime
      if (nodeRotateTimer > 4000) {
        nodeRotateTimer = 0

        // Reset previous highlighted nodes to black
        const prevMaterial1 = nodes[currentHighlightIndex1].material as THREE.MeshStandardMaterial
        const prevMaterial2 = nodes[currentHighlightIndex2].material as THREE.MeshStandardMaterial
        prevMaterial1.color.setHex(0x000000)
        prevMaterial2.color.setHex(0x000000)

        currentHighlightIndex1 = (currentHighlightIndex1 % (embeddingNodes.length - 1)) + 1
        currentHighlightIndex2 = (currentHighlightIndex1 % (embeddingNodes.length - 1)) + 1
        if (currentHighlightIndex2 === currentHighlightIndex1) {
          currentHighlightIndex2 = (currentHighlightIndex2 % (embeddingNodes.length - 1)) + 1
        }

        // Set new highlighted nodes to their respective colors
        const newMaterial1 = nodes[currentHighlightIndex1].material as THREE.MeshStandardMaterial
        const newMaterial2 = nodes[currentHighlightIndex2].material as THREE.MeshStandardMaterial
        newMaterial1.color.setHex(0xef4444) // red-500
        newMaterial2.color.setHex(0x3b82f6) // blue-500

        setHighlightedNode1(currentHighlightIndex1)
        setHighlightedNode2(currentHighlightIndex2)
      }

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

      // Update edge positions to follow node centers
      edges.forEach(({ line, fromIndex, toIndex }) => {
        const positions = line.geometry.attributes.position.array as Float32Array
        const fromPos = nodes[fromIndex].position
        const toPos = nodes[toIndex].position

        // Update start point
        positions[0] = fromPos.x
        positions[1] = fromPos.y
        positions[2] = fromPos.z

        // Update end point
        positions[3] = toPos.x
        positions[4] = toPos.y
        positions[5] = toPos.z

        line.geometry.attributes.position.needsUpdate = true
      })

      // Update both highlighted line positions
      const centerPos = nodes[0].position
      const targetPos1 = nodes[currentHighlightIndex1].position
      const targetPos2 = nodes[currentHighlightIndex2].position

      const highlightPoints1 = [centerPos, targetPos1]
      highlightLine1.geometry.setFromPoints(highlightPoints1)

      const highlightPoints2 = [centerPos, targetPos2]
      highlightLine2.geometry.setFromPoints(highlightPoints2)

      // Calculate cosine similarity and dot product between the two vectors from origin
      const vec1 = [targetPos1.x, targetPos1.y, targetPos1.z]
      const vec2 = [targetPos2.x, targetPos2.y, targetPos2.z]
      const sim = cosineSimilarity(vec1, vec2)
      const dot = vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2]
      setSimilarity(sim)
      setDotProduct(dot)

      renderer.render(scene, camera)
    }

    animate(0)

    // Raycaster for hover detection
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    // Handle mouse move for hover detection
    const handleMouseMove = (event: MouseEvent) => {
      if (!container) return

      const rect = container.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(nodes)

      if (intersects.length > 0) {
        const intersectedNode = intersects[0].object as THREE.Mesh
        const nodeIndex = nodes.indexOf(intersectedNode)

        if (nodeIndex !== -1) {
          const nodeData = embeddingNodes[nodeIndex]

          // Convert 3D position to 2D screen coordinates
          const vector = new THREE.Vector3()
          intersectedNode.getWorldPosition(vector)
          vector.project(camera)

          const x = (vector.x * 0.5 + 0.5) * rect.width
          const y = (-vector.y * 0.5 + 0.5) * rect.height

          setHoveredNode({ label: nodeData.label, x, y })
          container.style.cursor = 'pointer'
        }
      } else {
        setHoveredNode(null)
        container.style.cursor = 'default'
      }
    }

    // Handle resize
    const handleResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }

    window.addEventListener('resize', handleResize)
    container.addEventListener('mousemove', handleMouseMove)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeChild(renderer.domElement)
      scene.clear()
      renderer.dispose()
    }
  }, [])

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />

      {/* Hover tooltip */}
      {hoveredNode && (
        <div
          className="absolute pointer-events-none bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 shadow-lg text-xs font-medium text-gray-900 whitespace-nowrap z-50"
          style={{
            left: `${hoveredNode.x}px`,
            top: `${hoveredNode.y - 40}px`,
            transform: 'translateX(-50%)',
          }}
        >
          {hoveredNode.label}
        </div>
      )}

      {/* Minimal info panel - always visible */}
      <div className="absolute top-20 left-[22.5rem] bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 shadow-lg max-w-[200px]">
        <div className="text-xs text-gray-600 leading-relaxed mb-2">
          A personal embedding space showing clusters of my interests:
        </div>
        <div className="text-[10px] font-medium text-gray-700 space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span>{embeddingNodes[highlightedNode1]?.label}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>{embeddingNodes[highlightedNode2]?.label}</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="text-[10px] text-gray-500 font-mono">similarity</div>
          <div className="text-lg font-bold text-gray-900">{similarity.toFixed(3)}</div>
        </div>
      </div>
    </div>
  )
}
