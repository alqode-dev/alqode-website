import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  const [, setChar] = useState<THREE.Object3D | null>(null);
  useEffect(() => {
    if (canvasDiv.current) {
      let rect = canvasDiv.current.getBoundingClientRect();
      let container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      const scene = sceneRef.current;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      canvasDiv.current.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      camera.position.z = 10;
      camera.position.set(0, 13.1, 24.7);
      camera.zoom = 1.1;
      camera.updateProjectionMatrix();

      let headBone: THREE.Object3D | null = null;
      let screenLight: any | null = null;
      let mixer: THREE.AnimationMixer;

      const clock = new THREE.Clock();

      const light = setLighting(scene);
      let progress = setProgress((value) => setLoading(value));
      const { loadCharacter } = setCharacter(renderer, scene, camera);

      // Store character reference for resize handler
      let loadedCharacter: THREE.Object3D | null = null;

      // Add 10-second timeout to prevent infinite loading
      const loadingTimeout = setTimeout(() => {
        console.warn('3D model load timeout - forcing completion');
        progress.clear();
      }, 10000);

      loadCharacter()
        .then((gltf) => {
          clearTimeout(loadingTimeout); // Cancel timeout on success
          if (gltf) {
            const animations = setAnimations(gltf);
            hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
            mixer = animations.mixer;
            loadedCharacter = gltf.scene;
            setChar(loadedCharacter);
            scene.add(loadedCharacter);
            headBone = loadedCharacter.getObjectByName("spine006") || null;
            screenLight = loadedCharacter.getObjectByName("screenlight") || null;
            progress.loaded().then(() => {
              setTimeout(() => {
                light.turnOnLights();
                animations.startIntro();
              }, 500); // Reduced from 2500ms - just enough for GPU stabilization
            });
            // Note: resize handler is added outside this callback for proper cleanup
          }
        })
        .catch((error) => {
          clearTimeout(loadingTimeout); // Cancel timeout on error
          console.error("Failed to load 3D character model:", error);
          // Still complete the loading progress so the site remains usable
          progress.clear();
        });

      let mouse = { x: 0, y: 0 },
        interpolation = { x: 0.1, y: 0.2 };

      const onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => (mouse = { x, y }));
      };

      let debounce: ReturnType<typeof setTimeout> | undefined;
      let touchMoveHandler: ((e: TouchEvent) => void) | null = null;
      let touchTargetElement: HTMLElement | null = null;

      const onTouchStart = (event: TouchEvent) => {
        const element = event.target as HTMLElement;
        touchTargetElement = element;
        debounce = setTimeout(() => {
          touchMoveHandler = (e: TouchEvent) =>
            handleTouchMove(e, (x, y) => (mouse = { x, y }));
          element?.addEventListener("touchmove", touchMoveHandler);
        }, 200);
      };

      const onTouchEnd = () => {
        // FIRST: Clear the debounce to prevent handler attachment
        if (debounce) {
          clearTimeout(debounce);
          debounce = undefined;
        }

        handleTouchEnd((x, y, interpolationX, interpolationY) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        });

        // Clean up touchmove handler if it was attached
        if (touchTargetElement && touchMoveHandler) {
          touchTargetElement.removeEventListener("touchmove", touchMoveHandler);
          touchMoveHandler = null;
          touchTargetElement = null;
        }
      };

      // Store resize handler for proper cleanup
      const resizeHandler = () => {
        if (loadedCharacter) {
          handleResize(renderer, camera, canvasDiv, loadedCharacter);
        }
      };

      // Add event listeners (store references for cleanup)
      document.addEventListener("mousemove", onMouseMove);
      window.addEventListener("resize", resizeHandler);

      const landingDiv = document.getElementById("landingDiv");
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart);
        landingDiv.addEventListener("touchend", onTouchEnd);
      }

      // Animation loop with cancellation support
      let animationFrameId: number | null = null;

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );
          light.setPointLight(screenLight);
        }
        const delta = clock.getDelta();
        if (mixer) {
          mixer.update(delta);
        }
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        // Cancel animation frame
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
        }

        clearTimeout(debounce);
        scene.clear();
        renderer.dispose();

        // Remove event listeners (use same references)
        document.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", resizeHandler);

        if (canvasDiv.current) {
          canvasDiv.current.removeChild(renderer.domElement);
        }

        if (landingDiv) {
          landingDiv.removeEventListener("touchstart", onTouchStart);
          landingDiv.removeEventListener("touchend", onTouchEnd);
        }

        // Clean up any lingering touchmove handler
        if (touchTargetElement && touchMoveHandler) {
          touchTargetElement.removeEventListener("touchmove", touchMoveHandler);
        }
      };
    }
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
