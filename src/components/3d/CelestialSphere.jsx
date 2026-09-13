import React, { useMemo } from 'react';
import * as THREE from 'three';
import { ZODIAC_SIGNS, sphericalToCartesian } from '../../utils/astronomy';
import { Html } from '@react-three/drei';
import ZodiacGlyph from '../ui/ZodiacGlyph';
import CelestialFloor from './CelestialFloor';

export default function CelestialSphere({ activeSignId, onSelectSign, sphereRadius = 48, isLanding = false }) {
  // 1. Generate lightweight, delicate background star points (800 stars)
  const { starPositions, starColors } = useMemo(() => {
    const count = 800;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = sphereRadius * (0.85 + Math.random() * 0.35);
      const height = (Math.random() - 0.5) * 36; // Balanced vertical span

      pos[i * 3] = r * Math.cos(angle);
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = r * Math.sin(angle);

      const brightness = 0.4 + Math.random() * 0.45;
      const isWarm = Math.random() > 0.85;

      col[i * 3] = isWarm ? 1.0 : brightness;
      col[i * 3 + 1] = isWarm ? 0.9 : brightness;
      col[i * 3 + 2] = isWarm ? 0.8 : brightness;
    }

    return { starPositions: pos, starColors: col };
  }, [sphereRadius]);

  // 2. Generate Horizontal Ecliptic Belt Line curve
  const eclipticPoints = useMemo(() => {
    const points = [];
    const segments = 180;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const r = sphereRadius * 0.98;
      points.push(new THREE.Vector3(r * Math.cos(angle), 0, r * Math.sin(angle)));
    }
    return points;
  }, [sphereRadius]);

  const eclipticGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(eclipticPoints);
  }, [eclipticPoints]);

  // 3. Generate circular feathered star sprite texture (delicate round stars)
  const starTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.6)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.15)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <group>
      {/* Delicate Round Starry Sky (Puntini delicati al 50% di trasparenza) */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={starPositions.length / 3}
            array={starPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={starColors.length / 3}
            array={starColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          map={starTexture}
          size={1.6}
          vertexColors
          transparent
          opacity={0.55}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Luminous Horizontal Ecliptic Guide Ring */}
      {/* @ts-ignore */}
      <line geometry={eclipticGeometry}>
        <lineBasicMaterial
          color="#4361ee"
          transparent
          opacity={0.2}
          linewidth={1}
        />
      </line>

      {/* 12 Zodiac Sign Markers: GLYPH IN ALTO (Y ~ +14), NOME LATINO IN BASSO (Y ~ -14) */}
      {ZODIAC_SIGNS.map((sign) => {
        const rad = ((sign.angle + 15) * Math.PI) / 180;
        const r = sphereRadius * 0.96;
        const x = r * Math.cos(rad);
        const z = r * Math.sin(rad);
        const isActive = activeSignId === sign.id;

        return (
          <group key={sign.id}>
            {/* 1. IN ALTO: Grande Glifo Vettoriale Bianco Puro Ingrandito */}
            <group position={[x, 14.5, z]}>
              <Html center distanceFactor={45}>
                <button
                  onClick={() => onSelectSign(sign.id)}
                  title={`${sign.latin} (${sign.name}) — Focus sulla costellazione`}
                  className={`pointer-events-auto cursor-pointer transition-all duration-300 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full backdrop-blur-md shadow-2xl ${
                    isActive
                      ? 'bg-white/30 border-2 border-white shadow-cyan-400/30 scale-125'
                      : 'bg-black/75 hover:bg-white/20 border border-white/35 hover:border-white/80 hover:scale-110'
                  }`}
                  style={{ borderColor: isActive ? sign.color : undefined }}
                >
                  <ZodiacGlyph
                    sign={sign.id}
                    className="w-7 h-7 md:w-8 md:h-8 text-white drop-shadow-xl"
                    color="#ffffff"
                    strokeWidth={1.8}
                  />
                </button>
              </Html>
            </group>

            {/* 2. IN BASSO: Nome Latino Ingrandito, Pulito e Arioso */}
            <group position={[x, -14, z]}>
              <Html center distanceFactor={45}>
                <button
                  onClick={() => onSelectSign(sign.id)}
                  title={`${sign.latin} — Focus sulla costellazione`}
                  className={`pointer-events-auto cursor-pointer transition-all duration-300 flex items-center justify-center px-5 py-2 rounded-2xl backdrop-blur-md border shadow-2xl ${
                    isActive
                      ? 'bg-white/30 text-white border-white shadow-cyan-400/30 scale-120'
                      : 'bg-black/80 hover:bg-black/95 text-white/90 hover:text-white border-white/35 hover:border-white/80 hover:scale-105'
                  }`}
                  style={{ borderColor: isActive ? sign.color : undefined }}
                >
                  <span className="font-serif text-sm md:text-base tracking-[0.25em] uppercase text-white font-medium drop-shadow-lg select-none">
                    {sign.latin}
                  </span>
                </button>
              </Html>
            </group>
          </group>
        );
      })}
      {/* 3. Celestial Astrolabe Floor (Pavimento / Tappeto Zodiacale Dorato Rotante) */}
      <CelestialFloor radius={25} yPosition={-12} opacity={0.4} isLanding={isLanding} />
    </group>
  );
}
