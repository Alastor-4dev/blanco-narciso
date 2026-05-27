import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blanco Narciso — Estudio Floral · Guadalajara",
  description:
    "Estudio floral en Av. Vallarta, Guadalajara. Arreglos artesanales, bodas y suscripciones premium hechas a mano con flor de temporada.",
  robots: { index: true, follow: true },
  referrer: "strict-origin-when-cross-origin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <head>
        {/* Security meta tags */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta
          httpEquiv="Referrer-Policy"
          content="strict-origin-when-cross-origin"
        />
        <meta
          httpEquiv="Permissions-Policy"
          content="camera=(), microphone=(), geolocation=(), payment=()"
        />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-bn-navy">
        {children}
      </body>
    </html>
  );
}
