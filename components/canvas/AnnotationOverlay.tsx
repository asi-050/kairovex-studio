"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface Annotation {
  id: string;
  worldPos: THREE.Vector3;
  label: string;
  offset: "left" | "right" | "top" | "bottom";
}

const annotations: Annotation[] = [
  {
    id: "ring-outer",
    worldPos: new THREE.Vector3(3, 0, 0),
    label: "Outer Rotor Ring",
    offset: "right",
  },
  {
    id: "cylinder-main",
    worldPos: new THREE.Vector3(0, 3, 0),
    label: "Primary Axis",
    offset: "top",
  },
  {
    id: "ring-inner",
    worldPos: new THREE.Vector3(0, 0, 1),
    label: "Inner Stabilizer",
    offset: "right",
  },
  {
    id: "energy-core",
    worldPos: new THREE.Vector3(0, 0, 0),
    label: "Plasma Core",
    offset: "left",
  },
];

interface ScreenPosition {
  x: number;
  y: number;
  visible: boolean;
}

export function AnnotationOverlay() {
  const { camera, size } = useThree();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useFrame(() => {
    const positions = new Map<string, ScreenPosition>();

    annotations.forEach((annotation) => {
      const vector = annotation.worldPos.clone();
      vector.project(camera);

      const x = (vector.x * 0.5 + 0.5) * size.width;
      const y = (-(vector.y) * 0.5 + 0.5) * size.height;
      const visible = vector.z < 1;

      positions.set(annotation.id, { x, y, visible });
    });

    if (svgRef.current) {
      svgRef.current.innerHTML = "";

      annotations.forEach((annotation) => {
        const pos = positions.get(annotation.id);
        if (!pos || !pos.visible) return;

        let labelX = pos.x;
        let labelY = pos.y;
        let lineEndX = pos.x;
        let lineEndY = pos.y;

        const offsetDistance = 60;

        switch (annotation.offset) {
          case "right":
            labelX = pos.x + offsetDistance;
            lineEndX = pos.x + 15;
            break;
          case "left":
            labelX = pos.x - offsetDistance;
            lineEndX = pos.x - 15;
            break;
          case "top":
            labelY = pos.y - offsetDistance;
            lineEndY = pos.y - 15;
            break;
          case "bottom":
            labelY = pos.y + offsetDistance;
            lineEndY = pos.y + 15;
            break;
        }

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", pos.x.toString());
        line.setAttribute("y1", pos.y.toString());
        line.setAttribute("x2", lineEndX.toString());
        line.setAttribute("y2", lineEndY.toString());
        line.setAttribute("stroke", "#00ffff");
        line.setAttribute("stroke-width", "1");
        line.setAttribute("opacity", "0.6");

        svgRef.current?.appendChild(line);

        const labelKey = `label-${annotation.id}`;
        const label = containerRef.current?.querySelector(
          `[data-label="${labelKey}"]`
        ) as HTMLElement;

        if (label) {
          label.style.left = `${labelX}px`;
          label.style.top = `${labelY}px`;
          label.style.opacity = "1";
        }
      });
    }
  });

  return (
    <>
      <svg
        ref={svgRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      <div
        ref={containerRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 11,
        }}
      >
        {annotations.map((annotation) => (
          <div
            key={annotation.id}
            data-label={`label-${annotation.id}`}
            style={{
              position: "absolute",
              transform: "translate(-50%, -50%)",
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: "11px",
              color: "#00ffff",
              letterSpacing: "1px",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              textShadow: "0 0 10px #00ffff",
              opacity: 0,
              transition: "opacity 0.3s ease-out",
              pointerEvents: "none",
            }}
          >
            {annotation.label}
          </div>
        ))}
      </div>
    </>
  );
}
