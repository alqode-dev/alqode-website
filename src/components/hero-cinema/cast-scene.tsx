"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, MarchingCubes, MarchingCube, Text3D } from "@react-three/drei";
import {
  EffectComposer,
  SelectiveBloom,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { StudioEnv } from "./studio-env";
import type { Group, Mesh, MeshStandardMaterial } from "three";

/**
 * Phase 2: the CAST. A liquid-chrome pool sinks and hands off to the {alqode}
 * wordmark, which rises out of it as the terminal-green glow ignites.
 * Driven by a single progress value `prog.p` (0..1) so the same scene works
 * for scroll later. URL ?p=0.5 freezes it for deterministic verification.
 */

const FONT = "/fonts/helvetiker_bold.typeface.json";
const T3D = {
  font: FONT,
  size: 1.0,
  height: 0.26,
  curveSegments: 24,
  bevelEnabled: true,
  bevelThickness: 0.03,
  bevelSize: 0.02,
  bevelOffset: 0,
  bevelSegments: 10,
  letterSpacing: -0.02,
} as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRef = any;

const prog = { p: 0, fixed: false };

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function ProgressDriver() {
  useFrame((state) => {
    if (prog.fixed) return;
    // ping-pong 0..1 so the preview keeps casting and un-casting
    const t = state.clock.elapsedTime % 12;
    prog.p = t < 6 ? t / 6 : 1 - (t - 6) / 6;
  });
  return null;
}

function Pool() {
  const refs = useRef<AnyRef[]>([]);
  const grp = useRef<Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const sink = smooth(0.45, 0.9, prog.p);
    if (grp.current) {
      grp.current.position.y = -sink * 2.6;
      grp.current.scale.setScalar(Math.max(0.0001, 1 - sink * 0.92));
    }
    const n = refs.current.length;
    for (let i = 0; i < n; i++) {
      const m = refs.current[i];
      if (!m) continue;
      const baseX = (i - (n - 1) / 2) * 0.1;
      m.position.set(
        baseX + Math.sin(t * 0.7 + i) * 0.02,
        Math.cos(t * 0.5 + i * 1.3) * 0.03,
        Math.sin(t * 0.4 + i * 0.9) * 0.025
      );
    }
  });

  return (
    <group ref={grp}>
      <MarchingCubes
        resolution={56}
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
        {Array.from({ length: 4 }).map((_, i) => (
          <MarchingCube
            key={i}
            ref={(el: AnyRef) => {
              refs.current[i] = el;
            }}
            strength={0.5}
            subtract={10}
          />
        ))}
      </MarchingCubes>
    </group>
  );
}

function Wordmark({ greenRef }: { greenRef: React.RefObject<Mesh> }) {
  const grp = useRef<Group>(null);
  const greenMat = useRef<MeshStandardMaterial>(null);

  useFrame((state) => {
    const rise = smooth(0.35, 0.85, prog.p);
    if (grp.current) {
      grp.current.position.y = (1 - rise) * -2.0;
      grp.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.06 * rise;
    }
    if (greenMat.current) {
      greenMat.current.emissiveIntensity = smooth(0.72, 1, prog.p) * 3.4;
    }
  });

  return (
    <group ref={grp}>
      <group position={[0, 0, -0.12]} scale={1.022}>
        <Center>
          <Text3D ref={greenRef} {...T3D}>
            {"{alqode}"}
            <meshStandardMaterial
              ref={greenMat}
              color="#000000"
              emissive="#10b981"
              emissiveIntensity={0}
              toneMapped={false}
            />
          </Text3D>
        </Center>
      </group>
      <Center>
        <Text3D {...T3D}>
          {"{alqode}"}
          <meshStandardMaterial
            color="#fdfdff"
            metalness={1}
            roughness={0.03}
            envMapIntensity={1.6}
          />
        </Text3D>
      </Center>
    </group>
  );
}

export default function CastScene() {
  const greenRef = useRef<Mesh>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const u = new URLSearchParams(window.location.search);
    const pv = u.get("p");
    if (pv !== null) {
      prog.p = parseFloat(pv);
      prog.fixed = true;
    }
    setReady(true);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 8.2], fov: 30 }}
      gl={{ antialias: true }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#070708"]} />
      <ProgressDriver />
      <Suspense fallback={null}>
        <Pool />
        <Wordmark greenRef={greenRef} />
        <StudioEnv />
      </Suspense>
      <directionalLight position={[4, 6, 5]} intensity={0.4} />
      {ready && greenRef.current && (
        <EffectComposer disableNormalPass>
          <SelectiveBloom
            selection={[greenRef.current]}
            lights={[]}
            intensity={1.8}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.3}
            radius={0.55}
            mipmapBlur
          />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
