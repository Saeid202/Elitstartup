"use client";

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Process } from "@/components/Process";
import { ProjectsShowcase } from "@/components/ProjectsShowcase";
import { CTAStrip } from "@/components/CTAStrip";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main style={{ minHeight: "100vh" }}>
        <Hero />
        <About />
        <Process />
        <ProjectsShowcase />
        <CTAStrip />
      </main>
      <Footer />
    </>
  );
}
