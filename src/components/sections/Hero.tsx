"use client";

import Image from "@/components/ui/Img";
import { motion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";

type HeroProps = {
  onReserve: () => void;
};

export default function Hero({ onReserve }: HeroProps) {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <Image
          src="/img/principal.png"
          alt="Hortensias rosadas y blancas en composición boutique"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bn-navy/55 via-bn-navy/35 to-bn-navy/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_55%)]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 pt-32 pb-20 md:px-10 md:pt-40 md:pb-28">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.32em] text-white/80"
        >
          <span className="gold-divider" aria-hidden="true" />
          Estudio Floral · Guadalajara, Jal.
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="font-display mt-7 max-w-3xl text-5xl leading-[1.05] text-white sm:text-6xl md:text-7xl lg:text-[88px]"
        >
          Flores que sostienen <em className="not-italic text-bn-gold-soft">silencios</em> y celebran momentos.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 max-w-xl text-base leading-relaxed text-white/85 md:text-lg"
        >
          Diseño botánico hecho a mano. Cada arreglo en Blanco Narciso es una
          pieza única, compuesta con flores de temporada y entregada en un
          empaque sustentable, libre de plástico.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <button
            type="button"
            onClick={onReserve}
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-white px-7 py-4 text-xs uppercase tracking-[0.24em] text-bn-navy transition hover:bg-bn-gold hover:text-white"
          >
            Reservar un arreglo
            <ArrowDownRight size={16} />
          </button>
          <a
            href="#coleccion"
            className="inline-flex items-center justify-center rounded-sm border border-white/60 px-7 py-4 text-xs uppercase tracking-[0.24em] text-white transition hover:bg-white hover:text-bn-navy"
          >
            Ver colección
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-20 grid max-w-2xl grid-cols-3 gap-8 border-t border-white/15 pt-8 text-white/85 md:mt-28"
        >
          {[
            { k: "12", v: "Años de oficio" },
            { k: "300+", v: "Bodas y eventos" },
            { k: "48 h", v: "Entrega GDL & ZMG" },
          ].map((s) => (
            <div key={s.v}>
              <div className="font-display text-3xl text-bn-gold-soft md:text-4xl">
                {s.k}
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.22em]">
                {s.v}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-white/60">
        Scroll
      </div>
    </section>
  );
}
