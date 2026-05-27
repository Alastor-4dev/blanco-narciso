"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "#coleccion", label: "Colección" },
  { href: "#sobre-nosotros", label: "Estudio" },
  { href: "#servicios", label: "Servicios" },
  { href: "#testimonios", label: "Historias" },
  { href: "#contacto", label: "Contacto" },
];

type NavbarProps = {
  onReserve: () => void;
};

export default function Navbar({ onReserve }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const shellClass = scrolled
    ? "bg-white/95 backdrop-blur border-b border-bn-ice shadow-[0_1px_0_rgba(26,43,74,0.04)]"
    : "bg-transparent border-b border-transparent";

  const linkColor = scrolled ? "text-bn-navy" : "text-white";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${shellClass}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10 md:py-5">
        <Link
          href="#top"
          className="flex items-center gap-3"
          aria-label="Blanco Narciso, inicio"
        >
          <span className="relative inline-flex h-11 w-11 items-center justify-center">
            <Image
              src="/img/logo.png"
              alt=""
              width={48}
              height={48}
              className="h-11 w-11 object-contain"
              priority
            />
          </span>
          <span className="flex flex-col leading-none">
            <span
              className={`font-display text-xl tracking-wide ${linkColor} md:text-2xl`}
            >
              Blanco <span className="italic">Narciso</span>
            </span>
            <span
              className={`mt-1 text-[9px] uppercase tracking-[0.32em] ${
                scrolled ? "text-bn-gold" : "text-bn-gold-soft"
              }`}
            >
              Estudio Floral
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-9 md:flex"
          aria-label="Navegación principal"
        >
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-[13px] uppercase tracking-[0.2em] transition-opacity hover:opacity-60 ${linkColor}`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <button
            type="button"
            onClick={onReserve}
            className={`rounded-sm px-5 py-2.5 text-xs uppercase tracking-[0.22em] transition ${
              scrolled
                ? "bg-bn-navy text-white hover:bg-bn-navy-soft"
                : "border border-white/60 text-white hover:bg-white hover:text-bn-navy"
            }`}
          >
            Reservar
          </button>
        </div>

        <button
          type="button"
          className={`md:hidden ${linkColor}`}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden border-t border-bn-ice/60 bg-white transition-[max-height,opacity] duration-300 ease-out ${
          open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav
          className="flex flex-col px-6 py-4"
          aria-label="Navegación móvil"
        >
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="border-b border-bn-ice/60 py-3 text-sm uppercase tracking-[0.2em] text-bn-navy last:border-b-0"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onReserve();
            }}
            className="mt-4 rounded-sm bg-bn-navy py-3 text-xs uppercase tracking-[0.22em] text-white"
          >
            Reservar
          </button>
        </nav>
      </div>
    </header>
  );
}
