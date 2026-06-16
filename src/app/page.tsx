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
      <IntroLoader />
      <Cursor />
      <CinemaHero />
      <PageSections />
      <WhatsappFab />
    </>
  );
}
