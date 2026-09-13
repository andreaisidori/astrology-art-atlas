import React, { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

export default function CelestialFloor({ radius = 25, yPosition = -12, opacity = 0.42, isLanding = false }) {
  const monogramRef = useRef();
  const ringMatRef = useRef();
  const centerMatRef = useRef();
  const glowMatRef = useRef();
  const currentOpacity = useRef(isLanding ? 0.05 : opacity);

  const ringTexture = useLoader(THREE.TextureLoader, "/images/aaa-logo-ring.png");
  const centerTexture = useLoader(THREE.TextureLoader, "/images/aaa-logo-center.png");

  // Calibrazione: la corona zodiacale a terra è agganciata 1:1 alla volta celeste in coordinate mondo
  const SKY_ALIGN_ROT_Z = (-15 * Math.PI) / 180;

  useFrame(({ camera }, delta) => {
    // Smoothly blend in floor during landing
    if (isLanding) {
      currentOpacity.current = THREE.MathUtils.lerp(currentOpacity.current, opacity, Math.min(delta * 4.5, 1));
    } else {
      currentOpacity.current = opacity;
    }

    if (ringMatRef.current) ringMatRef.current.opacity = currentOpacity.current;
    if (centerMatRef.current) centerMatRef.current.opacity = currentOpacity.current * 1.15;
    if (glowMatRef.current) glowMatRef.current.opacity = currentOpacity.current * 0.22;

    if (monogramRef.current) {
      // 1. Direzione orizzontale di sguardo dell'osservatore (camera)
      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);

      // 2. Azimuth orizzontale
      const azimuth = Math.atan2(forward.x, -forward.z);

      // 3. Il monogramma AAA rimane sempre orientato a ore 12 di fronte all'osservatore
      monogramRef.current.rotation.z = -azimuth;
    }
  });

  return (
    <group position={[0, yPosition, 0]}>
      {/* 1. Corona Zodiacale Esterna (Agganciata al cielo / ruota con la volta celeste) */}
      <mesh
        rotation={[-Math.PI / 2, 0, SKY_ALIGN_ROT_Z]}
        scale={[-1, 1, 1]}
        position={[0, 0, 0]}
      >
        <planeGeometry args={[radius * 2, radius * 2]} />
        <meshBasicMaterial
          ref={ringMatRef}
          map={ringTexture}
          transparent
          opacity={currentOpacity.current}
          depthWrite={false}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* 2. Monogramma Centrale AAA (Puntatore fisso a ore 12 di fronte all'osservatore) */}
      <mesh
        ref={monogramRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
      >
        <planeGeometry args={[radius * 2, radius * 2]} />
        <meshBasicMaterial
          ref={centerMatRef}
          map={centerTexture}
          transparent
          opacity={currentOpacity.current * 1.15}
          depthWrite={false}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* 3. Aura Luminosa Radiale Dorata Sotto il Tappeto Astrolabio */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <ringGeometry args={[radius * 0.4, radius * 1.08, 64]} />
        <meshBasicMaterial
          ref={glowMatRef}
          color="#e5b869"
          transparent
          opacity={currentOpacity.current * 0.22}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
