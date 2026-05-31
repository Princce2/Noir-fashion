import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FashionVoid from "../images/Fashion-void.jpg";

/*
  All images use loading="eager" — these are inside Framer Motion clipPath
  reveal animations, and browsers skip lazy-loading clipped/invisible elements.

  All image containers use position:absolute + inset:0 instead of height:100%
  because height:100% doesn't resolve against flex parents with only min-height.
*/

const PANELS = [
  {
    id: 1,
    layout: "left",
    title: "The Obsidian Chapter",
    body: "Draped in silence, the collection speaks through shadow. Each silhouette a study in restraint — darkness refined into form.",
    tag: "Vol. I",
    img: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&dpr=1",
  },
  {
    id: 2,
    layout: "right",
    title: "Void & Volume",
    body: "Architectural cuts dissolve into fluid movement. A conversation between structure and surrender, night and near-nothing.",
    tag: "Vol. II",
    img: FashionVoid,
  },
  {
    id: 3,
    layout: "full",
    title: "Eclipse Editorial",
    body: "Shot in the shadow of the Marais, winter light filtered through black lace. The garment becomes the architecture.",
    tag: "Vol. III",
    img: "https://images.pexels.com/photos/1148957/pexels-photo-1148957.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=1",
  },
  {
    id: 4,
    layout: "left",
    title: "After Dark",
    body: "The final chapter. Velvet against skin, gold against black. An ending that was always a beginning.",
    tag: "Vol. IV",
    img: "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&dpr=1",
  },
];

const reveal = {
  hidden: { opacity: 0, scale: 1.06 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.4, ease: [0.76, 0, 0.24, 1] },
  },
};
const fadeUp = {
  hidden: { y: 44, opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.1, duration: 1, ease: [0.33, 1, 0.68, 1] },
  }),
};

/* ── ParallaxImg ─────────────────────────────────────────────────────────────
   Uses position:absolute + inset:0 so the img never depends on parent's
   computed height being non-zero.  The parallax motion.div overflows slightly
   to give room for the -8% / +8% y movement.
*/
function ParallaxImg({ src, alt }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    /* This div fills whatever positioned ancestor wraps it */
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

export default function Lookbook() {
  return (
    <section className="bg-noir-950 py-24 md:py-32">
      {/* ── Heading ─────────────────────────────────────────────────────── */}
      <div className="px-10 md:px-16 mb-20">
        <motion.p
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="font-montserrat text-[10px] tracking-[0.4em] uppercase text-gold-600 mb-4"
        >
          Lookbook 2025
        </motion.p>
        <motion.h2
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="font-cormorant font-bold text-5xl md:text-7xl leading-none"
        >
          The Visual <span className="italic text-gold-gradient">Archive</span>
        </motion.h2>
      </div>

      {/* ── Panels ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 md:gap-5">
        {PANELS.map((panel) => {
          /* Full-width panel */
          if (panel.layout === "full")
            return (
              <div
                key={panel.id}
                style={{
                  position: "relative",
                  height: "clamp(360px, 70vh, 700px)",
                  margin: "0 1rem",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  style={{ position: "absolute", inset: 0 }}
                  variants={reveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                >
                  <ParallaxImg src={panel.img} alt={panel.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir-950/85 via-transparent to-noir-950/30" />
                </motion.div>

                <div
                  className="absolute bottom-10 left-10 right-10"
                  style={{ zIndex: 10 }}
                >
                  <motion.span
                    variants={fadeUp}
                    custom={0}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="font-montserrat text-[9px] tracking-[0.4em] uppercase text-gold-500 block mb-3"
                  >
                    {panel.tag}
                  </motion.span>
                  <motion.h3
                    variants={fadeUp}
                    custom={1}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="font-cormorant text-4xl md:text-6xl font-medium text-noir-50 max-w-xl mb-4"
                  >
                    {panel.title}
                  </motion.h3>
                  <motion.p
                    variants={fadeUp}
                    custom={2}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="font-montserrat text-sm text-noir-300 max-w-md leading-relaxed"
                  >
                    {panel.body}
                  </motion.p>
                </div>
              </div>
            );

          /* Left / right split panel */
          const isLeft = panel.layout === "left";
          return (
            <div
              key={panel.id}
              className={`flex flex-col gap-4 md:gap-5 mx-4 md:mx-10 ${!isLeft ? "md:flex-row-reverse" : "md:flex-row"}`}
            >
              {/* ── Image side — explicit height so ParallaxImg absolute-fill works ── */}
              <motion.div
                className="relative overflow-hidden"
                style={{
                  /* flex-[3] equivalent without relying on flex share */
                  flexGrow: 3,
                  flexShrink: 1,
                  flexBasis: 0,
                  /* Explicit height — NOT min-height — so height:100% children resolve */
                  height: "clamp(280px, 56vw, 520px)",
                }}
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                <ParallaxImg src={panel.img} alt={panel.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-noir-950/40 to-transparent" />
              </motion.div>

              {/* ── Text side ────────────────────────────────────────────────── */}
              <div
                className={`flex flex-col justify-end pb-10 ${isLeft ? "md:pl-8" : "md:pr-8"}`}
                style={{ flexGrow: 2, flexShrink: 1, flexBasis: 0 }}
              >
                <motion.span
                  variants={fadeUp}
                  custom={0}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0 }}
                  className="font-montserrat text-[9px] tracking-[0.38em] uppercase text-gold-600 mb-4 block"
                >
                  {panel.tag}
                </motion.span>
                <motion.h3
                  variants={fadeUp}
                  custom={1}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0 }}
                  className="font-cormorant text-4xl md:text-5xl font-medium text-noir-50 leading-tight mb-5"
                >
                  {panel.title}
                </motion.h3>
                <motion.p
                  variants={fadeUp}
                  custom={2}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0 }}
                  className="font-montserrat text-sm text-noir-400 leading-relaxed max-w-sm"
                >
                  {panel.body}
                </motion.p>
                <motion.a
                  variants={fadeUp}
                  custom={3}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0 }}
                  href="/lookbook"
                  className="mt-8 inline-flex items-center gap-3 font-montserrat text-[10px] tracking-[0.25em] uppercase text-gold-600 hover:text-gold-400 transition-colors duration-300 group cursor-none w-fit"
                >
                  View Chapter
                  <svg
                    width="18"
                    height="8"
                    viewBox="0 0 18 8"
                    fill="none"
                    className="group-hover:translate-x-1.5 transition-transform duration-300"
                  >
                    <path
                      d="M0 4h16M12 1l4 3-4 3"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </motion.a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
