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
  const landingActive = useRef(isLanding);

  // Flight animation state for smooth non-uniform impulse ("lento -> veloce -> lento / spinta")
  const flightState = useRef({
    active: false,
    startTime: 0,
    duration: 850, // 850ms: rapid impulse sweep
    startAzimuth: 0,
    deltaAngle: 0,
    startPitch: 0,
    targetPitch: 0,
  });

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

  // When targetSignId changes, initiate dynamic rotation to 12 o'clock
  useEffect(() => {
    if (!targetSignId || landingActive.current) return;

    const sign = ZODIAC_SIGNS.find(
      s => s.id === targetSignId || s.name.toLowerCase() === targetSignId.toLowerCase()
    );
    if (!sign) return;

    // Target azimuth angle for the sign on the ecliptic sphere
    const targetRad = ((sign.angle + 15) * Math.PI) / 180;

    // Current camera forward view direction in world space
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);

    // Current horizontal azimuth & vertical pitch
    const startAzimuth = Math.atan2(forward.z, forward.x);
    const startPitch = Math.asin(Math.max(-0.99, Math.min(0.99, forward.y)));

    // Calculate shortest angular difference (modulo 2π)
    let deltaAngle = targetRad - startAzimuth;
    while (deltaAngle < -Math.PI) deltaAngle += Math.PI * 2;
    while (deltaAngle > Math.PI) deltaAngle -= Math.PI * 2;

    flightState.current = {
      active: true,
      startTime: performance.now(),
      duration: 850, // Rapid and dynamic
      startAzimuth,
      deltaAngle,
      startPitch,
      targetPitch: 0, // Align horizon directly at eye level
    };
  }, [targetSignId, camera]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    // 1. Sky Landing Descent ("Atterraggio dall'alto come da una porta nel cielo")
    if (landingActive.current) {
      // Smoothly descend Y from 45 -> 0
      const currentY = camera.position.y;
      const targetY = 0.01;
      const newY = THREE.MathUtils.lerp(currentY, targetY, Math.min(delta * 2.2, 1));
      
      // Drift into center
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

    // 2. Flight to target zodiac sign: non-uniform impulse ("lento -> veloce -> lento con spinta")
    if (flightState.current.active) {
      const elapsed = performance.now() - flightState.current.startTime;
      const progress = Math.min(1, elapsed / flightState.current.duration);

      // Quartic Ease-in-Out curve: gentle start, powerful acceleration thrust in middle, smooth braking
      const ease = progress < 0.5
        ? 8 * Math.pow(progress, 4)
        : 1 - Math.pow(-2 * progress + 2, 4) / 2;

      const currentAzimuth = flightState.current.startAzimuth + flightState.current.deltaAngle * ease;
      const currentPitch = flightState.current.startPitch + (flightState.current.targetPitch - flightState.current.startPitch) * ease;

      const cosPitch = Math.cos(currentPitch);
      const sinPitch = Math.sin(currentPitch);
      const dirX = Math.cos(currentAzimuth) * cosPitch;
      const dirY = sinPitch;
      const dirZ = Math.sin(currentAzimuth) * cosPitch;

      // Inside-sphere camera positioned at -dir * 0.01 looking through origin (0,0,0) towards +dir
      const camRadius = 0.01;
      camera.position.set(-dirX * camRadius, -dirY * camRadius, -dirZ * camRadius);
      camera.lookAt(0, 0, 0);

      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }

      if (progress >= 1) {
        flightState.current.active = false;
        if (onTargetReached) onTargetReached();
      }
      return;
    }

    // 3. Apply manual rotation velocity from navigation arrow buttons
    if (manualRotateVelocity !== 0) {
      const angle = manualRotateVelocity * delta * 2.5;
      // Rotate camera around origin Y axis
      camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
      camera.lookAt(0, 0, 0);
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

