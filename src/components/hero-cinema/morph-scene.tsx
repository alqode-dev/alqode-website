"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { MarchingCubes, MarchingCube } from "@react-three/drei";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { Mesh, Vector3 } from "three";
import { StudioEnv } from "./studio-env";

/**
 * "Venom cast": ONE liquid-metal substance. Every metaball flows from a
 * churning pool home to a target sampled on the {alqode} letterforms, so the
 * same mercury that was a pool reforms into the logo. Driven by prog.p (0..1);
 * URL ?p= freezes it for verification.
 */

const FONT = "/fonts/helvetiker_bold.typeface.json";
const N = 220;
// field-fit: map the sampled letter extent into the marching-cubes field
const FIELD_FIT = 0.34;

const prog = { p: 1, fixed: false };

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function useLetterTargets(): Vector3[] {
  const font = useLoader(FontLoader, FONT);
  return useMemo(() => {
    const geo = new TextGeometry("{alqode}", {
      font,
      size: 1,
      height: 0.4,
      bevelEnabled: false,
      curveSegments: 5,
    });
    geo.computeBoundingBox();
    const bb = geo.boundingBox!;
    geo.translate(
      -(bb.max.x + bb.min.x) / 2,
      -(bb.max.y + bb.min.y) / 2,
      -(bb.max.z + bb.min.z) / 2
    );
    geo.computeBoundingBox();
    const maxAbsX = Math.max(
      Math.abs(geo.boundingBox!.max.x),
      Math.abs(geo.boundingBox!.min.x)
    );
    const k = FIELD_FIT / maxAbsX;
    const sampler = new MeshSurfaceSampler(new Mesh(geo)).build();
    const tmp = new Vector3();
    const pts: Vector3[] = [];
    for (let i = 0; i < N; i++) {
      sampler.sample(tmp);
      pts.push(tmp.clone().multiplyScalar(k));
    }
    return pts;
  }, [font]);
}

function Liquid() {
  const targets = useLetterTargets();
  const refs = useRef<(Vector3 & { position?: Vector3 })[]>([]);

  // deterministic pool homes: a tight churning horizontal cluster
  const pool = useMemo(
    () =>
      targets.map((_, i) => {
        const a = i * 2.399963; // golden angle, even spread
        const r = 0.16 * Math.sqrt((i + 0.5) / N);
        return new Vector3(Math.cos(a) * r * 1.7, Math.sin(a) * r, Math.sin(a * 1.3) * r * 0.5);
      }),
    [targets]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const form = smooth(0, 1, prog.p);
    for (let i = 0; i < N; i++) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const m = refs.current[i] as any;
      if (!m) continue;
      const ph = pool[i];
      const tg = targets[i];
      // flowy noise so motion reads as liquid, stronger mid-morph
      const flow = (1 - Math.abs(form - 0.5) * 2) * 0.04;
      const nx = Math.sin(t * 0.8 + i) * flow + Math.sin(t * 0.6 + i * 1.7) * 0.012;
      const ny = Math.cos(t * 0.7 + i * 1.3) * flow + Math.cos(t * 0.5 + i) * 0.012;
      const nz = Math.sin(t * 0.5 + i * 0.9) * flow * 0.5;
      m.position.set(
        ph.x + (tg.x - ph.x) * form + nx,
        ph.y + (tg.y - ph.y) * form + ny,
        ph.z + (tg.z - ph.z) * form + nz
      );
    }
  });

  return (
    <MarchingCubes
      resolution={100}
      maxPolyCount={90000}
      enableUvs={false}
      enableColors={false}
      scale={[4, 4, 4]}
    >
      <meshStandardMaterial
        color="#fdfdff"
        metalness={1}
        roughness={0.04}
        envMapIntensity={1.6}
      />
      {Array.from({ length: N }).map((_, i) => (
        <MarchingCube
          key={i}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref={(el: any) => {
            refs.current[i] = el;
          }}
          strength={0.07}
          subtract={14}
        />
      ))}
    </MarchingCubes>
  );
}

export default function MorphScene() {
  const [, setReady] = useState(false);
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
      dpr={[1, 1.75]}
    >
      <color attach="background" args={["#070708"]} />
      <Suspense fallback={null}>
        <Liquid />
        <StudioEnv />
      </Suspense>
      <directionalLight position={[4, 6, 5]} intensity={0.4} />
    </Canvas>
  );
}
