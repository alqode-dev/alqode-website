import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { PageSections } from "@/components/hero-cinema/page-sections";
import { Cursor } from "@/components/hero-cinema/cursor";
import { IntroLoader } from "@/components/hero-cinema/intro-loader";
import { WhatsappFab } from "@/components/hero-cinema/whatsapp-fab";

const CinemaHero = dynamic(() => import("@/components/hero-cinema/cinema-hero"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "alqode — Every layer. Built to earn.",
  description:
    "Brand, web, commerce, motion, automation and software, every layer built in house in Cape Town. We don't build websites, we build machines that make you money.",
};

export default function Home() {
  return (
    <>
      {/* The semantic H1 — always present in the SSR HTML. The visible hero is
          ssr:false, so its headline is not in the server response that crawlers
          and non-JS clients read first. Keyword-rich, screen-reader only. */}
      <h1 className="sr-only">
        alqode, a digital agency in Cape Town building web, automation, e-commerce
        and software for businesses across South Africa and the UAE.
      </h1>
      <IntroLoader />
      <Cursor />
      <CinemaHero />
      <PageSections />
      <WhatsappFab />
    </>
  );
}
