import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ZODIAC_SIGNS } from '../../utils/astronomy';

// Global texture cache to prevent re-fetching and ensure instant texture reuse
const textureCache = new Map();
const textureLoader = new THREE.TextureLoader();

// Square artwork mesh with robust asynchronous texture loading and vibrant zodiac colored border
function ArtworkSquareMesh({ url, isHovered, dominantColor, isDimmed, isSelected }) {
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
      {/* Artwork Canvas Plane */}
      <mesh>
        <planeGeometry args={[2.4, 2.4]} />
        {texture ? (
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={isDimmed ? 0.25 : isHovered ? 1.0 : 0.95}
            side={THREE.DoubleSide}
          />
        ) : (
          <meshBasicMaterial
            color={dominantColor || '#ffffff'}
            transparent
            opacity={isDimmed ? 0.1 : isHovered ? 0.85 : 0.65}
            side={THREE.DoubleSide}
          />
        )}
      </mesh>

      {/* Vibrant Illuminated Border Frame */}
      <mesh position={[0, 0, 0.01]}>
        <ringGeometry args={[1.65, 1.73, 4, 1, Math.PI / 4]} />
        <meshBasicMaterial
          color={dominantColor || '#ffffff'}
          transparent
          opacity={isDimmed ? 0.15 : isHovered ? 1.0 : isSelected ? 0.95 : 0.75}
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

  // Determine official sign color matching the constellation connection lines exactly
  const signInfo = useMemo(() => {
    const raw = (artwork.segno || '').toLowerCase().trim();
    return ZODIAC_SIGNS.find(s => s.name.toLowerCase() === raw || s.id === raw);
  }, [artwork.segno]);

  const signColor = signInfo ? signInfo.color : '#4361ee';
  const effectiveColor = isEditingSelected ? '#10b981' : signColor;

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
        {/* Glowing Aura Frame in vibrant zodiac sign / dominant color */}
        <mesh position={[0, 0, -0.04]}>
          <planeGeometry args={[2.75, 2.75]} />
          <meshBasicMaterial
            color={effectiveColor}
            transparent
            opacity={isEditingSelected ? 0.9 : hovered ? 0.85 : isSelected ? 0.65 : isDimmed ? 0.05 : 0.35}
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
            dominantColor={effectiveColor}
            isDimmed={isDimmed}
            isSelected={isSelected}
          />
        ) : (
          /* Vibrant Geometric Celestial Square Box */
          <group>
            {/* Deep translucent backing plate */}
            <mesh>
              <planeGeometry args={[2.2, 2.2]} />
              <meshBasicMaterial
                color="#0a0a14"
                transparent
                opacity={isDimmed ? 0.3 : hovered ? 0.9 : 0.75}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Tinted inner face in zodiac constellation color */}
            <mesh position={[0, 0, 0.005]}>
              <planeGeometry args={[2.14, 2.14]} />
              <meshBasicMaterial
                color={effectiveColor}
                transparent
                opacity={isDimmed ? 0.04 : hovered ? 0.65 : isSelected ? 0.5 : 0.28}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Vibrant luminous square border */}
            <mesh position={[0, 0, 0.01]}>
              <ringGeometry args={[1.50, 1.58, 4, 1, Math.PI / 4]} />
              <meshBasicMaterial
                color={effectiveColor}
                transparent
                opacity={isDimmed ? 0.12 : hovered ? 1.0 : isSelected ? 0.95 : 0.8}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        )}

        {/* Central Luminous Star Nucleus Dot */}
        <mesh position={[0, 0, 0.06]}>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshBasicMaterial
            color={hovered ? '#ffffff' : effectiveColor}
            transparent={false}
          />
        </mesh>

        {/* Minimalist Hover Tooltip */}
        {hovered && (
          <Html center distanceFactor={45} position={[0, -2.2, 0]} zIndexRange={[10, 0]}>
            <div className="pointer-events-none whitespace-nowrap px-3.5 py-1.5 rounded-xl bg-black/95 backdrop-blur-md border border-white/20 text-center shadow-2xl">
              <p className="text-[11px] font-semibold text-white tracking-wide">{artwork.artista}</p>
              {artwork.date_biografiche && (
                <p className="text-[9px] font-mono text-zinc-400">{artwork.date_biografiche}</p>
              )}
              <p className="text-[9px] font-mono mt-0.5 tracking-wider uppercase font-bold" style={{ color: effectiveColor }}>
                {artwork.segno}
              </p>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
