import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Loader({ onComplete }) {
  const rootRef  = useRef(null)
  const lineRef  = useRef(null)
  const countRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => gsap.to(rootRef.current, {
        clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'power4.inOut', onComplete,
      }),
    })
    const counter = { val: 0 }
    tl.to(counter, {
      val: 100, duration: 2.4, ease: 'power2.inOut',
      onUpdate() { if (countRef.current) countRef.current.textContent = String(Math.round(counter.val)).padStart(3,'0') },
    })
    tl.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 2.4, ease: 'power2.inOut' }, 0)
    tl.fromTo('.ldr-char',
      { y: 80, opacity: 0, rotateX: -60, transformOrigin: '50% 100%' },
      { y: 0,  opacity: 1, rotateX: 0, duration: 0.85, stagger: 0.1, ease: 'power4.out' }, 0.3)
    tl.fromTo('.ldr-char',
      { color: '#CA8A04' }, { color: '#FDE68A', stagger: 0.08, duration: 0.25, yoyo: true, repeat: 1, ease: 'none' }, 1.8)
    return () => tl.kill()
  }, [onComplete])

  return (
    <div ref={rootRef} className="fixed inset-0 z-[9000] bg-noir-950 flex flex-col items-center justify-center"
      style={{ clipPath: 'inset(0 0 0% 0)' }}>
      <div className="flex gap-3 md:gap-6" style={{ perspective: '600px' }} aria-hidden>
        {'NOIR'.split('').map((c, i) => (
          <span key={i} className="ldr-char font-cormorant font-bold text-[18vw] md:text-[14vw] leading-none text-gold-600 opacity-0 select-none">
            {c}
          </span>
        ))}
      </div>
      <div className="mt-10 w-48 md:w-64 h-px bg-noir-800 relative overflow-hidden">
        <div ref={lineRef} className="absolute inset-0 bg-gold-600 origin-left" style={{ transform: 'scaleX(0)' }} />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <span className="font-montserrat text-[9px] tracking-[0.4em] uppercase text-noir-600">Loading</span>
        <span ref={countRef} className="font-cormorant text-sm text-gold-700 tabular-nums">000</span>
      </div>
    </div>
  )
}
