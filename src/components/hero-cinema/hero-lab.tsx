"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import { StudioEnv } from "./studio-env";
import { useWordmarkGeometry } from "./wordmark-geometry";
import {
  EffectComposer,
  SelectiveBloom,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";
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
        {/* flip y: SVGLoader is y-down */}
        <group scale={[s, -s, s]}>
          <mesh geometry={letters}>
            <meshStandardMaterial
              color="#fdfdff"
              metalness={1}
              roughness={0.04}
              envMapIntensity={1.6}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh ref={bracketRef} geometry={brackets}>
            <meshStandardMaterial
              color="#10b981"
              emissive="#10b981"
              emissiveIntensity={1.0}
              metalness={1}
              roughness={0.15}
              envMapIntensity={1.3}
              side={THREE.DoubleSide}
              toneMapped={false}
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
      {composerReady && bracketRef.current && (
        <EffectComposer disableNormalPass>
          <SelectiveBloom
            selection={[bracketRef.current]}
            lights={[]}
            intensity={1.6}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.3}
            radius={0.6}
            mipmapBlur
          />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
