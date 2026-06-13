"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useProgressStore } from "@/lib/store/progressStore";
import { particleVertexShader, particleFragmentShader } from "@/lib/shaders/particleShaders";

interface QuantumCoreProps {
  sceneProgress: number;
}

function createMechanicalParts() {
  return [
    { id: "ring-outer", pos: [0, 0, 0], rot: [0, 0, 0], color: "#00ffff", explode: [4, 0, 0] },
    { id: "ring-mid-1", pos: [0, 0, 0], rot: [0.785, 0, 0], color: "#00ffff", explode: [-3, 3, 2] },
    { id: "ring-mid-2", pos: [0, 0, 0], rot: [-0.785, 0, 0], color: "#00ffff", explode: [3, -3, -2] },
    { id: "cylinder-1", pos: [0, 0, 0], rot: [0, 0, 0], color: "#0088ff", explode: [0, 4, 0] },
    { id: "panel-1", pos: [0, 1.2, 0], rot: [0.3, 0.5, 0.2], color: "#00cc88", explode: [2, 5, -2] },
    { id: "panel-2", pos: [0, -1.2, 0], rot: [-0.3, -0.5, -0.2], color: "#00cc88", explode: [-2, -5, 2] },
    { id: "ring-inner", pos: [0, 0, 0], rot: [1.57, 0, 1.047], color: "#ff00ff", explode: [0, 0, -4] },
    { id: "node-1", pos: [0, 0, 1.5], rot: [0, 0, 0], color: "#ffff00", explode: [3, 2, 5] },
    { id: "node-2", pos: [0, 0, -1.5], rot: [0, 0, 0], color: "#ffff00", explode: [-3, -2, -5] },
  ];
}

function ParticleCloud({
  sceneProgress,
  particleCount,
}: {
  sceneProgress: number;
  particleCount: number;
}) {
  const particlesRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const timeRef = useRef(0);

  const geometry = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const posAss = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 1.2;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      posAss[i * 3] = x;
      posAss[i * 3 + 1] = y;
      posAss[i * 3 + 2] = z;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aPosAssembled", new THREE.BufferAttribute(posAss, 3));
    return g;
  }, [particleCount]);

  useMemo(() => {
    materialRef.current = new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms: {
        uProgress: { value: sceneProgress },
        uTime: { value: 0 },
        uNoiseScale: { value: 0.5 },
      },
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
    });
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      timeRef.current += state.clock.getDelta();
      materialRef.current.uniforms.uProgress.value = sceneProgress;
      materialRef.current.uniforms.uTime.value = timeRef.current;
    }
  });

  return materialRef.current ? (
    <points ref={particlesRef} geometry={geometry} material={materialRef.current} />
  ) : null;
}

function MechanicalHousing({ sceneProgress }: { sceneProgress: number }) {
  const partRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(() => {
    createMechanicalParts().forEach((part, idx) => {
      const mesh = partRefs.current[idx];
      if (!mesh) return;

      const dist = sceneProgress * 8;
      const v = new THREE.Vector3(...part.explode).normalize();
      mesh.position.copy(v.multiplyScalar(dist));
    });
  });

  return (
    <group>
      {createMechanicalParts().map((part, idx) => (
        <mesh
          key={part.id}
          ref={(el) => {
            partRefs.current[idx] = el;
          }}
          position={part.pos as [number, number, number]}
          rotation={part.rot as [number, number, number]}
        >
          {idx % 3 === 0 && <torusGeometry args={[3 - idx * 0.2, 0.3, 16, 100]} />}
          {idx % 3 === 1 && <cylinderGeometry args={[0.4, 0.4, 4, 16]} />}
          {idx % 3 === 2 && <boxGeometry args={[1.5, 1.5, 0.2]} />}
          <meshPhongMaterial
            color={part.color}
            emissive={part.color}
            emissiveIntensity={0.4 + sceneProgress * 0.3}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

export function QuantumCore({ sceneProgress }: QuantumCoreProps) {
  const groupRef = useRef<THREE.Group>(null);
  const deviceTier = useProgressStore((s) => s.deviceTier);

  const particleCount = {
    mobile: 10000,
    tablet: 25000,
    desktop: 50000,
    "high-end": 100000,
  }[deviceTier];

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0008;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]}>
        <icosahedronGeometry args={[1, 2]} />
        <meshPhongMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.6 + sceneProgress * 0.4}
        />
      </mesh>

      <MechanicalHousing sceneProgress={sceneProgress} />
      <ParticleCloud sceneProgress={sceneProgress} particleCount={particleCount} />

      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#00ffff" />
      <pointLight position={[-5, -5, -5]} intensity={0.6} color="#ff00ff" />
    </group>
  );
}
