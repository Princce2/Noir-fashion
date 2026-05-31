import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { n:'2018', label:'Founded',     suffix:'' },
  { n:'47',   label:'Collections', suffix:'+' },
  { n:'12',   label:'Countries',   suffix:'' },
  { n:'∞',    label:'Craft',       suffix:'' },
]

const fadeUp = { hidden:{y:48,opacity:0}, visible: i => ({ y:0,opacity:1, transition:{delay:i*0.12,duration:1,ease:[0.33,1,0.68,1]} }) }

function ParallaxImg() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target:ref, offset:['start end','end start'] })
  const y = useTransform(scrollYProgress, [0,1], ['-8%','8%'])
  return (
    <motion.div ref={ref} className="relative overflow-hidden h-[60vw] md:h-[640px]"
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
      transition={{ duration:1.4, ease:[0.76,0,0.24,1] }} viewport={{ once:true,amount:0.2 }}>
      <motion.div className="absolute inset-[-10%] w-[120%] h-[120%]" style={{ y }}>
        <img src="https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=1200&h=750&dpr=1" alt="NOIR Atelier"
          loading="lazy" decoding="async" 
          style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center', display:'block' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-noir-950/40 to-transparent" />
      </motion.div>
      <div className="absolute top-5 left-5 glass px-3 py-1.5">
        <span className="font-montserrat text-[9px] tracking-[0.3em] uppercase text-gold-500">Paris Atelier</span>
      </div>
    </motion.div>
  )
}

export default function About() {
  const sectionRef = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      document.querySelectorAll('.stat-num').forEach(el => {
        const raw = el.dataset.value ?? ''
        if (!/^\d+$/.test(raw)) return
        const end = parseInt(raw, 10), proxy = { val:0 }
        gsap.to(proxy, { val:end, duration:2.2, ease:'power2.out',
          scrollTrigger:{ trigger:el, start:'top 85%', once:true },
          onUpdate() { el.textContent = Math.round(proxy.val) + (el.dataset.suffix??'') } })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-noir-950 py-24 md:py-32 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center mb-24 md:mb-32">
          <ParallaxImg />
          <div className="flex flex-col gap-6">
            {[
              <motion.p key="tag" variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{once:true}} className="font-montserrat text-[10px] tracking-[0.42em] uppercase text-gold-600">Our Story</motion.p>,
              <motion.h2 key="h" variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{once:true}} className="font-cormorant font-bold text-5xl md:text-6xl leading-none">Born from<br /><span className="italic text-gold-gradient">Darkness</span></motion.h2>,
              <motion.p key="p1" variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{once:true}} className="font-montserrat text-sm text-noir-400 leading-relaxed">NOIR was conceived in a Marais atelier in 2018, born from the belief that true luxury speaks in silence. We design for those who find beauty in absence — the space between folds, the weight of shadow, the precision of a perfectly hidden seam.</motion.p>,
              <motion.p key="p2" variants={fadeUp} custom={3} initial="hidden" whileInView="visible" viewport={{once:true}} className="font-montserrat text-sm text-noir-400 leading-relaxed">Each piece begins as a conversation between our head designer and a single bolt of the finest sourced fabric. From Tokyo's Nishijin silk weavers to Florence's master tailors — every NOIR garment carries the memory of two thousand hands.</motion.p>,
              <motion.div key="cta" variants={fadeUp} custom={4} initial="hidden" whileInView="visible" viewport={{once:true}} className="flex items-center gap-5 pt-2">
                <a href="/about" className="px-9 py-3.5 font-montserrat text-[10px] tracking-[0.24em] uppercase text-noir-950 bg-gold-600 hover:bg-gold-500 transition-colors duration-300 cursor-none">Our Manifesto</a>
                <span className="font-cormorant italic text-xl text-noir-600">— Est. 2018</span>
              </motion.div>,
            ]}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-noir-800/60">
          {STATS.map((s,i) => (
            <motion.div key={s.label} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{once:true,amount:0.3}}
              className="bg-noir-950 px-8 py-10 text-center group hover:bg-noir-900 transition-colors duration-500">
              <p className="stat-num font-cormorant text-5xl md:text-6xl font-light text-gold-gradient mb-2 tabular-nums"
                data-value={/^\d+$/.test(s.n)?s.n:undefined} data-suffix={s.suffix}>
                {s.n}{s.suffix}
              </p>
              <p className="font-montserrat text-[9px] tracking-[0.38em] uppercase text-noir-500 group-hover:text-noir-400 transition-colors duration-300">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
