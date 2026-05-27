import Image from "@/components/ui/Img";

const groups = [
  {
    title: "Estudio",
    links: [
      { label: "Colección", href: "#coleccion" },
      { label: "Servicios", href: "#servicios" },
      { label: "Suscripción", href: "#servicios" },
      { label: "Historias", href: "#testimonios" },
    ],
  },
  {
    title: "Visítanos",
    links: [
      { label: "Vallarta Nte., Guadalajara", href: "#contacto" },
      { label: "Mar a Sáb · 10–19h", href: "#contacto" },
      { label: "Cita previa", href: "#contacto" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-bn-navy text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-10">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/img/logo.png"
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
              <span className="flex flex-col leading-none">
                <span className="font-display text-2xl tracking-wide">
                  Blanco <span className="italic">Narciso</span>
                </span>
                <span className="mt-1 text-[10px] uppercase tracking-[0.32em] text-bn-gold-soft">
                  Estudio Floral
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">
              Estudio floral fundado en 2014. Composiciones a mano, flores de
              temporada y mucha calma.
            </p>
          </div>

          {groups.map((g) => (
            <div key={g.title}>
              <h4 className="text-[11px] uppercase tracking-[0.28em] text-bn-gold-soft">
                {g.title}
              </h4>
              <ul className="mt-5 space-y-3 text-sm text-white/80">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="hover:text-white">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-[11px] uppercase tracking-[0.28em] text-bn-gold-soft">
              Contacto
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-white/80">
              <li>
                <a
                  href="mailto:hola@blanconarciso.mx"
                  className="hover:text-white"
                >
                  hola@blanconarciso.mx
                </a>
              </li>
              <li>
                <a href="tel:+523334019364" className="hover:text-white">
                  +52 33 3401 9364
                </a>
              </li>
              <li className="text-white/60">
                Av. Ignacio L. Vallarta 3300, Vallarta Nte.
                <br />
                44690 Guadalajara, Jalisco
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/15 pt-8 text-[11px] uppercase tracking-[0.24em] text-white/55 md:flex-row md:items-center md:justify-between">
          <span>© {year} Blanco Narciso · Todos los derechos reservados</span>
          <span>Diseñado con calma en Guadalajara, Jalisco</span>
        </div>
      </div>
    </footer>
  );
}
