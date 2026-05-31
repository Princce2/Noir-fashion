import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { useCart } from '../context/CartContext'

const LINKS = ['Collections', 'Lookbook', 'About']

const menuV = {
  initial: { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
  animate: { clipPath: 'inset(0 0 0% 0)',   opacity: 1, transition: { duration: 0.7, ease: [0.76,0,0.24,1] } },
  exit:    { clipPath: 'inset(0 0 100% 0)', opacity: 0, transition: { duration: 0.6, ease: [0.76,0,0.24,1] } },
}
const linkV = {
  initial: { y: 60, opacity: 0 },
  animate: i => ({ y:0, opacity:1, transition:{ delay: i*0.07+0.15, duration:0.65, ease:[0.33,1,0.68,1] } }),
  exit:    i => ({ y:-40, opacity:0, transition:{ delay: i*0.04, duration:0.35 } }),
}

export default function Navigation() {
  const navRef = useRef(null)
  const [open, setOpen]   = useState(false)
  const [solid, setSolid] = useState(false)
  const { count, openCart } = useCart()

  useEffect(() => {
    const fn = () => setSolid(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    gsap.fromTo(navRef.current, { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.3, ease: 'power4.out', delay: 1.6 })
  }, [])

  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])

  return (
    <>
      <nav ref={navRef} style={{ opacity: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 px-8 md:px-12 py-5 flex items-center justify-between transition-all duration-700 ${solid||open ? 'glass border-b border-gold-600/10' : ''}`}>
        <Link to="/" className="font-cormorant text-3xl font-bold tracking-[0.38em] text-gold-600 hover:text-gold-400 transition-colors duration-300 cursor-none">NOIR</Link>

        <div className="hidden md:flex items-center gap-10">
          {LINKS.map(l => (
            <Link key={l} to={`/${l.toLowerCase()}`}
              className="relative font-montserrat text-[11px] font-medium tracking-[0.22em] uppercase text-noir-300 hover:text-gold-400 transition-colors duration-300 group cursor-none">
              {l}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold-500 group-hover:w-full transition-all duration-500 origin-left" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <button onClick={openCart} aria-label="Cart" className="relative text-noir-300 hover:text-gold-400 transition-colors duration-300 cursor-none">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-gold-600 text-noir-950 font-montserrat text-[8px] font-bold flex items-center justify-center leading-none">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </button>
          <button onClick={() => setOpen(!open)} aria-label="Menu" className="relative w-6 h-4 flex flex-col justify-between cursor-none">
            <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 7 : 0 }} className="block h-px w-full bg-gold-600 origin-left" />
            <motion.span animate={{ opacity: open ? 0 : 1 }} className="block h-px w-full bg-gold-600" />
            <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -7 : 0 }} className="block h-px w-full bg-gold-600 origin-left" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div key="menu" variants={menuV} initial="initial" animate="animate" exit="exit"
            className="fixed inset-0 z-40 bg-noir-950 flex flex-col items-center justify-center">
            <span className="absolute text-[30vw] font-cormorant font-bold text-noir-900/30 select-none pointer-events-none">N</span>
            <nav className="flex flex-col items-center gap-8">
              {LINKS.map((l, i) => (
                <div key={l} className="overflow-hidden">
                  <motion.div custom={i} variants={linkV} initial="initial" animate="animate" exit="exit">
                    <Link to={`/${l.toLowerCase()}`} onClick={() => setOpen(false)}
                      className="font-cormorant text-[14vw] md:text-[10vw] font-bold italic text-noir-50 hover:text-gold-500 transition-colors duration-300 leading-none cursor-none block">
                      {l}
                    </Link>
                  </motion.div>
                </div>
              ))}
            </nav>
            <motion.p initial={{ opacity:0 }} animate={{ opacity:1, transition:{ delay:0.5 } }}
              className="absolute bottom-10 font-montserrat text-[9px] tracking-[0.45em] uppercase text-noir-700">
              Paris · Maison NOIR · Est. 2018
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
