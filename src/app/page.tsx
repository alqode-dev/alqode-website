import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { ClientLogos } from "@/components/client-logos";
import { TechMarquee } from "@/components/tech-marquee";
import { TheBuild } from "@/components/the-build";
import { Work } from "@/components/work";
import { About } from "@/components/about";
import { System } from "@/components/system";
import { Quickstart } from "@/components/quickstart";
import { Talk } from "@/components/talk";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { CursorGlow } from "@/components/cursor-glow";
import { CursorFrame } from "@/components/cursor-frame";
import { WhatsappFab } from "@/components/whatsapp-fab";

export default function Home() {
  return (
    <>
      <CursorGlow />
      <CursorFrame />
      <Nav />
      <main>
        <Hero />
        <div className="gradient-divider mx-5" />
        <ClientLogos />
        <TechMarquee />
        <TheBuild />
        <Work />
        <About />
        <System />
        <div className="gradient-divider mx-5" />
        <Quickstart />
        <div className="gradient-divider mx-5" />
        <Talk />
      </main>
      <Footer />
      <ScrollToTop />
      <WhatsappFab />
    </>
  );
}
