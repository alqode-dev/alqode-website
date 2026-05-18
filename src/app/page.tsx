import dynamic from "next/dynamic";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { ClientLogos } from "@/components/client-logos";
import { TechMarquee } from "@/components/tech-marquee";
import { Work } from "@/components/work";

// Code-split TheBuild — it pulls in GSAP + ScrollTrigger (~40KB).
// SSR stays on so the section markup is in initial HTML for SEO; only the JS is deferred.
const TheBuild = dynamic(
  () => import("@/components/the-build").then((m) => ({ default: m.TheBuild })),
  {
    loading: () => (
      <section className="min-h-[88vh] lg:min-h-screen" aria-hidden="true" />
    ),
  }
);
import { About } from "@/components/about";
import { System } from "@/components/system";
import { Quickstart } from "@/components/quickstart";
import { Talk } from "@/components/talk";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { CursorGlow } from "@/components/cursor-glow";
import { CursorFrame } from "@/components/cursor-frame";
import { ScrollProgress } from "@/components/scroll-progress";
import { WhatsappFab } from "@/components/whatsapp-fab";

export default function Home() {
  return (
    <>
      <ScrollProgress />
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
