import React, { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

export default function CelestialFloor({ radius = 26, yPosition = -12, opacity = 0.42 }) {
  const floorRef = useRef();
  const texture = useLoader(THREE.TextureLoader, "/images/aaa-logo-gold.png");

  useFrame((_, delta) => {
    if (floorRef.current) {
      // Rotazione lenta e continua coordinata con la volta celeste
      floorRef.current.rotation.z -= delta * 0.035;
    }
  });

  return (
    <group position={[0, yPosition, 0]}>
      {/* 1. Tappeto / Pavimento Zodiacale Dorato Astrolabio */}
      <mesh ref={floorRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[radius * 2, radius * 2]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={opacity}
          depthWrite={false}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* 2. Delicate Radial Luminous Aura underneath the Astrolabe Carpet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <ringGeometry args={[radius * 0.4, radius * 1.1, 64]} />
        <meshBasicMaterial
          color="#e5b869"
          transparent
          opacity={opacity * 0.25}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
