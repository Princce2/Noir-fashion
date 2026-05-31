import { useRef, useEffect, lazy, Suspense } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ExplodingScene = lazy(() => import('./three/ExplodingScene'))

const PHASES = [
  { at: 0.00, label: 'I',   heading: 'The Cloth',    sub: 'Six layers of Japanese silk assembled into a single garment.' },
  { at: 0.30, label: 'II',  heading: 'Separation',   sub: 'Watch each layer peel away. Scroll to deconstruct.' },
  { at: 0.60, label: 'III', heading: 'Architecture', sub: 'The skeleton beneath every NOIR piece — obsessive structure.' },
  { at: 0.85, label: 'IV',  heading: 'Void',         sub: 'In the space between the layers, we find the design.' },
]

export default function ScrollMorph() {
  const outerRef = useRef(null)   // 400 vh — the scroll space
  const stickyRef = useRef(null)  // 100 vh — gets pinned by GSAP
  const progress = useRef(0)      // 0–1 read by Three.js every frame
  const lineRef = useRef(null)

  // Individual refs so React can assign them before the GSAP effect runs
  const p0 = useRef(null)
  const p1 = useRef(null)
  const p2 = useRef(null)
  const p3 = useRef(null)

  useEffect(() => {
    // All DOM nodes must be mounted before we create the ScrollTrigger
    if (!outerRef.current || !stickyRef.current) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger:    outerRef.current,
        start:      'top top',
        end:        'bottom bottom',
        pin:        stickyRef.current,
        // pinSpacing:false tells GSAP we already own the scroll space (400 vh outer)
        // Without this GSAP adds a spacer that inflates the section and pushes the end
        // waypoint so far out that progress never reaches 0.30+, so phases never change.
        pinSpacing: false,
        scrub:      1.2,
        onUpdate(self) {
          progress.current = self.progress

          // Vertical gold line
          if (lineRef.current) {
            lineRef.current.style.height = `${self.progress * 100}%`
          }

          // Crossfade phases
          const refs  = [p0, p1, p2, p3]
          const prog  = self.progress
          refs.forEach((ref, i) => {
            if (!ref.current) return
            const start  = PHASES[i].at
            const end    = PHASES[i + 1]?.at ?? 1.01
            const active = prog >= start && prog < end
            ref.current.style.opacity   = active ? '1' : '0'
            ref.current.style.transform = active ? 'translateY(0px)' : 'translateY(16px)'
          })
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={outerRef}
      style={{ height: '400vh', position: 'relative', background: '#0C0A09' }}
    >
      {/*
        stickyRef:  position:relative is REQUIRED so that the canvas child
        with position:absolute / inset:0 sizes against this 100 vh frame,
        not against the 400 vh outer section.
      */}
      <div
        ref={stickyRef}
        style={{
          position:   'relative',
          width:      '100%',
          height:     '100vh',
          overflow:   'hidden',
        }}
      >
        {/* ── Canvas — fills stickyRef 100 vh ───────────────────────── */}
        <div
          style={{
            position:   'absolute',
            inset:      0,
            background: '#0C0A09',
            zIndex:     0,
          }}
        >
          <Suspense
            fallback={
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 1, height: 60, background: 'rgba(202,138,4,0.25)' }} />
              </div>
            }
          >
            <ExplodingScene progress={progress} />
          </Suspense>
        </div>

        {/* ── Gradient veils ──────────────────────────────────────────── */}
        <div
          style={{
            position:       'absolute', inset: 0,
            pointerEvents:  'none',     zIndex: 1,
            background:     'linear-gradient(to bottom, rgba(12,10,9,.80) 0%, transparent 22%, transparent 75%, rgba(12,10,9,.80) 100%)',
          }}
        />
        <div
          style={{
            position:       'absolute', inset: 0,
            pointerEvents:  'none',     zIndex: 1,
            background:     'radial-gradient(ellipse 68% 68% at 50% 50%, transparent 18%, rgba(12,10,9,.88) 90%)',
          }}
        />

        {/* ── Section eyebrow ─────────────────────────────────────────── */}
        <p style={{
          position: 'absolute', top: 32, left: 48,
          fontFamily: 'var(--font-montserrat)', fontSize: 9,
          letterSpacing: '0.44em', textTransform: 'uppercase',
          color: '#CA8A04', pointerEvents: 'none', zIndex: 10, margin: 0,
        }}>
          The Deconstruction
        </p>

        {/* ── Vertical progress line ──────────────────────────────────── */}
        <div style={{
          position: 'absolute', top: 48, right: 32, bottom: 48,
          width: 1, background: 'rgba(255,255,255,0.06)', zIndex: 10,
        }}>
          <div
            ref={lineRef}
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '100%', height: '0%',
              background: '#CA8A04', transition: 'none',
            }}
          />
        </div>

        {/* ── Phase panels ────────────────────────────────────────────── */}
        <div style={{ position: 'absolute', bottom: 56, left: 48, zIndex: 10, pointerEvents: 'none' }}>
          {PHASES.map((phase, i) => {
            const ref = [p0, p1, p2, p3][i]
            return (
              <div
                key={i}
                ref={ref}
                style={{
                  position:   'absolute', bottom: 0, left: 0,
                  maxWidth:   360,
                  opacity:    i === 0 ? 1 : 0,
                  transform:  'translateY(0px)',
                  transition: 'opacity 0.5s ease, transform 0.5s ease',
                }}
              >
                <span style={{
                  display: 'block', marginBottom: 8,
                  fontFamily: 'var(--font-montserrat)', fontSize: 8,
                  letterSpacing: '0.42em', textTransform: 'uppercase', color: '#A16207',
                }}>
                  {phase.label}
                </span>
                <h3 style={{
                  margin: '0 0 10px', lineHeight: 1,
                  fontFamily: 'var(--font-cormorant)', fontWeight: 700, fontSize: 'clamp(2rem,4vw,3.2rem)',
                  color: '#FAFAF9',
                }}>
                  {phase.heading}
                </h3>
                <p style={{
                  margin: 0,
                  fontFamily: 'var(--font-montserrat)', fontSize: 11, lineHeight: 1.65,
                  color: '#78716C', maxWidth: 320,
                }}>
                  {phase.sub}
                </p>
              </div>
            )
          })}
        </div>

        {/* ── Scroll hint ─────────────────────────────────────────────── */}
        <div style={{
          position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          pointerEvents: 'none', zIndex: 10,
        }}>
          <span style={{
            fontFamily: 'var(--font-montserrat)', fontSize: 8,
            letterSpacing: '0.38em', textTransform: 'uppercase', color: '#44403C',
          }}>
            Scroll to deconstruct
          </span>
          <div style={{ width: 1, height: 28, background: 'linear-gradient(to bottom, rgba(202,138,4,.5), transparent)' }} />
        </div>
      </div>
    </section>
  )
}
