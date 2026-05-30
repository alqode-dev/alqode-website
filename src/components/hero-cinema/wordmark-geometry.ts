// Loads the real {alqode} brand wordmark SVG and extrudes it into 3D geometry.
// The SVG is a single dark <g> of 8 paths in document order: { a l q o d e }.
// Brackets are therefore the FIRST and LAST paths (by position, not colour) —
// those become the green signature; the middle six are the white chrome letters.
//
// Shared by the static lab and the melt scene. SVGLoader emits shapes in SVG
// y-down space. We stand them upright HERE in geometry (negate Y + reverse
// winding so normals stay outward), NOT with a negative mesh scale — a mirror
// scale inverts normals, which turns a chrome mirror material BLACK on its flat
// faces. So scenes render this geometry with a normal POSITIVE scale.
import { useLoader } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { SVGLoader, TessellateModifier } from "three-stdlib";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

const GREEN = new THREE.Color("#10b981");
const WHITE = new THREE.Color("#ffffff");

// Fat, ROUNDED bevel: thin Space-Grotesk strokes need a generous light-catching
// rim or chrome reads as black. More bevel segments = a smooth rounded edge that
// sweeps the strip-lights as a continuous specular highlight (the metal "gleam").
const EXTRUDE: THREE.ExtrudeGeometryOptions = {
  depth: 150,
  bevelEnabled: true,
  bevelThickness: 34,
  bevelSize: 22,
  bevelOffset: 0,
  bevelSegments: 8,
  curveSegments: 26,
};

function toNonIndexed(geo: THREE.BufferGeometry) {
  return geo.index ? geo.toNonIndexed() : geo;
}

// Stand the y-down SVG geometry upright without mirroring: negate Y on every
// vertex, then reverse each triangle's winding (swap v1/v2) so faces stay
// front-facing. Recompute normals afterwards so the chrome reflects correctly.
function flipYUpright(geo: THREE.BufferGeometry) {
  const pos = geo.getAttribute("position") as THREE.BufferAttribute;
  const arr = pos.array as Float32Array;
  for (let i = 1; i < arr.length; i += 3) arr[i] = -arr[i];
  // reverse winding on the non-indexed buffer (every 3 verts = 1 triangle)
  for (let t = 0; t < arr.length; t += 9) {
    for (let k = 0; k < 3; k++) {
      const a = t + 3 + k; // vertex 1, component k
      const b = t + 6 + k; // vertex 2, component k
      const tmp = arr[a];
      arr[a] = arr[b];
      arr[b] = tmp;
    }
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

function setVertexColor(geo: THREE.BufferGeometry, color: THREE.Color) {
  const n = geo.getAttribute("position").count;
  const arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    arr[i * 3] = color.r;
    arr[i * 3 + 1] = color.g;
    arr[i * 3 + 2] = color.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(arr, 3));
}

type RawGroups = {
  letterGeos: THREE.BufferGeometry[];
  bracketGeos: THREE.BufferGeometry[];
  center: THREE.Vector3;
  size: THREE.Vector3;
};

function buildRaw(data: { paths: { color: THREE.Color }[] }): RawGroups {
  const paths = data.paths as unknown as Array<{ color: THREE.Color }>;
  const letterGeos: THREE.BufferGeometry[] = [];
  const bracketGeos: THREE.BufferGeometry[] = [];
  const lastIndex = paths.length - 1;

  paths.forEach((path, i) => {
    const isBracket = i === 0 || i === lastIndex;
    const shapes = SVGLoader.createShapes(path as never);
    shapes.forEach((shape: THREE.Shape) => {
      const geo = flipYUpright(toNonIndexed(new THREE.ExtrudeGeometry(shape, EXTRUDE)));
      (isBracket ? bracketGeos : letterGeos).push(geo);
    });
  });

  // measure the whole wordmark so the scene can recentre + fit it
  const all = mergeGeometries([...letterGeos, ...bracketGeos], false);
  all.computeBoundingBox();
  const box = all.boundingBox!;
  const center = new THREE.Vector3();
  const size = new THREE.Vector3();
  box.getCenter(center);
  box.getSize(size);

  // recentre every part on the wordmark centre (so transforms are symmetric)
  const offset = center.clone().multiplyScalar(-1);
  [...letterGeos, ...bracketGeos].forEach((g) => g.translate(offset.x, offset.y, offset.z));

  return { letterGeos, bracketGeos, center, size };
}

export type WordmarkGeometry = {
  letters: THREE.BufferGeometry;
  brackets: THREE.BufferGeometry;
  size: THREE.Vector3;
};

/** Two clean meshes — white letters + green brackets — for the static lab. */
export function useWordmarkGeometry(src = "/brand/alqode-wordmark.svg"): WordmarkGeometry {
  const data = useLoader(SVGLoader, src);
  return useMemo(() => {
    const { letterGeos, bracketGeos, size } = buildRaw(data);
    return {
      letters: mergeGeometries(letterGeos, false),
      brackets: mergeGeometries(bracketGeos, false),
      size,
    };
  }, [data]);
}

export type MeltGeometry = {
  geometry: THREE.BufferGeometry;
  size: THREE.Vector3;
  triangles: number;
};

/**
 * One merged, vertex-coloured (green brackets / white letters), densely
 * tessellated mesh. This is the single substance that melts: a noise vertex
 * shader churns the whole body as molten chrome and resolves it to the logo.
 */
export function useMeltGeometry(src = "/brand/alqode-wordmark.svg"): MeltGeometry {
  const data = useLoader(SVGLoader, src);
  return useMemo(() => {
    const { letterGeos, bracketGeos, size } = buildRaw(data);
    letterGeos.forEach((g) => setVertexColor(g, WHITE));
    bracketGeos.forEach((g) => setVertexColor(g, GREEN));

    let merged = mergeGeometries([...letterGeos, ...bracketGeos], false);

    // densify so flat letter faces can churn smoothly (edge length in SVG units)
    const tess = new TessellateModifier(70, 8);
    merged = tess.modify(merged);
    merged.computeVertexNormals();

    const triangles = merged.getAttribute("position").count / 3;
    return { geometry: merged, size, triangles };
  }, [data]);
}
