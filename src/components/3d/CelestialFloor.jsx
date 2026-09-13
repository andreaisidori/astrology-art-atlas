import React, { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

export default function CelestialFloor({ radius = 25, yPosition = -12, opacity = 0.42 }) {
  const ringRef = useRef();
  const currentRotZ = useRef(0);
  const ringTexture = useLoader(THREE.TextureLoader, "/images/aaa-logo-ring.png");
  const centerTexture = useLoader(THREE.TextureLoader, "/images/aaa-logo-center.png");

  // Calibrazione fine: allineamento perfetto a ore 12 per il segno inquadrato
  const CALIBRATION_OFFSET = -0.2618; // -15 deg per allineare esattamente Capricorno / Eclittica

  useFrame(({ camera }, delta) => {
    if (ringRef.current) {
      // 1. Calcola la direzione orizzontale in cui l'utente sta guardando con la camera
      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);

      // 2. Azimuth orizzontale (0 quando si guarda verso -Z / ore 12:00)
      const azimuth = Math.atan2(forward.x, -forward.z);

      // 3. Target rotation per la corona zodiacale:
      // La corona ruota in base alla rotazione della visuale dell'utente
      const targetRotZ = -azimuth + CALIBRATION_OFFSET;

      // 4. Interpolazione fluida per massima reattività e morbidezza visiva
      currentRotZ.current = THREE.MathUtils.lerp(
        currentRotZ.current,
        targetRotZ,
        Math.min(delta * 12, 1)
      );

      ringRef.current.rotation.z = currentRotZ.current;
    }
  });

  return (
    <group position={[0, yPosition, 0]}>
      {/* 1. Monogramma Centrale AAA Fisso (Puntatore fisso a ore 12:00) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[radius * 2, radius * 2]} />
        <meshBasicMaterial
          map={centerTexture}
          transparent
          opacity={opacity * 1.15}
          depthWrite={false}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* 2. Corona Zodiacale Esterna Dinamica (Ruota unicamente su azione dell'utente) */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[radius * 2, radius * 2]} />
        <meshBasicMaterial
          map={ringTexture}
          transparent
          opacity={opacity}
          depthWrite={false}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* 3. Aura Luminosa Radiale Dorata Sotto il Tappeto Astrolabio */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <ringGeometry args={[radius * 0.4, radius * 1.08, 64]} />
        <meshBasicMaterial
          color="#e5b869"
          transparent
          opacity={opacity * 0.22}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
