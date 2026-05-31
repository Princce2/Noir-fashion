import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { CartProvider } from '../context/CartContext'
import CartDrawer       from '../components/CartDrawer'
import Navigation   from '../components/Navigation'
import CustomCursor from '../components/CustomCursor'
import Footer       from '../components/Footer'

const HeroScene = lazy(() => import('../components/three/HeroScene'))

/* All IDs confirmed working — same pool used in Collections which loads fine */
const TEAM = [
  {
    name: 'Élise Marchais',
    role: 'Creative Director',
    img:  'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&dpr=1',
  },
  {
    name: 'Kaito Yamashita',
    role: 'Head of Craft',
    img:  'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&dpr=1',
  },
  {
    name: 'Sofia Anagnos',
    role: 'Material Specialist',
    img:  'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&dpr=1',
  },
]
const VALUES = [
  { title:'Obsessive Craft', body:'Every stitch placed with intention. We reject speed in favour of permanence — pieces built to outlast trends by decades.' },
  { title:'Material Truth',  body:'We source only what the planet can sustain. Our silks trace back to named weavers; our dyes to plants, never synthetics.' },
  { title:'Fearless Design', body:'Beauty is most powerful when it unsettles. NOIR pieces do not comfort — they challenge, question, and ultimately liberate.' },
]

const fadeUp  = { hidden:{y:50,opacity:0}, visible: i => ({ y:0,opacity:1, transition:{delay:i*0.12,duration:1,ease:[0.33,1,0.68,1]} }) }
const revealC = { hidden:{opacity:0}, visible:{ opacity:1, transition:{duration:1.35,ease:[0.76,0,0.24,1]} } }

function AboutInner() {
  return (
    <>
      <CustomCursor />
      <CartDrawer />
      <Navigation />
      <main className="min-h-screen bg-noir-950">
        <section className="relative h-[70vh] flex items-end pb-20 overflow-hidden">
          <div className="absolute inset-0 canvas-wrapper canvas-vignette opacity-55">
            <Suspense fallback={null}><HeroScene /></Suspense>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-noir-950/25 to-transparent pointer-events-none" />
          <div className="relative z-10 px-10 md:px-16">
            <motion.p variants={fadeUp} custom={0} initial="hidden" animate="visible" className="font-montserrat text-[10px] tracking-[0.44em] uppercase text-gold-600 mb-4">Our Manifesto</motion.p>
            <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="visible" className="font-cormorant font-bold text-6xl md:text-8xl leading-none max-w-3xl">
              Darkness as<br /><span className="italic text-gold-gradient">Design Language</span>
            </motion.h1>
          </div>
        </section>

        <section className="px-10 md:px-16 py-24 max-w-4xl">
          <motion.p variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{once:true}} className="font-cormorant text-2xl md:text-3xl italic text-noir-200 leading-relaxed mb-10">
            &ldquo;We don&rsquo;t design clothing. We design how light behaves against skin. We design the sensation of moving through a room and leaving silence behind you.&rdquo;
          </motion.p>
          <motion.p variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{once:true}} className="font-montserrat text-sm text-noir-400 leading-relaxed mb-6">
            NOIR was born in 2018 in a 200 m² atelier on Rue de Bretagne. Our founder, Élise Marchais, had spent a decade at the highest levels of Parisian couture before deciding that the industry&rsquo;s relationship with speed was irreconcilable with the kind of work she believed in.
          </motion.p>
          <motion.p variants={fadeUp} custom={2} initial="hidden" whileInView="visible" viewport={{once:true}} className="font-montserrat text-sm text-noir-400 leading-relaxed">
            She closed her atelier to external visitors for the first three years. No press, no social media, no runway. Only making. The first NOIR collection reached the public in 2021 through a single invitation-only presentation. Seventy pieces. Sixty were sold before the day ended.
          </motion.p>
        </section>

        <section className="px-10 md:px-16 py-16 border-y border-noir-800">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-px bg-noir-800/50">
            {VALUES.map((v,i) => (
              <motion.div key={v.title} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{once:true,amount:0.3}}
                className="bg-noir-950 p-10 md:p-12 group hover:bg-noir-900 transition-colors duration-500">
                <motion.div className="w-8 h-px bg-gold-600 mb-8 group-hover:w-14 transition-all duration-500" />
                <h3 className="font-cormorant text-2xl font-medium text-noir-50 mb-4">{v.title}</h3>
                <p className="font-montserrat text-xs text-noir-500 leading-relaxed">{v.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="px-10 md:px-16 py-24">
          <div className="max-w-7xl mx-auto">
            <motion.p variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{once:true}} className="font-montserrat text-[10px] tracking-[0.44em] uppercase text-gold-600 mb-14">The Atelier</motion.p>
            <div className="grid md:grid-cols-3 gap-6">
              {TEAM.map((m,i) => (
                <motion.div key={m.name} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{once:true,amount:0.2}} className="group">
                  <motion.div variants={revealC} initial="hidden" whileInView="visible" viewport={{once:true,amount:0.1}}
                    style={{ position:'relative', aspectRatio:'3/4', minHeight:280, overflow:'hidden', marginBottom:20 }}>
                    <img
                      src={m.img} alt={m.name}
                      loading="lazy" decoding="async"
                      style={{
                        position:'absolute', inset:0,
                        width:'100%', height:'100%',
                        objectFit:'cover', objectPosition:'top',
                        display:'block',
                        filter:'grayscale(1)',
                        transform:'scale(1.05)',
                        transition:'filter 0.7s ease, transform 0.7s ease',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.filter='grayscale(0)'; e.currentTarget.style.transform='scale(1)' }}
                      onMouseLeave={e => { e.currentTarget.style.filter='grayscale(1)'; e.currentTarget.style.transform='scale(1.05)' }}
                    />
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(12,10,9,.5), transparent)' }} />
                  </motion.div>
                  <p className="font-montserrat text-[9px] tracking-[0.32em] uppercase text-gold-600 mb-1">{m.role}</p>
                  <h3 className="font-cormorant text-2xl text-noir-50">{m.name}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 md:px-10 pb-24">
          <motion.div variants={revealC} initial="hidden" whileInView="visible" viewport={{once:true,amount:0.15}} className="relative h-[50vh] md:h-[70vh] overflow-hidden">
            <img src="https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=1800&h=950&dpr=1" alt="NOIR Atelier Paris" loading="lazy" decoding="async"
              className="absolute inset-0"
              style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-noir-950/50 to-transparent" />
            <div className="absolute bottom-8 right-8"><span className="glass px-4 py-2 font-montserrat text-[9px] tracking-[0.32em] uppercase text-gold-500">Marais Atelier, Paris</span></div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function AboutPage() {
  return <CartProvider><AboutInner /></CartProvider>
}

export default AboutPage
