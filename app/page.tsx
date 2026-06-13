"use client";

import dynamic from "next/dynamic";
import { PerformanceMonitor } from "@/components/canvas/PerformanceMonitor";

// Dynamically import canvas component to avoid SSR issues
const Experience = dynamic(
  () => import("@/components/canvas/Experience").then((mod) => ({ default: mod.Experience })),
  {
    ssr: false,
    loading: () => <div className="w-full h-screen bg-void flex items-center justify-center text-mono-sm text-flux-cyan">Initializing quantum realm...</div>,
  }
);

export default function Home() {
  return (
    <main className="w-full h-screen overflow-hidden">
      <Experience />
      <PerformanceMonitor />
    </main>
  );
}
