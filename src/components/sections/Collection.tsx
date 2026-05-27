"use client";

import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

type Arrangement = {
  name: string;
  tagline: string;
  description: string;
  price: string;
  src: string;
};

const arrangements: Arrangement[] = [
  {
    name: "Composición Boutique",
    tagline: "Edición de la casa",
    description:
      "Pieza compuesta a mano con flor de temporada en jarrón de cerámica. Selección que rota cada semana.",
    price: "$1,390 MXN",
    src: "/img/ramo01.png",
  },
  {
    name: "Brazada de Temporada",
    tagline: "Botón de estación",
    description:
      "Brazada generosa con flor recién cortada del campo, envuelta a mano en papel para regalo inmediato.",
    price: "$690 MXN",
    src: "/img/ramo02.png",
  },
  {
    name: "Composición Silvestre",
    tagline: "Estilo libre",
    description:
      "Arreglo con movimiento, mezcla de follaje y flor variada. Atado a mano con cinta de seda cruda.",
    price: "$1,090 MXN",
    src: "/img/ramo03.png",
  },
  {
    name: "Edición de Temporada",
    tagline: "Edición limitada",
    description:
      "Composición escultural en cantidad reducida. Diseñada para piezas de regalo o espacios especiales.",
    price: "$1,450 MXN",
    src: "/img/ramo04.png",
  },
  {
    name: "Ramos",
    tagline: "Regalo íntimo",
    description:
      "Ramillete envuelto en papel francés, ideal para enviar a domicilio o regalar a la mano.",
    price: "Desde $150 MXN",
    src: "/img/recomendaciones.png",
  },
  {
    name: "Personaliza tu ramo",
    tagline: "A tu medida",
    description:
      "Cuéntanos paleta de color, estilo y ocasión. Diseñamos tu arreglo con la flor más fresca del día.",
    price: "A cotizar",
    src: "/img/principal.png",
  },
];

type CollectionProps = {
  onReserve: (name: string) => void;
};

export default function Collection({ onReserve }: CollectionProps) {
  return (
    <section
      id="coleccion"
      className="relative bg-white py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <div className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-[0.32em] text-bn-gold">
                <span className="gold-divider mr-3 align-middle" aria-hidden="true" />
                La colección de la semana
              </span>
              <h2 className="font-display mt-5 text-4xl text-bn-navy md:text-5xl lg:text-6xl">
                Arreglos compuestos en cantidades pequeñas, para mesas que se notan.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-bn-navy/65">
              Cada pieza está disponible en cantidades limitadas y se entrega el
              mismo día dentro de la Zona Metropolitana de Guadalajara. Reserva
              con 24 horas de anticipación para piezas a medida.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {arrangements.map((a, i) => (
            <Reveal key={a.name} delay={(i % 3) * 0.08}>
              <article className="group flex h-full flex-col">
                <div className="relative aspect-[4/5] overflow-hidden bg-bn-ice">
                  <Image
                    src={a.src}
                    alt={`Arreglo floral ${a.name}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                  />
                  <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/85 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-bn-navy backdrop-blur">
                    {a.tagline}
                  </span>
                </div>

                <div className="mt-6 flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-2xl text-bn-navy">
                    {a.name}
                  </h3>
                  <span className="text-sm tracking-wide text-bn-gold">
                    {a.price}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-bn-navy/65">
                  {a.description}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-bn-ice pt-5">
                  <button
                    type="button"
                    onClick={() => onReserve(a.name)}
                    className="text-xs uppercase tracking-[0.24em] text-bn-navy transition hover:text-bn-gold"
                  >
                    Reservar →
                  </button>
                  <span className="text-[10px] uppercase tracking-[0.24em] text-bn-navy/40">
                    Hecho a mano
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
