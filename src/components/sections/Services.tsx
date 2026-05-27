"use client";

import { Calendar, Flower2, Gift, Repeat } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const services = [
  {
    icon: Flower2,
    title: "Bodas íntimas",
    desc: "Diseño floral completo: ramo de novia, boutonnières, centros de mesa y arco ceremonial.",
    cta: "Solicitar cotización",
  },
  {
    icon: Calendar,
    title: "Eventos privados",
    desc: "Composiciones para cenas corporativas, inauguraciones, cumpleaños y lanzamientos.",
    cta: "Hablemos de tu evento",
  },
  {
    icon: Repeat,
    title: "Suscripción semanal",
    desc: "Un arreglo nuevo cada semana, entregado en casa u oficina. Ideal para espacios de marca.",
    cta: "Pedir información",
  },
  {
    icon: Gift,
    title: "Regalos curados",
    desc: "Ramo, vino natural y tarjeta hecha a mano. Mensajería el mismo día dentro de ZMG.",
    cta: "Cotizar a la medida",
  },
];

export default function Services() {
  return (
    <section id="servicios" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <div className="mb-14 text-center">
            <span className="text-xs uppercase tracking-[0.32em] text-bn-gold">
              <span className="gold-divider mr-3 align-middle" aria-hidden="true" />
              Servicios
              <span className="gold-divider ml-3 align-middle" aria-hidden="true" />
            </span>
            <h2 className="font-display mx-auto mt-5 max-w-3xl text-4xl text-bn-navy md:text-5xl">
              Acompañamos rituales pequeños y celebraciones de gran escala con la misma atención.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-bn-navy/65">
              Cada servicio se cotiza a la medida según fecha, alcance y
              estética. Escríbenos para diseñar una propuesta personalizada.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-px overflow-hidden border border-bn-ice bg-bn-ice md:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={i * 0.06}>
                <article className="group flex h-full flex-col justify-between bg-white p-8 transition-colors hover:bg-bn-cloud md:p-10">
                  <div>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-bn-gold/40 text-bn-navy transition group-hover:border-bn-gold group-hover:bg-bn-gold/10">
                      <Icon size={22} strokeWidth={1.4} />
                    </div>
                    <h3 className="font-display mt-7 text-2xl text-bn-navy">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-bn-navy/70">
                      {s.desc}
                    </p>
                  </div>
                  <a
                    href="#contacto"
                    className="mt-8 inline-flex items-center justify-between gap-3 border-t border-bn-ice pt-5 text-[11px] uppercase tracking-[0.24em] text-bn-gold transition hover:text-bn-navy"
                  >
                    <span>{s.cta}</span>
                    <span aria-hidden="true">→</span>
                  </a>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
