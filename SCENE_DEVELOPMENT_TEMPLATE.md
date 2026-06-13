# SCENE DEVELOPMENT TEMPLATE

## Quick Reference for Building New Scenes

### Template: New Scene Component

```typescript
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useProgressStore } from "@/lib/store/progressStore";

/**
 * SCENE: [Name]
 * Scroll Range: [X] to [Y]
 * Description: [Visual description]
 */

interface SceneProps {
  sceneProgress: number; // Local progress within this scene (0-1)
}

export function [SceneName]({ sceneProgress }: SceneProps) {
  const meshRef = useRef<THREE.Group>(null);
  const deviceTier = useProgressStore((s) => s.deviceTier);

  // Compute all transforms as pure functions of sceneProgress
  const rotation = sceneProgress * Math.PI * 2;
  const position = sceneProgress * 10;
  const scale = 1 + sceneProgress * 0.5;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z = rotation;
      meshRef.current.position.y = position;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={meshRef}>
      {/* Your geometry here */}
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhongMaterial color="#00ffff" />
      </mesh>
    </group>
  );
}
```

---

## Integration Pattern

### In Experience.tsx

```typescript
// Add to SceneContent component:

function SceneContent() {
  const progress = useProgressStore((state) => state.progress);

  // Define scene ranges
  const scene1Range = { start: 0.0, end: 0.15 };
  const scene2Range = { start: 0.15, end: 0.35 };

  // Calculate local progress (0-1) within each scene
  const getLocalProgress = (start: number, end: number) => {
    if (progress < start) return 0;
    if (progress > end) return 1;
    return (progress - start) / (end - start);
  };

  return (
    <group>
      {progress >= scene1Range.start && progress <= scene1Range.end && (
        <QuantumCore sceneProgress={getLocalProgress(scene1Range.start, scene1Range.end)} />
      )}

      {progress >= scene2Range.start && progress <= scene2Range.end && (
        <LuxeWorld sceneProgress={getLocalProgress(scene2Range.start, scene2Range.end)} />
      )}

      {/* More scenes... */}
    </group>
  );
}
```

---

## Key Patterns

### 1. Device-Aware Rendering

```typescript
const maxParticles = deviceTier === "mobile" ? 10000 : 50000;

// Or use the full capabilities object:
const capabilities = detectDeviceTier();

if (capabilities.enablePostProcessing) {
  // Add bloom, glow, etc.
}
```

### 2. Particle Cloud Pattern

```typescript
useFrame(() => {
  const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

  // Update particle positions based on progress
  for (let i = 0; i < positions.length; i += 3) {
    const baseX = initialPositions[i];
    const baseY = initialPositions[i + 1];
    const baseZ = initialPositions[i + 2];

    // Apply curl noise displacement
    const noise = Simplex3D(baseX, baseY, baseZ, sceneProgress);

    positions[i] = baseX + noise * sceneProgress * 5;
    positions[i + 1] = baseY + noise * sceneProgress * 5;
    positions[i + 2] = baseZ + noise * sceneProgress * 5;
  }

  particlesRef.current.geometry.attributes.position.needsUpdate = true;
});
```

### 3. Exploded-View Geometry

```typescript
const parts = [
  { geometry, position: [5, 5, 0], rotationAxis: [1, 0, 0] },
  { geometry, position: [-5, 5, 0], rotationAxis: [0, 1, 0] },
  { geometry, position: [0, -5, 0], rotationAxis: [0, 0, 1] },
];

parts.forEach((part, idx) => {
  const progress3D = new THREE.Vector3(...part.position).normalize();
  const distance = sceneProgress * 15;

  mesh.position.copy(progress3D.multiplyScalar(distance));
});
```

### 4. Shader-Based Transforms

```glsl
uniform float uProgress;
uniform vec3 uExplodeDirection;
uniform float uNoiseScale;

vec4 position_exploded = vec4(position + uExplodeDirection * uProgress * 10.0, 1.0);

float noise = sin(position.x * uNoiseScale + uProgress * 10.0) * 0.5;
vec4 position_final = position_exploded + vec4(vec3(noise), 0.0);

gl_Position = projectionMatrix * modelViewMatrix * position_final;
```

---

## Color & Material Guidelines

### Glass/Transparent Materials
```typescript
<meshPhongMaterial
  color="#00ffff"
  transparent
  opacity={0.5}
  emissive="#00ffff"
  emissiveIntensity={0.3}
  wireframe={false}
/>
```

### Metallic/Reflective
```typescript
<meshStandardMaterial
  color="#d4af37"
  metalness={0.9}
  roughness={0.1}
  emissive="#d4af37"
  emissiveIntensity={0.2}
/>
```

### Neon/Glow
```typescript
<meshBasicMaterial
  color="#ff00ff"
  emissive="#ff00ff"
  emissiveIntensity={1.0}
  wireframe={true}
/>
```

---

## Cursor Interaction Pattern

```typescript
const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    setMousePos({
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
    });
  };

  window.addEventListener("mousemove", handleMouseMove);
  return () => window.removeEventListener("mousemove", handleMouseMove);
}, []);

useFrame(() => {
  // Use mousePos to drive lighting, particle attraction, etc.
  lightRef.current.position.x = mousePos.x * 20;
  lightRef.current.position.y = mousePos.y * 20;
});
```

---

## Performance Optimization Checklist

- [ ] Using InstancedMesh for repeated geometry?
- [ ] Baking static lighting (avoid runtime shadows)?
- [ ] LOD (Level of Detail) for far objects?
- [ ] Frustum culling for off-screen geometry?
- [ ] Texture atlasing to reduce draw calls?
- [ ] Shader complexity appropriate for device tier?
- [ ] Particle count within device budget?
- [ ] No memory leaks (cleanup in useEffect)?
- [ ] Frame rate target achieved (60fps desktop, 45fps tablet, 30fps mobile)?

---

## Testing Your Scene

### 1. Visual Verification
```bash
npm run dev
# Scroll slowly through your scene
# Check that all transforms are smooth and reversible
# Press P to verify FPS
```

### 2. Reversibility Test
- Scroll forward through the scene
- Scroll backward to the start
- **All state must be identical** at any progress value

### 3. Device Testing
- Test on mobile (reduce particles if needed)
- Test on tablet (medium complexity)
- Test on high-end desktop (enable all features)

### 4. Performance Profiling
- Chrome DevTools > Performance tab
- Record during scroll
- Target: <16.67ms per frame (60fps)

---

## Common Pitfalls

❌ **Don't**: Use `setInterval()` or `setTimeout()` for animations
✅ **Do**: Drive everything from `sceneProgress`

❌ **Don't**: Mutate state during animation
✅ **Do**: Calculate all values as pure functions

❌ **Don't**: Create geometries inside `useFrame()`
✅ **Do**: Create geometries in component body, update positions in `useFrame()`

❌ **Don't**: Ignore device tier capabilities
✅ **Do**: Check `deviceTier` before adding expensive effects

---

## Scene Completion Checklist

- [ ] Component exported and typed
- [ ] Integrated into Experience.tsx with scene range
- [ ] Scroll progress drives all transforms (perfect reversibility)
- [ ] Tested on desktop, tablet, mobile
- [ ] FPS stable at target (60/45/30)
- [ ] No console warnings/errors
- [ ] Shader complexity matches device tier
- [ ] Particle count within budget
- [ ] Materials use correct colors from tailwind tokens
- [ ] Documentation updated

---

**Ready to build?** Create a new file in `components/canvas/scenes/` and use this template!
