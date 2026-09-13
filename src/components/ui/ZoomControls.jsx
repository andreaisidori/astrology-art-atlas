import React, { useRef, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function ZoomControls({ onZoomIn, onZoomOut, onStopZoom, onStepZoomIn, onStepZoomOut }) {
  const isHoldingRef = useRef(false);
  const clickTimeoutRef = useRef(null);

  const clearAll = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }
    if (isHoldingRef.current) {
      isHoldingRef.current = false;
      onStopZoom?.();
    }
  };

  useEffect(() => {
    return () => {
      clearAll();
    };
  }, []);

  // Zoom In (Decrease FOV)
  const handlePointerDownZoomIn = (e) => {
    e.preventDefault();
    isHoldingRef.current = true;
    onZoomIn?.(0.9);
  };

  const handlePointerUpZoomIn = (e) => {
    e.preventDefault();
    if (isHoldingRef.current) {
      isHoldingRef.current = false;
      clickTimeoutRef.current = setTimeout(() => {
        onStopZoom?.();
      }, 50);
    }
  };

  const handleClickZoomIn = (e) => {
    e.preventDefault();
    onStepZoomIn ? onStepZoomIn() : onZoomIn?.(1.0);
    clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => {
      onStopZoom?.();
    }, 120);
  };

  // Zoom Out (Increase FOV)
  const handlePointerDownZoomOut = (e) => {
    e.preventDefault();
    isHoldingRef.current = true;
    onZoomOut?.(0.9);
  };

  const handlePointerUpZoomOut = (e) => {
    e.preventDefault();
    if (isHoldingRef.current) {
      isHoldingRef.current = false;
      clickTimeoutRef.current = setTimeout(() => {
        onStopZoom?.();
      }, 50);
    }
  };

  const handleClickZoomOut = (e) => {
    e.preventDefault();
    onStepZoomOut ? onStepZoomOut() : onZoomOut?.(1.0);
    clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => {
      onStopZoom?.();
    }, 120);
  };

  return (
    <div className="fixed right-3 md:right-6 top-1/2 translate-y-12 md:translate-y-14 z-20 pointer-events-auto select-none flex flex-col items-center gap-1">
      <div className="flex flex-col rounded-2xl bg-black/40 border border-white/15 backdrop-blur-md shadow-2xl overflow-hidden">
        {/* Zoom In Button (+) */}
        <button
          type="button"
          onPointerDown={handlePointerDownZoomIn}
          onPointerUp={handlePointerUpZoomIn}
          onPointerLeave={clearAll}
          onPointerCancel={clearAll}
          onClick={handleClickZoomIn}
          title="Ingrandisci (Zoom In +)"
          aria-label="Zoom In"
          style={{ touchAction: 'manipulation' }}
          className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 active:bg-white/30 transition-all duration-150 focus:outline-none cursor-pointer border-b border-white/10"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        {/* Zoom Out Button (-) */}
        <button
          type="button"
          onPointerDown={handlePointerDownZoomOut}
          onPointerUp={handlePointerUpZoomOut}
          onPointerLeave={clearAll}
          onPointerCancel={clearAll}
          onClick={handleClickZoomOut}
          title="Rimpicciolisci (Zoom Out -)"
          aria-label="Zoom Out"
          style={{ touchAction: 'manipulation' }}
          className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 active:bg-white/30 transition-all duration-150 focus:outline-none cursor-pointer"
        >
          <Minus className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  );
}
