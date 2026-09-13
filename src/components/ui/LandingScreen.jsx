import React, { useState, useRef, useEffect } from 'react';

export default function LandingScreen({ onEnter }) {
  const [isDiving, setIsDiving] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const hoverTimerRef = useRef(null);

  const handleStartDive = () => {
    if (isDiving) return;
    setIsDiving(true);
    setShowTooltip(false);
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    // Give time for celestial warp zoom effect before triggering camera descent
    setTimeout(() => {
      onEnter();
    }, 400);
  };

  const handleMouseEnter = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 850); // After a brief moment of hover inactivity on the logo
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setShowTooltip(false);
  };

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  return (
    <div
      onClick={handleStartDive}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 select-none overflow-hidden transition-all duration-1000 bg-[#030307] cursor-pointer ${
        isDiving ? 'opacity-0 scale-125 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Subtle Background Radial Aura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,184,105,0.1)_0%,rgba(10,10,25,0.8)_50%,rgba(3,3,7,1)_95%)] pointer-events-none" />

      {/* Center: Astrolabe Logo with Rotating Zodiac Ring & Center Monogram */}
      <main className="relative z-10 flex flex-col items-center justify-center group transition-transform duration-700 hover:scale-105">
        {/* Luminous Pulsing Glow Backdrop */}
        <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-amber-500/10 filter blur-3xl group-hover:bg-amber-400/20 transition-all duration-1000 animate-pulse" />

        {/* Circular Astrolabe Interactive Unit */}
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center"
        >
          {/* 1. Rotating Outer Zodiac Ring (Rotazione Lenta Continua) */}
          <img
            src="/images/aaa-logo-ring.png"
            alt="Zodiac Ring"
            className="absolute inset-0 w-full h-full object-contain animate-[spin_80s_linear_infinite] drop-shadow-[0_0_20px_rgba(229,184,105,0.45)]"
          />

          {/* 2. Fixed Center AAA Monogram (Immutato, allargato al 68%, perfettamente centrato) */}
          <img
            src="/images/aaa-logo-center.png"
            alt="AAA Center Monogram"
            className="w-[68%] h-[68%] object-contain drop-shadow-[0_0_25px_rgba(243,203,114,0.6)] group-hover:scale-105 transition-transform duration-500 z-10"
          />

          {/* Hover Portal Ring Hint */}
          <div className="absolute inset-0 rounded-full border border-amber-400/0 group-hover:border-amber-400/30 group-hover:scale-105 transition-all duration-700" />

          {/* Subtle Golden "discover" Tooltip on Hover Inactivity */}
          <div
            className={`absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-all duration-500 transform ${
              showTooltip && !isDiving
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-2 scale-95'
            }`}
          >
            <div className="px-3 py-1 rounded-full bg-black/85 border border-[#e5b869]/40 backdrop-blur-md shadow-[0_0_18px_rgba(229,184,105,0.35)] flex items-center justify-center">
              <span className="text-[11px] sm:text-xs font-serif tracking-[0.25em] text-[#f3cb72] lowercase font-light">
                discover
              </span>
            </div>
          </div>
        </div>

        {/* Pure Astrology Art Atlas Typography */}
        <div className="mt-8 text-center space-y-1.5">
          <div className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold tracking-[0.35em] text-[#e5b869] drop-shadow-[0_0_18px_rgba(229,184,105,0.6)]">
            AAA
          </div>
          <h1 className="text-base sm:text-lg md:text-xl font-light font-serif tracking-[0.25em] text-white/90 uppercase">
            Astrology Art Atlas
          </h1>
        </div>
      </main>
    </div>
  );
}
