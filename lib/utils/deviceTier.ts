import { DeviceTier } from "@/lib/store/progressStore";

/**
 * DEVICE TIER DETECTION
 * Classifies device capabilities for optimized rendering
 */

export interface DeviceCapabilities {
  tier: DeviceTier;
  maxParticles: number;
  targetFps: number;
  enablePostProcessing: boolean;
  enableInstancedMesh: boolean;
  maxShaderComplexity: "low" | "medium" | "high";
}

export function detectDeviceTier(): DeviceCapabilities {
  if (typeof window === "undefined") {
    return {
      tier: "desktop",
      maxParticles: 50000,
      targetFps: 60,
      enablePostProcessing: true,
      enableInstancedMesh: true,
      maxShaderComplexity: "high",
    };
  }

  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const pixelCount = width * height * dpr;

  // Check WebGL capabilities (for future use)
  const canvas = document.createElement("canvas");
  canvas.getContext("webgl2");

  // Mobile: small screens, limited GPU
  if (width < 768) {
    return {
      tier: "mobile",
      maxParticles: 10000,
      targetFps: 30,
      enablePostProcessing: false,
      enableInstancedMesh: true,
      maxShaderComplexity: "low",
    };
  }

  // Tablet: medium screens
  if (width < 1024) {
    return {
      tier: "tablet",
      maxParticles: 25000,
      targetFps: 45,
      enablePostProcessing: false,
      enableInstancedMesh: true,
      maxShaderComplexity: "medium",
    };
  }

  // High-end desktop: large screens, high DPR
  if (pixelCount > 5242880 && dpr >= 2) {
    return {
      tier: "high-end",
      maxParticles: 100000,
      targetFps: 60,
      enablePostProcessing: true,
      enableInstancedMesh: true,
      maxShaderComplexity: "high",
    };
  }

  // Standard desktop
  return {
    tier: "desktop",
    maxParticles: 50000,
    targetFps: 60,
    enablePostProcessing: true,
    enableInstancedMesh: true,
    maxShaderComplexity: "high",
  };
}
