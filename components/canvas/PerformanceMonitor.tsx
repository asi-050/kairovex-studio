"use client";

import { useEffect, useRef } from "react";
import { useProgressStore } from "@/lib/store/progressStore";

/**
 * PERFORMANCE MONITOR
 * Real-time FPS tracker and frame timing diagnostics
 * Displays performance metrics in top-left corner
 */

interface FrameMetrics {
  fps: number;
  frameTime: number;
  gpuTime?: number;
}

export function PerformanceMonitor() {
  const setFps = useProgressStore((state) => state.setFps);
  const metricsRef = useRef<FrameMetrics>({
    fps: 60,
    frameTime: 0,
  });
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const showRef = useRef(false);

  useEffect(() => {
    // Toggle with 'P' key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "p" || e.key === "P") {
        showRef.current = !showRef.current;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const measure = () => {
      const now = performance.now();
      const deltaTime = now - lastTimeRef.current;
      lastTimeRef.current = now;

      frameCountRef.current++;

      // Calculate FPS every 500ms
      if (deltaTime > 500) {
        const fps = Math.round((frameCountRef.current / deltaTime) * 1000);
        metricsRef.current.fps = fps;
        metricsRef.current.frameTime = deltaTime / frameCountRef.current;
        setFps(fps);
        frameCountRef.current = 0;
      }

      animationFrameId = requestAnimationFrame(measure);
    };

    animationFrameId = requestAnimationFrame(measure);

    return () => cancelAnimationFrame(animationFrameId);
  }, [setFps]);

  if (!showRef.current) return null;

  return (
    <div className="fixed top-4 left-4 z-50 glass rounded-lg p-3 font-mono text-xs text-flux-cyan pointer-events-none">
      <div className="space-y-1">
        <div>FPS: {metricsRef.current.fps}</div>
        <div>Frame: {metricsRef.current.frameTime.toFixed(2)}ms</div>
        <div className="text-flux-acid text-[10px] mt-2">press P to toggle</div>
      </div>
    </div>
  );
}
