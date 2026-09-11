import React, { useState } from 'react';
import { Sparkles, Compass, ChevronDown } from 'lucide-react';

export default function LandingScreen({ onEnter }) {
  const [isDiving, setIsDiving] = useState(false);

  const handleStartDive = () => {
    if (isDiving) return;
    setIsDiving(true);
    // Give time for celestial warp zoom effect before triggering camera descent
    setTimeout(() => {
      onEnter();
    }, 400);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-12 select-none overflow-hidden transition-all duration-1000 bg-[#030307] ${
        isDiving ? 'opacity-0 scale-125 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Subtle Background Radial Aura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,184,105,0.12)_0%,rgba(10,10,25,0.8)_50%,rgba(3,3,7,1)_95%)] pointer-events-none" />

      {/* Top Header Badge */}
      <header className="relative z-10 flex flex-col items-center gap-1 text-center pt-2">
        <span className="text-[10px] md:text-xs font-mono tracking-[0.35em] text-amber-300/80 uppercase flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Mnemosyne Celestial Atlas</span>
        </span>
        <p className="text-[11px] font-mono text-zinc-500 tracking-wider">Curatela di Giacomo Isidori</p>
      </header>

      {/* Center: Astrolabe Logo with Rotating Zodiac Ring & Center Monogram */}
      <main
        onClick={handleStartDive}
        className="relative z-10 flex flex-col items-center justify-center cursor-pointer group my-auto transition-transform duration-700 hover:scale-105"
      >
        {/* Luminous Pulsing Glow Backdrop */}
        <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-amber-500/10 filter blur-3xl group-hover:bg-amber-400/20 transition-all duration-1000 animate-pulse" />

        {/* Circular Astrolabe Interactive Unit */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center">
          {/* 1. Rotating Outer Zodiac Ring (Rotazione Lenta Continua) */}
          <img
            src="/images/aaa-logo-ring.png"
            alt="Zodiac Ring"
            className="absolute inset-0 w-full h-full object-contain animate-[spin_80s_linear_infinite] drop-shadow-[0_0_20px_rgba(229,184,105,0.45)]"
          />

          {/* 2. Fixed Center AAA Monogram (Stazionario con bagliore dorato) */}
          <img
            src="/images/aaa-logo-center.png"
            alt="AAA Center Monogram"
            className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_0_25px_rgba(243,203,114,0.6)] group-hover:scale-110 transition-transform duration-500"
          />

          {/* Hover Portal Ring Hint */}
          <div className="absolute inset-0 rounded-full border border-amber-400/0 group-hover:border-amber-400/30 group-hover:scale-105 transition-all duration-700" />
        </div>

        {/* Branding Typography */}
        <div className="mt-8 text-center space-y-1.5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light font-serif tracking-[0.25em] text-white">
            <span className="text-amber-400 font-normal">AAA</span>
          </h1>
          <p className="text-xs sm:text-sm font-mono tracking-[0.3em] uppercase text-zinc-300">
            Astrology Art Atlas
          </p>
          <p className="text-[11px] sm:text-xs text-zinc-500 font-sans max-w-sm mx-auto pt-1 leading-relaxed">
            12 costellazioni simboliche &bull; 171 artisti contemporanei
          </p>
        </div>
      </main>

      {/* Bottom CTA / Enter Portal Button */}
      <footer className="relative z-10 flex flex-col items-center gap-3 pb-4">
        <button
          onClick={handleStartDive}
          className="group/btn flex items-center gap-3 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500/15 via-white/10 to-amber-500/15 hover:from-amber-500/30 hover:to-amber-500/30 border border-amber-400/40 hover:border-amber-300 text-amber-200 hover:text-white backdrop-blur-xl shadow-[0_0_20px_rgba(229,184,105,0.25)] transition-all duration-300 cursor-pointer"
        >
          <Compass className="w-4 h-4 text-amber-400 group-hover/btn:rotate-90 transition-transform duration-500" />
          <span className="text-xs font-mono tracking-[0.2em] uppercase font-semibold">
            Entra nella Volta Celeste
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
        </button>

        <span className="text-[10px] font-mono text-zinc-600 tracking-wider">
          Clicca ovunque per atterrare dall'alto
        </span>
      </footer>
    </div>
  );
}
