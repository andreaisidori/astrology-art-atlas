import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function NavigationArrows({ onRotateLeft, onRotateRight }) {
  const leftIntervalRef = useRef(null);
  const rightIntervalRef = useRef(null);

  const startHoldingLeft = () => {
    onRotateLeft(0.4); // Initial step
    leftIntervalRef.current = setInterval(() => {
      onRotateLeft(0.08); // Continuous smooth rotation
    }, 30);
  };

  const stopHoldingLeft = () => {
    if (leftIntervalRef.current) {
      clearInterval(leftIntervalRef.current);
      leftIntervalRef.current = null;
    }
  };

  const startHoldingRight = () => {
    onRotateRight(0.4); // Initial step
    rightIntervalRef.current = setInterval(() => {
      onRotateRight(0.08); // Continuous smooth rotation
    }, 30);
  };

  const stopHoldingRight = () => {
    if (rightIntervalRef.current) {
      clearInterval(rightIntervalRef.current);
      rightIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopHoldingLeft();
      stopHoldingRight();
    };
  }, []);

  return (
    <>
      {/* Left Navigation Arrow */}
      <div className="fixed left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 pointer-events-auto">
        <button
          onMouseDown={startHoldingLeft}
          onMouseUp={stopHoldingLeft}
          onMouseLeave={stopHoldingLeft}
          onTouchStart={startHoldingLeft}
          onTouchEnd={stopHoldingLeft}
          title="Ruota a sinistra (o trascina con swipe)"
          className="group w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/30 hover:bg-white/15 active:bg-white/25 border border-white/10 hover:border-white/30 backdrop-blur-md flex items-center justify-center text-white/50 hover:text-white transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:-translate-x-0.5" />
        </button>
      </div>

      {/* Right Navigation Arrow */}
      <div className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 pointer-events-auto">
        <button
          onMouseDown={startHoldingRight}
          onMouseUp={stopHoldingRight}
          onMouseLeave={stopHoldingRight}
          onTouchStart={startHoldingRight}
          onTouchEnd={stopHoldingRight}
          title="Ruota a destra (o trascina con swipe)"
          className="group w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/30 hover:bg-white/15 active:bg-white/25 border border-white/10 hover:border-white/30 backdrop-blur-md flex items-center justify-center text-white/50 hover:text-white transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95"
        >
          <ChevronRight className="w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </>
  );
}
