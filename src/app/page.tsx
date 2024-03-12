"use client";

import Container from "@/components/container";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";

export default function Home() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <main className="bg-[#fcfcfc]">
      <Container isLanding>
        <Navbar />
        <Hero />
        <Features />
      </Container>
    </main>
  );
}
