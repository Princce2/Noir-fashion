import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'

const overlay = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
const drawer  = {
  hidden:  { x: '100%' },
  visible: { x: 0,     transition: { type: 'tween', duration: 0.45, ease: [0.76, 0, 0.24, 1] } },
  exit:    { x: '100%', transition: { type: 'tween', duration: 0.4, ease: [0.76, 0, 0.24, 1] } },
}

export default function CartDrawer() {
  const { items, open, closeCart, removeItem, updateQty, total, clearCart } = useCart()

  // Lock scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            variants={overlay} initial="hidden" animate="visible" exit="exit"
            className="fixed inset-0 z-[200] bg-noir-950/60 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer panel */}
          <motion.aside
            key="drawer"
            variants={drawer} initial="hidden" animate="visible" exit="exit"
            className="fixed top-0 right-0 bottom-0 z-[201] w-full max-w-sm bg-noir-900 border-l border-noir-800 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-noir-800">
              <div>
                <h2 className="font-cormorant text-2xl font-medium text-noir-50">Your Bag</h2>
                <p className="font-montserrat text-[9px] tracking-[0.3em] uppercase text-noir-500 mt-0.5">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </p>
              </div>
              <button
                onClick={closeCart}
                className="w-8 h-8 flex items-center justify-center text-noir-400 hover:text-gold-400 transition-colors duration-300 cursor-none"
                aria-label="Close cart"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <div className="w-12 h-12 border border-noir-700 rounded-full flex items-center justify-center mb-4">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-noir-600">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                    </svg>
                  </div>
                  <p className="font-cormorant italic text-xl text-noir-400 mb-2">Your bag is empty</p>
                  <p className="font-montserrat text-xs text-noir-600">Add pieces from the collection</p>
                  <button onClick={closeCart}
                    className="mt-6 px-6 py-2.5 font-montserrat text-[10px] tracking-[0.2em] uppercase text-noir-950 bg-gold-600 hover:bg-gold-500 transition-colors duration-300 cursor-none">
                    Explore Collection
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map(item => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                      className="flex gap-4 border-b border-noir-800 pb-5"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-20 h-24 flex-shrink-0 overflow-hidden bg-noir-800">
                        <img src={item.img} alt={item.title} className="w-full h-full object-cover object-top" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-montserrat text-[9px] tracking-[0.25em] uppercase text-noir-600 mb-0.5">{item.category}</p>
                        <h3 className="font-cormorant text-lg text-noir-50 leading-tight mb-1">{item.title}</h3>
                        <p className="font-cormorant text-base text-gold-500 mb-3">{item.price}</p>

                        {/* Qty controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-noir-700">
                            <button
                              onClick={() => item.qty <= 1 ? removeItem(item.id) : updateQty(item.id, item.qty - 1)}
                              className="w-7 h-7 flex items-center justify-center text-noir-400 hover:text-gold-400 transition-colors duration-200 cursor-none text-sm"
                            >−</button>
                            <span className="w-7 text-center font-montserrat text-xs text-noir-200">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.id, item.qty + 1)}
                              className="w-7 h-7 flex items-center justify-center text-noir-400 hover:text-gold-400 transition-colors duration-200 cursor-none text-sm"
                            >+</button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="font-montserrat text-[9px] tracking-[0.2em] uppercase text-noir-600 hover:text-red-400 transition-colors duration-200 cursor-none"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer — only show if items */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-noir-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-montserrat text-xs text-noir-400">Subtotal</span>
                  <span className="font-cormorant text-xl text-gold-400">€ {total.toLocaleString('de-DE', { minimumFractionDigits: 0 })}</span>
                </div>
                <p className="font-montserrat text-[9px] text-noir-600">Shipping and duties calculated at checkout</p>
                <button className="w-full py-4 font-montserrat text-[11px] tracking-[0.25em] uppercase text-noir-950 bg-gold-600 hover:bg-gold-500 transition-colors duration-300 cursor-none">
                  Proceed to Checkout
                </button>
                <button
                  onClick={clearCart}
                  className="w-full py-2 font-montserrat text-[10px] tracking-[0.2em] uppercase text-noir-600 hover:text-noir-300 transition-colors duration-300 cursor-none"
                >
                  Clear Bag
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
