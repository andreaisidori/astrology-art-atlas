import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Square artwork mesh with smooth texture loading
function ArtworkSquareMesh({ url, isHovered, dominantColor }) {
  let texture = null;
  try {
    texture = useTexture(url);
  } catch (e) {
    texture = null;
  }

  return (
    <group>
      <mesh>
        <planeGeometry args={[2.4, 2.4]} />
        {texture ? (
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={isHovered ? 1.0 : 0.9}
            side={THREE.DoubleSide}
          />
        ) : (
          <meshStandardMaterial
            color={dominantColor || '#ffffff'}
            roughness={0.4}
            metalness={0.1}
            side={THREE.DoubleSide}
          />
        )}
      </mesh>

      {/* Subtle thin border line */}
      <mesh position={[0, 0, 0.01]}>
        <ringGeometry args={[1.68, 1.70, 4, 1, Math.PI / 4]} />
        <meshBasicMaterial
          color={dominantColor || '#ffffff'}
          transparent
          opacity={isHovered ? 0.9 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export default function ArtworkNode({
  artwork,
  targetPosition,
  isDimmed,
  isSelected,
  onSelect,
  magnitude = 1.0,
  showImages = false,
}) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Smooth position interpolation vector
  const currentPos = useRef(new THREE.Vector3(...(targetPosition || [0, 0, 0])));
  const targetVec = useMemo(() => new THREE.Vector3(...(targetPosition || [0, 0, 0])), [targetPosition]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    
    // Smooth lerp to target position
    currentPos.current.lerp(targetVec, Math.min(delta * 4.5, 1));
    meshRef.current.position.copy(currentPos.current);

    // Make the sprite always orient towards the origin (camera viewpoint)
    meshRef.current.lookAt(0, 0, 0);
  });

  const baseScale = magnitude * (hovered ? 1.45 : isSelected ? 1.25 : 1.0);
  const glowColor = artwork.colore_dominante || '#ffffff';

  return (
    <group ref={meshRef} position={targetPosition}>
      {/* Interactive Hit Box / Visual Container */}
      <group
        scale={baseScale}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(artwork);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Glowing Aura Frame in dominant color */}
        <mesh position={[0, 0, -0.04]}>
          <planeGeometry args={[2.7, 2.7]} />
          <meshBasicMaterial
            color={glowColor}
            transparent
            opacity={hovered ? 0.75 : isSelected ? 0.55 : isDimmed ? 0.08 : 0.28}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Square Content: Either Image Texture OR Ultra-Fast Minimalist Square Space */}
        {showImages ? (
          <React.Suspense
            fallback={
              <mesh>
                <planeGeometry args={[2.4, 2.4]} />
                <meshBasicMaterial color={glowColor} />
              </mesh>
            }
          >
            <ArtworkSquareMesh
              url={artwork.immagine}
              isHovered={hovered}
              dominantColor={glowColor}
            />
          </React.Suspense>
        ) : (
          /* Lightweight Minimalist Square Space (Sagoma Quadrata Ultra-Leggera) */
          <group>
            {/* Dark translucent square plate */}
            <mesh>
              <planeGeometry args={[2.2, 2.2]} />
              <meshBasicMaterial
                color="#0a0a14"
                transparent
                opacity={hovered ? 0.95 : 0.8}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Glowing square border */}
            <mesh position={[0, 0, 0.01]}>
              <ringGeometry args={[1.54, 1.57, 4, 1, Math.PI / 4]} />
              <meshBasicMaterial
                color={glowColor}
                transparent
                opacity={hovered ? 0.95 : 0.5}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        )}

        {/* Central Luminous Star Nucleus Dot */}
        <mesh position={[0, 0, 0.06]}>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Minimalist Hover Tooltip */}
        {hovered && (
          <Html center distanceFactor={45} position={[0, -2.2, 0]} zIndexRange={[10, 0]}>
            <div className="pointer-events-none whitespace-nowrap px-3.5 py-1.5 rounded-xl bg-black/95 backdrop-blur-md border border-white/20 text-center shadow-2xl">
              <p className="text-[11px] font-semibold text-white tracking-wide">{artwork.artista}</p>
              {artwork.date_biografiche && (
                <p className="text-[9px] font-mono text-zinc-400">{artwork.date_biografiche}</p>
              )}
              <p className="text-[9px] font-mono text-cyan-400 mt-0.5 tracking-wider uppercase">{artwork.segno}</p>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
