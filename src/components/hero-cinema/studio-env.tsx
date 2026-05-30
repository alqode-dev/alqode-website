import { Environment, Lightformer } from "@react-three/drei";

/**
 * Premium studio environment for the chrome hero.
 *
 * Tuned for the REAL brand wordmark (Space Grotesk Medium) which has THIN
 * strokes. Thin chrome strokes reflect whatever is behind the camera, so a
 * pure-black room turns the letters black. Fix: keep the bright vertical
 * strip-lights (the signature "chrome bar" highlights) but ALSO wrap the
 * subject in a soft, slightly-raised ambient so flat faces read as bright
 * graphite metal instead of void. Cool key on the left, warm rim on the right
 * = the bichrome reflection that sells real metal. Dark, not black, backdrop.
 */
export function StudioEnv() {
  return (
    <Environment resolution={1024} background={false}>
      {/* gentle lift so flat faces aren't void-black, but kept LOW so chrome
          keeps its dark/bright contrast (a mirror, not a glowing tube) */}
      <Lightformer
        form="rect"
        intensity={0.22}
        color="#9aa7bd"
        position={[0, 0, 8]}
        scale={[18, 12, 1]}
      />

      {/* big KEY softbox, top-front */}
      <Lightformer
        intensity={3.8}
        color="#ffffff"
        position={[0, 5, 5]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[12, 4, 1]}
      />

      {/* vertical STRIP-LIGHTS, cool left -> warm right (premium bichrome bars) */}
      <Lightformer intensity={4.2} color="#cfe0ff" position={[-5, 0, 6]} scale={[0.5, 11, 1]} />
      <Lightformer intensity={3.4} color="#eaf1ff" position={[-2.4, 0.4, 6]} scale={[0.32, 11, 1]} />
      <Lightformer intensity={3.0} color="#ffffff" position={[-0.4, 0, 6]} scale={[0.3, 11, 1]} />
      <Lightformer intensity={3.6} color="#ffffff" position={[1.8, 0.4, 6]} scale={[0.34, 11, 1]} />
      <Lightformer intensity={3.2} color="#ffd9b0" position={[4.2, -0.2, 5.6]} scale={[0.28, 10, 1]} />

      {/* left COOL fill */}
      <Lightformer
        intensity={1.6}
        color="#9fc0f0"
        position={[-7, 1, 3]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[6, 7, 1]}
      />

      {/* warm RIM, behind-right (the ember edge from the target frame) */}
      <Lightformer
        intensity={6}
        color="#ffa84f"
        position={[7, 2, -3]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={[4, 7, 1]}
      />

      {/* cool back-left rim for separation */}
      <Lightformer
        intensity={2.2}
        color="#bcd2ff"
        position={[-6, 0, -4]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[3, 6, 1]}
      />

      {/* floor bounce so the underside of the strokes glows faintly */}
      <Lightformer
        intensity={0.9}
        color="#7e8a9c"
        position={[0, -6, 3]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[12, 5, 1]}
      />
    </Environment>
  );
}
