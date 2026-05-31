import { lazy, Suspense, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FabricMesh = lazy(() => import('./three/FabricMesh'))

// ─── Material catalogue ───────────────────────────────────────────────────
const MATERIALS = [
  {
    label:   'Gold Silk',
    desc:    'Nishijin-woven, Kyoto',
    story:   'Hand-loomed on century-old Nishijin shuttles. The weft carries 24-carat gold filament at 3.2 threads per centimetre.',
    composition: [['Gold Silk', '68%'], ['Japanese Lyocell', '24%'], ['Metallic Thread', '8%']],
    accent:  '#CA8A04',
  },
  {
    label:   'Onyx Velvet',
    desc:    'Genoa crush, 480 g/m²',
    story:   'Deep-pile Genovese velvet, crush-finished by hand. Each metre takes eighteen hours to weave on a traditional velvet loom.',
    composition: [['Silk Velvet Pile', '72%'], ['Cotton Backing', '20%'], ['Nylon Binder', '8%']],
    accent:  '#4a1a70',
  },
  {
    label:   'Shadow Lace',
    desc:    "Calais point d'esprit",
    story:   "Machined on 19th-century Leavers looms in Calais. A single metre weighs 38 g yet holds its structure across seven metres of fall.",
    composition: [['Cotton Bobbinnet', '55%'], ['Viscose Cord', '35%'], ['Lurex', '10%']],
    accent:  '#6060aa',
  },
  {
    label:   'Void Satin',
    desc:    'Charmeuse, 19 momme',
    story:   'Grade-6A mulberry silk, woven in a 4/1 charmeuse satin weave. The reverse carries the matte finish; the face reflects light like polished obsidian.',
    composition: [['Mulberry Silk', '92%'], ['Elastane', '8%'], ['Optical Treatment', '<1%']],
    accent:  '#888888',
  },
]

const fadeUp = {
  hidden:  { y: 44, opacity: 0 },
  visible: i => ({ y: 0, opacity: 1, transition: { delay: i * 0.1, duration: 0.95, ease: [0.33, 1, 0.68, 1] } }),
}

export default function FabricViewer() {
  const [active, setActive] = useState(0)
  const mat = MATERIALS[active]

  return (
    <section className="relative bg-noir-950 overflow-hidden">
      <div className="relative flex flex-col md:flex-row" style={{ minHeight: '90vh' }}>

        {/* ── 3D Canvas ─────────────────────────────────────────────────── */}
        <div className="relative flex-1 canvas-vignette" style={{ minHeight: 'min(55vw, 90vh)' }}>
          <Suspense fallback={null}>
            {/* Pass active material index — FabricMesh lerps smoothly */}
            <FabricMesh materialIndex={active} />
          </Suspense>

          {/* Side fade */}
          <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-noir-950 to-transparent hidden md:block pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-noir-950 to-transparent md:hidden pointer-events-none" />

          {/* Active material badge — bottom left of canvas */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="absolute bottom-6 left-6 flex items-center gap-3"
            >
              <div className="glass px-4 py-2 flex items-center gap-2.5">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: mat.accent, boxShadow: `0 0 8px ${mat.accent}` }}
                />
                <span className="font-montserrat text-[9px] tracking-[0.25em] uppercase text-noir-200">
                  {mat.label}
                </span>
              </div>
              <div className="glass px-3 py-2 hidden md:block">
                <span className="font-montserrat text-[8px] tracking-[0.2em] text-noir-500">
                  Move cursor · Drag to orbit
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Info panel ────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 w-full md:w-[440px] flex flex-col justify-center px-10 md:px-14 py-16">

          <motion.p
            variants={fadeUp} custom={0} initial="hidden"
            whileInView="visible" viewport={{ once: true, amount: 0.3 }}
            className="font-montserrat text-[10px] tracking-[0.42em] uppercase text-gold-600 mb-4"
          >
            Interactive 3D
          </motion.p>
          <motion.h2
            variants={fadeUp} custom={1} initial="hidden"
            whileInView="visible" viewport={{ once: true, amount: 0.3 }}
            className="font-cormorant font-bold text-5xl md:text-6xl leading-none mb-5"
          >
            Living<br /><span className="italic text-gold-gradient">Fabric</span>
          </motion.h2>

          {/* Material story — crossfades on switch */}
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45 }}
              className="font-montserrat text-sm text-noir-400 leading-relaxed mb-8 max-w-xs"
            >
              {mat.story}
            </motion.p>
          </AnimatePresence>

          {/* ── Material selector ───────────────────────────────────────── */}
          <motion.div
            variants={fadeUp} custom={3} initial="hidden"
            whileInView="visible" viewport={{ once: true, amount: 0.3 }}
            className="mb-8"
          >
            <p className="font-montserrat text-[9px] tracking-[0.32em] uppercase text-noir-600 mb-4">
              Material Stories
            </p>
            <div className="flex flex-col gap-2">
              {MATERIALS.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`group flex items-center justify-between px-4 py-3 text-left transition-all duration-300 cursor-none border ${
                    active === i
                      ? 'bg-gold-600/10 border-gold-600/40 text-gold-400'
                      : 'border-noir-800 text-noir-500 hover:border-noir-600 hover:text-noir-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Colour swatch */}
                    <span
                      className="w-1.5 h-1.5 rounded-full transition-all duration-500 flex-shrink-0"
                      style={{
                        background: active === i ? m.accent : '#44403C',
                        boxShadow:  active === i ? `0 0 6px ${m.accent}` : 'none',
                      }}
                    />
                    <span className="font-montserrat text-[10px] tracking-[0.18em] uppercase">{m.label}</span>
                  </div>
                  <span className="font-montserrat text-[9px] text-noir-600 italic hidden sm:inline">
                    {m.desc}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* ── Composition bars — remount on material switch to replay animation ── */}
          <motion.div
            variants={fadeUp} custom={4} initial="hidden"
            whileInView="visible" viewport={{ once: true, amount: 0.3 }}
            className="border-t border-noir-800 pt-7"
          >
            <p className="font-montserrat text-[9px] tracking-[0.32em] uppercase text-noir-600 mb-4">
              Composition
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {mat.composition.map(([k, v], idx) => (
                  <div key={k} className="flex justify-between items-center mb-3">
                    <span className="font-montserrat text-xs text-noir-400">{k}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-px bg-noir-800 relative overflow-hidden">
                        <motion.div
                          className="absolute inset-y-0 left-0"
                          style={{ background: mat.accent }}
                          initial={{ width: 0 }}
                          animate={{ width: v }}
                          transition={{ duration: 1.1, ease: [0.33, 1, 0.68, 1], delay: idx * 0.12 }}
                        />
                      </div>
                      <span className="font-cormorant text-sm tabular-nums" style={{ color: mat.accent }}>
                        {v}
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
