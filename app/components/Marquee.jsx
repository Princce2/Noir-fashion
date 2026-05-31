import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const WORDS = ['NOIR','LUXURY','FASHION','ELEGANCE','CRAFT','PARIS','TIMELESS','DESIGN']

export default function Marquee() {
  const t1 = useRef(null), t2 = useRef(null)
  const items = [...WORDS, ...WORDS]
  useGSAP(() => {
    gsap.to(t1.current, { xPercent:-50, ease:'none', duration:22, repeat:-1 })
    gsap.to(t2.current, { xPercent:50,  ease:'none', duration:18, repeat:-1 })
  }, [])
  return (
    <div className="relative py-6 overflow-hidden border-y border-gold-600/15 bg-noir-950/80 backdrop-blur-sm">
      <div className="flex whitespace-nowrap mb-3">
        <div ref={t1} className="flex gap-8 pr-8" style={{ width:'max-content' }}>
          {[...items,...items].map((w,i) => (
            <span key={i} className="font-cormorant italic text-[13px] tracking-[0.3em] uppercase text-noir-600 select-none">
              {w} <span className="text-gold-700 not-italic mx-1">✦</span>
            </span>
          ))}
        </div>
      </div>
      <div className="flex whitespace-nowrap">
        <div ref={t2} className="flex gap-8 pr-8" style={{ width:'max-content', transform:'translateX(-50%)' }}>
          {[...items,...items].map((w,i) => (
            <span key={i} className="font-montserrat text-[10px] tracking-[0.4em] uppercase text-noir-700 select-none">
              {w} <span className="text-gold-800 mx-2">—</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
