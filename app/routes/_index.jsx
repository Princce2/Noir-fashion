import { useState, lazy, Suspense } from 'react'
import { CartProvider }  from '../context/CartContext'
import CartDrawer        from '../components/CartDrawer'
import CustomCursor      from '../components/CustomCursor'
import Navigation    from '../components/Navigation'
import Hero          from '../components/Hero'
import Marquee       from '../components/Marquee'
import Collections   from '../components/Collections'
import Lookbook      from '../components/Lookbook'
import FabricViewer  from '../components/FabricViewer'
import Testimonials  from '../components/Testimonials'
import About         from '../components/About'
import Footer        from '../components/Footer'

const Loader       = lazy(() => import('../components/Loader'))
const SmoothScroll = lazy(() => import('../components/SmoothScroll'))
const ScrollMorph  = lazy(() => import('../components/ScrollMorph'))

export default function Index() {
  const [loaded, setLoaded] = useState(false)

  return (
    <CartProvider>
      <CustomCursor />
      <CartDrawer />

      <Suspense fallback={null}>
        {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      </Suspense>

      <Suspense fallback={null}>
        <SmoothScroll>
          <Navigation />
          <main>
            <Hero />
            <Marquee />
            <Collections />
            <Suspense fallback={<div className="h-[400vh] bg-noir-950" />}>
              <ScrollMorph />
            </Suspense>
            <Lookbook />
            <FabricViewer />
            <Testimonials />
            <About />
          </main>
          <Footer />
        </SmoothScroll>
      </Suspense>
    </CartProvider>
  )
}
