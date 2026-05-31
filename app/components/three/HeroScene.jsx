import { useRef, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

const mouse = { x: 0, y: 0, tx: 0, ty: 0 }

function GoldKnot() {
  const ref = useRef()
  const mat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#CA8A04', metalness: 1, roughness: 0.04,
    clearcoat: 1, clearcoatRoughness: 0.05,
    envMapIntensity: 2, iridescence: 0.4, iridescenceIOR: 1.8,
  }), [])
  const wireMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#FDE68A', wireframe: true, transparent: true, opacity: 0.06,
  }), [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y += 0.004
    ref.current.rotation.x += 0.001
    ref.current.rotation.y += (mouse.tx * 0.35 - ref.current.rotation.y) * 0.025
    ref.current.rotation.x += (mouse.ty * 0.22 - ref.current.rotation.x) * 0.025
    const s = 1 + Math.sin(clock.elapsedTime * 0.5) * 0.03
    ref.current.scale.setScalar(s)
  })

  return (
    <group ref={ref}>
      <mesh material={mat}><torusKnotGeometry args={[1.5, 0.44, 300, 32, 2, 3]} /></mesh>
      <mesh material={wireMat}><torusKnotGeometry args={[1.5, 0.44, 300, 32, 2, 3]} /></mesh>
    </group>
  )
}

function Particles() {
  const ref = useRef()
  const [pos, col] = useMemo(() => {
    const N = 1200, p = new Float32Array(N*3), c = new Float32Array(N*3)
    for (let i = 0; i < N; i++) {
      const t = Math.random()*Math.PI*2, ph = Math.acos(2*Math.random()-1), r = 3.5+Math.random()*6
      p[i*3]=r*Math.sin(ph)*Math.cos(t); p[i*3+1]=r*Math.sin(ph)*Math.sin(t); p[i*3+2]=r*Math.cos(ph)
      const m=Math.random(); c[i*3]=.8+m*.18; c[i*3+1]=.55+m*.38; c[i*3+2]=.02+m*.5
    }
    return [p, c]
  }, [])
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y -= 0.0004
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.1) * 0.1
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-color"    args={[col, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.038} vertexColors sizeAttenuation transparent opacity={0.95}
        blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  )
}

function Rings() {
  const r = [useRef(), useRef(), useRef()]
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color:'#CA8A04', wireframe:true, transparent:true, opacity:.18 }), [])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (r[0].current) { r[0].current.rotation.x=t*.3; r[0].current.rotation.y=t*.5 }
    if (r[1].current) { r[1].current.rotation.x=-t*.2; r[1].current.rotation.z=t*.4 }
    if (r[2].current) { r[2].current.rotation.y=-t*.6; r[2].current.rotation.z=-t*.3 }
  })
  return (
    <>
      <mesh ref={r[0]} material={mat} rotation={[Math.PI/4,0,0]}><torusGeometry args={[3.8,.01,2,128]}/></mesh>
      <mesh ref={r[1]} material={mat} rotation={[0,Math.PI/3,Math.PI/6]}><torusGeometry args={[5.2,.008,2,128]}/></mesh>
      <mesh ref={r[2]} material={mat} rotation={[Math.PI/6,Math.PI/4,0]}><torusGeometry args={[6.4,.006,2,128]}/></mesh>
    </>
  )
}

function CamController() {
  const cam = useThree(s => s.camera)
  useFrame(() => {
    mouse.tx += (mouse.x - mouse.tx) * 0.055
    mouse.ty += (mouse.y - mouse.ty) * 0.055
    cam.position.x += (mouse.tx * 1.0 - cam.position.x) * 0.045
    cam.position.y += (mouse.ty * 0.65 - cam.position.y) * 0.045
    cam.lookAt(0, 0, 0)
  })
  return null
}

function FX() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.85} intensity={2.4} radius={0.65} />
      <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new THREE.Vector2(0.0014, 0.0009)} />
      <Vignette eskil={false} offset={0.32} darkness={0.78} />
      <Noise opacity={0.03} blendFunction={BlendFunction.SOFT_LIGHT} />
    </EffectComposer>
  )
}

export default function HeroScene() {
  useEffect(() => {
    const fn = (e) => {
      mouse.x = (e.clientX/window.innerWidth-0.5)*2
      mouse.y = -(e.clientY/window.innerHeight-0.5)*2
    }
    window.addEventListener('mousemove', fn, { passive: true })
    return () => window.removeEventListener('mousemove', fn)
  }, [])

  return (
    <Canvas style={{ width:'100%', height:'100%', display:'block', background:'transparent' }} camera={{ position:[0,0,9.5], fov:55 }} dpr={[1,1.5]}
      gl={{ alpha:true, antialias:false, powerPreference:'high-performance',
            toneMapping:THREE.ACESFilmicToneMapping, toneMappingExposure:1.4 }}>
      <ambientLight intensity={0.3} color="#120700" />
      <pointLight position={[6,6,6]}   intensity={4}   color="#CA8A04" />
      <pointLight position={[-5,-4,4]} intensity={1.4} color="#1a1a5e" />
      <pointLight position={[0,8,-4]}  intensity={1.0} color="#ffffff" />
      <spotLight  position={[0,14,0]}  intensity={0.7} angle={0.3} penumbra={0.6} color="#FDE68A" />
      <GoldKnot /><Particles /><Rings /><CamController />
      <Suspense fallback={null}><FX /></Suspense>
    </Canvas>
  )
}
