import React, { useState } from 'react';

export default function LandingScreen({ onEnter }) {
  const [isDiving, setIsDiving] = useState(false);

  const handleStartDive = () => {
    if (isDiving) return;
    setIsDiving(true);
    // Start 3D camera descent immediately in sync with the falling door animation
    onEnter();
  };

  return (
    <div
      onClick={handleStartDive}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 select-none overflow-hidden transition-all duration-1000 [perspective:1200px] cursor-pointer ${
        isDiving ? 'bg-transparent pointer-events-none' : 'bg-[#030307]'
      }`}
    >
      {/* Subtle Background Radial Aura */}
      <div
        className={`absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,184,105,0.1)_0%,rgba(10,10,25,0.8)_50%,rgba(3,3,7,1)_95%)] pointer-events-none transition-opacity duration-1000 ${
          isDiving ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Center: Astrolabe Logo - "Porta Celeste che cade in avanti ingrandendosi e diventa pavimento" */}
      <main
        className={`relative z-10 flex flex-col items-center justify-center group transition-all duration-1200 ease-out ${
          isDiving
            ? '[transform:rotateX(78deg)_translateY(36%)_scale(3.6)] opacity-35'
            : '[transform:rotateX(0deg)_translateY(0)_scale(1)] opacity-100 hover:scale-105'
        }`}
        style={{ transformOrigin: 'center bottom', transformStyle: 'preserve-3d' }}
      >
        {/* Luminous Pulsing Glow Backdrop */}
        <div
          className={`absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-amber-500/10 filter blur-3xl transition-all duration-1000 ${
            isDiving ? 'opacity-0 scale-150' : 'group-hover:bg-amber-400/20 animate-pulse'
          }`}
        />

        {/* Circular Astrolabe Interactive Unit */}
        <div
          title="discover"
          className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center"
        >
          {/* 1. Rotating Outer Zodiac Ring (Rotazione Lenta Continua) */}
          <img
            src="/images/aaa-logo-ring.png"
            alt="Zodiac Ring"
            className="absolute inset-0 w-full h-full object-contain animate-[spin_80s_linear_infinite] drop-shadow-[0_0_20px_rgba(229,184,105,0.45)]"
          />

          {/* 2. Fixed Center AAA Monogram (Perfettamente centrato con la corona rotante) */}
          <img
            src="/images/aaa-logo-center.png"
            alt="AAA Center Monogram"
            className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_0_25px_rgba(243,203,114,0.6)] group-hover:scale-105 transition-transform duration-500 z-10"
          />

          {/* Hover Portal Ring Hint */}
          <div className="absolute inset-0 rounded-full border border-amber-400/0 group-hover:border-amber-400/30 group-hover:scale-105 transition-all duration-700" />
        </div>

        {/* Pure Astrology Art Atlas Typography */}
        <div
          className={`mt-8 text-center space-y-1.5 transition-all duration-700 ${
            isDiving ? 'opacity-0 -translate-y-6' : 'opacity-100 translate-y-0'
          }`}
        >
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
