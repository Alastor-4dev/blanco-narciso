// ─────────────────────────────────────────────
//  Shared domain types for Blanco Narciso site
// ─────────────────────────────────────────────

export interface Arrangement {
  name: string;
  tagline: string;
  description: string;
  price: string;
  src: string;
}

export interface Service {
  title: string;
  description: string;
  cta: string;
  icon: string; // lucide icon name
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}
