import { Environment, Lightformer } from "@react-three/drei";

/**
 * Moody cinematic studio for the chrome hero.
 *
 * Cold + dark by default: the metal sits mostly in shadow, picking up a few
 * controlled vertical strip-lights (the "chrome bars") and ONE warm ember rim
 * on the right. The warm rim is the single warm note in an otherwise cold dark
 * scene, which is what reads as cinematic rather than "showroom bright".
 * Thin Space-Grotesk strokes still need the rounded bevel (set in geometry) to
 * catch these bars, but the overall level is pulled way down from the lab.
 */
export function StudioEnv() {
  return (
    <Environment resolution={1024} background={false}>
      {/* very low cool fill so flat faces aren't pure void but stay dark */}
      <Lightformer
        form="rect"
        intensity={0.12}
        color="#7e8aa2"
        position={[0, 0, 8]}
        scale={[18, 12, 1]}
      />

      {/* restrained key, top-front */}
      <Lightformer
        intensity={2.2}
        color="#dfe8ff"
        position={[0, 5, 5]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[10, 3, 1]}
      />

      {/* vertical STRIP-LIGHTS — fewer, cooler, dimmer (the mirror bars) */}
      <Lightformer intensity={2.8} color="#bcd0f5" position={[-4.6, 0, 6]} scale={[0.45, 11, 1]} />
      <Lightformer intensity={2.0} color="#e8efff" position={[-1.6, 0.4, 6]} scale={[0.28, 11, 1]} />
      <Lightformer intensity={2.4} color="#ffffff" position={[1.4, 0.2, 6]} scale={[0.3, 11, 1]} />

      {/* cool back-left rim for separation */}
      <Lightformer
        intensity={1.6}
        color="#9fb6e6"
        position={[-7, 1, -3]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[4, 7, 1]}
      />

      {/* the ONE warm ember rim, behind-right — the cinematic accent */}
      <Lightformer
        intensity={4.2}
        color="#ff9742"
        position={[6.5, 1.5, -3.5]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={[3.5, 7, 1]}
      />
    </Environment>
  );
}
