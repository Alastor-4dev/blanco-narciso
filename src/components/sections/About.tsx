"use client";

import Image from "@/components/ui/Img";
import Reveal from "@/components/ui/Reveal";

export default function About() {
  return (
    <section
      id="sobre-nosotros"
      className="relative overflow-hidden bg-bn-ice py-24 md:py-32"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:gap-20 md:px-10">
        <Reveal>
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/img/servicios01.png"
                alt="Florista trabajando arreglo a mano en el estudio"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-6 hidden h-44 w-44 border border-bn-gold/60 bg-white/80 backdrop-blur md:flex flex-col items-center justify-center text-center text-bn-navy">
              <span className="font-display text-5xl leading-none">12</span>
              <span className="mt-2 text-[10px] uppercase tracking-[0.28em]">
                Años de oficio botánico
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex h-full flex-col justify-center">
            <span className="text-xs uppercase tracking-[0.32em] text-bn-gold">
              <span className="gold-divider mr-3 align-middle" aria-hidden="true" />
              El estudio
            </span>
            <h2 className="font-display mt-5 text-4xl text-bn-navy md:text-5xl">
              Un estudio floral pequeño, dedicado a piezas duraderas.
            </h2>
            <div className="mt-7 space-y-5 text-[15px] leading-[1.85] text-bn-navy/75">
              <p>
                Blanco Narciso nació en 2014 en un pequeño estudio sobre
                avenida Vallarta. Empezamos componiendo ramos para amistades
                cercanas y pequeñas bodas íntimas, y con el tiempo construimos
                una red de productores locales que nos suministran flor recién
                cortada cada amanecer desde los Altos de Jalisco.
              </p>
              <p>
                Hoy seguimos firmes en la misma idea: trabajar con cantidades
                pequeñas, conocer cada flor que entra al taller y entregar
                piezas que cuenten algo. No producimos en serie; cada arreglo se
                compone a mano por una sola florista.
              </p>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-bn-navy/10 pt-8">
              {[
                { k: "Origen", v: "Productores locales de Jalisco" },
                { k: "Estudio", v: "Vallarta Nte. · Guadalajara" },
                { k: "Estación", v: "Composición rotando cada 14 días" },
                { k: "Empaque", v: "Materiales biodegradables · libre de plástico" },
              ].map((i) => (
                <div key={i.k}>
                  <dt className="text-[10px] uppercase tracking-[0.28em] text-bn-gold">
                    {i.k}
                  </dt>
                  <dd className="mt-2 text-sm text-bn-navy">{i.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
