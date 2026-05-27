// ─────────────────────────────────────────────
//  Brand & contact configuration
//  Single source of truth — update here only.
// ─────────────────────────────────────────────

export const SITE = {
  name: "Blanco Narciso",
  tagline: "Estudio Floral",
  description:
    "Estudio floral en Av. Vallarta, Guadalajara. Arreglos artesanales, bodas y suscripciones premium hechas a mano con flor de temporada.",
  url: "https://blanconarciso.mx",
} as const;

export const CONTACT = {
  address: {
    street: "Av. Ignacio L. Vallarta 3300",
    neighborhood: "Vallarta Nte.",
    zip: "44690",
    city: "Guadalajara",
    state: "Jalisco",
    mapsUrl:
      "https://maps.google.com/?q=Av.+Ignacio+L+Vallarta+3300,+Vallarta+Nte.,+44690+Guadalajara,+Jal.",
  },
  phone: {
    display: "+52 33 3401 9364",
    tel: "+523334019364",
    whatsapp: "https://wa.me/523334019364",
  },
  email: "hola@blanconarciso.mx",
  hours: "Mar a Sáb · 10:00 – 19:00",
} as const;

export const SOCIAL = {
  instagram: "https://www.instagram.com/blanconarcisomx/?hl=es",
} as const;
