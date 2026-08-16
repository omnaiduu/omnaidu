import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'

function Laptop() {
  const ref = useRef<Group>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (!ref.current) return
    ref.current.rotation.y = 0.4 + Math.sin(t * 0.45) * 0.22
    ref.current.rotation.x = 0.18 + Math.sin(t * 0.32) * 0.05
  })

  return (
    <group ref={ref} position={[0, -0.05, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.42, 0.1]} receiveShadow>
        <circleGeometry args={[1.55, 48]} />
        <meshStandardMaterial color="#d4d0c6" roughness={0.92} metalness={0} />
      </mesh>
      <mesh position={[0, -0.28, 0.08]} castShadow>
        <boxGeometry args={[1.62, 0.07, 1.08]} />
        <meshStandardMaterial color="#2a2824" roughness={0.42} metalness={0.12} />
      </mesh>
      <group position={[0, -0.08, -0.46]} rotation={[-0.58, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.58, 1.0, 0.05]} />
          <meshStandardMaterial color="#1a1814" roughness={0.38} />
        </mesh>
        <mesh position={[0, 0.02, 0.032]}>
          <planeGeometry args={[1.4, 0.86]} />
          <meshStandardMaterial color="#0c0b09" emissive="#24180c" emissiveIntensity={0.55} />
        </mesh>
        <mesh position={[0.58, -0.34, 0.04]}>
          <planeGeometry args={[0.05, 0.05]} />
          <meshStandardMaterial color="#f54e00" emissive="#f54e00" emissiveIntensity={3.2} />
        </mesh>
      </group>
    </group>
  )
}

export default function ThreeDesk({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? 'three-desk three-desk-compact' : 'three-desk'}>
      <Canvas
        camera={{ position: [1.55, 1.15, 2.45], fov: 30 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      >
        <ambientLight intensity={0.75} />
        <directionalLight position={[2.2, 3.2, 2]} intensity={1.15} />
        <pointLight position={[0.55, 0.35, 0.5]} color="#f54e00" intensity={1.6} distance={4} />
        <Laptop />
      </Canvas>
    </div>
  )
}
