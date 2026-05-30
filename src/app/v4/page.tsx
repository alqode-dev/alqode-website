import type { Metadata } from "next";
import { MoltenCast } from "@/components/v4/molten-cast";

export const metadata: Metadata = {
  title: "alqode — One builder. Every layer.",
  description:
    "A studio of one. Brand, web, commerce, motion, automation and software — cast from a single hand. We build machines that make you money.",
  robots: { index: false, follow: false },
};

export default function V4Page() {
  return <MoltenCast />;
}
