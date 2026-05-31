import dynamic from "next/dynamic";
import type { Metadata } from "next";

const CinemaHero = dynamic(() => import("@/components/hero-cinema/cinema-hero"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "alqode — One builder. Every layer.",
  description:
    "Cape Town studio. We don't build websites, we build machines that make you money.",
};

export default function V4Page() {
  return (
    <main className="bg-[#060607]">
      <CinemaHero />
    </main>
  );
}
