import React, { useRef, useEffect } from 'react';
import { TransformControls } from '@react-three/drei';
import * as THREE from 'three';

export default function CuratorSpatialEditor({
  selectedArtwork,
  currentPosition,
  onUpdatePosition,
  onDraggingChange,
}) {
  const transformRef = useRef();
  const dummyMeshRef = useRef();

  // Keep dummy mesh synced with current position
  useEffect(() => {
    if (dummyMeshRef.current && currentPosition) {
      dummyMeshRef.current.position.set(currentPosition[0], currentPosition[1], currentPosition[2]);
    }
  }, [currentPosition, selectedArtwork]);

  useEffect(() => {
    const controls = transformRef.current;
    if (!controls) return;

    const handleChange = () => {
      if (dummyMeshRef.current && selectedArtwork) {
        const p = dummyMeshRef.current.position;
        onUpdatePosition?.(selectedArtwork.id, {
          x: Math.round(p.x * 100) / 100,
          y: Math.round(p.y * 100) / 100,
          z: Math.round(p.z * 100) / 100,
        });
      }
    };

    const handleDraggingChanged = (event) => {
      onDraggingChange?.(event.value);
    };

    controls.addEventListener('change', handleChange);
    controls.addEventListener('dragging-changed', handleDraggingChanged);

    return () => {
      controls.removeEventListener('change', handleChange);
      controls.removeEventListener('dragging-changed', handleDraggingChanged);
    };
  }, [selectedArtwork, onUpdatePosition, onDraggingChange]);

  if (!selectedArtwork || !currentPosition) return null;

  return (
    <>
      {/* Invisible anchor mesh that TransformControls binds to */}
      <mesh
        ref={dummyMeshRef}
        position={currentPosition}
        visible={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <TransformControls
        ref={transformRef}
        object={dummyMeshRef}
        mode="translate"
        size={0.75}
        showX
        showY
        showZ
      />
    </>
  );
}
