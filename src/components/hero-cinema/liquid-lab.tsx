"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MarchingCubes, MarchingCube } from "@react-three/drei";
import { StudioEnv } from "./studio-env";

/**
 * Phase 1: liquid chrome pool. drei MarchingCube positions are centred at the
 * ORIGIN (~[-1,1] field space), so the balls churn around 0. Same chrome
 * material as the wordmark for a continuous surface through the future morph.
 */

const N = 4;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CubeRef = any;

function Pool() {
  const refs = useRef<CubeRef[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    for (let i = 0; i < N; i++) {
      const m = refs.current[i];
      if (!m) continue;
      const baseX = (i - (N - 1) / 2) * 0.1;
      m.position.set(
        baseX + Math.sin(t * 0.7 + i) * 0.02,
        Math.cos(t * 0.5 + i * 1.3) * 0.03,
        Math.sin(t * 0.4 + i * 0.9) * 0.025
      );
    }
  });

  return (
    <MarchingCubes
      resolution={60}
      maxPolyCount={20000}
      enableUvs={false}
      enableColors={false}
      scale={[3.4, 2.4, 2.4]}
    >
      <meshStandardMaterial
        color="#fdfdff"
        metalness={1}
        roughness={0.045}
        envMapIntensity={1.6}
      />
      {Array.from({ length: N }).map((_, i) => (
        <MarchingCube
          key={i}
          ref={(el: CubeRef) => {
            refs.current[i] = el;
          }}
          strength={0.5}
          subtract={10}
        />
      ))}
    </MarchingCubes>
  );
}

export default function LiquidLab() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8.2], fov: 30 }}
      gl={{ antialias: true }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#070708"]} />
      <Suspense fallback={null}>
        <Pool />
        <StudioEnv />
      </Suspense>
      <directionalLight position={[4, 6, 5]} intensity={0.4} />
    </Canvas>
  );
}
