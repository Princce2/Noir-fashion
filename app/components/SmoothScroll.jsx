import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll({ children }) {
  useEffect(() => {
    let lenis = null
    let tick  = null

    const init = async () => {
      const { default: Lenis } = await import('lenis')

      lenis = new Lenis({
        duration:      1.35,
        easing:        t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel:   true,
        wheelMultiplier: 0.88,
      })

      // Keep GSAP ScrollTrigger in sync on every Lenis scroll event
      lenis.on('scroll', ScrollTrigger.update)

      tick = (time) => lenis.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)

      // CRITICAL: Without this, GSAP caches all trigger positions before Lenis
      // takes over scroll.  Triggers then fire at the wrong scroll depth — some
      // never fire at all.  The small delay lets React finish its first paint so
      // all elements have their final layout before we measure them.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          ScrollTrigger.refresh()
        })
      })
    }

    init()

    return () => {
      lenis?.destroy()
      if (tick) gsap.ticker.remove(tick)
    }
  }, [])

  return <>{children}</>
}
