import { create } from "zustand";

/**
 * KAIROVEX PROGRESS STORE
 * Single source of truth for scroll progress (0.0 to 1.0)
 * All animations evaluate as pure functions of this value
 * Perfect reversibility guaranteed
 */

export type DeviceTier = "mobile" | "tablet" | "desktop" | "high-end";

interface ProgressStore {
  progress: number;
  setProgress: (progress: number) => void;
  deviceTier: DeviceTier;
  setDeviceTier: (tier: DeviceTier) => void;
  fps: number;
  setFps: (fps: number) => void;
}

export const useProgressStore = create<ProgressStore>((set) => ({
  progress: 0,
  setProgress: (progress: number) =>
    set({
      progress: Math.max(0, Math.min(1, progress)),
    }),
  deviceTier: "desktop",
  setDeviceTier: (tier: DeviceTier) => set({ deviceTier: tier }),
  fps: 60,
  setFps: (fps: number) => set({ fps }),
}));
