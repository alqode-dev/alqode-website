import type { Metadata } from "next";
import dynamic from "next/dynamic";

const MeltScene = dynamic(() => import("@/components/hero-cinema/melt-scene"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "alqode — melt lab",
  robots: { index: false, follow: false },
};

export default function V4MeltPage() {
  return (
    <main style={{ width: "100%", height: "100vh", background: "#070708" }}>
      <MeltScene />
    </main>
  );
}
