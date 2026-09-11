import React from 'react';

export default function DomeOverlay({ enabled }) {
  if (!enabled) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden">
      {/* Outer Black Mask covering everything outside the dome circle */}
      <div className="absolute inset-0 bg-black/90 [mask-image:radial-gradient(circle_at_center,transparent_0%,transparent_46%,black_48%)]" />

      {/* Circular Dome Frame */}
      <div className="relative w-[min(88vh,88vw)] h-[min(88vh,88vw)] rounded-full border border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.15)] flex items-center justify-center">
        {/* Concentric Altitude Rings */}
        <div className="absolute w-[66%] h-[66%] rounded-full border border-amber-500/20 border-dashed" />
        <div className="absolute w-[33%] h-[33%] rounded-full border border-amber-500/20 border-dashed" />

        {/* Crosshair / Zenith Center */}
        <div className="absolute w-4 h-4 rounded-full border border-amber-400/60 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-amber-400" />
        </div>
        <div className="absolute w-full h-[1px] bg-amber-500/15" />
        <div className="absolute h-full w-[1px] bg-amber-500/15" />

        {/* Cardinal Markers */}
        <span className="absolute top-3 text-[10px] font-mono text-amber-400/80 tracking-widest">ZENITH / N</span>
        <span className="absolute bottom-3 text-[10px] font-mono text-amber-400/80 tracking-widest">S</span>
        <span className="absolute left-3 text-[10px] font-mono text-amber-400/80 tracking-widest">E</span>
        <span className="absolute right-3 text-[10px] font-mono text-amber-400/80 tracking-widest">W</span>

        {/* Installation Calibration Label */}
        <div className="absolute bottom-10 px-3 py-1 rounded bg-black/80 border border-amber-500/30 text-[10px] font-mono text-amber-300 backdrop-blur-md">
          SIMULAZIONE PROIEZIONE CUPOLA (180° FISHEYE)
        </div>
      </div>
    </div>
  );
}
