import type { Metadata } from "next";
import dynamic from "next/dynamic";

const LiquidLab = dynamic(() => import("@/components/hero-cinema/liquid-lab"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "alqode — liquid lab",
  robots: { index: false, follow: false },
};

export default function V4LiquidPage() {
  return (
    <main style={{ width: "100%", height: "100vh", background: "#070708" }}>
      <LiquidLab />
    </main>
  );
}
