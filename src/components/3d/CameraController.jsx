import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { sphericalToCartesian, ZODIAC_SIGNS } from '../../utils/astronomy';

export default function CameraController({
  targetSignId,
  initialMoonInfo,
  onTargetReached,
  isDomeView,
  manualRotateVelocity = 0,
  isLanding = false,
  onLandingComplete,
}) {
  const { camera } = useThree();
  const controlsRef = useRef();
  const targetLookAt = useRef(new THREE.Vector3(0, 0, -1));
  const isFlying = useRef(false);
  const landingActive = useRef(isLanding);

  // Initialize camera position when landing from above
  useEffect(() => {
    if (isLanding) {
      camera.position.set(0, 45, 0.05);
      camera.lookAt(0, 0, 0);
      landingActive.current = true;
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }
    }
  }, [isLanding, camera]);

  // When targetSignId changes, animate camera lookAt
  useEffect(() => {
    if (!targetSignId || landingActive.current) return;

    const sign = ZODIAC_SIGNS.find(s => s.id === targetSignId || s.name.toLowerCase() === targetSignId.toLowerCase());
    if (sign) {
      const [x, y, z] = sphericalToCartesian(40, sign.angle + 15, 0, 0);
      targetLookAt.current.set(x, y, z);
      isFlying.current = true;
    }
  }, [targetSignId]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    // 1. Sky Landing Descent ("Atterraggio dall'alto come da una porta nel cielo")
    if (landingActive.current) {
      // Smoothly descend Y from 45 -> 0
      const currentY = camera.position.y;
      const targetY = 0.01;
      const newY = THREE.MathUtils.lerp(currentY, targetY, Math.min(delta * 2.2, 1));
      
      // Also smoothly drift slightly into standard Z view position
      camera.position.set(0, newY, 0.01);
      
      // Orient camera from looking straight down to looking forward at the celestial belt
      const progress = 1 - (newY / 45); // 0 at top -> 1 at bottom
      const lookY = THREE.MathUtils.lerp(-10, 0, progress);
      const lookZ = THREE.MathUtils.lerp(0.01, -30, Math.min(progress * 1.4, 1));
      camera.lookAt(0, lookY, lookZ);

      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, -1);
        controlsRef.current.update();
      }

      if (newY < 0.15) {
        camera.position.set(0, 0, 0.01);
        landingActive.current = false;
        if (onLandingComplete) onLandingComplete();
      }
      return;
    }

    // 2. Apply manual rotation velocity from navigation arrow buttons
    if (manualRotateVelocity !== 0) {
      const angle = manualRotateVelocity * delta * 2.5;
      // Rotate camera around origin Y axis
      camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
      camera.lookAt(0, 0, 0);
      controlsRef.current.update();
    }

    // 3. Flight to specific constellation
    if (isFlying.current) {
      const currentTarget = controlsRef.current.target;
      const step = Math.min(delta * 3.0, 1);
      
      const dir = targetLookAt.current.clone().normalize().multiplyScalar(0.1);
      currentTarget.lerp(dir, step);
      
      const lookTarget = targetLookAt.current;
      camera.lookAt(lookTarget);

      if (currentTarget.distanceTo(dir) < 0.005) {
        isFlying.current = false;
        if (onTargetReached) onTargetReached();
      }

      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={true}
      rotateSpeed={-0.6} // Responsive drag & swipe
      zoomSpeed={0.8}
      minDistance={0.01}
      maxDistance={20}
      dampingFactor={0.08}
      enableDamping
      minPolarAngle={isDomeView ? 0.1 : Math.PI / 2 - 0.45}
      maxPolarAngle={isDomeView ? Math.PI / 2 : Math.PI / 2 + 0.45}
    />
  );
}

