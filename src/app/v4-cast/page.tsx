import type { Metadata } from "next";
import dynamic from "next/dynamic";

const CastScene = dynamic(
  () => import("@/components/hero-cinema/cast-scene"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "alqode — cast",
  robots: { index: false, follow: false },
};

export default function V4CastPage() {
  return (
    <main style={{ width: "100%", height: "100vh", background: "#070708" }}>
      <CastScene />
    </main>
  );
}
