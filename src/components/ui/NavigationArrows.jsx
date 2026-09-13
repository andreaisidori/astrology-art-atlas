import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function NavigationArrows({ onRotateLeft, onRotateRight, onStopRotate }) {
  const isHoldingRef = useRef(false);
  const clickTimeoutRef = useRef(null);

  const clearAll = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }
    if (isHoldingRef.current) {
      isHoldingRef.current = false;
      onStopRotate?.();
    }
  };

  useEffect(() => {
    return () => {
      clearAll();
    };
  }, []);

  // Left Arrow: Turns view to the left (points at what is to the left)
  const handlePointerDownLeft = (e) => {
    e.preventDefault();
    isHoldingRef.current = true;
    onRotateLeft?.(0.65);
  };

  const handlePointerUpLeft = (e) => {
    e.preventDefault();
    if (isHoldingRef.current) {
      isHoldingRef.current = false;
      // Allow slight pleasant inertia (80ms) then stop
      clickTimeoutRef.current = setTimeout(() => {
        onStopRotate?.();
      }, 80);
    }
  };

  // Right Arrow: Turns view to the right (points at what is to the right)
  const handlePointerDownRight = (e) => {
    e.preventDefault();
    isHoldingRef.current = true;
    onRotateRight?.(0.65);
  };

  const handlePointerUpRight = (e) => {
    e.preventDefault();
    if (isHoldingRef.current) {
      isHoldingRef.current = false;
      // Allow slight pleasant inertia (80ms) then stop
      clickTimeoutRef.current = setTimeout(() => {
        onStopRotate?.();
      }, 80);
    }
  };

  // Click handler fallback for keyboard users or standard clicks
  const handleClickLeft = (e) => {
    e.preventDefault();
    onRotateLeft?.(0.85);
    clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => {
      onStopRotate?.();
    }, 180);
  };

  const handleClickRight = (e) => {
    e.preventDefault();
    onRotateRight?.(0.85);
    clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => {
      onStopRotate?.();
    }, 180);
  };

  return (
    <>
      {/* Left Navigation Arrow: Turns camera view left towards what's to the left */}
      <div className="fixed left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 pointer-events-auto select-none">
        <button
          type="button"
          onPointerDown={handlePointerDownLeft}
          onPointerUp={handlePointerUpLeft}
          onPointerLeave={clearAll}
          onPointerCancel={clearAll}
          onClick={handleClickLeft}
          title="Ruota la vista a sinistra"
          aria-label="Ruota a sinistra"
          style={{ touchAction: 'manipulation' }}
          className="group w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/40 hover:bg-white/15 active:bg-white/30 border border-white/15 hover:border-white/40 backdrop-blur-md flex items-center justify-center text-white/60 hover:text-white transition-all duration-200 shadow-2xl hover:scale-105 active:scale-95 focus:outline-none cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:-translate-x-0.5" />
        </button>
      </div>

      {/* Right Navigation Arrow: Turns camera view right towards what's to the right */}
      <div className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 pointer-events-auto select-none">
        <button
          type="button"
          onPointerDown={handlePointerDownRight}
          onPointerUp={handlePointerUpRight}
          onPointerLeave={clearAll}
          onPointerCancel={clearAll}
          onClick={handleClickRight}
          title="Ruota la vista a destra"
          aria-label="Ruota a destra"
          style={{ touchAction: 'manipulation' }}
          className="group w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/40 hover:bg-white/15 active:bg-white/30 border border-white/15 hover:border-white/40 backdrop-blur-md flex items-center justify-center text-white/60 hover:text-white transition-all duration-200 shadow-2xl hover:scale-105 active:scale-95 focus:outline-none cursor-pointer"
        >
          <ChevronRight className="w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </>
  );
}
