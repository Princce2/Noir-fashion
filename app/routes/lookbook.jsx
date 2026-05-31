import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CartProvider } from "../context/CartContext";
import CartDrawer from "../components/CartDrawer";
import Navigation from "../components/Navigation";
import CustomCursor from "../components/CustomCursor";
import Footer from "../components/Footer";
import FashionVoid from "../images/Fashion-void.jpg";

const SPREADS = [
  {
    images: [
      "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=1",
      "https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=700&h=930&dpr=1",
    ],
    title: "The Obsidian Chapter",
    year: "2025",
    issue: "Vol. I",
    body: "An exploration of absence. Photographed at dawn in the 4th arrondissement, Paris.",
  },
  {
    images: [
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=700&h=930&dpr=1",
      FashionVoid,
    ],
    title: "Void & Volume",
    year: "2025",
    issue: "Vol. II",
    body: "Architectural silhouettes that dissolve at the edges. Each piece a study in how fabric remembers light.",
  },
  {
    images: [
      "https://images.pexels.com/photos/1148957/pexels-photo-1148957.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=1",
      "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=700&h=930&dpr=1",
    ],
    title: "Eclipse Editorial",
    year: "2025",
    issue: "Vol. III",
    body: "Winter light filtered through black lace. The collection moves between ceremony and dissolution.",
  },
];

const reveal = {
  hidden: { opacity: 0, scale: 1.05 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.4, ease: [0.76, 0, 0.24, 1] },
  },
};
const fadeUp = {
  hidden: { y: 35, opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.12, duration: 1, ease: [0.33, 1, 0.68, 1] },
  }),
};

function ParallaxImg({ src, alt }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  return (
    /* position:absolute + inset:0 so this fills whatever positioned parent wraps it
       without relying on height:100% which collapses if parent has no explicit height */
    <div
      ref={ref}
      style={{ position: "absolute", inset: 0, overflow: "hidden" }}
    >
      <motion.div
        style={{
          y,
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: "120%",
          height: "120%",
        }}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 15%",
            display: "block",
          }}
        />
      </motion.div>
    </div>
  );
}

function LookbookInner() {
  return (
    <>
      <CustomCursor />
      <Navigation />
      <main className="min-h-screen bg-noir-950 pt-28 pb-24">
        <div className="px-10 md:px-16 mb-20">
          <p className="font-montserrat text-[10px] tracking-[0.4em] uppercase text-gold-600 mb-3">
            Visual Narratives
          </p>
          <h1 className="font-cormorant font-bold text-6xl md:text-8xl leading-none">
            Lookbook
          </h1>
        </div>

        {SPREADS.map((s, i) => (
          <div key={i} className="mb-24 md:mb-32 px-4 md:px-10">
            <div className={`grid gap-3 md:gap-4 mb-10 grid-cols-3`}>
              <motion.div
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                className={`relative overflow-hidden ${i % 2 === 0 ? "col-span-2 aspect-[16/10]" : "col-span-1 aspect-[3/4]"}`}
              >
                <ParallaxImg src={s.images[0]} alt={s.title} />
              </motion.div>
              <motion.div
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                className={`relative overflow-hidden ${i % 2 === 0 ? "col-span-1 aspect-[3/4]" : "col-span-2 aspect-[16/10]"}`}
              >
                <ParallaxImg src={s.images[1]} alt={s.title} />
              </motion.div>
            </div>
            <div className="grid md:grid-cols-2 gap-8 px-2 md:px-4">
              <div>
                <motion.p
                  variants={fadeUp}
                  custom={0}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="font-montserrat text-[9px] tracking-[0.35em] uppercase text-gold-600 mb-3"
                >
                  {s.issue} — {s.year}
                </motion.p>
                <motion.h2
                  variants={fadeUp}
                  custom={1}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="font-cormorant text-4xl md:text-5xl font-medium text-noir-50 leading-tight"
                >
                  {s.title}
                </motion.h2>
              </div>
              <div className="flex flex-col justify-end">
                <motion.p
                  variants={fadeUp}
                  custom={2}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="font-montserrat text-sm text-noir-400 leading-relaxed"
                >
                  {s.body}
                </motion.p>
              </div>
            </div>
          </div>
        ))}
      </main>
      <Footer />
    </>
  );
}

export default function Lookbook() {
  return (
    <CartProvider>
      <CartDrawer />
      <LookbookInner />
    </CartProvider>
  );
}
