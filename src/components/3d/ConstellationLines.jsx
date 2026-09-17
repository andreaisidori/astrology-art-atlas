import React, { useMemo } from 'react';
import * as THREE from 'three';
import { ZODIAC_SIGNS } from '../../utils/astronomy';

export default function ConstellationLines({ artworks, positions, activeSignId }) {
  // Build interconnected constellation networks for each zodiac sign
  const linesBySign = useMemo(() => {
    const grouped = {};
    artworks.forEach((art) => {
      const signKey = (art.segno || '').toLowerCase();
      if (!grouped[signKey]) grouped[signKey] = [];
      grouped[signKey].push(art);
    });

    const lines = [];

    Object.entries(grouped).forEach(([signKey, items]) => {
      if (items.length < 2) return;
      const signInfo = ZODIAC_SIGNS.find(s => s.name.toLowerCase() === signKey || s.id === signKey);
      const color = signInfo ? signInfo.color : '#4361ee';

      const points = [];
      const addedPairs = new Set();

      // Connect sequential line
      for (let i = 0; i < items.length - 1; i++) {
        const p1 = positions[items[i].id];
        const p2 = positions[items[i + 1].id];
        if (p1 && p2) {
          points.push(new THREE.Vector3(...p1));
          points.push(new THREE.Vector3(...p2));
          addedPairs.add(`${items[i].id}-${items[i+1].id}`);
        }
      }

      // Add nearest-neighbor geometric cross-lines for a true constellation look
      if (items.length >= 4) {
        for (let i = 0; i < items.length; i++) {
          const p1 = positions[items[i].id];
          if (!p1) continue;

          // Find closest node that isn't direct neighbor
          let closest = null;
          let minDist = Infinity;

          for (let j = 0; j < items.length; j++) {
            if (i === j || Math.abs(i - j) === 1) continue;
            const p2 = positions[items[j].id];
            if (!p2) continue;

            const dist = Math.hypot(p1[0] - p2[0], p1[1] - p2[1], p1[2] - p2[2]);
            const pairKey = `${Math.min(i,j)}-${Math.max(i,j)}`;
            if (dist < minDist && dist < 18 && !addedPairs.has(pairKey)) {
              minDist = dist;
              closest = { j, p2, pairKey };
            }
          }

          if (closest && Math.random() > 0.4) {
            points.push(new THREE.Vector3(...p1));
            points.push(new THREE.Vector3(...closest.p2));
            addedPairs.add(closest.pairKey);
          }
        }
      }

      if (points.length > 0) {
        const geom = new THREE.BufferGeometry().setFromPoints(points);
        const isActive = !activeSignId || activeSignId === signKey;
        lines.push({
          id: signKey,
          geometry: geom,
          color,
          // Highly visible and accentuated constellation lines
          opacity: isActive ? (activeSignId === signKey ? 0.95 : 0.6) : 0.12
        });
      }
    });

    return lines;
  }, [artworks, positions, activeSignId]);

  return (
    <group>
      {linesBySign.map((line) => {
        const isDarkLine = line.color === '#31353D' || line.color === '#475569' || line.color === '#1A1A1A' || line.id === 'scorpione';
        return (
          <group key={line.id}>
            {/* Dark gray shadow / halo layer specifically for black Scorpio constellation lines */}
            {isDarkLine && (
              /* @ts-ignore */
              <lineSegments geometry={line.geometry}>
                <lineBasicMaterial
                  color="#52525b"
                  transparent
                  opacity={line.opacity * 0.75}
                  linewidth={4}
                  depthWrite={false}
                />
              </lineSegments>
            )}

            {/* Main constellation lines */}
            {/* @ts-ignore */}
            <lineSegments geometry={line.geometry}>
              <lineBasicMaterial
                color={line.color}
                transparent
                opacity={line.opacity}
                linewidth={2}
                depthWrite={false}
              />
            </lineSegments>

            {/* Subtle glow layer for active constellation */}
            {!isDarkLine && line.opacity > 0.5 && (
              /* @ts-ignore */
              <lineSegments geometry={line.geometry}>
                <lineBasicMaterial
                  color="#ffffff"
                  transparent
                  opacity={line.opacity * 0.4}
                  linewidth={1}
                  depthWrite={false}
                />
              </lineSegments>
            )}
          </group>
        );
      })}
    </group>
  );
}
