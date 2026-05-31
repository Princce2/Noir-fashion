import { useRef, useMemo, Suspense, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

// ─── Shared mouse state ───────────────────────────────────────────────────
const mouse = { x: 0, y: 0, tx: 0, ty: 0 }

// ─── Cloth shaders ────────────────────────────────────────────────────────
const CLOTH_VERT = /* glsl */`
  uniform float uTime;
  uniform float uProgress;
  uniform float uLayerOffset;
  uniform float uLayerIndex;
  varying vec2  vUv;
  varying float vElevation;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float wStr = 1.0 - uProgress * 0.5;
    float w  = sin(pos.x * 2.8 + uTime * 1.2 + uLayerIndex) * 0.18 * wStr
             + cos(pos.y * 2.2 + uTime * 0.9 + uLayerIndex * 0.7) * 0.13 * wStr
             + sin((pos.x + pos.y) * 1.8 + uTime * 0.6) * 0.09 * wStr;
    pos.z += w;

    // Explosion: each layer peels away in Z + drift
    float expZ   = uLayerOffset * 5.5 * uProgress;
    float expX   = uLayerOffset * 0.65 * uProgress;
    float expY   = sin(uLayerIndex * 1.4) * 0.4 * uProgress;
    float twist  = uLayerOffset * 0.25 * uProgress;

    // Corner-curl as layers peel
    float d    = length(pos.xy);
    float ang  = twist * (1.0 - exp(-d * 0.5));
    float cosA = cos(ang), sinA = sin(ang);
    float rx   = pos.x * cosA - pos.z * sinA;
    float rz   = pos.x * sinA + pos.z * cosA;
    pos.x = rx; pos.z = rz;

    pos.z += expZ;
    pos.x += expX;
    pos.y += expY;

    vElevation = w;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`
const CLOTH_FRAG = /* glsl */`
  uniform float uTime;
  uniform float uProgress;
  uniform float uLayerIndex;
  varying vec2  vUv;
  varying float vElevation;

  void main() {
    vec3 dark  = vec3(0.04, 0.03, 0.01);
    vec3 gold1 = vec3(0.50, 0.32, 0.01);
    vec3 gold2 = vec3(0.80, 0.55, 0.04);
    vec3 gold3 = vec3(0.98, 0.82, 0.22);

    float t  = clamp((vElevation + 0.5), 0.0, 1.0);
    vec3  c  = mix(dark,  gold1, smoothstep(0.0, 0.4, t));
    c        = mix(c,     gold2, smoothstep(0.4, 0.7, t));
    c        = mix(c,     gold3, smoothstep(0.7, 1.0, t));

    float sheen = sin((vUv.x - vUv.y) * 28.0 + uTime * 0.4 + uLayerIndex) * 0.08 + 0.92;
    c *= sheen;

    float edge  = min(min(vUv.x, 1.0-vUv.x), min(vUv.y, 1.0-vUv.y));
    float alpha = 1.0 - smoothstep(0.0, 0.06*(1.0+uProgress), edge) * uProgress * 0.65;

    gl_FragColor = vec4(c, alpha);
  }
`

// ─── Single cloth layer ───────────────────────────────────────────────────
function ClothLayer({ layerIndex, totalLayers, progress }) {
  const matRef     = useRef()
  const layerOffset = (layerIndex / (totalLayers - 1)) * 2 - 1

  const uniforms = useMemo(() => ({
    uTime:        { value: 0 },
    uProgress:    { value: 0 },
    uLayerOffset: { value: layerOffset },
    uLayerIndex:  { value: layerIndex },
  }), [layerOffset, layerIndex])

  useFrame(({ clock }) => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value     = clock.elapsedTime
    matRef.current.uniforms.uProgress.value += (progress.current - matRef.current.uniforms.uProgress.value) * 0.06
  })

  return (
    <mesh rotation={[-0.35, 0, 0.08 * layerOffset]}>
      <planeGeometry args={[8, 8, 90, 90]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={CLOTH_VERT}
        fragmentShader={CLOTH_FRAG}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

// ─── Geometry fragments ───────────────────────────────────────────────────
const PIECES = [
  // [restPos, explodePos, rotMult, scale, type, geoArgs]
  [[0,0,0],   [0,0,0],       0.7, 1.0, 'torusKnot',  [1.1, 0.30, 220, 32, 2, 3]],
  [[0,0,0],   [-5, 2.5,-3],  1.3, 1.0, 'torus',      [2.4, 0.013, 2, 120]],
  [[0,0,0],   [4.5,-2, 3.5], 1.6, 1.0, 'torus',      [3.2, 0.010, 2, 120]],
  [[0,0,0],   [1.5, 5,-4.5], 1.0, 1.0, 'torus',      [4.0, 0.008, 2, 120]],
  [[-2,1,0],  [-7, 4,-2],    2.1, 1.0, 'octahedron', [0.42, 0]],
  [[2,-1,0],  [7,-4, 2.5],   1.9, 1.0, 'octahedron', [0.32, 0]],
  [[0, 2,0],  [-2, 7, 3.5],  1.7, 1.0, 'icosahedron',[0.38, 0]],
  [[-1,-2,0], [-5,-6,-3],    2.3, 1.0, 'octahedron', [0.28, 0]],
  [[1.5,0.5,0],[6.5,1.5,4],  1.5, 1.0, 'icosahedron',[0.44, 0]],
]

const goldMat = {
  color: '#CA8A04', metalness: 1, roughness: 0.04,
  clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 2,
  iridescence: 0.3, iridescenceIOR: 2,
}
const wireMat = { color: '#FDE68A', wireframe: true, transparent: true, opacity: 0.14 }

function GeoPiece({ piece, progress }) {
  const [restPos, explodePos, rotMult, , type, geoArgs] = piece
  const ref = useRef()

  useFrame(({ clock }) => {
    if (!ref.current) return
    const p = progress.current
    ref.current.position.x = THREE.MathUtils.lerp(restPos[0], explodePos[0], p)
    ref.current.position.y = THREE.MathUtils.lerp(restPos[1], explodePos[1], p)
    ref.current.position.z = THREE.MathUtils.lerp(restPos[2], explodePos[2], p)
    ref.current.rotation.x += 0.003 * rotMult * (0.4 + p * 0.8)
    ref.current.rotation.y += 0.005 * rotMult
    ref.current.rotation.z += 0.002 * rotMult * p
    const s = 1 + Math.sin(clock.elapsedTime * 0.7 + restPos[0]) * 0.018
    ref.current.scale.setScalar(s)
  })

  return (
    <group ref={ref}>
      {type === 'torus' ? (
        <mesh>
          <torusGeometry args={geoArgs} />
          <meshBasicMaterial color="#FDE68A" wireframe transparent opacity={0.14} />
        </mesh>
      ) : (
        <mesh>
          {type === 'torusKnot'  && <torusKnotGeometry  args={geoArgs} />}
          {type === 'octahedron' && <octahedronGeometry  args={geoArgs} />}
          {type === 'icosahedron'&& <icosahedronGeometry args={geoArgs} />}
          <meshPhysicalMaterial color="#CA8A04" metalness={1} roughness={0.04} clearcoat={1} clearcoatRoughness={0.04} envMapIntensity={2} iridescence={0.3} iridescenceIOR={2} />
        </mesh>
      )}
    </group>
  )
}

// ─── Particles ───────────────────────────────────────────────────────────
function ParticleBurst({ progress }) {
  const ref = useRef()

  const [origins, velocities] = useMemo(() => {
    const N   = 700
    const ori = new Float32Array(N * 3)
    const vel = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const t = Math.random() * Math.PI * 2
      const p = Math.acos(2 * Math.random() - 1)
      const r = 0.5 + Math.random() * 2.5
      ori[i*3]   = r * Math.sin(p) * Math.cos(t)
      ori[i*3+1] = r * Math.sin(p) * Math.sin(t)
      ori[i*3+2] = r * Math.cos(p)
      vel[i*3]   = (Math.random() - 0.5) * 0.05
      vel[i*3+1] = (Math.random() - 0.5) * 0.05
      vel[i*3+2] = (Math.random() - 0.5) * 0.05
    }
    return [ori, vel]
  }, [])

  const initPos = useMemo(() => origins.slice(), [origins])

  useFrame(() => {
    if (!ref.current) return
    const p   = progress.current
    const arr = ref.current.geometry.attributes.position.array
    for (let i = 0; i < arr.length / 3; i++) {
      arr[i*3]   = origins[i*3]   + velocities[i*3]   * p * 90
      arr[i*3+1] = origins[i*3+1] + velocities[i*3+1] * p * 90
      arr[i*3+2] = origins[i*3+2] + velocities[i*3+2] * p * 90
    }
    ref.current.geometry.attributes.position.needsUpdate = true
    ref.current.material.opacity = p * 0.85
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[initPos, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#EAB308" sizeAttenuation transparent opacity={0}
        blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  )
}

// ─── Camera ───────────────────────────────────────────────────────────────
function CamController() {
  const cam = useThree(s => s.camera)
  useFrame(() => {
    mouse.tx += (mouse.x - mouse.tx) * 0.05
    mouse.ty += (mouse.y - mouse.ty) * 0.05
    cam.position.x += (mouse.tx * 1.2 - cam.position.x) * 0.04
    cam.position.y += (mouse.ty * 0.8 - cam.position.y) * 0.04
    cam.lookAt(0, 0, 0)
  })
  return null
}

// ─── FX ──────────────────────────────────────────────────────────────────
function FX() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom luminanceThreshold={0.15} luminanceSmoothing={0.85} intensity={2.8} radius={0.75} />
      <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new THREE.Vector2(0.0018, 0.0011)} />
      <Vignette eskil={false} offset={0.28} darkness={0.82} />
      <Noise opacity={0.032} blendFunction={BlendFunction.SOFT_LIGHT} />
    </EffectComposer>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────
const LAYER_COUNT = 6

export default function ExplodingScene({ progress }) {
  useEffect(() => {
    const fn = (e) => {
      mouse.x =  (e.clientX / window.innerWidth  - 0.5) * 2
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', fn, { passive: true })
    return () => window.removeEventListener('mousemove', fn)
  }, [])

  return (
    <Canvas
      style={{ width: '100%', height: '100%', display: 'block', background: '#0C0A09' }}
      camera={{ position: [0, 0, 11], fov: 52 }}
      dpr={[1, 1.5]}
      gl={{
        alpha: false,
        antialias: false,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.5,
      }}
    >
      <ambientLight intensity={0.3} color="#120700" />
      <pointLight position={[6,  6,  6]}  intensity={4.5} color="#CA8A04" />
      <pointLight position={[-5,-4,  4]}  intensity={1.5} color="#1a1a6e" />
      <pointLight position={[0,  8, -4]}  intensity={1.0} color="#ffffff" />
      <spotLight  position={[0, 14,  0]}  intensity={0.8} angle={0.3} penumbra={0.6} color="#FDE68A" />

      {Array.from({ length: LAYER_COUNT }, (_, i) => (
        <ClothLayer key={i} layerIndex={i} totalLayers={LAYER_COUNT} progress={progress} />
      ))}

      {PIECES.map((piece, i) => <GeoPiece key={i} piece={piece} progress={progress} />)}

      <ParticleBurst progress={progress} />
      <CamController />

      <Suspense fallback={null}>
        <FX />
      </Suspense>
    </Canvas>
  )
}
