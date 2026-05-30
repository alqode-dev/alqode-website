"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Text3D } from "@react-three/drei";
import { StudioEnv } from "./studio-env";
import {
  EffectComposer,
  SelectiveBloom,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import type { RefObject } from "react";
import type { Group, Mesh } from "three";

const FONT = "/fonts/helvetiker_bold.typeface.json";
const TEXT3D_PROPS = {
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

/**
 * Phase 0 quality spike: a live, real-time chrome {alqode} wordmark.
 * Goal: prove the chrome MATERIAL + studio LIGHTING look premium and razor sharp
 * before any morph / scroll / mobile work. Letterforms here are a placeholder
 * bold typeface; the exact brand vector shapes come in a later phase.
 */

function Wordmark({ greenRef }: { greenRef: RefObject<Mesh> }) {
  const group = useRef<Group>(null);

  // Very gentle idle sway so reflections shift — life, not motion for its own sake.
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(t * 0.25) * 0.1;
    group.current.rotation.x = Math.sin(t * 0.2) * 0.035;
  });

  return (
    <group ref={group}>
      {/* terminal-green glow shell, concentric + slightly larger + behind,
          read as a clean neon rim once bloomed (the end-frame look) */}
      <group position={[0, 0, -0.12]} scale={1.022}>
        <Center>
          <Text3D ref={greenRef} {...TEXT3D_PROPS}>
            {"{alqode}"}
            <meshStandardMaterial
              color="#000000"
              emissive="#10b981"
              emissiveIntensity={3.2}
              toneMapped={false}
            />
          </Text3D>
        </Center>
      </group>

      {/* chrome front */}
      <Center>
        <Text3D {...TEXT3D_PROPS}>
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

export default function HeroLab() {
  const greenRef = useRef<Mesh>(null);
  // Mount the composer only after the green mesh ref is populated, so
  // SelectiveBloom's selection is never null on init.
  const [composerReady, setComposerReady] = useState(false);
  useEffect(() => setComposerReady(true), []);

  return (
    <Canvas
      camera={{ position: [0, 0, 8.2], fov: 30 }}
      gl={{ antialias: true }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#070708"]} />
      <Suspense fallback={null}>
        <Wordmark greenRef={greenRef} />
        <StudioEnv />
      </Suspense>
      <directionalLight position={[4, 6, 5]} intensity={0.4} />
      {composerReady && greenRef.current && (
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
