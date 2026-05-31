import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { motion, useScroll, useTransform } from 'framer-motion'

const LINKS = { Collections:['New Arrivals','Signature','Archive','Bespoke'], Brand:['Our Story','Ateliers','Craftsmen','Press'], Services:['Styling','Alterations','Shipping','Returns'] }
const stagger = { hidden:{}, visible:{ transition:{ staggerChildren:0.1 } } }
const item    = { hidden:{y:30,opacity:0}, visible:{ y:0,opacity:1, transition:{ duration:0.8, ease:[0.33,1,0.68,1] } } }

export default function Footer() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target:ref, offset:['start end','end end'] })
  const logoScale   = useTransform(scrollYProgress, [0,1], [0.88,1])
  const logoOpacity = useTransform(scrollYProgress, [0,0.4], [0,1])
  const [email, setEmail] = useState('')
  const [sent, setSent]   = useState(false)

  return (
    <footer ref={ref} className="bg-noir-900 border-t border-noir-800 overflow-hidden">
      <div className="border-b border-noir-800 px-10 md:px-16 py-14">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{once:true,amount:0.4}}>
            <motion.p variants={item} className="font-montserrat text-[9px] tracking-[0.44em] uppercase text-gold-600 mb-2">The Inner Circle</motion.p>
            <motion.h3 variants={item} className="font-cormorant text-3xl md:text-4xl font-light italic text-noir-50">Access before the world</motion.h3>
          </motion.div>
          <motion.form initial={{opacity:0,x:30}} whileInView={{opacity:1,x:0}} transition={{duration:0.8,ease:[0.33,1,0.68,1],delay:0.2}} viewport={{once:true}}
            className="flex w-full md:w-auto" onSubmit={e=>{e.preventDefault();setSent(true)}}>
            {!sent ? (<>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" required
                className="flex-1 md:w-72 px-5 py-3.5 bg-noir-950 border border-noir-700 font-montserrat text-xs text-noir-200 placeholder:text-noir-600 focus:outline-none focus:border-gold-600/60 transition-colors duration-300" />
              <button type="submit" className="px-8 py-3.5 bg-gold-600 hover:bg-gold-500 font-montserrat text-[10px] tracking-[0.22em] uppercase text-noir-950 transition-colors duration-300 cursor-none whitespace-nowrap">Join</button>
            </>) : (
              <motion.p initial={{opacity:0}} animate={{opacity:1}} className="font-cormorant italic text-xl text-gold-500 py-3">Welcome to NOIR. ✦</motion.p>
            )}
          </motion.form>
        </div>
      </div>

      <div className="overflow-hidden border-b border-noir-800/50 py-4 px-10">
        <motion.p style={{scale:logoScale,opacity:logoOpacity}} className="font-cormorant font-bold text-[18vw] leading-none text-noir-800/40 select-none text-center">NOIR</motion.p>
      </div>

      <div className="px-10 md:px-16 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{once:true,amount:0.3}} className="col-span-2 md:col-span-1">
            <motion.div variants={item}>
              <Link to="/" className="font-cormorant text-4xl font-bold tracking-[0.38em] text-gold-600 block mb-5 cursor-none">NOIR</Link>
              <p className="font-montserrat text-xs text-noir-500 leading-relaxed max-w-[180px]">Luxury fashion from the Marais. Obsessive craft. Fearless design.</p>
            </motion.div>
          </motion.div>
          {Object.entries(LINKS).map(([cat,links]) => (
            <motion.div key={cat} variants={stagger} initial="hidden" whileInView="visible" viewport={{once:true,amount:0.3}}>
              <motion.p variants={item} className="font-montserrat text-[9px] tracking-[0.38em] uppercase text-noir-600 mb-5">{cat}</motion.p>
              <ul className="flex flex-col gap-3">
                {links.map(l => (<motion.li key={l} variants={item}><Link to="#" className="font-montserrat text-xs text-noir-400 hover:text-gold-400 transition-colors duration-300 cursor-none">{l}</Link></motion.li>))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="border-t border-noir-800 px-10 md:px-16 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-montserrat text-[9px] tracking-[0.22em] text-noir-700">© 2025 NOIR Fashion House. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy','Terms','Cookies'].map(t => (<Link key={t} to="#" className="font-montserrat text-[9px] tracking-[0.22em] text-noir-700 hover:text-gold-600 transition-colors duration-300 cursor-none">{t}</Link>))}
          </div>
        </div>
      </div>
    </footer>
  )
}
