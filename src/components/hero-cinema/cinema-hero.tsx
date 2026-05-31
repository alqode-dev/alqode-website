"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import { EffectComposer, Bloom, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import * as THREE from "three";
import { StudioEnv } from "./studio-env";
import { useMeltGeometry } from "./wordmark-geometry";
import { waUrl } from "@/lib/constants";

/**
 * THE HERO. A real-time chrome {alqode} that lives on scroll + cursor.
 *
 * Structure: a tall scroll track (SCROLL_VH) with a sticky full-screen canvas.
 * As you scroll the track, `view.p` goes 0 -> 1:
 *   p ~0.0   churning molten chrome blob (the pool)
 *   p ~0.7   the metal has cast itself into the crisp {alqode} wordmark
 *   p ~0.85  the green brackets ignite from inside
 * The cursor tilts the metal and stirs the liquid, so it reads as alive, not a
 * video. Copy layers cross-fade with the same progress (driven by DOM refs in
 * one rAF loop, never React state, so the 3D never stalls).
 */

const TARGET_WIDTH = 5.6;
const SCROLL_VH = 420; // height of the scroll track in vh

// shared cross-frame view state (no React re-render in the hot path)
const view = {
  p: 0, // scroll progress 0..1
  mx: 0, // cursor x, -1..1 (smoothed)
  my: 0, // cursor y, -1..1 (smoothed)
  mxT: 0, // cursor x target
  myT: 0, // cursor y target
};

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const NOISE_GLSL = /* glsl */ `
uniform float uTime;
uniform float uMelt;
uniform float uAmp;
uniform float uFreq;
uniform float uFlow;
uniform float uSag;
uniform float uEps;

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod(i, 289.0);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
float fbm(vec3 p){
  float v = snoise(p);
  v += 0.5 * snoise(p * 2.03 + 11.0);
  return v;
}
// GENTLE molten skin. Small surface ripple along the normal only — never a
// position explosion. The logo stays readable at all times; it just looks like
// liquid chrome settling, not a mesh tearing apart.
vec3 meltDisplace(vec3 pos, vec3 nrm){
  float t = uTime * uFlow;
  float amp = uAmp * uMelt;
  float d = fbm(pos * uFreq + vec3(0.0, 0.0, t));
  return pos + nrm * d * amp;
}
`;

function HeroMesh() {
  const { geometry, size } = useMeltGeometry();
  const s = useMemo(() => TARGET_WIDTH / size.x, [size]);
  const group = useRef<THREE.Group>(null);

  const uniforms = useRef({
    uTime: { value: 0 },
    uMelt: { value: 1 },
    uIgnite: { value: 0 },
    // amp is a SMALL fraction of letter height — a molten ripple, not an
    // explosion. (was size.y*0.55 ≈ 750u which tore the mesh into strings.)
    uAmp: { value: size.y * 0.08 },
    uFreq: { value: 2.2 / size.x },
    uFlow: { value: 0.35 },
    uSag: { value: 0 },
    uEps: { value: size.x * 0.01 },
    uStir: { value: 0 },
  });

  useFrame((state, dt) => {
    const u = uniforms.current;
    const k = Math.min(1, dt * 2.5); // shared damping (slow, calm)
    u.uTime.value = state.clock.elapsedTime;

    // smoothly ease cursor toward target — heavy damping, no jitter
    view.mx += (view.mxT - view.mx) * k;
    view.my += (view.myT - view.my) * k;

    const p = view.p;
    u.uMelt.value = THREE.MathUtils.clamp(1 - p / 0.7, 0, 1);
    u.uIgnite.value = smoothstep(0.72, 0.92, p);

    if (group.current) {
      // subtle cursor tilt, capped small so it never looks frantic
      const tilt = 0.1;
      group.current.rotation.y += (view.mx * tilt - group.current.rotation.y) * k;
      group.current.rotation.x += (-view.my * tilt * 0.5 - group.current.rotation.x) * k;
    }
  });

  return (
    <Center>
      <group ref={group}>
        <group scale={[s, s, s]}>
          <mesh geometry={geometry}>
            <meshStandardMaterial
              vertexColors
              metalness={1}
              roughness={0.022}
              envMapIntensity={1.55}
              onBeforeCompile={(shader) => {
                Object.assign(shader.uniforms, uniforms.current);
                shader.vertexShader = shader.vertexShader
                  .replace("#include <common>", "#include <common>\n" + NOISE_GLSL)
                  .replace(
                    "#include <beginnormal_vertex>",
                    /* glsl */ `
                    vec3 objectNormal = vec3( normal );
                    #ifdef USE_TANGENT
                      vec3 objectTangent = vec3( tangent.xyz );
                    #endif
                    vec3 mRef = abs(objectNormal.y) > 0.99 ? vec3(1.0,0.0,0.0) : vec3(0.0,1.0,0.0);
                    vec3 mTan = normalize(cross(objectNormal, mRef));
                    vec3 mBit = normalize(cross(objectNormal, mTan));
                    vec3 mP0 = meltDisplace(position, objectNormal);
                    vec3 meltPos = mP0;
                    if (uMelt > 0.0001) {
                      vec3 mPt = meltDisplace(position + mTan*uEps, objectNormal);
                      vec3 mPb = meltDisplace(position + mBit*uEps, objectNormal);
                      vec3 nn = normalize(cross(mPt - mP0, mPb - mP0));
                      if (dot(nn, objectNormal) < 0.0) nn = -nn;
                      objectNormal = normalize(mix(objectNormal, nn, clamp(uMelt*1.5, 0.0, 1.0)));
                    }
                    `
                  )
                  .replace("#include <begin_vertex>", "vec3 transformed = meltPos;");
                shader.fragmentShader = shader.fragmentShader
                  .replace("#include <common>", "#include <common>\nuniform float uIgnite;")
                  .replace(
                    "#include <emissivemap_fragment>",
                    /* glsl */ `
                    #include <emissivemap_fragment>
                    float greenMask = smoothstep(0.15, 0.4, vColor.g - max(vColor.r, vColor.b));
                    totalEmissiveRadiance += greenMask * uIgnite * vec3(0.04, 0.85, 0.55) * 2.6;
                    `
                  );
              }}
            />
          </mesh>
        </group>
      </group>
    </Center>
  );
}

function Rig() {
  // subtle dolly-in as it casts + cursor parallax on the camera
  useFrame((state, dt) => {
    const z = THREE.MathUtils.lerp(9.0, 7.6, smoothstep(0.2, 0.9, view.p));
    state.camera.position.z += (z - state.camera.position.z) * Math.min(1, dt * 2);
    state.camera.position.x += (view.mx * 0.5 - state.camera.position.x) * Math.min(1, dt * 2);
    state.camera.position.y += (view.my * 0.3 - state.camera.position.y) * Math.min(1, dt * 2);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

function Scene() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <>
      <color attach="background" args={["#060607"]} />
      <directionalLight position={[4, 6, 5]} intensity={0.4} />
      <Suspense fallback={null}>
        <HeroMesh />
        <StudioEnv />
        <Rig />
        {mounted && (
          <EffectComposer disableNormalPass>
            <Bloom intensity={0.6} luminanceThreshold={0.82} luminanceSmoothing={0.2} radius={0.62} mipmapBlur />
            <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          </EffectComposer>
        )}
      </Suspense>
    </>
  );
}

export default function CinemaHero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const layerA = useRef<HTMLDivElement>(null);
  const layerB = useRef<HTMLDivElement>(null);
  const layerC = useRef<HTMLDivElement>(null);
  const scrollHint = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    // ?p= freezes scroll progress for deterministic QC screenshots
    const frozenP = (() => {
      const v = new URLSearchParams(window.location.search).get("p");
      return v === null ? null : Math.min(1, Math.max(0, parseFloat(v)));
    })();
    const onMove = (e: PointerEvent) => {
      view.mxT = (e.clientX / window.innerWidth) * 2 - 1;
      view.myT = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);

    const tick = () => {
      const el = trackRef.current;
      if (el) {
        let p: number;
        if (frozenP !== null) {
          p = frozenP;
        } else {
          const rect = el.getBoundingClientRect();
          const total = rect.height - window.innerHeight;
          p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
        }
        view.p = p;
        if (layerA.current) layerA.current.style.opacity = String(1 - smoothstep(0.16, 0.3, p));
        if (layerB.current)
          layerB.current.style.opacity = String(smoothstep(0.3, 0.42, p) * (1 - smoothstep(0.56, 0.66, p)));
        if (layerC.current) layerC.current.style.opacity = String(smoothstep(0.74, 0.86, p));
        if (scrollHint.current) scrollHint.current.style.opacity = String(1 - smoothstep(0.02, 0.1, p));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={trackRef} style={{ height: `${SCROLL_VH}vh`, position: "relative" }} className="bg-[#060607]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Canvas
          camera={{ position: [0, 0, 9], fov: 30 }}
          dpr={[1, 1.85]}
          gl={{ antialias: true, preserveDrawingBuffer: true }}
        >
          <Scene />
        </Canvas>

        {/* film grain */}
        <div className="grain pointer-events-none absolute inset-0 z-10" />

        {/* ---- copy layers (all centered, cross-fade by scroll) ---- */}
        <div className="pointer-events-none absolute inset-0 z-20">
          {/* A — opening statement */}
          <div
            ref={layerA}
            className="absolute inset-x-0 top-[12%] flex flex-col items-center px-6 text-center"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-white/45">
              Cape Town, South Africa and UAE
            </span>
            <h1 className="mt-5 font-sans text-[clamp(2.6rem,8vw,6.5rem)] font-bold leading-[0.95] tracking-tight text-white">
              One builder.
              <br />
              Every layer.
            </h1>
          </div>

          {/* B — the crafts */}
          <div
            ref={layerB}
            className="absolute inset-x-0 bottom-[12%] flex flex-wrap items-center justify-center gap-x-8 gap-y-2 px-6 text-center opacity-0"
          >
            {["Brand", "Web", "Commerce", "Motion", "Automation", "Software"].map((c) => (
              <span
                key={c}
                className="font-sans text-[clamp(1.1rem,2.4vw,2rem)] font-medium tracking-tight text-white/70"
              >
                {c}
              </span>
            ))}
          </div>

          {/* C — payoff + CTA (appears once the metal has cast + ignited) */}
          <div
            ref={layerC}
            className="pointer-events-none absolute inset-x-0 bottom-[10%] flex flex-col items-center px-6 text-center opacity-0"
          >
            <p className="max-w-2xl font-sans text-[clamp(1.05rem,2.6vw,1.6rem)] font-medium leading-snug text-white/90">
              We don&apos;t build websites. We build machines that make you money.
            </p>
            <a
              href={waUrl("v4_hero")}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto mt-7 inline-flex items-center gap-2 rounded-full bg-[#10b981] px-7 py-3.5 font-sans text-sm font-semibold text-[#060607] transition-transform duration-300 ease-out hover:scale-[1.04]"
            >
              Start on WhatsApp
              <span aria-hidden>→</span>
            </a>
          </div>

          {/* scroll hint */}
          <div
            ref={scrollHint}
            className="absolute inset-x-0 bottom-7 flex flex-col items-center gap-2 text-white/40"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
            <span className="h-8 w-px animate-pulse bg-white/30" />
          </div>
        </div>
      </div>
    </div>
  );
}
