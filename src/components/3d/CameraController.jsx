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
  manualZoomVelocity = 0,
  isLanding = false,
  onLandingComplete,
}) {
  const { camera, gl } = useThree();
  const controlsRef = useRef();
  const landingActive = useRef(isLanding);

  // Target FOV for smooth zooming (default: 70°, min: 25°, max: 95°)
  const targetFov = useRef(70);

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

  // Landing animation state
  const landingState = useRef({
    active: false,
    startTime: 0,
    duration: 1100, // Slightly slower, fluid and majestic
    startY: 32,
  });

  // Initialize camera position when landing from above
  useEffect(() => {
    if (isLanding) {
      camera.position.set(0, 32, 0.05);
      camera.lookAt(0, -12, 0);
      targetFov.current = 70;
      camera.fov = 70;
      camera.updateProjectionMatrix();

      landingState.current = {
        active: true,
        startTime: performance.now(),
        duration: 1100,
        startY: 32,
      };
      landingActive.current = true;
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
      }
    }
  }, [isLanding, camera]);

  // Canonical Mouse Wheel & Trackpad Pinch/Scroll Listener
  useEffect(() => {
    const dom = gl.domElement;
    if (!dom) return;

    const handleWheel = (e) => {
      e.preventDefault();
      // deltaY < 0 = scroll up -> zoom in (lower FOV)
      // deltaY > 0 = scroll down -> zoom out (higher FOV)
      const zoomStep = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY) * 0.06, 6);
      targetFov.current = Math.min(95, Math.max(25, targetFov.current + zoomStep));
    };

    // Touch 2-finger Pinch to Zoom
    let touchDistance = 0;
    let initialTouchFov = 70;

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchDistance = Math.hypot(dx, dy);
        initialTouchFov = targetFov.current;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2 && touchDistance > 0) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDist = Math.hypot(dx, dy);
        if (currentDist > 0) {
          const ratio = touchDistance / currentDist; // > 1 when pinching in, < 1 when spreading fingers
          targetFov.current = Math.min(95, Math.max(25, initialTouchFov * ratio));
        }
      }
    };

    const handleTouchEnd = () => {
      touchDistance = 0;
    };

    dom.addEventListener('wheel', handleWheel, { passive: false });
    dom.addEventListener('touchstart', handleTouchStart, { passive: false });
    dom.addEventListener('touchmove', handleTouchMove, { passive: false });
    dom.addEventListener('touchend', handleTouchEnd);
    dom.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      dom.removeEventListener('wheel', handleWheel);
      dom.removeEventListener('touchstart', handleTouchStart);
      dom.removeEventListener('touchmove', handleTouchMove);
      dom.removeEventListener('touchend', handleTouchEnd);
      dom.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [gl]);

  // Canonical Keyboard Zoom Shortcuts (+ / - / = / _)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept when typing in inputs/textareas
      const tagName = document.activeElement?.tagName;
      if (tagName === 'INPUT' || tagName === 'TEXTAREA') return;

      if (e.key === '+' || e.key === '=' || e.code === 'NumpadAdd') {
        e.preventDefault();
        targetFov.current = Math.max(25, targetFov.current - 6);
      } else if (e.key === '-' || e.key === '_' || e.code === 'NumpadSubtract') {
        e.preventDefault();
        targetFov.current = Math.min(95, targetFov.current + 6);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // When targetSignId changes, initiate dynamic rotation to 12 o'clock and reset FOV to standard
  useEffect(() => {
    if (!targetSignId || landingActive.current) return;

    const sign = ZODIAC_SIGNS.find(
      s => s.id === targetSignId || s.name.toLowerCase() === targetSignId.toLowerCase()
    );
    if (!sign) return;

    // Reset FOV smoothly to default framing for clear constellation view
    targetFov.current = 70;

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
    // Smoothly interpolate Camera FOV towards targetFov
    if (manualZoomVelocity !== 0) {
      targetFov.current = Math.min(95, Math.max(25, targetFov.current + manualZoomVelocity * delta * 45));
    }

    if (Math.abs(camera.fov - targetFov.current) > 0.05) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov.current, delta * 9);
      camera.updateProjectionMatrix();
    }

    // 1. Sky Landing Descent ("Atterraggio fluido e continuo sul tappeto celeste")
    if (landingState.current.active) {
      const elapsed = performance.now() - landingState.current.startTime;
      const progress = Math.min(1, elapsed / landingState.current.duration);

      // Quartic ease-out: starts gently, glides downwards, and slows smoothly to a complete stop
      const ease = 1 - Math.pow(1 - progress, 4);
      const currentY = THREE.MathUtils.lerp(landingState.current.startY, 0.001, ease);
      camera.position.set(0, currentY, 0.01);

      const lookY = THREE.MathUtils.lerp(-12, 0, ease);
      const lookZ = THREE.MathUtils.lerp(-0.01, -40, ease);
      camera.lookAt(0, lookY, lookZ);

      if (progress >= 1) {
        camera.position.set(0, 0, 0.01);
        camera.lookAt(0, 0, -40);
        landingState.current.active = false;
        landingActive.current = false;
        if (controlsRef.current) {
          controlsRef.current.target.set(0, 0, 0);
          controlsRef.current.update();
          controlsRef.current.enabled = true;
        }
        if (onLandingComplete) onLandingComplete();
      }
      return;
    }

    if (!controlsRef.current) return;

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
      enableZoom={false}
      rotateSpeed={-0.6} // Responsive drag & swipe
      dampingFactor={0.08}
      enableDamping
      minPolarAngle={isDomeView ? 0.1 : Math.PI / 2 - 0.45}
      maxPolarAngle={isDomeView ? Math.PI / 2 : Math.PI / 2 + 0.45}
    />
  );
}

