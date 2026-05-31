import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// ─── Per-material visual config ───────────────────────────────────────────
// Each material drives shader uniforms + scene lighting via smooth lerp.
export const MATERIAL_CONFIGS = [
  {
    // Gold Silk — warm, lustrous, flowing
    c1: [0.04, 0.03, 0.01],   // shadow
    c2: [0.80, 0.55, 0.04],   // mid gold
    c3: [0.98, 0.82, 0.20],   // bright highlight
    sheenFreq:  32,
    sheenAmp:   0.06,
    highlightStr: 0.30,
    waveSpeed:  1.0,
    waveAmp:    1.0,
    lightColor: '#CA8A04',
    ambientColor: '#1a0700',
    rimColor:   '#1a1a4e',
  },
  {
    // Onyx Velvet — deep, rich, soft crush
    c1: [0.01, 0.01, 0.02],   // near-black
    c2: [0.07, 0.04, 0.12],   // dark violet
    c3: [0.22, 0.14, 0.32],   // muted plum highlight
    sheenFreq:  12,
    sheenAmp:   0.03,
    highlightStr: 0.08,
    waveSpeed:  0.45,
    waveAmp:    1.5,           // deeper, softer folds
    lightColor: '#4a1a70',
    ambientColor: '#0a0010',
    rimColor:   '#200030',
  },
  {
    // Shadow Lace — gossamer, fine, sparkle
    c1: [0.02, 0.02, 0.03],   // near-black
    c2: [0.14, 0.14, 0.18],   // dark silver-grey
    c3: [0.75, 0.75, 0.80],   // bright silver
    sheenFreq:  80,            // high-freq = lace-like sparkle
    sheenAmp:   0.12,
    highlightStr: 0.55,
    waveSpeed:  1.6,
    waveAmp:    0.65,          // fine, rapid movement
    lightColor: '#8888aa',
    ambientColor: '#080810',
    rimColor:   '#202040',
  },
  {
    // Void Satin — black mirror, high contrast
    c1: [0.005, 0.005, 0.008], // near-pure black
    c2: [0.04,  0.04,  0.055], // very dark charcoal
    c3: [0.92,  0.92,  0.94],  // near-white specular flash
    sheenFreq:  48,
    sheenAmp:   0.04,
    highlightStr: 0.80,        // dramatic satin specular
    waveSpeed:  0.35,          // slow, glacial movement
    waveAmp:    0.75,
    lightColor: '#ffffff',
    ambientColor: '#050505',
    rimColor:   '#111111',
  },
]

// ─── Shaders ──────────────────────────────────────────────────────────────
const VERT = /* glsl */`
  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uWaveSpeed;
  uniform float uWaveAmp;
  varying vec2  vUv;
  varying float vElevation;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float spd = uTime * uWaveSpeed;
    float w =  sin(pos.x * 2.8 + spd * 1.3) * 0.18 * uWaveAmp
             + cos(pos.y * 2.2 + spd * 1.0) * 0.14 * uWaveAmp
             + sin((pos.x + pos.y) * 1.8 + spd * 0.7) * 0.09 * uWaveAmp;

    vec2  md = pos.xy - uMouse * 9.0;
    float ml = length(md);
    w += exp(-ml * 0.35) * sin(ml * 2.5 - spd * 5.0) * 0.5;

    pos.z    = w;
    vElevation = w;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const FRAG = /* glsl */`
  uniform float uTime;
  uniform vec3  uColor1;
  uniform vec3  uColor2;
  uniform vec3  uColor3;
  uniform float uSheenFreq;
  uniform float uSheenAmp;
  uniform float uHighlightStr;
  varying vec2  vUv;
  varying float vElevation;

  void main() {
    float t = clamp((vElevation + 0.5), 0.0, 1.0);
    vec3  c = mix(uColor1, uColor2, smoothstep(0.0, 0.55, t));
    c       = mix(c, uColor3, smoothstep(0.55, 1.0, t));

    float sheen = sin((vUv.x - vUv.y) * uSheenFreq + uTime * 0.5) * uSheenAmp + (1.0 - uSheenAmp);
    float hi    = smoothstep(0.4, 0.6, vElevation) * uHighlightStr;

    gl_FragColor = vec4(c * sheen + hi, 1.0);
  }
`

// ─── Mouse tracking ───────────────────────────────────────────────────────
const mPos = new THREE.Vector2()
const tPos = new THREE.Vector2()

// ─── Fabric mesh — reads materialIndex prop, lerps to target config ───────
function Fabric({ materialIndex }) {
  const meshRef    = useRef()
  const matRef     = useRef()
  const light1Ref  = useRef()
  const light2Ref  = useRef()

  const cfg0 = MATERIAL_CONFIGS[0]

  const uniforms = useMemo(() => ({
    uTime:         { value: 0 },
    uMouse:        { value: new THREE.Vector2() },
    uWaveSpeed:    { value: cfg0.waveSpeed },
    uWaveAmp:      { value: cfg0.waveAmp },
    uColor1:       { value: new THREE.Color(...cfg0.c1) },
    uColor2:       { value: new THREE.Color(...cfg0.c2) },
    uColor3:       { value: new THREE.Color(...cfg0.c3) },
    uSheenFreq:    { value: cfg0.sheenFreq },
    uSheenAmp:     { value: cfg0.sheenAmp },
    uHighlightStr: { value: cfg0.highlightStr },
  }), [])

  // Lerp targets — updated instantly when materialIndex changes
  const target = useRef({
    color1:       new THREE.Color(...cfg0.c1),
    color2:       new THREE.Color(...cfg0.c2),
    color3:       new THREE.Color(...cfg0.c3),
    sheenFreq:    cfg0.sheenFreq,
    sheenAmp:     cfg0.sheenAmp,
    highlightStr: cfg0.highlightStr,
    waveSpeed:    cfg0.waveSpeed,
    waveAmp:      cfg0.waveAmp,
    lightColor:   new THREE.Color(cfg0.lightColor),
    rimColor:     new THREE.Color(cfg0.rimColor),
  })

  // Current lerped values
  const current = useRef({
    color1:       new THREE.Color(...cfg0.c1),
    color2:       new THREE.Color(...cfg0.c2),
    color3:       new THREE.Color(...cfg0.c3),
    sheenFreq:    cfg0.sheenFreq,
    sheenAmp:     cfg0.sheenAmp,
    highlightStr: cfg0.highlightStr,
    waveSpeed:    cfg0.waveSpeed,
    waveAmp:      cfg0.waveAmp,
    lightColor:   new THREE.Color(cfg0.lightColor),
    rimColor:     new THREE.Color(cfg0.rimColor),
  })

  useEffect(() => {
    const cfg = MATERIAL_CONFIGS[materialIndex]
    target.current.color1.set(...cfg.c1)
    target.current.color2.set(...cfg.c2)
    target.current.color3.set(...cfg.c3)
    target.current.sheenFreq    = cfg.sheenFreq
    target.current.sheenAmp     = cfg.sheenAmp
    target.current.highlightStr = cfg.highlightStr
    target.current.waveSpeed    = cfg.waveSpeed
    target.current.waveAmp      = cfg.waveAmp
    target.current.lightColor.set(cfg.lightColor)
    target.current.rimColor.set(cfg.rimColor)
  }, [materialIndex])

  useFrame(({ clock }) => {
    if (!matRef.current) return
    const u   = matRef.current.uniforms
    const T   = target.current
    const C   = current.current
    const LRP = 0.035   // smoothness — lower = slower fade

    // Lerp colors
    C.color1.lerp(T.color1, LRP)
    C.color2.lerp(T.color2, LRP)
    C.color3.lerp(T.color3, LRP)
    C.lightColor.lerp(T.lightColor, LRP)
    C.rimColor.lerp(T.rimColor, LRP)

    // Lerp scalars
    C.sheenFreq    += (T.sheenFreq    - C.sheenFreq)    * LRP
    C.sheenAmp     += (T.sheenAmp     - C.sheenAmp)     * LRP
    C.highlightStr += (T.highlightStr - C.highlightStr) * LRP
    C.waveSpeed    += (T.waveSpeed    - C.waveSpeed)    * LRP
    C.waveAmp      += (T.waveAmp      - C.waveAmp)      * LRP

    // Write to uniforms
    u.uTime.value    = clock.elapsedTime
    u.uColor1.value.copy(C.color1)
    u.uColor2.value.copy(C.color2)
    u.uColor3.value.copy(C.color3)
    u.uSheenFreq.value    = C.sheenFreq
    u.uSheenAmp.value     = C.sheenAmp
    u.uHighlightStr.value = C.highlightStr
    u.uWaveSpeed.value    = C.waveSpeed
    u.uWaveAmp.value      = C.waveAmp

    // Lerp mouse
    tPos.lerp(mPos, 0.07)
    u.uMouse.value.copy(tPos)

    // Lerp light colors
    if (light1Ref.current) light1Ref.current.color.copy(C.lightColor)
    if (light2Ref.current) light2Ref.current.color.copy(C.rimColor)
  })

  return (
    <>
      <ambientLight intensity={0.45} color="#0a0500" />
      <pointLight ref={light1Ref} position={[ 6, 10,  6]} intensity={2.8} color={cfg0.lightColor} />
      <pointLight ref={light2Ref} position={[-6, -4,  5]} intensity={0.9} color={cfg0.rimColor}   />
      <pointLight                  position={[ 0,  0, 10]} intensity={0.4} color="#ffffff"          />

      <mesh ref={meshRef} rotation={[-0.52, 0, 0.18]}>
        <planeGeometry args={[14, 14, 90, 90]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={VERT}
          fragmentShader={FRAG}
          uniforms={uniforms}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  )
}

// ─── Canvas export ────────────────────────────────────────────────────────
export default function FabricMesh({ materialIndex = 0 }) {
  useEffect(() => {
    const fn = (e) => {
      mPos.x =  (e.clientX / window.innerWidth  - 0.5) * 2
      mPos.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', fn, { passive: true })
    return () => window.removeEventListener('mousemove', fn)
  }, [])

  return (
    <Canvas
      style={{ width: '100%', height: '100%', display: 'block' }}
      camera={{ position: [0, 8, 10], fov: 48 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
    >
      <Fabric materialIndex={materialIndex} />
      <OrbitControls
        enableZoom={false} enablePan={false}
        autoRotate autoRotateSpeed={0.6}
        minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  )
}
