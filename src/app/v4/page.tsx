import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { PageSections } from "@/components/hero-cinema/page-sections";
import { Cursor } from "@/components/hero-cinema/cursor";

const CinemaHero = dynamic(() => import("@/components/hero-cinema/cinema-hero"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "alqode — One builder. Every layer.",
  description:
    "Cape Town studio of one. Brand, web, commerce, motion, automation and software. We don't build websites, we build machines that make you money.",
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
