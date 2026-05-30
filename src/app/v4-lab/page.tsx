import type { Metadata } from "next";
import dynamic from "next/dynamic";

const HeroLab = dynamic(() => import("@/components/hero-cinema/hero-lab"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "alqode — chrome lab",
  robots: { index: false, follow: false },
};

export default function V4LabPage() {
  return (
    <main style={{ width: "100%", height: "100vh", background: "#070708" }}>
      <HeroLab />
    </main>
  );
}
