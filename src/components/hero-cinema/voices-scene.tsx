"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, Sparkles, Float } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { TESTIMONIALS } from "@/lib/constants";

/**
 * VOICES SCENE — the client faces as real bubbles floating in 3D space.
 * The active speaker pushes forward (large, lit, ring glowing); the others
 * drift back into soft depth (smaller, dimmed, fogged). True WebGL depth +
 * bloom, the same engine as the hero. The crisp words are a DOM overlay in
 * client-proof.tsx; this is purely the cinematic stage.
 */

const VOICES = TESTIMONIALS.items;
const BG_POS: [number, number, number][] = [
  [-2.6, 0.7, -1.4],
  [2.6, 0.5, -1.7],
];

function targetFor(i: number, active: number) {
  if (i === active) {
    return { p: new THREE.Vector3(0, 0.15, 1.7), s: 1.35, dim: 1, ring: 0.7 };
  }
  const others = VOICES.map((_, k) => k).filter((k) => k !== active);
  const k = others.indexOf(i);
  const p = BG_POS[k] ?? [0, -1.4, -2];
  return { p: new THREE.Vector3(p[0], p[1], p[2]), s: 0.62, dim: 0.4, ring: 0.18 };
}

function Bubble({
  url,
  i,
  active,
  onSelect,
}: {
  url: string;
  i: number;
  active: number;
  onSelect: (i: number) => void;
}) {
  const tex = useTexture(url);
  const grp = useRef<THREE.Group>(null);
  const faceMat = useRef<THREE.MeshBasicMaterial>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  const tgt = useRef(targetFor(i, active));
  tgt.current = targetFor(i, active);

  useFrame((_, dt) => {
    const g = grp.current;
    if (!g) return;
    const a = Math.min(1, dt * 3.2);
    g.position.lerp(tgt.current.p, a);
    const s = THREE.MathUtils.lerp(g.scale.x, tgt.current.s, a);
    g.scale.setScalar(s);
    if (faceMat.current) {
      const c = faceMat.current.color;
      c.r += (tgt.current.dim - c.r) * a;
      c.g = c.r;
      c.b = c.r;
    }
    if (ringMat.current) {
      ringMat.current.opacity += (tgt.current.ring - ringMat.current.opacity) * a;
    }
  });

  return (
    <Float speed={1.3} rotationIntensity={0.1} floatIntensity={0.7}>
      <group
        ref={grp}
        position={tgt.current.p}
        onPointerDown={(e) => {
          e.stopPropagation();
          onSelect(i);
        }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "default")}
      >
        <mesh>
          <circleGeometry args={[0.9, 64]} />
          <meshBasicMaterial ref={faceMat} map={tex} toneMapped={false} transparent />
        </mesh>
        <mesh position={[0, 0, -0.02]}>
          <ringGeometry args={[0.92, 1.0, 64]} />
          <meshBasicMaterial ref={ringMat} color="#10b981" transparent opacity={0.18} toneMapped={false} />
        </mesh>
      </group>
    </Float>
  );
}

export default function VoicesScene({
  active,
  onSelect,
  dpr,
  paused,
}: {
  active: number;
  onSelect: (i: number) => void;
  dpr: [number, number];
  paused: boolean;
}) {
  return (
    <Canvas
      dpr={dpr}
      frameloop={paused ? "never" : "always"}
      camera={{ position: [0, 0, 5], fov: 46 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#080a0e"]} />
      <fog attach="fog" args={["#080a0e", 4.5, 9.5]} />
      <Suspense fallback={null}>
        {VOICES.map((v, i) => (
          <Bubble key={v.clientKey} url={v.photo} i={i} active={active} onSelect={onSelect} />
        ))}
        <Sparkles count={70} scale={[12, 7, 5]} size={2} speed={0.22} color="#10b981" opacity={0.5} />
      </Suspense>
      <EffectComposer>
        <Bloom intensity={0.75} luminanceThreshold={0.15} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
