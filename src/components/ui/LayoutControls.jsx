import React from 'react';
import { Layers, Clock, Palette, Sparkles, Image, Eye, EyeOff, Square } from 'lucide-react';

export default function LayoutControls({
  currentMode,
  onSelectMode,
  magnitude = 1.0,
  onMagnitudeChange,
  showImages = false,
  onToggleShowImages,
}) {
  const modes = [
    { id: 'manual', label: 'Manuale (Warburg)', icon: Layers, desc: 'Disposizione curatoriale aperta' },
    { id: 'chronological', label: 'Cronologico', icon: Clock, desc: 'Nastro temporale per anno' },
    { id: 'chromatic', label: 'Cromatico', icon: Palette, desc: 'Spettro delle tinte dominanti' },
  ];

  return (
    <div className="fixed top-20 right-4 md:right-8 z-20 flex flex-col gap-2.5 pointer-events-auto max-w-[220px]">
      {/* 1. Toggle Mostra Opere (Swipe Switch) */}
      <div className="p-2.5 rounded-xl bg-black/85 backdrop-blur-xl border border-white/15 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {showImages ? (
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <Square className="w-3.5 h-3.5 text-white/60" />
            )}
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-white tracking-wide">
                {showImages ? 'Opere Visibili' : 'Sagome Quadrati'}
              </span>
              <span className="text-[8px] font-mono text-white/50">
                {showImages ? 'Texture HD attive' : 'Spazi leggeri 60fps'}
              </span>
            </div>
          </div>

          {/* Swipe / Switch Button */}
          <button
            onClick={onToggleShowImages}
            title={showImages ? 'Disattiva immagini per massima fluidità' : 'Carica e visualizza le immagini delle opere'}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              showImages ? 'bg-cyan-500' : 'bg-white/20'
            }`}
            role="switch"
            aria-checked={showImages}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                showImages ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 2. Spatial Reconfiguration Card */}
      <div className="p-1 rounded-xl bg-black/85 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col gap-1">
        <div className="px-2.5 py-1 text-[9px] font-mono tracking-widest text-white/40 uppercase">
          Riconfigurazione
        </div>

        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = currentMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelectMode(m.id)}
              title={m.desc}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left ${
                isActive
                  ? 'bg-white/20 text-white border border-white/30 shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="text-[11px] tracking-wide truncate">{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Star Node Magnitude / Scale Slider */}
      <div className="p-3 rounded-xl bg-black/85 backdrop-blur-xl border border-white/10 shadow-2xl space-y-2">
        <div className="flex items-center justify-between text-[9px] font-mono tracking-widest text-white/50 uppercase">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Magnitudo</span>
          </span>
          <span className="text-white/80 font-semibold">{Math.round(magnitude * 100)}%</span>
        </div>

        <input
          type="range"
          min="0.3"
          max="2.0"
          step="0.05"
          value={magnitude}
          onChange={(e) => onMagnitudeChange(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
          title="Regola la dimensione visiva dei nodi-stella"
        />

        <div className="flex justify-between text-[8px] font-mono text-white/40">
          <span>Stelle (Piccole)</span>
          <span>Quadri (Grandi)</span>
        </div>
      </div>
    </div>
  );
}
