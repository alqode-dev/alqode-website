import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { Portfolio } from "@/components/portfolio";
import { About } from "@/components/about";
import { Process } from "@/components/process";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { CursorGlow } from "@/components/cursor-glow";
import { TechMarquee } from "@/components/tech-marquee";

export default function Home() {
  return (
    <>
      <CursorGlow />
      <Nav />
      <main>
        <Hero />
        <div className="gradient-divider mx-5" />
        <TechMarquee />
        <div className="gradient-divider mx-5" />
        <Services />
        <div className="gradient-divider mx-5" />
        <Portfolio />
        <About />
        <Process />
        <div className="gradient-divider mx-5" />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
