"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Center } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import * as THREE from "three";
import { StudioEnv } from "./studio-env";
import { useMeltGeometry } from "./wordmark-geometry";

const TARGET_WIDTH = 5.6;

// simplex noise (Ashima) + melt displacement, injected into the chrome material
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

vec3 meltDisplace(vec3 pos, vec3 nrm){
  float t = uTime * uFlow;
  float amp = uAmp * uMelt;
  float d = fbm(pos * uFreq + vec3(0.0, 0.0, t));
  vec3 displaced = pos + nrm * d * amp;
  // spread outward + sag + collapse height as it melts into a churning pool
  displaced.x += pos.x * 0.18 * uMelt;
  displaced.y += uSag * uMelt;
  displaced.y = mix(displaced.y, displaced.y * 0.5, uMelt);
  return displaced;
}
`;

function MeltMesh({ frozen }: { frozen: number | null }) {
  const { geometry, size, triangles } = useMeltGeometry();
  const s = useMemo(() => TARGET_WIDTH / size.x, [size]);

  const uniforms = useRef({
    uTime: { value: 0 },
    uMelt: { value: 1 },
    uIgnite: { value: 0 },
    uAmp: { value: size.y * 0.55 },
    uFreq: { value: 3.5 / size.x },
    uFlow: { value: 0.5 },
    uSag: { value: size.y * 0.16 },
    uEps: { value: size.x * 0.004 },
  });

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("[melt] triangles:", triangles, "size:", size.x.toFixed(0), size.y.toFixed(0));
  }, [triangles, size]);

  useFrame((state) => {
    const u = uniforms.current;
    u.uTime.value = state.clock.elapsedTime;
    // p: 0 = molten blob, 1 = solid crisp logo
    const p =
      frozen !== null ? frozen : Math.sin(state.clock.elapsedTime * 0.35) * 0.5 + 0.5;
    u.uMelt.value = THREE.MathUtils.clamp(1 - p / 0.85, 0, 1);
    u.uIgnite.value = THREE.MathUtils.smoothstep(p, 0.78, 1.0);
  });

  return (
    <Center>
      <group scale={[s, s, s]}>
        <mesh geometry={geometry}>
          <meshStandardMaterial
            vertexColors
            metalness={1}
            roughness={0.022}
            envMapIntensity={1.55}
            onBeforeCompile={(shader) => {
              Object.assign(shader.uniforms, uniforms.current);
              shader.uniforms.uIgnite = uniforms.current.uIgnite;

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
                  totalEmissiveRadiance += greenMask * uIgnite * vec3(0.04, 0.85, 0.55) * 2.4;
                  `
                );
            }}
          />
        </mesh>
      </group>
    </Center>
  );
}

function Scene({ frozen }: { frozen: number | null }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <color attach="background" args={["#070708"]} />
      <directionalLight position={[4, 6, 5]} intensity={0.4} />
      <Suspense fallback={null}>
        <MeltMesh frozen={frozen} />
        <StudioEnv />
        {mounted && (
          <EffectComposer disableNormalPass>
            {/* same recipe as the lab: bloom only the hottest chrome specular +
                the green ignite, so liquid chrome reads identically to the solid */}
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
      </Suspense>
    </>
  );
}

export default function MeltScene() {
  const frozen = useMemo(() => {
    if (typeof window === "undefined") return null;
    const v = new URLSearchParams(window.location.search).get("p");
    return v === null ? null : parseFloat(v);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 8.2], fov: 30 }}
      dpr={[1, 2]}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
    >
      <Scene frozen={frozen} />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
