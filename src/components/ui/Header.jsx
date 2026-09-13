import React from 'react';
import { Sparkles, Sun, Moon, Info, Eye, Disc, Lock } from 'lucide-react';
import ZodiacGlyph from './ZodiacGlyph';

export default function Header({
  viewMode,
  onToggleViewMode,
  moonInfo,
  isDomeView,
  onToggleDomeView,
  onOpenInfo,
  onOpenAdmin,
  onOpenLanding,
  onOpenBio,
  activeSignId,
  onResetSign,
}) {
  const isNight = viewMode === '3d';

  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-4 md:px-8 pointer-events-none">
      {/* Left: Project Brand with Astrolabe Gold Logo */}
      <div className="flex items-center gap-3.5 pointer-events-auto">
        {/* Astrolabe Gold Logo Icon */}
        <div className="relative flex-shrink-0 group">
          <img
            src="/images/aaa-logo-gold.png"
            alt="AAA Logo"
            className="w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-[0_0_14px_rgba(243,203,114,0.5)] hover:rotate-12 transition-transform duration-500 cursor-pointer"
            onClick={onOpenLanding || onResetSign}
            title="AAA — Astrology Art Atlas (Clicca per tornare al portale iniziale)"
          />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className={`text-sm md:text-base font-bold tracking-wider uppercase transition-colors flex items-center gap-1.5 ${
              isNight ? 'text-white' : 'text-zinc-900'
            }`}>
              <span className="text-amber-400 font-extrabold tracking-widest">AAA</span>
              <span className="text-[11px] font-normal opacity-60 lowercase font-mono">/ astrology art atlas</span>
            </h1>
          </div>
          <button
            onClick={onOpenBio}
            className={`text-[10px] tracking-wide font-mono transition-all text-left flex items-center gap-1 group/bio ${
              isNight ? 'text-white/60 hover:text-amber-300' : 'text-zinc-600 hover:text-amber-600'
            }`}
            title="Leggi la biografia di Giacomo Isidori"
          >
            <span className="group-hover/bio:underline">a cura di Giacomo Isidori</span>
            <span className="text-[8px] opacity-60">↗</span>
          </button>
        </div>

        {/* Active Sign Filter Pill */}
        {activeSignId && (
          <button
            onClick={onResetSign}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-blue-500/20 text-blue-300 border border-blue-400/30 hover:bg-blue-500/30 transition-all pointer-events-auto"
          >
            <ZodiacGlyph sign={activeSignId} className="w-3 h-3" color="currentColor" />
            <span>Focus: {activeSignId.toUpperCase()}</span>
            <span className="text-[10px] opacity-60 ml-1">✕</span>
          </button>
        )}
      </div>

      {/* Right: Controls & Toggles */}
      <div className="flex items-center gap-2 md:gap-3 pointer-events-auto">
        {/* Dome / Fisheye Simulator Toggle (Only in 3D Mode) */}
        {isNight && (
          <button
            onClick={onToggleDomeView}
            title={isDomeView ? 'Disattiva anteprima Cupola / Fisheye' : 'Attiva anteprima Cupola / Fisheye'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isDomeView
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/10'
                : 'bg-black/40 border-white/15 text-white/70 hover:text-white hover:border-white/30 backdrop-blur-md'
            }`}
          >
            <Disc className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cupola {isDomeView ? 'ON' : 'Preview'}</span>
          </button>
        )}

        {/* Day / Night Polarity Switch */}
        <button
          onClick={onToggleViewMode}
          title={isNight ? 'Passa all’Archivio Tassonomico Bianco (Giorno)' : 'Torna alla Volta Celeste 3D (Notte)'}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all shadow-md ${
            isNight
              ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-md'
              : 'bg-zinc-900 text-white hover:bg-zinc-800 border-zinc-800'
          }`}
        >
          {isNight ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Archivio Bianco</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-300" />
              <span className="hidden sm:inline">Volta Celeste 3D</span>
            </>
          )}
        </button>

        {/* Info & Statement Modal Button */}
        <button
          onClick={onOpenInfo}
          title="Visione e Metodo Mnemosyne"
          className={`p-2 rounded-lg border transition-all backdrop-blur-md ${
            isNight
              ? 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/15'
              : 'bg-white border-zinc-200 text-zinc-700 hover:text-zinc-950 shadow-sm'
          }`}
        >
          <Info className="w-4 h-4" />
        </button>

        {/* Protected Curator Studio Button */}
        <button
          onClick={onOpenAdmin}
          title="Curator Studio / Gestione Backend (Protetto)"
          className={`p-2 rounded-lg border transition-all backdrop-blur-md ${
            isNight
              ? 'bg-white/5 border-white/10 text-cyan-400 hover:text-cyan-300 hover:bg-white/15 hover:border-cyan-400/40'
              : 'bg-white border-zinc-200 text-cyan-700 hover:text-cyan-900 shadow-sm'
          }`}
        >
          <Lock className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
