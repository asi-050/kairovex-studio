"use client";

import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { useProgressStore } from "@/lib/store/progressStore";
import { QuantumCore } from "@/components/canvas/scenes/QuantumCore";
import { AnnotationOverlay } from "@/components/canvas/AnnotationOverlay";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * EXPERIENCE COMPONENT
 * Main React Three Fiber canvas with scroll-driven animation system
 * All transformations driven by progress (0.0 to 1.0) for perfect reversibility
 */

const SCENE_RANGES = {
  quantumCore: { start: 0.0, end: 0.2 },
  luxeWorld: { start: 0.2, end: 0.35 },
  playWorld: { start: 0.35, end: 0.5 },
  porcelainWorld: { start: 0.5, end: 0.65 },
  fluxWorld: { start: 0.65, end: 0.8 },
  theCraft: { start: 0.8, end: 0.9 },
  theGate: { start: 0.9, end: 1.0 },
};

function getLocalProgress(globalProgress: number, start: number, end: number): number {
  if (globalProgress < start) return 0;
  if (globalProgress > end) return 1;
  return (globalProgress - start) / (end - start);
}

function SceneContent() {
  const progress = useProgressStore((state) => state.progress);

  return (
    <group>
      {progress >= SCENE_RANGES.quantumCore.start && progress <= SCENE_RANGES.quantumCore.end && (
        <QuantumCore
          sceneProgress={getLocalProgress(
            progress,
            SCENE_RANGES.quantumCore.start,
            SCENE_RANGES.quantumCore.end
          )}
        />
      )}
    </group>
  );
}

function ScrollController() {
  const setProgress = useProgressStore((state) => state.setProgress);
  const setDeviceTier = useProgressStore((state) => state.setDeviceTier);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth;
      if (width < 768) setDeviceTier("mobile");
      else if (width < 1024) setDeviceTier("tablet");
      else setDeviceTier("desktop");
    };

    detectDevice();
    window.addEventListener("resize", detectDevice);

    return () => window.removeEventListener("resize", detectDevice);
  }, [setDeviceTier]);

  useEffect(() => {
    const scrollTrigger = ScrollTrigger.create({
      onUpdate: (self) => {
        const scrollProgress = self.progress;
        setProgress(scrollProgress);
      },
    });

    return () => {
      scrollTrigger.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [setProgress]);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-x-hidden">
      <div className="relative w-full">
        <section className="relative w-full h-screen flex items-center justify-center bg-void">
          <div className="text-center pointer-events-none">
            <h1 className="text-serif-title text-plasma mb-4">THE VOID</h1>
            <p className="text-mono-sm text-luxe-gold">Mechanical Symphony Awaits</p>
          </div>
        </section>

        <section className="relative w-full h-screen bg-luxe-espresso border-b border-luxe-gold/20 flex items-center justify-center">
          <div className="text-center pointer-events-none">
            <h2 className="text-serif-heading text-luxe-ivory mb-2">LUXE</h2>
            <p className="text-mono-sm text-luxe-gold">Premium. Minimal. Luminous.</p>
          </div>
        </section>

        <section className="relative w-full h-screen bg-play-indigo border-b border-play-magenta/20 flex items-center justify-center">
          <div className="text-center pointer-events-none">
            <h2 className="text-serif-heading text-play-mint mb-2">PLAY</h2>
            <p className="text-mono-sm text-play-magenta">Vibrant. Interactive. Alive.</p>
          </div>
        </section>

        <section className="relative w-full h-screen bg-porcelain-white border-b border-porcelain-blue/20 flex items-center justify-center">
          <div className="text-center pointer-events-none">
            <h2 className="text-serif-heading text-porcelain-blue mb-2">PORCELAIN</h2>
            <p className="text-mono-sm text-porcelain-blue">Fluid. Artistic. Crystalline.</p>
          </div>
        </section>

        <section className="relative w-full h-screen bg-void border-b border-flux-cyan/20 flex items-center justify-center">
          <div className="text-center pointer-events-none">
            <h2 className="text-serif-heading text-flux-cyan mb-2">FLUX</h2>
            <p className="text-mono-sm text-flux-acid">Terminal. Glitch. Encrypted.</p>
          </div>
        </section>

        <section className="relative w-full h-screen bg-void border-b border-flux-cyan/20 flex items-center justify-center">
          <div className="text-center pointer-events-none">
            <h2 className="text-serif-heading text-luxe-ivory mb-2">THE CRAFT</h2>
            <p className="text-mono-sm text-luxe-gold">SIGNAL • WORLD • BEYOND</p>
          </div>
        </section>

        <section className="relative w-full h-screen bg-void flex items-center justify-center">
          <div className="text-center pointer-events-none">
            <h2 className="text-serif-heading text-plasma mb-2">THE GATE</h2>
            <p className="text-mono-sm text-flux-cyan">Unlock the Ritual</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export function Experience() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-screen z-0">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45, near: 0.1, far: 1000 }}
          gl={{
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: false,
            powerPreference: "high-performance",
          }}
          performance={{ min: 0.5 }}
        >
          <SceneContent />
          <PerspectiveCamera makeDefault position={[0, 0, 8]} />
          <AnnotationOverlay />
        </Canvas>
      </div>

      <div className="relative z-10 w-full h-screen">
        <ScrollController />
      </div>
    </div>
  );
}
