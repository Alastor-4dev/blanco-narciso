"use client";

import Image from "@/components/ui/Img";
import { Instagram, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import Reveal from "@/components/ui/Reveal";

type Errors = { name?: string; email?: string; message?: string };

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (data: typeof form): Errors => {
    const e: Errors = {};
    if (data.name.trim().length < 2) e.name = "Indícanos tu nombre.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      e.email = "Necesitamos un correo válido.";
    if (data.message.trim().length < 10)
      e.message = "Cuéntanos un poco más (mínimo 10 caracteres).";
    return e;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length === 0) {
      setSubmitted(true);
    }
  };

  return (
    <section id="contacto" className="bg-white py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 md:grid-cols-[1.1fr_0.9fr] md:gap-20 md:px-10">
        <Reveal>
          <div>
            <span className="text-xs uppercase tracking-[0.32em] text-bn-gold">
              <span className="gold-divider mr-3 align-middle" aria-hidden="true" />
              Contacto
            </span>
            <h2 className="font-display mt-5 text-4xl text-bn-navy md:text-5xl">
              Escríbenos y diseñamos algo juntos.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-bn-navy/70">
              Para reservas, bodas y suscripciones, cuéntanos un poco del
              ocasión y te respondemos en menos de 24 horas con propuestas y
              referencias.
            </p>

            {submitted ? (
              <div className="mt-10 rounded-sm border border-bn-gold/40 bg-bn-cloud p-8">
                <div className="font-display text-2xl text-bn-navy">
                  Gracias por escribirnos, {form.name.split(" ")[0]}.
                </div>
                <p className="mt-3 text-sm leading-relaxed text-bn-navy/70">
                  Hemos recibido tu mensaje. Una de nuestras floristas te
                  responderá personalmente al correo {form.email} en las
                  próximas horas hábiles.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", message: "" });
                  }}
                  className="mt-6 text-xs uppercase tracking-[0.24em] text-bn-gold hover:text-bn-navy"
                >
                  Enviar otro mensaje →
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="mt-10 space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-[11px] uppercase tracking-[0.24em] text-bn-navy/60"
                  >
                    Nombre
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="mt-2 w-full border-0 border-b border-bn-navy/20 bg-transparent py-3 text-base text-bn-navy outline-none transition focus:border-bn-gold"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-2 text-xs text-red-600">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-[11px] uppercase tracking-[0.24em] text-bn-navy/60"
                  >
                    Correo
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className="mt-2 w-full border-0 border-b border-bn-navy/20 bg-transparent py-3 text-base text-bn-navy outline-none transition focus:border-bn-gold"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-2 text-xs text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-[11px] uppercase tracking-[0.24em] text-bn-navy/60"
                  >
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    className="mt-2 w-full resize-none border-0 border-b border-bn-navy/20 bg-transparent py-3 text-base text-bn-navy outline-none transition focus:border-bn-gold"
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={
                      errors.message ? "message-error" : undefined
                    }
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-2 text-xs text-red-600">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-sm bg-bn-navy px-7 py-4 text-xs uppercase tracking-[0.24em] text-white transition hover:bg-bn-navy-soft"
                >
                  Enviar mensaje
                  <Send size={14} />
                </button>
              </form>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <aside className="flex h-full flex-col overflow-hidden border border-bn-ice bg-bn-cloud">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src="/img/local.png"
                alt="Fachada de Blanco Narciso · Estudio Floral en Av. Vallarta"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute left-0 top-0 m-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-bn-navy backdrop-blur">
                Estudio Floral
              </div>
            </div>

            <div className="flex flex-1 flex-col p-8 md:p-10">
              <span className="text-xs uppercase tracking-[0.28em] text-bn-gold">
                Visítanos
              </span>
              <h3 className="font-display mt-3 text-3xl text-bn-navy">
                Estudio Floral Vallarta
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-bn-navy/70">
                Recibimos solo con cita previa. Reserva una sesión de
                consultoría floral para bodas y eventos.
              </p>

              <ul className="mt-8 space-y-5 text-sm text-bn-navy">
                <li className="flex items-start gap-3">
                  <MapPin
                    size={16}
                    className="mt-1 shrink-0 text-bn-gold"
                    strokeWidth={1.6}
                  />
                  <a
                    href="https://maps.google.com/?q=Av.+Ignacio+L+Vallarta+3300,+Vallarta+Nte.,+44690+Guadalajara,+Jal."
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-bn-gold"
                  >
                    Av. Ignacio L. Vallarta 3300
                    <br />
                    Vallarta Nte., 44690 Guadalajara, Jal.
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Phone
                    size={16}
                    className="mt-1 shrink-0 text-bn-gold"
                    strokeWidth={1.6}
                  />
                  <a href="tel:+523334019364" className="hover:text-bn-gold">
                    +52 33 3401 9364
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Mail
                    size={16}
                    className="mt-1 shrink-0 text-bn-gold"
                    strokeWidth={1.6}
                  />
                  <a
                    href="mailto:hola@blanconarciso.mx"
                    className="hover:text-bn-gold"
                  >
                    hola@blanconarciso.mx
                  </a>
                </li>
              </ul>

              <div className="mt-10 border-t border-bn-navy/10 pt-6">
                <p className="text-[10px] uppercase tracking-[0.28em] text-bn-navy/50">
                  Horario · Mar a Sáb · 10:00 – 19:00
                </p>
                <div className="mt-5 flex gap-3">
                  <a
                    href="https://www.instagram.com/blanconarcisomx/?hl=es"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram de Blanco Narciso"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-bn-navy/15 text-bn-navy transition hover:border-bn-gold hover:text-bn-gold"
                  >
                    <Instagram size={16} strokeWidth={1.5} />
                  </a>
                  <a
                    href="https://wa.me/523334019364"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-bn-navy/15 text-bn-navy transition hover:border-bn-gold hover:text-bn-gold"
                  >
                    <Phone size={16} strokeWidth={1.5} />
                  </a>
                  <a
                    href="mailto:hola@blanconarciso.mx"
                    aria-label="Enviar correo"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-bn-navy/15 text-bn-navy transition hover:border-bn-gold hover:text-bn-gold"
                  >
                    <Mail size={16} strokeWidth={1.5} />
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
