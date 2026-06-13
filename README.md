# KAIROVEX STUDIO
## The Perfect Moment in 3D — Next-Generation WebGL Interactive Portfolio

### PROJECT ARCHITECTURE

A high-performance 3D interactive journey built with React Three Fiber, GSAP, and TypeScript. Every animation is driven by a unified scroll progress value (0.0 to 1.0) ensuring perfect reversibility.

---

## TECH STACK

- **Framework**: Next.js 15+ (App Router)
- **3D Rendering**: React Three Fiber + Three.js
- **Animation**: GSAP (ScrollTrigger) + Framer Motion (DOM overlays)
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Language**: TypeScript

---

## CORE ARCHITECTURE PRINCIPLES

### 1. PERFECT REVERSIBILITY
All visual states are pure functions of `progress` (0.0 to 1.0):
```typescript
// All animations evaluate like this:
const transform = easeFunction(progress) * maxValue
```

No state-based animations. No "play" methods. Everything derives from scroll position.

### 2. UNIFIED PROGRESS STORE
**File**: `lib/store/progressStore.ts`
- Single source of truth: Zustand store
- GSAP ScrollTrigger writes to store
- All components read from store
- Device tier detection included

### 3. DEVICE-AWARE RENDERING
**File**: `lib/utils/deviceTier.ts`
- Mobile: 10k particles, 30fps target
- Tablet: 25k particles, 45fps target
- Desktop: 50k particles, 60fps target
- High-end: 100k particles, 60fps target

### 4. CANVAS-FIRST ARCHITECTURE
- Fixed canvas layer (z-0)
- Scroll container on top (z-10)
- Performance monitor overlay (z-50)

---

## PROJECT STRUCTURE

```
/workspaces/kairovex-studio/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page (orchestrator)
│   └── globals.css                # Global styles
├── components/
│   └── canvas/
│       ├── Experience.tsx         # Main R3F canvas
│       └── PerformanceMonitor.tsx # FPS tracker
├── lib/
│   ├── store/
│   │   └── progressStore.ts       # Zustand store (progress + device tier)
│   └── utils/
│       └── deviceTier.ts          # Device capability detection
├── tsconfig.json                  # TypeScript config
├── next.config.js                 # Next.js config (WebGL shader loader)
├── tailwind.config.ts             # Tailwind + color tokens
├── postcss.config.js              # PostCSS
└── package.json
```

---

## SETUP INSTRUCTIONS

### 1. Install Dependencies
```bash
npm install
# or
yarn install
```

### 2. Run Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## USAGE GUIDE

### Performance Monitor
**Press `P`** to toggle the performance monitor in the top-left corner.
- FPS counter
- Frame time (milliseconds)
- Real-time diagnostics

### Adding New Scenes
Each scene should:
1. Derive all transforms from `progress` value
2. Read from `useProgressStore` hook
3. Use `useFrame` for continuous updates
4. Maintain reversibility (no state mutations during animation)

### Color Tokens
All predefined in `tailwind.config.ts`:
- **Void**: `#0a0e27` (bg-void)
- **Luxe**: Gold, Ivory, Espresso
- **Play**: Indigo, Magenta, Mint
- **Porcelain**: White, Blue
- **Flux**: Cyan, Magenta, Acid neon

---

## PERFORMANCE TARGETS

- **Target FPS**: 60 (desktop), 45 (tablet), 30 (mobile)
- **Particle Budget**: 50k (desktop), 25k (tablet), 10k (mobile)
- **Shader Complexity**: Dynamically scaled per device
- **Memory**: Optimized for sustained scrolling

---

## NEXT PHASES

1. **Scene 1: The Void & Quantum Core**
   - Mechanical core mesh with particle cloud dissolution
   - Exploded-view disassembly on scroll
   - Custom vertex shader with curl-noise displacement

2. **Scene 2: Luxe World**
   - Marble and gold luxury aesthetic
   - Cursor-driven point light illumination
   - Portfolio panel interactions

3. **Scene 3-7**: Play, Porcelain, Flux, Craft, Gate

---

## DEBUGGING

- **Canvas not rendering?** Check browser console for Three.js errors
- **Scroll not working?** Verify GSAP ScrollTrigger is registered
- **Performance issues?** Press `P` and check FPS; device tier may need adjustment

---

## GIT & VERSIONING

- Main branch: `main`
- Feature branches: `feature/scene-*`
- All changes tracked in version control

---

**Built with precision. Rendered with passion. Scroll into the perfect moment.**

KAIROVEX © 2026
