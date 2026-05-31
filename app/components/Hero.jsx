import { useRef, useEffect, lazy, Suspense } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const HeroScene = lazy(() => import('./three/HeroScene'))
gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const sectionRef = useRef(null)
  const overlayRef = useRef(null)
  const eyebrowRef = useRef(null)
  const titleRef   = useRef(null)
  const subRef     = useRef(null)
  const ctaRef     = useRef(null)
  const scrollRef  = useRef(null)

  // Magnetic buttons
  useEffect(() => {
    const cleanup = []
    document.querySelectorAll('[data-magnetic]').forEach(btn => {
      const onMove  = e => { const r=btn.getBoundingClientRect(); gsap.to(btn,{ x:(e.clientX-r.left-r.width/2)*0.35, y:(e.clientY-r.top-r.height/2)*0.35, duration:0.4, ease:'power2.out' }) }
      const onLeave = () => gsap.to(btn, { x:0,y:0,duration:0.7,ease:'elastic.out(1,0.4)' })
      btn.addEventListener('mousemove', onMove)
      btn.addEventListener('mouseleave', onLeave)
      cleanup.push(() => { btn.removeEventListener('mousemove',onMove); btn.removeEventListener('mouseleave',onLeave) })
    })
    return () => cleanup.forEach(f => f())
  }, [])

  useEffect(() => {
    let st = null, st2 = null
    const ctx = gsap.context(async () => {
      const { default: SplitType } = await import('split-type')
      const splitTitle = new SplitType(titleRef.current, { types: 'chars' })
      const splitSub   = new SplitType(subRef.current,   { types: 'words' })

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.fromTo(eyebrowRef.current, { yPercent:120, opacity:0 }, { yPercent:0, opacity:1, duration:1 }, 0)
        .fromTo(splitTitle.chars, { yPercent:130, opacity:0, rotateX:-55, transformOrigin:'50% 100%' },
          { yPercent:0, opacity:1, rotateX:0, duration:1.05, stagger:0.04 }, 0.15)
        .fromTo(splitSub.words, { yPercent:80, opacity:0 }, { yPercent:0, opacity:1, duration:0.85, stagger:0.06 }, 0.55)
        .fromTo(ctaRef.current, { y:22, opacity:0 }, { y:0, opacity:1, duration:0.8 }, 0.85)
        .fromTo(scrollRef.current, { opacity:0 }, { opacity:1, duration:1 }, 1.2)

      st2 = gsap.to(overlayRef.current, {
        yPercent:28, opacity:0, ease:'none',
        scrollTrigger: { trigger:sectionRef.current, start:'top top', end:'bottom top', scrub:true },
      })

      return () => { splitTitle.revert(); splitSub.revert() }
    }, sectionRef)
    return () => { ctx.revert() }
  }, [])

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-noir-950">
      <div className="absolute inset-0 canvas-vignette" style={{ width:'100%', height:'100%' }}>
        <Suspense fallback={null}><HeroScene /></Suspense>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_75%_at_50%_50%,transparent_25%,#0C0A09_85%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-noir-950/65 via-transparent to-noir-950/95 pointer-events-none" />

      <div ref={overlayRef} className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6" style={{ perspective:'900px' }}>
        <div className="overflow-hidden mb-5">
          <p ref={eyebrowRef} style={{ opacity:0 }} className="font-montserrat text-[10px] font-semibold tracking-[0.48em] uppercase text-gold-600">
            Luxury Fashion House&nbsp;&nbsp;·&nbsp;&nbsp;Est. Paris 2018
          </p>
        </div>
        <h1 ref={titleRef} className="font-cormorant font-bold leading-[0.87] text-[23vw] md:text-[19vw] text-gold-gradient select-none" aria-label="NOIR">NOIR</h1>
        <div className="overflow-hidden mt-5">
          <p ref={subRef} className="font-cormorant italic text-xl md:text-[1.65rem] text-noir-300 max-w-xl tracking-wide">
            Where darkness becomes the design language
          </p>
        </div>
        <div ref={ctaRef} className="mt-12 flex flex-col sm:flex-row items-center gap-6" style={{ opacity:0 }}>
          <a href="/collections" data-magnetic className="relative group overflow-hidden px-11 py-4 font-montserrat text-[11px] font-semibold tracking-[0.28em] uppercase text-noir-950 cursor-none inline-block">
            <span className="absolute inset-0 bg-gold-600 group-hover:bg-gold-500 transition-colors duration-300" />
            <span className="relative z-10">Explore Collection</span>
          </a>
          <a href="/lookbook" data-magnetic className="group inline-flex items-center gap-3 font-montserrat text-[11px] font-medium tracking-[0.24em] uppercase text-noir-400 hover:text-gold-400 transition-colors duration-300 cursor-none">
            <span className="w-7 h-px bg-current transition-all duration-500 group-hover:w-12" />
            View Lookbook
          </a>
        </div>
      </div>

      <div ref={scrollRef} className="absolute bottom-9 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2.5" style={{ opacity:0 }}>
        <div className="w-5 h-8 rounded-full border border-gold-600/30 flex justify-center pt-1.5">
          <div className="w-0.5 h-2 rounded-full bg-gold-600 animate-bounce-sm" />
        </div>
      </div>
    </section>
  )
}
