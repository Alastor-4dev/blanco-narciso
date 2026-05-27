# Blanco Narciso — Estudio Floral

> Landing page estática para **Blanco Narciso**, estudio floral boutique ubicado en Av. Vallarta, Guadalajara, Jalisco.

[![CI](https://github.com/tu-usuario/blanco-narciso/actions/workflows/ci.yml/badge.svg)](https://github.com/tu-usuario/blanco-narciso/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Características

- **One-page** responsive — mobile-first, probado en 375 px, 768 px y 1280 px
- **Exportación estática** (`output: "export"`) — sin servidor Node, desplegable en Netlify, Vercel, Hostinger o GitHub Pages
- **Animaciones de entrada** con Framer Motion (respeta `prefers-reduced-motion`)
- **Security headers** configurados para Netlify, Vercel y Cloudflare Pages
- **Accesibilidad** WCAG AA: roles ARIA, contraste navy/blanco, navegación por teclado
- **Fuentes autoalojadas** vía `next/font` — sin peticiones externas en runtime
- Formulario de contacto con validación cliente (simulado, sin backend)

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript 5 — strict mode |
| Estilos | Tailwind CSS v4 |
| Animaciones | Framer Motion |
| Iconos | lucide-react |
| Fuentes | Cormorant Garamond + Inter (next/font/google) |
| Deploy | Static export → Netlify / Vercel |

---

## Estructura del proyecto

```
src/
├── app/
│   ├── globals.css          # Tema global: paleta, fuentes, utilidades
│   ├── layout.tsx           # Root layout + metadata SEO + security meta tags
│   └── page.tsx             # Ensamble de la one-page + estado del modal
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx       # Fija, transparente → blanca al scroll, drawer móvil
│   │   └── Footer.tsx       # Fondo navy, links, copyright
│   │
│   ├── sections/
│   │   ├── Hero.tsx         # Pantalla completa, imagen de fondo + overlay
│   │   ├── Collection.tsx   # Grid de 6 arreglos con hover zoom
│   │   ├── About.tsx        # Dos columnas: imagen + texto + datos clave
│   │   ├── Services.tsx     # 4 tarjetas con CTA a #contacto
│   │   ├── Testimonials.tsx # 3 reseñas reales sobre fondo navy
│   │   └── Contact.tsx      # Formulario + aside con foto del local
│   │
│   └── ui/
│       ├── Reveal.tsx       # Wrapper animación fade+slide al hacer scroll
│       └── ContactModal.tsx # Modal "Hablemos en privado" con WhatsApp + email
│
├── data/
│   ├── site.ts              # ← Fuente única: nombre, dirección, teléfono, redes
│   ├── arrangements.ts      # 6 productos de la colección
│   ├── services.ts          # 4 servicios
│   └── testimonials.ts      # 3 reseñas
│
└── types/
    └── index.ts             # Interfaces compartidas: Arrangement, Testimonial…

public/
└── img/                     # Imágenes optimizadas (logo, fotos del local, ramos)

.github/
└── workflows/
    └── ci.yml               # Type-check + build en cada push/PR

netlify.toml                 # Headers de seguridad + caché para Netlify
vercel.json                  # Headers de seguridad + caché para Vercel
public/_headers              # Headers para Cloudflare Pages y hosting compatible
```

---

## Comenzar en local

```bash
# 1. Clonar
git clone https://github.com/tu-usuario/blanco-narciso.git
cd blanco-narciso

# 2. Instalar dependencias (requiere Node 20+)
npm install

# 3. Levantar servidor de desarrollo
npm run dev
# → http://localhost:3000
```

### Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot reload |
| `npm run build` | Exportación estática a `out/` |
| `npm run start` | Preview del build de producción |
| `npm run lint` | Lint con ESLint |
| `npx tsc --noEmit` | Verificación de tipos sin compilar |

---

## Actualizar información del negocio

Todos los datos de contacto y marca viven en **un solo archivo**:

```
src/data/site.ts
```

Cambia ahí la dirección, teléfono, email u horario y haz rebuild — se propaga a toda la página automáticamente.

---

## Deploy

### Netlify (recomendado)

```bash
# Opción A — Drag & drop
npm run build
# Arrastra la carpeta out/ a https://app.netlify.com/drop

# Opción B — CLI
npm install -g netlify-cli
netlify deploy --prod --dir=out
```

### Vercel

```bash
npm install -g vercel
vercel --prod
```

### Hosting tradicional (cPanel / FTP)

Sube el **contenido** de `out/` a `public_html/`. No subas la carpeta `out/` envolvente.

> Los archivos `netlify.toml`, `vercel.json` y `public/_headers` configuran automáticamente los headers de seguridad HTTP en cada plataforma.

---

## Seguridad

Los siguientes headers se aplican en producción mediante los archivos de configuración incluidos:

| Header | Valor | Propósito |
|---|---|---|
| `X-Frame-Options` | `DENY` | Previene clickjacking |
| `X-Content-Type-Options` | `nosniff` | Previene MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limita filtración de referrer |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Deshabilita APIs de riesgo |
| `Content-Security-Policy` | `default-src 'self'; frame-ancestors 'none'; …` | Mitiga XSS e inyección |
| `Cache-Control` | `immutable` en `/_next/static/*` | Assets fingerprinted, caché máxima |

---

## Licencia

[MIT](LICENSE) © 2026 Blanco Narciso
