"use client";

import Container from "@/components/container";

import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import Pitch from "@/components/landing/pitch";
import Plans from "@/components/landing/plans";
import Faq from "@/components/landing/faq";
import LandingFooter from "@/components/landing/footer";
import useMenu from "@/utils/hooks/use-menu";
import MenuMobile from "@/components/landing/menu-mobile";

export default function Home() {
  const menu = useMenu();
  return menu.isOpen ? (
    <MenuMobile />
  ) : (
    <main className="bg-[#fcfcfc]">
      <Container isLanding>
        <Navbar />
        <Hero />
        <Pitch />
        <Features />
        <Plans />
        <Faq />
        <LandingFooter />
      </Container>
    </main>
  );
}
