import React from 'react';
import { Sparkles, Sun, Moon, Eye, Disc, Lock } from 'lucide-react';

export default function Header({
  viewMode,
  onToggleViewMode,
  moonInfo,
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
            onClick={onOpenLanding}
            title="Torna alla landing page"
          />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className={`text-sm md:text-base font-mono font-bold tracking-wider uppercase transition-colors flex items-center gap-1.5 ${
              isNight ? 'text-white' : 'text-zinc-900'
            }`}>
              <button
                type="button"
                onClick={onOpenInfo}
                className="text-amber-400 hover:text-amber-300 font-extrabold tracking-widest hover:underline underline-offset-4 cursor-pointer transition-all focus:outline-none drop-shadow-[0_0_10px_rgba(243,203,114,0.3)]"
                title="informazioni sul progetto"
              >
                AAA
              </button>
              <span
                className="text-[11px] font-normal opacity-60 lowercase font-mono cursor-pointer"
                onClick={onOpenInfo}
                title="informazioni sul progetto"
              >
                / astrology art atlas
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-1 text-[10px] tracking-wide font-mono transition-colors">
            <span className={isNight ? 'text-white/40' : 'text-zinc-500'}>a cura di</span>
            <button
              onClick={onOpenBio}
              className={`transition-all text-left flex items-center gap-0.5 group/bio font-medium font-mono ${
                isNight ? 'text-amber-300/90 hover:text-amber-300' : 'text-amber-700 hover:text-amber-800'
              }`}
              title="bio"
            >
              <span className="group-hover/bio:underline underline-offset-2">Giacomo Isidori</span>
              <span className="text-[9px] opacity-60">↗</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right: Controls & Toggles */}
      <div className="flex items-center gap-2 md:gap-3 pointer-events-auto">
        {/* Alternanza tra le due sezioni: Archivio (Sole) / Atlante (Luna) */}
        <button
          onClick={onToggleViewMode}
          title={isNight ? 'Passa alla sezione Archivio (Pensiero Diurno / Bianco)' : 'Torna alla sezione Atlante (Volta Celeste 3D)'}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all shadow-md ${
            isNight
              ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-md'
              : 'bg-zinc-900 text-white hover:bg-zinc-800 border-zinc-800'
          }`}
        >
          {isNight ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Archivio</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-300" />
              <span className="hidden sm:inline">Atlante</span>
            </>
          )}
        </button>

        {/* Protected Curator Studio Button */}
        <button
          onClick={onOpenAdmin}
          title="Curator Studio / Gestione Backend (Opere, Bio o Info Progetto)"
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
