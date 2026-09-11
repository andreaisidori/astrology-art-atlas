import React from 'react';
import { X, Sparkles, Orbit, Compass, Eye, BookOpen } from 'lucide-react';

export default function InfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Click outside */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-2xl max-h-[88vh] bg-zinc-950/95 border border-white/20 rounded-2xl shadow-2xl p-6 md:p-8 overflow-y-auto text-white space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title & Subtitle */}
        <div className="flex items-center gap-4">
          <img
            src="/images/aaa-logo-gold.png"
            alt="AAA Astrolabe Logo"
            className="w-14 h-14 object-contain drop-shadow-[0_0_15px_rgba(243,203,114,0.4)] flex-shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              <span>Visione Concettuale &bull; Dottorato di Ricerca</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">AAA — Astrology Art Atlas</h2>
            <p className="text-xs font-mono text-zinc-400">Curatela e ricerca di Giacomo Isidori &bull; Ispirato ad Aby Warburg</p>
          </div>
        </div>

        {/* Conceptual Text */}
        <div className="space-y-4 text-sm text-zinc-300 leading-relaxed font-sans border-y border-white/10 py-5">
          <p>
            Questo atlante celeste dinamico in 3D costituisce la parte pratica di una ricerca di storia dell'arte ispirata al metodo di <strong className="text-white">Aby Warburg</strong> e al suo celebre <em>Bilderatlas Mnemosyne</em>: un sistema aperto, non gerarchico, per orientarsi nell'immaginario collettivo attraverso il montaggio associativo di immagini anziché una narrazione lineare.
          </p>

          <p>
            Non si tratta di un progetto astrologico in senso divinatorio: lo zodiaco è impiegato come <strong className="text-white">struttura archivistica e mnemotecnica</strong>, un sistema di 12 categorie simboliche per organizzare un vasto corpus di opere d'arte contemporanea.
          </p>

          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 space-y-2">
            <h4 className="text-xs font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>Dalla Volta Web all'Installazione su Cupola</span>
            </h4>
            <p className="text-xs text-zinc-300">
              Il sito è progettato per essere fruibile nel browser ed essere successivamente proiettato dall'alto su una semisfera/cupola tramite specchio sferico. Nel buio dell'installazione, il pubblico sdraiato a terra "naviga" tra le immagini con lo sguardo rivolto verso l'alto — un'esperienza di pensiero associativo, orizzontale e onirico.
            </p>
          </div>
        </div>

        {/* Navigation Instructions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-1">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <Orbit className="w-3.5 h-3.5 text-cyan-400" />
              <span>Esplorazione 360°</span>
            </div>
            <p className="text-zinc-400 text-[11px]">Trascina per guardare in alto e intorno a te; usa la rotella per zoomare.</p>
          </div>

          <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-1">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Riconfigurazioni</span>
            </div>
            <p className="text-zinc-400 text-[11px]">Usa i tasti di layout per riordinare le stelle in modo cronologico o cromatico.</p>
          </div>

          <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-1">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Archivio Bianco</span>
            </div>
            <p className="text-zinc-400 text-[11px]">Passa alla vista Giorno per consultare la catalogazione tassonomica delle opere.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white text-zinc-950 font-medium text-xs hover:bg-zinc-200 transition-all shadow-lg"
          >
            Entra nell'Atlante
          </button>
        </div>
      </div>
    </div>
  );
}
