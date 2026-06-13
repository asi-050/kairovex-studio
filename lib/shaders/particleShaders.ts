// Particle Vertex Shader for Quantum Core
// Transforms particles from assembled sphere to dispersed cloud on scroll

export const particleVertexShader = `
attribute vec3 aPosAssembled;
attribute vec3 aNormal;

uniform float uProgress;
uniform float uTime;
uniform float uNoiseScale;

varying vec3 vColor;
varying float vAlpha;

// Simple 3D Perlin-like noise for curl effect
float noise(vec3 p) {
  return sin(p.x * 12.9898 + p.y * 78.233 + p.z * 45.164) * 0.5 + 0.5;
}

// Curl noise approximation
vec3 curlNoise(vec3 p, float t) {
  float eps = 0.1;
  float n1 = noise(p + vec3(eps, 0.0, 0.0)) - noise(p - vec3(eps, 0.0, 0.0));
  float n2 = noise(p + vec3(0.0, eps, 0.0)) - noise(p - vec3(0.0, eps, 0.0));
  float n3 = noise(p + vec3(0.0, 0.0, eps)) - noise(p - vec3(0.0, 0.0, eps));
  
  return normalize(vec3(n1, n2, n3)) * 0.15;
}

void main() {
  // Base position in assembled sphere
  vec3 posAssembled = aPosAssembled;
  
  // Curl noise displacement
  vec3 noiseDisplacement = curlNoise(posAssembled + vec3(uTime * 0.5), uTime) * (1.0 - uProgress);
  
  // Explosion outward
  vec3 explosionDirection = normalize(posAssembled) * uProgress * 12.0;
  
  // Radial scatter (particles move outward and get disturbed)
  vec3 scatteredPos = posAssembled * (1.0 - uProgress * 0.8) + explosionDirection + noiseDisplacement;
  
  // Assemble → Scatter transition
  vec3 finalPos = mix(posAssembled, scatteredPos, uProgress);
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
  gl_PointSize = 2.0 + uProgress * 1.5;
  
  // Color gradient: cyan to plasma on disassembly
  vColor = mix(vec3(0.0, 1.0, 1.0), vec3(1.0, 0.0, 1.0), uProgress);
  
  // Fade in/out effect
  vAlpha = mix(0.8, 0.4, uProgress);
}
`;

export const particleFragmentShader = `
varying vec3 vColor;
varying float vAlpha;

void main() {
  // Create circular point with soft edges
  vec2 center = gl_PointCoord - 0.5;
  float dist = length(center);
  
  if (dist > 0.5) discard;
  
  // Soft falloff
  float alpha = vAlpha * (1.0 - dist * 2.0);
  
  // Glow effect
  vec3 glow = vColor * 1.5;
  
  gl_FragColor = vec4(glow, alpha);
}
`;
