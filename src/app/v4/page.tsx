import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { PageSections } from "@/components/hero-cinema/page-sections";
import { Cursor } from "@/components/hero-cinema/cursor";

const CinemaHero = dynamic(() => import("@/components/hero-cinema/cinema-hero"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "alqode — Every layer. One studio.",
  description:
    "A Cape Town digital studio. Brand, web, commerce, motion, automation and software, every layer in house. We don't build websites, we build machines that make you money.",
};

export default function V4Page() {
  return (
    <>
      <Cursor />
      <CinemaHero />
      <PageSections />
    </>
  );
}
