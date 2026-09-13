import React from 'react';
import { Sparkles, UploadCloud, X, RotateCcw, Sliders, Check, Loader2, Maximize2, Move } from 'lucide-react';

export default function SpatialCuratorHUD({
  selectedArtwork,
  currentCoords,
  onDeselect,
  onScaleChange,
  onResetPosition,
  onExit,
  onCommitAndSync,
  isSyncing,
  modifiedCount = 0,
  syncStatus,
}) {
  const individualScale = typeof selectedArtwork?.scala === 'number'
    ? selectedArtwork.scala
    : (selectedArtwork?.dimensione || 1.0);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 select-none font-mono flex flex-col justify-between p-4 md:p-6">
      {/* 1. Top Control Bar */}
      <div className="flex items-center justify-between gap-3 bg-black/85 border border-emerald-500/40 rounded-2xl px-4 py-3 backdrop-blur-2xl shadow-2xl pointer-events-auto max-w-4xl mx-auto w-full animate-fadeIn">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
            <Move className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider text-emerald-300 uppercase">
                Curatela Spaziale 3D
              </span>
              {modifiedCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-semibold">
                  {modifiedCount} {modifiedCount === 1 ? 'modifica' : 'modifiche'}
                </span>
              )}
            </div>
            <p className="text-[10px] text-zinc-400 hidden sm:block">
              Clicca su un'opera per attivare il gizmo 3D e trascinarla nello spazio
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Auto-commit badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Autocommit 3 min</span>
          </div>

          {/* Commit & Sync Button */}
          <button
            type="button"
            onClick={onCommitAndSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-semibold text-xs transition-all shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
            title="Salva e committa tutte le nuove coordinate e dimensioni nell'Atlante perenne"
          >
            {isSyncing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <UploadCloud className="w-3.5 h-3.5" />
            )}
            <span>{isSyncing ? 'Salvataggio...' : 'Salva & Committa'}</span>
          </button>

          {/* Exit 3D Edit Mode */}
          <button
            type="button"
            onClick={onExit}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all cursor-pointer"
            title="Esci dalla modalità Curatela 3D"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sync Status Notification */}
      {syncStatus && (
        <div
          className={`max-w-xl mx-auto pointer-events-auto px-4 py-2 rounded-xl text-xs flex items-center gap-2 border shadow-2xl backdrop-blur-2xl transition-all ${
            syncStatus.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-400/40 text-emerald-300'
              : 'bg-red-950/90 border-red-400/40 text-red-300'
          }`}
        >
          {syncStatus.type === 'success' ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-red-400" />}
          <span>{syncStatus.message}</span>
        </div>
      )}

      {/* 2. Selected Artwork Inspector Card (Bottom) */}
      {selectedArtwork ? (
        <div className="max-w-md w-full mx-auto bg-black/90 border border-emerald-500/30 rounded-2xl p-4 backdrop-blur-2xl shadow-2xl pointer-events-auto animate-fadeIn space-y-3">
          {/* Header of Card */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {selectedArtwork.immagine ? (
                <img
                  src={selectedArtwork.immagine}
                  alt={selectedArtwork.titolo}
                  className="w-12 h-12 rounded-xl object-cover border border-white/20 flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white/40 flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
              )}
              <div className="min-w-0">
                <div className="text-[10px] text-amber-400 uppercase tracking-widest font-semibold">
                  {selectedArtwork.segno}
                </div>
                <div className="text-sm font-bold text-white truncate">
                  {selectedArtwork.artista}
                </div>
                <div className="text-xs text-zinc-300 truncate italic">
                  {selectedArtwork.titolo}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onDeselect}
              className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white"
              title="Deseleziona opera"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Coordinate Readouts */}
          <div className="grid grid-cols-3 gap-2 bg-white/[0.04] p-2 rounded-xl border border-white/10 text-center text-[11px]">
            <div>
              <span className="text-zinc-500 block text-[9px]">ASSE X</span>
              <span className="text-emerald-400 font-bold">{currentCoords?.x ?? 0}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[9px]">ASSE Y</span>
              <span className="text-emerald-400 font-bold">{currentCoords?.y ?? 0}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[9px]">ASSE Z</span>
              <span className="text-emerald-400 font-bold">{currentCoords?.z ?? 0}</span>
            </div>
          </div>

          {/* Individual Scale Slider */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-zinc-300 text-[11px]">
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Dimensione Opera</span>
              </span>
              <span className="text-amber-300 font-bold text-xs">
                {Math.round(individualScale * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.4"
              max="2.5"
              step="0.05"
              value={individualScale}
              onChange={(e) => onScaleChange(selectedArtwork.id, parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <button
              type="button"
              onClick={() => onResetPosition(selectedArtwork.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors text-[11px]"
              title="Ripristina la posizione calcolata astronomicamente"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Ripristina Posizione</span>
            </button>

            <button
              type="button"
              onClick={onDeselect}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-400/30 text-[11px] font-semibold"
            >
              Conferma Nodo
            </button>
          </div>
        </div>
      ) : (
        /* Hint when no artwork is selected */
        <div className="max-w-sm mx-auto bg-black/60 border border-white/15 rounded-2xl px-4 py-2 text-center text-xs text-white/60 backdrop-blur-xl">
          💡 Clicca su un nodo per selezionarlo e spostarlo
        </div>
      )}
    </div>
  );
}
