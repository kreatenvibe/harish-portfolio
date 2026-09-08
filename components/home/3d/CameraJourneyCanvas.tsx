"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { loadCinemaCameraModel, LoadedCameraModel } from "./cameraLoader";
import { prefersReducedMotion } from "@/lib/motion";

interface CameraJourneyCanvasProps {
  modelPath?: string;
}

/**
 * CAMERA JOURNEY STORYBOARD — 7 STAGES:
 * 1. HERO: Camera = huge, right close-up foreground anchor
 * 2. FILM STRIP: Camera = smaller, left margin projector observing cards
 * 3. WORK UNIVERSE: Camera = subtle move/rotate, right studio observer
 * 4. IDENTITY: Camera = atmospheric movement, left float with gentle tilt
 * 5. CAREER: Camera = slow mechanical rotation/wobble along timeline
 * 6. TECHNICAL: Camera = restrained compositing layer inspection
 * 7. FINAL: Camera = settles in bottom right alongside direct channels
 */

interface WaypointKeyframe {
  t: number; // Normalized scroll position (0.0 to 1.0)
  pos: THREE.Vector3;
  rot: THREE.Euler;
  scale: number;
}

const WAYPOINTS: WaypointKeyframe[] = [
  // 1. HERO (Huge foreground anchor - scale 2.80)
  {
    t: 0.0,
    pos: new THREE.Vector3(1.38, -0.22, 2.30),
    rot: new THREE.Euler(0.04, -0.24, 0.02),
    scale: 2.80,
  },
  // 1b. HERO HOLD
  {
    t: 0.07,
    pos: new THREE.Vector3(1.38, -0.22, 2.30),
    rot: new THREE.Euler(0.04, -0.24, 0.02),
    scale: 2.80,
  },
  // 2. FILM STRIP (Prominent left margin projector - scale 1.45)
  {
    t: 0.22,
    pos: new THREE.Vector3(-1.95, -0.34, 1.20),
    rot: new THREE.Euler(0.06, 0.52, -0.03),
    scale: 1.45,
  },
  // 2b. FILM STRIP TRACK
  {
    t: 0.28,
    pos: new THREE.Vector3(-1.85, -0.30, 1.20),
    rot: new THREE.Euler(0.06, 0.50, -0.03),
    scale: 1.45,
  },
  // 3. WORK UNIVERSE (Large studio observer - scale 1.35)
  {
    t: 0.42,
    pos: new THREE.Vector3(1.85, 0.08, 1.05),
    rot: new THREE.Euler(-0.08, -0.42, 0.04),
    scale: 1.35,
  },
  // 4. IDENTITY (Atmospheric float - scale 1.20)
  {
    t: 0.58,
    pos: new THREE.Vector3(-1.75, 0.05, 0.95),
    rot: new THREE.Euler(0.10, 0.36, -0.05),
    scale: 1.20,
  },
  // 5. CAREER (Slow mechanical rotation / wobble - scale 1.15)
  {
    t: 0.72,
    pos: new THREE.Vector3(1.70, -0.22, 0.88),
    rot: new THREE.Euler(0.05, -0.38, 0.03),
    scale: 1.15,
  },
  // 6. TECHNICAL (Restrained inspection - scale 1.05)
  {
    t: 0.85,
    pos: new THREE.Vector3(-1.60, -0.15, 0.80),
    rot: new THREE.Euler(0.16, 0.28, -0.02),
    scale: 1.05,
  },
  // 7. FINAL (Settles bottom right - scale 1.20)
  {
    t: 1.0,
    pos: new THREE.Vector3(1.55, -0.42, 0.95),
    rot: new THREE.Euler(-0.05, -0.20, 0.01),
    scale: 1.20,
  },
];

/**
 * Quintic smoothstep curve for fluid cinematic interpolation
 */
function smoothTransition(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped * clamped * clamped * (clamped * (clamped * 6 - 15) + 10);
}

/**
 * Continuous multi-waypoint interpolation across all 7 stages
 */
function evaluateCameraTrajectory(
  progress: number,
  isTablet: boolean,
  isMobile: boolean
) {
  const clampedProgress = Math.max(0, Math.min(1, progress));

  // Find surrounding waypoint segment
  let i = 0;
  while (i < WAYPOINTS.length - 1 && WAYPOINTS[i + 1].t < clampedProgress) {
    i++;
  }
  const w1 = WAYPOINTS[i];
  const w2 = WAYPOINTS[Math.min(i + 1, WAYPOINTS.length - 1)];

  const segDuration = w2.t - w1.t;
  const rawT = segDuration > 0 ? (clampedProgress - w1.t) / segDuration : 0;
  const smooth = smoothTransition(rawT);

  // Interpolate Position
  const pos = new THREE.Vector3().lerpVectors(w1.pos, w2.pos, smooth);

  // Interpolate Rotation (Euler angles)
  const rot = new THREE.Euler(
    THREE.MathUtils.lerp(w1.rot.x, w2.rot.x, smooth),
    THREE.MathUtils.lerp(w1.rot.y, w2.rot.y, smooth),
    THREE.MathUtils.lerp(w1.rot.z, w2.rot.z, smooth)
  );

  // Interpolate Scale
  let scale = THREE.MathUtils.lerp(w1.scale, w2.scale, smooth);

  // Viewport Responsive Tuning
  if (isTablet) {
    pos.x *= 0.78;
    pos.y *= 0.88;
    scale *= 0.80;
  } else if (isMobile) {
    pos.x *= 0.45;
    pos.y = THREE.MathUtils.lerp(-0.48, -0.36, smooth);
    pos.z = THREE.MathUtils.lerp(1.60, 0.95, smooth);
    scale = THREE.MathUtils.lerp(1.45, 0.75, smooth);
  }

  return { pos, rot, scale, segmentIndex: i };
}

export function CameraJourneyCanvas({ modelPath }: CameraJourneyCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !canvasRef.current || !containerRef.current) return;

    const isReduced = prefersReducedMotion();
    gsap.registerPlugin(ScrollTrigger);

    let isDestroyed = false;
    let animationFrameId: number;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;

    // 1. Scene & Depth Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0b, 0.04);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0, 5);

    // 2. WebGL Renderer with Transparent Alpha Backbuffer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: !isMobile,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);
    renderer.setClearAlpha(0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    // 3. Monochromatic Studio Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1c1c1f, 2.8);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xf2f1ed, 4.4);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x9c9992, 3.0);
    rimLight.position.set(-6, -1, -4);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x44444a, 1.5);
    fillLight.position.set(0, -3, 4);
    scene.add(fillLight);

    // 4. PERSISTENT 3D CAMERA RIG (Single instance throughout the entire journey)
    const cameraRig = new THREE.Group();
    cameraRig.name = "PersistentCinemaCameraRig";
    scene.add(cameraRig);

    // Initial transform matches Waypoint 1 (Hero)
    const initialTransform = evaluateCameraTrajectory(0, isTablet, isMobile);
    cameraRig.position.copy(initialTransform.pos);
    cameraRig.rotation.copy(initialTransform.rot);
    cameraRig.scale.setScalar(initialTransform.scale);

    // 5. Load Real Cinema Camera 3D Asset
    let loadedCameraData: LoadedCameraModel | null = null;

    loadCinemaCameraModel(modelPath).then((loaded) => {
      if (isDestroyed || !loaded) return;
      loadedCameraData = loaded;
      cameraRig.add(loaded.scene);
    });

    // 6. Scroll Tracking & Controller State
    const scrollState = {
      progress: 0,
      currentPos: initialTransform.pos.clone(),
      currentRot: new THREE.Euler().copy(initialTransform.rot),
      currentScale: initialTransform.scale,
    };

    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: isReduced ? false : 0.8,
      onUpdate: (self) => {
        scrollState.progress = self.progress;
      },
    });

    // 7. Motion & Render Loop (Continuous physical interpolation)
    let lastTime = performance.now();
    let totalElapsed = 0;
    let isPaused = false;

    const animate = () => {
      if (isDestroyed) return;

      const now = performance.now();
      const delta = (now - lastTime) * 0.001;
      lastTime = now;

      if (!isPaused) {
        totalElapsed += delta;
      }

      if (!isReduced && !isMobile) {
        // Target transform along full 7-stage camera trajectory
        const target = evaluateCameraTrajectory(
          scrollState.progress,
          isTablet,
          isMobile
        );

        // Section-specific harmonic dynamics:
        // Career (~0.65-0.78): slow mechanical rotation/wobble
        // Identity (~0.50-0.65): atmospheric floating drift
        // Final (>0.90): settles cleanly
        const p = scrollState.progress;
        let breathAmpY = 0.008;
        let breathAmpRot = 0.003;

        if (p >= 0.65 && p <= 0.78) {
          // Career: Slow rotation / wobble
          breathAmpRot = 0.012;
          breathAmpY = 0.006;
        } else if (p >= 0.50 && p < 0.65) {
          // Identity: Atmospheric float
          breathAmpY = 0.014;
          breathAmpRot = 0.005;
        } else if (p >= 0.80 && p < 0.90) {
          // Technical: Restrained movement
          breathAmpY = 0.003;
          breathAmpRot = 0.002;
        } else if (p >= 0.90) {
          // Final: Settled
          breathAmpY = 0.002;
          breathAmpRot = 0.001;
        }

        const floatY = Math.sin(totalElapsed * 0.45) * breathAmpY;
        const floatRotX = Math.cos(totalElapsed * 0.35) * breathAmpRot;
        const floatRotY = Math.sin(totalElapsed * 0.40) * (breathAmpRot * 1.2);

        // Smooth cinematic inertia interpolation (damping factor 0.055)
        scrollState.currentPos.lerp(target.pos, 0.055);
        cameraRig.position.set(
          scrollState.currentPos.x,
          scrollState.currentPos.y + floatY,
          scrollState.currentPos.z
        );

        cameraRig.rotation.x = THREE.MathUtils.lerp(
          cameraRig.rotation.x,
          target.rot.x + floatRotX,
          0.055
        );
        cameraRig.rotation.y = THREE.MathUtils.lerp(
          cameraRig.rotation.y,
          target.rot.y + floatRotY,
          0.055
        );
        cameraRig.rotation.z = THREE.MathUtils.lerp(
          cameraRig.rotation.z,
          target.rot.z,
          0.055
        );

        scrollState.currentScale = THREE.MathUtils.lerp(
          scrollState.currentScale,
          target.scale,
          0.055
        );
        cameraRig.scale.setScalar(scrollState.currentScale);
      } else if (isMobile) {
        const target = evaluateCameraTrajectory(
          scrollState.progress,
          isTablet,
          isMobile
        );
        const floatY = Math.sin(totalElapsed * 0.45) * 0.005;
        cameraRig.position.set(target.pos.x, target.pos.y + floatY, target.pos.z);
        cameraRig.rotation.copy(target.rot);
        cameraRig.scale.setScalar(target.scale);
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 8. Resize Handling
    const handleResize = () => {
      if (!renderer || !camera) return;
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, newWidth < 768 ? 1.5 : 2));
    };

    window.addEventListener("resize", handleResize);

    // 9. Pause Loop When Tab Inactive
    const handleVisibilityChange = () => {
      isPaused = document.hidden;
      lastTime = performance.now();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 10. Cleanup & Disposal
    return () => {
      isDestroyed = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      scrollTriggerInstance.kill();

      if (loadedCameraData) {
        loadedCameraData.cleanup();
      }

      scene.clear();
      renderer.dispose();
    };
  }, [modelPath]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[30] overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full opacity-100 transition-opacity duration-700"
      />
    </div>
  );
}
