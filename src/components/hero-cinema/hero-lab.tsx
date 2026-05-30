"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import { StudioEnv } from "./studio-env";
import { useWordmarkGeometry } from "./wordmark-geometry";
import {
  EffectComposer,
  Bloom,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import type { RefObject } from "react";
import type { Group, Mesh } from "three";

const TARGET_WIDTH = 5.6; // world units across the camera frame

/**
 * Phase 0/1: a live, real-time chrome {alqode} wordmark built from the REAL
 * brand vector (SVGLoader -> ExtrudeGeometry). White chrome letters, green
 * bracket signature that blooms. Proves material + lighting + the true letter
 * shapes before the melt.
 */
function Wordmark({ bracketRef }: { bracketRef: RefObject<Mesh> }) {
  const group = useRef<Group>(null);
  const { letters, brackets, size } = useWordmarkGeometry();
  const s = useMemo(() => TARGET_WIDTH / size.x, [size]);

  // gentle idle sway so reflections shift — life, not motion for its own sake
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(t * 0.25) * 0.1;
    group.current.rotation.x = Math.sin(t * 0.2) * 0.035;
  });

  return (
    <group ref={group}>
      <Center>
        {/* geometry is already upright (flipped in wordmark-geometry) */}
        <group scale={[s, s, s]}>
          {/* faint green halo behind the brackets — brand tie, kept subtle */}
          <mesh geometry={brackets} position={[0, 0, -0.05]} scale={1.03}>
            <meshBasicMaterial color="#0a8f63" toneMapped={false} />
          </mesh>

          <mesh geometry={letters}>
            <meshStandardMaterial
              color="#eef2f8"
              metalness={1}
              roughness={0.022}
              envMapIntensity={1.55}
            />
          </mesh>

          {/* brackets = green-TINTED chrome (metal), not flat neon paint */}
          <mesh ref={bracketRef} geometry={brackets}>
            <meshStandardMaterial
              color="#19c98d"
              emissive="#0c5f43"
              emissiveIntensity={0.35}
              metalness={1}
              roughness={0.12}
              envMapIntensity={1.7}
            />
          </mesh>
        </group>
      </Center>
    </group>
  );
}

export default function HeroLab() {
  const bracketRef = useRef<Mesh>(null);
  const [composerReady, setComposerReady] = useState(false);
  useEffect(() => setComposerReady(true), []);

  return (
    <Canvas
      camera={{ position: [0, 0, 8.2], fov: 30 }}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#070708"]} />
      <Suspense fallback={null}>
        <Wordmark bracketRef={bracketRef} />
        <StudioEnv />
      </Suspense>
      <directionalLight position={[4, 6, 5]} intensity={0.4} />
      {composerReady && (
        <EffectComposer disableNormalPass>
          {/* bloom on the bright chrome specular + the green glow = wet-metal
              gleam. Threshold high enough that only the hot highlights bloom. */}
          <Bloom
            intensity={0.55}
            luminanceThreshold={0.85}
            luminanceSmoothing={0.2}
            radius={0.6}
            mipmapBlur
          />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
