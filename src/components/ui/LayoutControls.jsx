import React, { useState } from 'react';
import { Layers, Clock, Palette, Sparkles, Eye, Square, ChevronUp, SlidersHorizontal } from 'lucide-react';

export default function LayoutControls({
  currentMode,
  onSelectMode,
  magnitude = 1.0,
  onMagnitudeChange,
  showImages = false,
  onToggleShowImages,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const modes = [
    { id: 'manual', label: 'Manuale (Warburg)', icon: Layers, desc: 'Disposizione curatoriale aperta' },
    { id: 'chronological', label: 'Cronologico', icon: Clock, desc: 'Nastro temporale per anno' },
    { id: 'chromatic', label: 'Cromatico', icon: Palette, desc: 'Spettro delle tinte dominanti' },
  ];

  return (
    <div className="fixed top-20 right-4 md:right-8 z-40 pointer-events-auto font-mono select-none flex flex-col items-end">
      {/* If collapsed: only the settings logo button */}
      {isCollapsed ? (
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          title="Parametri e Controlli Vista"
          className="p-3 rounded-2xl bg-black/85 hover:bg-black border border-white/20 text-amber-400 hover:text-amber-300 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:scale-105 active:scale-95 group focus:outline-none"
        >
          <SlidersHorizontal className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
        </button>
      ) : (
        /* Expanded Card collapsing vertically */
        <div className="w-60 sm:w-64 rounded-2xl bg-black/85 backdrop-blur-2xl border border-white/20 shadow-2xl overflow-hidden transition-all duration-300 animate-fadeIn">
          {/* Header Bar: Only the settings logo on the left + collapse button on the right (NO text title) */}
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-zinc-900/70 border-b border-white/10">
            <div className="flex items-center gap-2 text-amber-400">
              <SlidersHorizontal className="w-4 h-4" />
            </div>

            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors focus:outline-none"
              title="Comprimi pannello controlli"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>

          {/* Controls Body */}
          <div className="p-3 space-y-3">
            {/* 1. Toggle Mostra Opere / Sagome */}
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/[0.04] border border-white/10">
              <div className="flex items-center gap-2">
                {showImages ? (
                  <Eye className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-white/60 flex-shrink-0" />
                )}
                <div className="flex flex-col">
                  <span className="text-[11px] font-mono font-medium text-white tracking-wide">
                    {showImages ? 'Opere Visibili' : 'Sagome Quadrati'}
                  </span>
                  <span className="text-[8px] font-mono text-white/40">
                    {showImages ? 'Texture HD attive' : 'Spazi leggeri 60fps'}
                  </span>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={onToggleShowImages}
                title={showImages ? 'Disattiva immagini per massima fluidità' : 'Carica e visualizza le immagini delle opere'}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  showImages ? 'bg-cyan-500' : 'bg-white/20'
                }`}
                role="switch"
                aria-checked={showImages}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    showImages ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 2. Riconfigurazione Spaziale */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[9px] font-mono tracking-widest text-white/40 uppercase">
                Riconfigurazione
              </div>
              <div className="grid grid-cols-1 gap-1">
                {modes.map((m) => {
                  const Icon = m.icon;
                  const isActive = currentMode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => onSelectMode(m.id)}
                      title={m.desc}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all text-left ${
                        isActive
                          ? 'bg-white/20 text-white border border-white/30 shadow-md'
                          : 'text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="text-[10px] font-mono tracking-wide truncate">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Magnitudo / Scala Nodi */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-[9px] font-mono tracking-widest text-white/50 uppercase">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Magnitudo</span>
                </span>
                <span className="text-white/90 font-mono font-semibold">{Math.round(magnitude * 100)}%</span>
              </div>

              <input
                type="range"
                min="0.3"
                max="2.0"
                step="0.05"
                value={magnitude}
                onChange={(e) => onMagnitudeChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
                title="Regola la dimensione visiva dei nodi-stella"
              />

              <div className="flex justify-between text-[8px] font-mono text-white/40">
                <span>Piccole (Stelle)</span>
                <span>Grandi (Quadri)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
