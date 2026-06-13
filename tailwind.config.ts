import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Void & Quantum Core
        void: "#0a0e27",
        plasma: "#00ffff",

        // Luxe World
        luxe: {
          espresso: "#1a1410",
          ivory: "#f5f1ed",
          gold: "#d4af37",
        },

        // Play World
        play: {
          indigo: "#5a2d8a",
          magenta: "#ff006e",
          mint: "#00ff88",
        },

        // Porcelain World
        porcelain: {
          white: "#fafaf8",
          blue: "#2c3e50",
        },

        // Flux World
        flux: {
          cyan: "#00ffff",
          magenta: "#ff00ff",
          acid: "#ccff00",
        },
      },
      fontFamily: {
        serif: ["Georgia", "serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      animation: {
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
