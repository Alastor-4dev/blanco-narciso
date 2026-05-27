"use client";

import { Star } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const testimonials = [
  {
    quote:
      "Excelente florería. Los arreglos son espectaculares: flores fresquísimas, combinaciones de colores muy bien pensadas y un diseño moderno y elegante que se nota hecho con muchísimo cuidado. Cada arreglo se siente único y de altísima calidad.",
    name: "Mariana Gómez",
    role: "Cliente recurrente",
  },
  {
    quote:
      "Excelente atención, se ve que dominan su negocio al 100%. Me asesoraron en un arreglo floral y estuvo muy bien; además las flores duraron bastantes días, lo que deja ver que usan flor fresca. Súper recomendado, calidad-precio inmejorable.",
    name: "Juan Carlos",
    role: "Arreglo personalizado",
  },
  {
    quote:
      "Hice un pedido a ciegas porque vivo en otro estado. No solo tienen una excelente atención al cliente, también hacen cosas maravillosas. Me daban actualizaciones de mi pedido y este fue el resultado. Son mi florería de confianza en Guadalajara ❤️",
    name: "Ana Lorely Treviño",
    role: "Envío fuera del estado",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonios"
      className="relative bg-bn-navy py-24 text-white md:py-32"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(201,169,106,0.12),transparent_60%)]" />
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <div className="mb-16 max-w-2xl">
            <span className="text-xs uppercase tracking-[0.32em] text-bn-gold-soft">
              <span className="gold-divider mr-3 align-middle" aria-hidden="true" />
              Quienes nos eligen
            </span>
            <h2 className="font-display mt-5 text-4xl md:text-5xl">
              Historias contadas con flores.
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3 md:gap-10">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <figure className="flex h-full flex-col border-t border-white/15 pt-8">
                <div
                  className="flex gap-1 text-bn-gold-soft"
                  aria-label="5 estrellas"
                >
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      size={14}
                      strokeWidth={1.4}
                      className="fill-bn-gold-soft text-bn-gold-soft"
                    />
                  ))}
                </div>
                <blockquote className="font-display mt-6 text-2xl leading-snug text-white/90 md:text-[26px]">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-auto pt-8 text-sm">
                  <div className="text-white">{t.name}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.24em] text-white/55">
                    {t.role}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
