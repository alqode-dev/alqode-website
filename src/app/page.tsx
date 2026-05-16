import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { ClientLogos } from "@/components/client-logos";
import { Portfolio } from "@/components/portfolio";
import { Testimonials } from "@/components/testimonials";
import { About } from "@/components/about";
import { Process } from "@/components/process";
import { Quickstart } from "@/components/quickstart";
import { Retainer } from "@/components/retainer";
import { Faq } from "@/components/faq";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { CursorGlow } from "@/components/cursor-glow";
import { WhatsappFab } from "@/components/whatsapp-fab";

export default function Home() {
  return (
    <>
      <CursorGlow />
      <Nav />
      <main>
        <Hero />
        <div className="gradient-divider mx-5" />
        <ClientLogos />
        <div className="gradient-divider mx-5" />
        <Portfolio />
        <div className="gradient-divider mx-5" />
        <Testimonials />
        <About />
        <Process />
        <div className="gradient-divider mx-5" />
        <Quickstart />
        <div className="gradient-divider mx-5" />
        <Retainer />
        <div className="gradient-divider mx-5" />
        <Faq />
        <div className="gradient-divider mx-5" />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
      <WhatsappFab />
    </>
  );
}
