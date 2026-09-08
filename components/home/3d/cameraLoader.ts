import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export const DEFAULT_CAMERA_MODEL_PATH = "/models/cinema-camera.glb";

export interface LoadedCameraModel {
  scene: THREE.Group;
  root: THREE.Object3D;
  cleanup: () => void;
}

// In-memory cache for GLTF asset to avoid duplicate network fetches
let cachedGltfScene: THREE.Group | null = null;
let loadPromise: Promise<THREE.Group | null> | null = null;

/**
 * Isolated Camera Loader Module
 * Loads a cinema camera GLTF/GLB asset and normalizes its scale, pivot, and materials.
 * 
 * If the model file is not found, empty, or fails to parse, it returns null without
 * throwing an error, allowing the Three.js spatial scene to run gracefully.
 */
export async function loadCinemaCameraModel(
  modelPath: string = DEFAULT_CAMERA_MODEL_PATH
): Promise<LoadedCameraModel | null> {
  if (typeof window === "undefined") return null;

  try {
    if (!cachedGltfScene && !loadPromise) {
      const loader = new GLTFLoader();
      loadPromise = new Promise<THREE.Group | null>((resolve) => {
        loader.load(
          modelPath,
          (gltf) => {
            if (gltf && gltf.scene) {
              cachedGltfScene = gltf.scene;
              resolve(gltf.scene);
            } else {
              resolve(null);
            }
          },
          undefined,
          () => resolve(null)
        );
      });
    }

    const sourceScene = cachedGltfScene || (await loadPromise);
    if (!sourceScene) return null;

    // Clone model for instance usage
    const modelRoot = sourceScene.clone(true);

    // 1. Calculate bounding box and center pivot
    const box = new THREE.Box3().setFromObject(modelRoot);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // If model has zero volume (empty file placeholder), return null
    if (size.lengthSq() === 0) {
      return null;
    }

    // Offset geometry to center precisely at (0, 0, 0)
    modelRoot.position.sub(center);

    // Wrapper group to preserve clean local transformations
    const pivotGroup = new THREE.Group();
    pivotGroup.name = "CinemaCameraRig";
    pivotGroup.add(modelRoot);

    // 2. Normalize base scale to exactly 1.0 unit bounding box
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      const targetScale = 1.0 / maxDim;
      pivotGroup.scale.setScalar(targetScale);
    }

    // 3. Traverse materials to optimize for dark monochromatic studio lighting
    modelRoot.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = false;
        mesh.receiveShadow = false;

        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((mat) => {
            if (mesh.name === "cilindro_low1_lambert3_0" || mat.name === "lambert3") {
              // Front optical lens glass: crystal clear with high specular reflections
              mat.transparent = true;
              mat.opacity = 0.28;
              mat.depthWrite = false;
              if ("roughness" in mat) {
                (mat as THREE.MeshStandardMaterial).roughness = 0.05;
              }
              if ("metalness" in mat) {
                (mat as THREE.MeshStandardMaterial).metalness = 0.15;
              }
              if ("envMapIntensity" in mat) {
                (mat as THREE.MeshStandardMaterial).envMapIntensity = 2.2;
              }
            } else if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
              // Deep camera body matte finish with crisp edge definition
              mat.roughness = Math.max(0.3, Math.min(0.8, mat.roughness));
              mat.metalness = Math.max(0.15, Math.min(0.85, mat.metalness));
              mat.envMapIntensity = 1.6;
            }
            mat.needsUpdate = true;
          });
        }
      }
    });

    return {
      scene: pivotGroup,
      root: modelRoot,
      cleanup: () => {
        modelRoot.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.geometry?.dispose();
            if (mesh.material) {
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach((m) => m.dispose());
              } else {
                mesh.material.dispose();
              }
            }
          }
        });
      },
    };
  } catch {
    return null;
  }
}

