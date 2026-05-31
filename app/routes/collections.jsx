import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CartProvider } from '../context/CartContext'
import { useCart }      from '../context/CartContext'
import CartDrawer       from '../components/CartDrawer'
import Navigation   from '../components/Navigation'
import CustomCursor from '../components/CustomCursor'
import Footer       from '../components/Footer'

const ALL = [
  { id:1, title:'Shadow Veil',   price:'€ 2,850', category:'Womenswear', season:'FW25', img:'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=700&h=930&dpr=1'  },
  { id:2, title:'Onyx Drape',    price:'€ 3,400', category:'Womenswear', season:'SS25', img:'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=700&h=930&dpr=1'  },
  { id:3, title:'Eclipse Coat',  price:'€ 4,200', category:'Outerwear',  season:'FW25', img:'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=700&h=930&dpr=1'  },
  { id:4, title:'Midnight Gown', price:'€ 6,500', category:'Couture',    season:'SS25', img:'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=700&h=930&dpr=1'  },
  { id:5, title:'Void Suit',     price:'€ 2,200', category:'Menswear',   season:'FW25', img:'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=700&h=930&dpr=1'  },
  { id:6, title:'Cipher Blouse', price:'€ 980',   category:'Womenswear', season:'SS25', img:'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=700&h=930&dpr=1'  },
  { id:7, title:'Abyss Trench',  price:'€ 3,900', category:'Outerwear',  season:'FW25', img:'https://images.pexels.com/photos/1148957/pexels-photo-1148957.jpeg?auto=compress&cs=tinysrgb&w=700&h=930&dpr=1'  },
  { id:8, title:'Vanta Dress',   price:'€ 5,100', category:'Couture',    season:'SS25', img:'https://images.pexels.com/photos/1549200/pexels-photo-1549200.jpeg?auto=compress&cs=tinysrgb&w=700&h=930&dpr=1'  },
]
const FILTERS = ['All','Womenswear','Menswear','Outerwear','Couture']

const cardV = {
  hidden:  { opacity:0, y:40, scale:0.96 },
  visible: i => ({ opacity:1, y:0, scale:1, transition:{ delay:i*0.06, duration:0.75, ease:[0.33,1,0.68,1] } }),
  exit:    { opacity:0, scale:0.94, transition:{ duration:0.25 } },
}

function CollectionsInner() {
  const [active, setActive] = useState('All')
  const [items, setItems]   = useState(ALL)
  const { addItem, openCart } = useCart()
  useEffect(() => { setItems(active==='All'?ALL:ALL.filter(p=>p.category===active)) }, [active])

  return (
    <>
      <CustomCursor />
      <CartDrawer />
      <Navigation />
      <main className="min-h-screen bg-noir-950 pt-28 pb-24 px-8 md:px-16">
        <motion.div className="max-w-7xl mx-auto mb-14" initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{duration:0.9,ease:[0.33,1,0.68,1]}}>
          <p className="font-montserrat text-[10px] tracking-[0.44em] uppercase text-gold-600 mb-3">Seasonal Edit</p>
          <h1 className="font-cormorant font-bold text-6xl md:text-8xl leading-none mb-10">Collections</h1>
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map(f => (
              <button key={f} onClick={()=>setActive(f)}
                className={`px-5 py-2.5 font-montserrat text-[10px] tracking-[0.22em] uppercase transition-all duration-300 cursor-none relative overflow-hidden ${active===f?'text-noir-950':'border border-noir-700 text-noir-500 hover:border-gold-600/40 hover:text-gold-500'}`}>
                {active===f && <motion.span layoutId="filter-bg" className="absolute inset-0 bg-gold-600" style={{zIndex:-1}} />}
                {f}
              </button>
            ))}
            <span className="ml-auto font-montserrat text-[10px] text-noir-600">{items.length} pieces</span>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          <AnimatePresence mode="popLayout">
            {items.map((p,i) => (
              <motion.article key={p.id} custom={i} variants={cardV} initial="hidden" animate="visible" exit="exit" layout className="group relative overflow-hidden cursor-none">
                <div className="relative aspect-[3/4] overflow-hidden bg-noir-900">
                  <img src={p.img} alt={p.title}
                    loading={i < 4 ? 'eager' : 'lazy'} decoding="async"
                    className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.06]"
                    style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir-950/75 via-transparent to-transparent opacity-80 group-hover:opacity-50 transition-opacity duration-500" />
                  <div className="absolute top-3 right-3"><span className="glass px-2 py-1 font-montserrat text-[8px] tracking-[0.22em] uppercase text-gold-400">{p.season}</span></div>
                  <button onClick={() => { addItem(p); openCart() }} className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] py-2.5 bg-gold-600 font-montserrat text-[9px] tracking-[0.22em] uppercase text-noir-950 cursor-none opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">Add to Bag</button>
                </div>
                <div className="pt-3 pb-2">
                  <p className="font-montserrat text-[9px] tracking-[0.26em] uppercase text-noir-600 mb-1">{p.category}</p>
                  <h3 className="font-cormorant text-xl text-noir-50">{p.title}</h3>
                  <p className="font-cormorant text-base text-gold-500 mt-0.5">{p.price}</p>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function Collections() {
  return <CartProvider><CollectionsInner /></CartProvider>
}
