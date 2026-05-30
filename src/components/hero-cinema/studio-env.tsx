import { Environment, Lightformer } from "@react-three/drei";

/**
 * Shared procedural studio environment for the chrome hero.
 * Dark room, bright key + cool-to-warm vertical strip-lights (the mirror bars
 * that read as polished chrome), one warm rim for the ember highlight.
 * Reused by the static lab, the liquid pool, and the cast scene so the metal
 * looks identical across the morph.
 */
export function StudioEnv() {
  return (
    <Environment resolution={512} background={false}>
      {/* KEY softbox, top */}
      <Lightformer
        intensity={3.5}
        color="#ffffff"
        position={[0, 5, 4]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[10, 3.5, 1]}
      />
      {/* vertical STRIP-LIGHTS, cool left -> warm right (premium bichrome) */}
      <Lightformer intensity={3.4} color="#cfe0ff" position={[-4.2, 0, 6]} scale={[0.4, 9, 1]} />
      <Lightformer intensity={2.8} color="#eaf1ff" position={[-2, 0.4, 6]} scale={[0.3, 9, 1]} />
      <Lightformer intensity={2.6} color="#ffffff" position={[-0.2, 0, 6]} scale={[0.28, 9, 1]} />
      <Lightformer intensity={3.2} color="#ffffff" position={[1.6, 0.4, 6]} scale={[0.32, 9, 1]} />
      <Lightformer intensity={2.6} color="#ffd9b0" position={[3.5, -0.2, 5.6]} scale={[0.24, 8, 1]} />
      {/* left cool fill */}
      <Lightformer
        intensity={1.1}
        color="#a9c0e8"
        position={[-6, 1, 3]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[5, 6, 1]}
      />
      {/* warm RIM, behind-right */}
      <Lightformer
        intensity={5}
        color="#ffa84f"
        position={[6, 2, -3]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={[3.5, 6, 1]}
      />
      {/* faint low bounce */}
      <Lightformer
        intensity={0.5}
        color="#88909c"
        position={[0, -5, 3]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[10, 4, 1]}
      />
    </Environment>
  );
}
