"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Collection from "@/components/sections/Collection";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";
import ContactModal from "@/components/ui/ContactModal";

export default function Home() {
  const [modal, setModal] = useState<{ open: boolean; name?: string }>({
    open: false,
  });

  const openModal = (name?: string) => setModal({ open: true, name });
  const closeModal = () => setModal({ open: false });

  return (
    <>
      <Navbar onReserve={() => openModal()} />
      <main className="flex-1">
        <Hero onReserve={() => openModal()} />
        <Collection onReserve={(name) => openModal(name)} />
        <About />
        <Services />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <ContactModal
        open={modal.open}
        onClose={closeModal}
        productName={modal.name}
      />
    </>
  );
}
