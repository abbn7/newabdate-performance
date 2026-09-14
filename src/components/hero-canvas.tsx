"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import type * as THREE from "three";

function GlassTorus({ active, lowPower }: { active: boolean; lowPower: boolean }) {
  const mesh = useRef<THREE.Mesh>(null!);
  const group = useRef<THREE.Group>(null!);
  const elapsed = useRef(0);
  useFrame((_, delta) => {
    if (!active || !mesh.current || !group.current) return;
    // A resumed tab must not apply minutes of elapsed time in one frame.
    const step = Math.min(delta, 0.06);
    elapsed.current += step;
    mesh.current.rotation.x += step * 0.18;
    mesh.current.rotation.y += step * 0.22;
    const t = elapsed.current * 1.1;
    group.current.position.y = Math.sin(t) * 0.11;
    group.current.rotation.x = Math.cos(t / 4) * 0.05;
    group.current.rotation.y = Math.sin(t / 4) * 0.05;
    group.current.rotation.z = Math.sin(t / 4) * 0.05;
  });
  return (
    <group ref={group}>
      <mesh ref={mesh} scale={1.15}>
        <torusKnotGeometry args={[1, 0.32, lowPower ? 96 : 128, lowPower ? 16 : 20]} />
        <meshPhysicalMaterial
          transmission={1}
          thickness={1.4}
          roughness={0.15}
          metalness={0}
          ior={1.3}
          clearcoat={1}
          clearcoatRoughness={0.1}
          attenuationDistance={2}
          attenuationColor="#ffffff"
          transparent
        />
      </mesh>
    </group>
  );
}

// One bounded invalidation per interval; Fiber owns the only rendering rAF.
// Visibility and viewport changes cancel scheduling completely.
function DemandDriver({ active, fps }: { active: boolean; fps: number }) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let timer = 0;
    let scrolling = false;
    let constrainedUntil = 0;
    const stop = () => {
      window.clearTimeout(timer);
    };
    const tick = () => {
      if (!active || document.hidden || media.matches || scrolling) return;
      invalidate();
      const effectiveFps = performance.now() < constrainedUntil ? Math.max(12, fps / 2) : fps;
      timer = window.setTimeout(tick, 1000 / effectiveFps);
    };
    const sync = () => {
      stop();
      if (!active || document.hidden) return;
      invalidate();
      if (!media.matches) timer = window.setTimeout(tick, 1000 / fps);
    };
    const longTasks = typeof PerformanceObserver === "undefined"
      ? null
      : new PerformanceObserver((entries) => {
          if (entries.getEntries().length) constrainedUntil = performance.now() + 2500;
        });
    try {
      longTasks?.observe({ type: "longtask", buffered: false });
    } catch {
      longTasks?.disconnect();
    }
    const onScrollStart = () => {
      scrolling = true;
      window.clearTimeout(timer);
    };
    const onScrollEnd = () => {
      scrolling = false;
      sync();
    };
    sync();
    window.addEventListener("portfolio:scroll-start", onScrollStart);
    window.addEventListener("portfolio:scroll-end", onScrollEnd);
    document.addEventListener("visibilitychange", sync);
    media.addEventListener("change", sync);
    return () => {
      stop();
      window.removeEventListener("portfolio:scroll-start", onScrollStart);
      window.removeEventListener("portfolio:scroll-end", onScrollEnd);
      document.removeEventListener("visibilitychange", sync);
      media.removeEventListener("change", sync);
      longTasks?.disconnect();
    };
  }, [active, fps, invalidate]);
  return null;
}

export default function HeroCanvas({ active = true }: { active?: boolean }) {
  const lowPower = useMemo(() => {
    if (typeof navigator === "undefined") return true;
    return matchMedia("(pointer: coarse)").matches || (navigator.hardwareConcurrency ?? 4) <= 4;
  }, []);
  return (
    <Canvas
      dpr={lowPower ? 0.85 : 1}
      frameloop="demand"
      gl={{
        antialias: !lowPower,
        alpha: true,
        stencil: false,
        depth: true,
        powerPreference: "low-power",
        precision: lowPower ? "mediump" : "highp",
      }}
      onCreated={({ gl, events }) => {
        // Transmission stays enabled; only its internal offscreen buffer is smaller.
        gl.transmissionResolutionScale = lowPower ? 0.35 : 0.55;
        events.disconnect?.();
      }}
      camera={{ position: [0, 0, 4.5], fov: 38 }}
      resize={{ scroll: false, debounce: { scroll: 0, resize: 150 } }}
      fallback={<div className="hero-canvas-fallback" />}
    >
      <DemandDriver active={active} fps={lowPower ? 20 : 24} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} color="#7d6cff" />
      <directionalLight position={[-4, -2, 3]} intensity={1} color="#5fc8e8" />
      <directionalLight position={[0, -3, -4]} intensity={0.6} color="#e89cd8" />
      <GlassTorus active={active} lowPower={lowPower} />
    </Canvas>
  );
}
