import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// Global texture cache to prevent re-fetching and ensure instant texture reuse
const textureCache = new Map();
const textureLoader = new THREE.TextureLoader();

// Square artwork mesh with robust asynchronous texture loading
function ArtworkSquareMesh({ url, isHovered, dominantColor }) {
  const [texture, setTexture] = useState(() => {
    if (!url) return null;
    return textureCache.get(url) || null;
  });

  useEffect(() => {
    if (!url) return;
    if (textureCache.has(url)) {
      setTexture(textureCache.get(url));
      return;
    }

    let isMounted = true;
    textureLoader.load(
      url,
      (loadedTex) => {
        if (!isMounted) return;
        loadedTex.colorSpace = THREE.SRGBColorSpace;
        loadedTex.generateMipmaps = true;
        loadedTex.minFilter = THREE.LinearMipmapLinearFilter;
        textureCache.set(url, loadedTex);
        setTexture(loadedTex);
      },
      undefined,
      (err) => {
        console.warn('Texture load fallback:', url, err);
      }
    );

    return () => {
      isMounted = false;
    };
  }, [url]);

  return (
    <group>
      <mesh>
        <planeGeometry args={[2.4, 2.4]} />
        {texture ? (
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={isHovered ? 1.0 : 0.95}
            side={THREE.DoubleSide}
          />
        ) : (
          <meshBasicMaterial
            color={dominantColor || '#ffffff'}
            transparent
            opacity={0.65}
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
  isEditingSelected = false,
  isSpatialEditMode = false,
  onSelect,
  magnitude = 1.0,
  showImages = false,
}) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Individual artwork scale multiplier (default: 1.0)
  const individualScale = typeof artwork.scala === 'number' ? artwork.scala : (artwork.dimensione || 1.0);

  // Smooth position interpolation vector
  const currentPos = useRef(new THREE.Vector3(...(targetPosition || [0, 0, 0])));
  const targetVec = useMemo(() => new THREE.Vector3(...(targetPosition || [0, 0, 0])), [targetPosition]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    
    // In spatial edit mode, we can snap directly to targetPosition if being dragged, or lerp smoothly
    if (isSpatialEditMode && isEditingSelected) {
      currentPos.current.copy(targetVec);
    } else {
      currentPos.current.lerp(targetVec, Math.min(delta * 4.5, 1));
    }
    meshRef.current.position.copy(currentPos.current);

    // Make the sprite always orient towards the origin (camera viewpoint)
    meshRef.current.lookAt(0, 0, 0);
  });

  const baseScale = magnitude * individualScale * (hovered ? 1.45 : (isSelected || isEditingSelected) ? 1.25 : 1.0);
  const glowColor = isEditingSelected ? '#10b981' : (artwork.colore_dominante || '#ffffff');

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
        {/* Glowing Aura Frame in dominant color or emerald if selected in edit mode */}
        <mesh position={[0, 0, -0.04]}>
          <planeGeometry args={[2.7, 2.7]} />
          <meshBasicMaterial
            color={glowColor}
            transparent
            opacity={isEditingSelected ? 0.9 : hovered ? 0.75 : isSelected ? 0.55 : isDimmed ? 0.08 : 0.28}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Spatial Edit Mode Selector Frame */}
        {isEditingSelected && (
          <mesh position={[0, 0, -0.02]}>
            <ringGeometry args={[1.75, 1.95, 32]} />
            <meshBasicMaterial color="#10b981" transparent opacity={0.9} side={THREE.DoubleSide} />
          </mesh>
        )}

        {/* Square Content: Either Image Texture OR Ultra-Fast Minimalist Square Space */}
        {showImages ? (
          <ArtworkSquareMesh
            url={artwork.miniatura || artwork.immagine}
            isHovered={hovered}
            dominantColor={glowColor}
          />
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
