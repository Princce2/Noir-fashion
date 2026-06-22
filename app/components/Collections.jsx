import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCart } from '../context/CartContext'

gsap.registerPlugin(ScrollTrigger)

const ITEMS = [
  { id:1, title:'Shadow Veil',   category:'Womenswear', sub:'Fall / Winter 2025', price:'€ 2,850', tag:'New',       img:'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800&h=1060&dpr=1',  span:'col-span-1 md:col-span-2 row-span-2' },
  { id:2, title:'Onyx Drape',    category:'Womenswear', sub:'Signature Series',   price:'€ 3,400', tag:'Exclusive', img:'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=700&h=930&dpr=1',   span:'col-span-1' },
  { id:3, title:'Eclipse Coat',  category:'Outerwear',  sub:'Archive Edit',       price:'€ 4,200', tag:'Limited',   img:'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=700&h=930&dpr=1',   span:'col-span-1' },
  { id:4, title:'Midnight Gown', category:'Couture',    sub:'Haute Couture',      price:'€ 6,500', tag:'Bespoke',   img:'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=700&h=930&dpr=1',   span:'col-span-1' },
  { id:5, title:'Void Suit',     category:'Menswear',   sub:"Men's Collection",   price:'€ 2,200', tag:'Core',      img:'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=700&h=930&dpr=1',   span:'col-span-1' },
]

export default function Collections() {
  const sectionRef          = useRef(null)
  const { addItem, openCart } = useCart()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headingEl = document.querySelector('.col-heading')
      const gridEl = document.querySelector('.col-grid')
      
      if (headingEl) {
        gsap.fromTo('.col-heading > *', { y:50, opacity:0 }, {
          y:0, opacity:1, stagger:0.12, duration:1.1, ease:'power3.out',
          scrollTrigger:{ trigger:headingEl, start:'top 80%', once:true },
        })
      }
      
      if (gridEl) {
        gsap.fromTo('.col-card', { y:70, opacity:0, scale:0.96 }, {
          y:0, opacity:1, scale:1, stagger:0.1, duration:1.1, ease:'power3.out',
          scrollTrigger:{ trigger:gridEl, start:'top 78%', once:true },
        })
      }

      // 3-D tilt on hover (desktop only) - attach once, cleanup properly
      const cards = document.querySelectorAll('.col-card')
      const handlers = []
      
      cards.forEach(card => {
        const inner = card.querySelector('.col-inner')
        if (!inner) return
        
        const onMove  = (e) => {
          const r  = card.getBoundingClientRect()
          const nx = ((e.clientX-r.left)/r.width  - 0.5) * 2
          const ny = ((e.clientY-r.top )/r.height - 0.5) * 2
          gsap.to(inner, { rotateY:nx*9, rotateX:-ny*7, duration:0.5, ease:'power2.out', transformPerspective:900 })
          const spot = card.querySelector('.col-spot')
          if (spot) {
            spot.style.left=`${e.clientX-r.left}px`
            spot.style.top=`${e.clientY-r.top}px`
            gsap.to(spot,{opacity:1,duration:0.3})
          }
        }
        
        const onLeave = () => {
          gsap.to(inner, { rotateY:0, rotateX:0, duration:0.9, ease:'power3.out' })
          const spot = card.querySelector('.col-spot')
          if (spot) gsap.to(spot, { opacity:0, duration:0.4 })
        }
        
        card.addEventListener('mousemove', onMove)
        card.addEventListener('mouseleave', onLeave)
        handlers.push({ card, onMove, onLeave })
      })
      
      return () => {
        handlers.forEach(({ card, onMove, onLeave }) => {
          card.removeEventListener('mousemove', onMove)
          card.removeEventListener('mouseleave', onLeave)
        })
      }
    }, sectionRef)
    
    return () => ctx.revert()
  }, [])

  const handleAdd = (item, e) => {
    e.stopPropagation()
    addItem(item)
    openCart()
  }

  return (
    <section ref={sectionRef} className="bg-noir-950 py-24 md:py-32 px-6 md:px-12">

      {/* Heading */}
      <div className="col-heading max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="font-montserrat text-[10px] tracking-[0.4em] uppercase text-gold-600 mb-3">The Edit — SS/FW 2025</p>
          <h2 className="font-cormorant font-bold text-6xl md:text-8xl leading-[0.9]">Collections</h2>
        </div>
        <a href="/collections" className="group inline-flex items-center gap-3 font-montserrat text-[10px] tracking-[0.22em] uppercase text-noir-500 hover:text-gold-400 transition-colors duration-300 cursor-none self-end">
          View all pieces
          <svg width="24" height="8" viewBox="0 0 24 8" fill="none" className="group-hover:translate-x-1.5 transition-transform duration-300">
            <path d="M0 4h22M17 1l4 3-4 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
          </svg>
        </a>
      </div>

      {/* Editorial bento grid */}
      <div className="col-grid max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[min(55vw,380px)]">
        {ITEMS.map(item => (
          <div
            key={item.id}
            className={`col-card group relative overflow-hidden cursor-none opacity-0 ${item.span}`}
            style={{ transformStyle:'preserve-3d' }}
          >
            {/* Inner — receives 3-D tilt */}
            <div className="col-inner relative w-full h-full" style={{ transformStyle:'preserve-3d' }}>

              {/* Image */}
              {/* First card is above-fold — always eager. Rest lazy-load fine. */}
                <img
                  src={item.img} alt={item.title}
                  loading={item.id === 1 ? 'eager' : 'lazy'} decoding="async"
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]"
                  style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top' }}
                />

              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-noir-950/90 via-noir-950/20 to-transparent" />

              {/* Spotlight follow */}
              <div className="col-spot absolute w-40 h-40 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none opacity-0"
                style={{ background:'radial-gradient(circle, rgba(202,138,4,0.12) 0%, transparent 70%)' }} />

              {/* Badge */}
              <div className="absolute top-4 left-4">
                <span className="glass px-2.5 py-1 font-montserrat text-[8px] tracking-[0.25em] uppercase text-gold-400">{item.tag}</span>
              </div>

              {/* Info + CTA — slides up on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="font-montserrat text-[8px] tracking-[0.3em] uppercase text-gold-600 mb-1">{item.sub}</p>
                <div className="flex items-end justify-between mb-3">
                  <h3 className="font-cormorant text-2xl md:text-3xl font-medium text-noir-50 leading-tight">{item.title}</h3>
                  <span className="font-cormorant text-lg text-gold-400 ml-4 flex-shrink-0">{item.price}</span>
                </div>

                {/* Add to Bag — always visible on mobile, hover-reveal on desktop */}
                <button
                  onClick={(e) => handleAdd(item, e)}
                  className={[
                    'relative w-full py-2.5',
                    'font-montserrat text-[10px] tracking-[0.22em] uppercase',
                    'bg-gold-600 hover:bg-gold-500 active:bg-gold-400',
                    'text-noir-950 cursor-none',
                    'transition-all duration-400',
                    // Desktop: hidden until hover; Mobile: always visible
                    'md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0',
                    'opacity-100 translate-y-0',
                  ].join(' ')}
                  style={{ zIndex: 20 }}
                >
                  Add to Bag
                </button>
              </div>

              {/* Border glow */}
              <div className="absolute inset-0 border border-transparent group-hover:border-gold-600/25 transition-colors duration-500 pointer-events-none" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
