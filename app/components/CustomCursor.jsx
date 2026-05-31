import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const dot  = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    const onMove = (e) => {
      gsap.to(dot.current,  { x: e.clientX, y: e.clientY, duration: 0, overwrite: true })
      gsap.to(ring.current, { x: e.clientX, y: e.clientY, duration: 0.18, ease: 'power2.out', overwrite: true })
    }
    const onEnter = () => {
      gsap.to(ring.current, { scale: 2.4, borderColor: '#EAB308', opacity: 0.8, duration: 0.3 })
      gsap.to(dot.current,  { scale: 0, duration: 0.2 })
    }
    const onLeave = () => {
      gsap.to(ring.current, { scale: 1, borderColor: '#CA8A04', opacity: 0.5, duration: 0.3 })
      gsap.to(dot.current,  { scale: 1, duration: 0.2 })
    }
    const bind = () => {
      document.querySelectorAll('a,button,[data-cursor]').forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }
    window.addEventListener('mousemove', onMove)
    bind()
    const obs = new MutationObserver(bind)
    obs.observe(document.body, { childList: true, subtree: true })
    return () => { window.removeEventListener('mousemove', onMove); obs.disconnect() }
  }, [])

  return (
    <>
      <div ref={dot}  className="pointer-events-none fixed top-0 left-0 z-[9999] w-2 h-2 rounded-full bg-gold-600 -translate-x-1/2 -translate-y-1/2" style={{ mixBlendMode:'difference' }} />
      <div ref={ring} className="pointer-events-none fixed top-0 left-0 z-[9998] w-9 h-9 rounded-full border border-gold-600/50 -translate-x-1/2 -translate-y-1/2" />
    </>
  )
}
