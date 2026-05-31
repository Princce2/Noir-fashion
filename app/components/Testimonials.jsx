import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    quote:
      "NOIR redefines luxury through absence. Each piece is a meditation on form.",
    author: "Vogue Paris",
    role: "Editor's Choice 2024",
  },
  {
    quote:
      "The most compelling collection we've seen this decade. Darkness has never looked so refined.",
    author: "WWD",
    role: "Fashion Review",
  },
  {
    quote:
      "A masterclass in restraint. NOIR proves that true luxury whispers, never shouts.",
    author: "Harper's Bazaar",
    role: "Style Feature",
  },
  {
    quote:
      "Every garment tells a story of obsessive craftsmanship. This is fashion as art.",
    author: "The Business of Fashion",
    role: "Industry Spotlight",
  },
];

const PRESS_LOGOS = [
  "Vogue Paris",
  "WWD",
  "Harper's Bazaar",
  "The Business of Fashion",
];

const fadeUp = {
  hidden: { y: 50, opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.15,
      duration: 1,
      ease: [0.33, 1, 0.68, 1],
    },
  }),
};

export default function Testimonials() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonial-card",
        { y: 60, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.12,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: ".testimonial-grid", start: "top 75%" },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="testimonial-heading"
      className="bg-noir-950 py-24 md:py-32 px-8 md:px-16 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-noir-950 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-14 md:mb-20">
          <motion.p
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="font-montserrat text-[10px] tracking-[0.44em] uppercase text-gold-600 mb-4"
          >
            Press & Recognition
          </motion.p>
          <motion.h2
            id="testimonial-heading"
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="font-cormorant font-bold text-5xl md:text-7xl leading-none"
          >
            What They <span className="italic text-gold-gradient">Say</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-2xl mx-auto mt-6 text-sm md:text-base text-noir-400"
          >
            A curated selection of editorial praise for NOIR — a quiet
            collection that speaks through shape, material and craft.
          </motion.p>
        </div>

        <div className="testimonial-grid grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <motion.article
            variants={fadeUp}
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="testimonial-card group relative bg-noir-900/40 backdrop-blur-sm border border-noir-800 p-10 md:p-12 hover:border-gold-600/30 transition-all duration-500 opacity-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="text-right text-gold-600/20 text-8xl font-cormorant leading-none">
                “
              </div>
              <div>
                <p className="font-cormorant text-3xl md:text-4xl text-noir-100 leading-tight tracking-tight mb-8 italic">
                  {TESTIMONIALS[0].quote}
                </p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="w-16 h-px bg-gold-600" />
                <div className="text-right">
                  <p className="font-montserrat text-[11px] tracking-[0.2em] uppercase text-gold-500 mb-1">
                    {TESTIMONIALS[0].author}
                  </p>
                  <p className="font-montserrat text-[9px] tracking-[0.15em] uppercase text-noir-600">
                    {TESTIMONIALS[0].role}
                  </p>
                </div>
              </div>
            </div>
          </motion.article>

          <div className="grid gap-6">
            {TESTIMONIALS.slice(1).map((item, i) => (
              <motion.article
                key={item.author}
                variants={fadeUp}
                custom={4 + i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="testimonial-card group relative bg-noir-900/35 backdrop-blur-sm border border-noir-800 p-8 hover:border-gold-600/30 transition-all duration-500 opacity-0"
              >
                <div className="absolute top-6 right-6 text-gold-600/20 text-5xl font-cormorant leading-none">
                  “
                </div>
                <div className="relative z-10">
                  <p className="font-cormorant text-lg md:text-xl text-noir-200 leading-relaxed mb-6 italic">
                    {item.quote}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-px bg-gold-600" />
                    <div>
                      <p className="font-montserrat text-[11px] tracking-[0.2em] uppercase text-gold-500 mb-1">
                        {item.author}
                      </p>
                      <p className="font-montserrat text-[9px] tracking-[0.15em] uppercase text-noir-600">
                        {item.role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        <motion.div
          variants={fadeUp}
          custom={7}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] uppercase tracking-[0.25em] text-noir-500 mb-8">
            {PRESS_LOGOS.map((logo, index) => (
              <span
                key={index}
                className="px-3 py-2 rounded-full border border-noir-800 bg-noir-950/70 text-noir-300"
              >
                {logo}
              </span>
            ))}
          </div>

          <div className="text-center">
            <p className="font-montserrat text-sm text-noir-500 mb-6">
              Featured in over 40 international publications.
            </p>
            <a
              href="/about"
              className="inline-flex items-center gap-3 font-montserrat text-[10px] tracking-[0.25em] uppercase text-gold-600 hover:text-gold-400 transition-colors duration-300 group cursor-none"
            >
              Read our story
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
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
