import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";

const textureLoader = new THREE.TextureLoader();
const imageUrls = [
  "/images/react2.webp",
  "/images/next2.webp",
  "/images/node2.webp",
  "/images/express.webp",
  "/images/mongo.webp",
  "/images/mysql.webp",
  "/images/typescript.webp",
  "/images/javascript.webp",
];
const textures = imageUrls.map((url) => textureLoader.load(url));

// Desktop: 28x28 segments (784 triangles per sphere)
// Mobile: 16x16 segments (256 triangles per sphere)
const sphereGeometryDesktop = new THREE.SphereGeometry(1, 28, 28);
const sphereGeometryMobile = new THREE.SphereGeometry(1, 16, 16);

// Scale options for spheres
const scaleOptions = [0.7, 1, 0.8, 1, 1];

// Desktop: 30 spheres, Mobile: 10 spheres
// Assign stable IDs and pre-computed material indices
const spheresDesktop = [...Array(30)].map((_, i) => ({
  id: `desktop-sphere-${i}`,
  scale: scaleOptions[Math.floor(Math.random() * scaleOptions.length)],
  materialIndex: Math.floor(Math.random() * 8), // Pre-compute material index (8 textures)
}));
const spheresMobile = [...Array(10)].map((_, i) => ({
  id: `mobile-sphere-${i}`,
  scale: scaleOptions[Math.floor(Math.random() * scaleOptions.length)],
  materialIndex: Math.floor(Math.random() * 8),
}));

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
  geometry: THREE.SphereGeometry;
  isMobile: boolean;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
  geometry,
  isMobile,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    if (!isActive) return;
    delta = Math.min(0.1, delta);
    const impulse = vec
      .copy(api.current!.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -50 * delta * scale,
          -150 * delta * scale,
          -50 * delta * scale
        )
      );

    api.current?.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow={!isMobile}
        receiveShadow={!isMobile}
        scale={scale}
        geometry={geometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

const TechStack = () => {
  const [isActive, setIsActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleScroll = () => {
      const workElement = document.getElementById("work");
      if (!workElement) return;

      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const threshold = workElement.getBoundingClientRect().top;
      setIsActive(scrollY > threshold);
    };

    // Store click handlers for cleanup
    const clickHandlers = new Map<Element, EventListener>();
    let activeInterval: ReturnType<typeof setInterval> | null = null;

    document.querySelectorAll(".header a").forEach((elem) => {
      const handler = () => {
        // Clear any existing interval first
        if (activeInterval) {
          clearInterval(activeInterval);
        }
        // Use 50ms instead of 10ms - much more reasonable
        activeInterval = setInterval(() => {
          handleScroll();
        }, 50);
        setTimeout(() => {
          if (activeInterval) {
            clearInterval(activeInterval);
            activeInterval = null;
          }
        }, 1000);
      };
      clickHandlers.set(elem, handler);
      elem.addEventListener("click", handler);
    });

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);

      // Cleanup click handlers
      clickHandlers.forEach((handler, elem) => {
        elem.removeEventListener("click", handler);
      });

      // Clear any active interval
      if (activeInterval) {
        clearInterval(activeInterval);
      }
    };
  }, []);

  const spheres = isMobile ? spheresMobile : spheresDesktop;
  const sphereGeometry = isMobile ? sphereGeometryMobile : sphereGeometryDesktop;

  const materials = useMemo(() => {
    return textures.map(
      (texture) =>
        new THREE.MeshPhysicalMaterial({
          map: texture,
          emissive: "#ffffff",
          emissiveMap: texture,
          emissiveIntensity: 0.3,
          metalness: 0.5,
          roughness: 1,
          clearcoat: 0.1,
        })
    );
  }, []);

  return (
    <div className="techstack">
      <h2> Our Techstack</h2>

      <Canvas
        shadows={!isMobile}
        gl={{ alpha: true, stencil: false, depth: false, antialias: false }}
        camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
        dpr={isMobile ? 1 : [1, 2]}
        onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
        className="tech-canvas"
        style={{ position: 'relative' }}
      >
        <ambientLight intensity={1} />
        <spotLight
          position={[20, 20, 25]}
          penumbra={1}
          angle={0.2}
          color="white"
          castShadow={!isMobile}
          shadow-mapSize={isMobile ? [256, 256] : [512, 512]}
        />
        <directionalLight position={[0, 5, -4]} intensity={2} />
        <Physics gravity={[0, 0, 0]}>
          <Pointer isActive={isActive} />
          {spheres.map((props) => (
            <SphereGeo
              key={props.id}
              scale={props.scale}
              material={materials[props.materialIndex]}
              isActive={isActive}
              geometry={sphereGeometry}
              isMobile={isMobile}
            />
          ))}
        </Physics>
        <Environment
          files="/models/char_enviorment.hdr"
          environmentIntensity={0.5}
          environmentRotation={[0, 4, 2]}
        />
        {!isMobile && (
          <EffectComposer enableNormalPass={false}>
            <N8AO color="#001a1f" aoRadius={2} intensity={1.15} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
};

export default TechStack;
