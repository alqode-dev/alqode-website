import type { Metadata } from "next";
import dynamic from "next/dynamic";

const MorphScene = dynamic(
  () => import("@/components/hero-cinema/morph-scene"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "alqode — morph",
  robots: { index: false, follow: false },
};

export default function V4MorphPage() {
  return (
    <main style={{ width: "100%", height: "100vh", background: "#070708" }}>
      <MorphScene />
    </main>
  );
}
