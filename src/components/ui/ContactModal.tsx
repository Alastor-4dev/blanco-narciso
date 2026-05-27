"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Mail, Phone, X } from "lucide-react";
import { useEffect } from "react";

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
  productName?: string;
};

export default function ContactModal({
  open,
  onClose,
  productName,
}: ContactModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
        >
          <button
            type="button"
            aria-label="Cerrar"
            className="absolute inset-0 bg-bn-navy/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-md rounded-sm bg-white p-8 shadow-xl"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1 text-bn-navy/60 transition hover:bg-bn-ice hover:text-bn-navy"
              aria-label="Cerrar diálogo"
            >
              <X size={18} />
            </button>

            <span className="gold-divider mb-5" aria-hidden="true" />
            <h3
              id="contact-modal-title"
              className="font-display text-2xl text-bn-navy"
            >
              {productName ? `Reservar: ${productName}` : "Hablemos en privado"}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-bn-navy/70">
              Para mantener cada pieza única y cuidada, gestionamos cada pedido
              de manera personal. Contáctanos y te respondemos en menos de 24
              horas con disponibilidad y entrega.
            </p>

            <div className="mt-6 space-y-3 text-sm">
              <a
                href="https://wa.me/523334019364"
                className="flex items-center gap-3 rounded-sm border border-bn-ice px-4 py-3 text-bn-navy transition hover:border-bn-gold hover:bg-bn-cloud"
              >
                <Phone size={16} className="text-bn-gold" />
                <span>+52 33 3401 9364 · WhatsApp</span>
              </a>
              <a
                href="mailto:hola@blanconarciso.mx"
                className="flex items-center gap-3 rounded-sm border border-bn-ice px-4 py-3 text-bn-navy transition hover:border-bn-gold hover:bg-bn-cloud"
              >
                <Mail size={16} className="text-bn-gold" />
                <span>hola@blanconarciso.mx</span>
              </a>
            </div>

            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-bn-navy/40">
              Atención de martes a sábado · 10:00 a 19:00
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
