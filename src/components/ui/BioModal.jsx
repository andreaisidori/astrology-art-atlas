import React from "react";
import { X, Instagram, Mail, Compass, Sparkles, BookOpen, User, ExternalLink } from "lucide-react";

export default function BioModal({ isOpen, onClose, bioData, onOpenAdmin }) {
  if (!isOpen) return null;

  const curatore = bioData || {
    nome: "Giacomo Isidori",
    ruolo: "Curatore & Ideatore",
    biografia: "Giacomo Isidori è curatore, ricercatore e ideatore del progetto AAA — Astrology Art Atlas. La sua pratica curatoriale indaga le relazioni tra iconologia simbolica, archetipi celesti e l’arte contemporanea, riattivando il metodo delle tavole mnemotecniche teorizzato da Aby Warburg in chiave tridimensionale e immersiva.",
    visione: "AAA — Astrology Art Atlas nasce come dispositivo euristico e archivio vivente: una mappa cosmica in cui le costellazioni e i 12 archetipi zodiacali offrono una tassonomia aperta e trasversale per leggere la storia dell’arte al di là delle convenzioni cronologiche lineari.",
    instagram: "https://instagram.com/astro.expression",
    email: "astro.expression@gmail.com"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-xl animate-fadeIn select-text text-white">
      {/* Modal Card */}
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0a0a14] border border-[#e5b869]/30 shadow-[0_0_50px_rgba(229,184,105,0.15)] overflow-hidden">
        
        {/* Top Decorative Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#e5b869] to-transparent" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-[#e5b869] shadow-inner">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-serif font-bold text-white tracking-wide flex items-center gap-2">
                {curatore.nome || "Giacomo Isidori"}
              </h2>
              <p className="text-xs font-mono text-[#e5b869] tracking-wider uppercase">
                {curatore.ruolo || "Curatore & Ideatore"} &bull; AAA
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all border border-white/10"
            title="Chiudi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with Scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-zinc-300 font-light text-sm md:text-base leading-relaxed custom-scrollbar">
          
          {/* Biografia Section */}
          <div className="space-y-3 bg-white/[0.02] p-5 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#e5b869]">
              <BookOpen className="w-4 h-4" />
              <span>Biografia</span>
            </div>
            <div className="whitespace-pre-line text-zinc-200">
              {curatore.biografia || "Biografia in attesa di compilazione."}
            </div>
          </div>

          {/* Visione Curatoriale Section */}
          {curatore.visione && (
            <div className="space-y-3 bg-white/[0.02] p-5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#e5b869]">
                <Compass className="w-4 h-4" />
                <span>Visione & Metodo Curatoriale</span>
              </div>
              <div className="whitespace-pre-line italic text-zinc-300 font-serif">
                "{curatore.visione}"
              </div>
            </div>
          )}

          {/* Canali & Contatti Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#e5b869]">
              <Sparkles className="w-4 h-4" />
              <span>Contatti & Collegamenti</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {curatore.instagram && (
                <a
                  href={curatore.instagram.startsWith("http") ? curatore.instagram : `https://instagram.com/${curatore.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-pink-500/30 text-pink-200 hover:border-pink-400 hover:text-white transition-all text-xs font-mono"
                >
                  <Instagram className="w-4 h-4 text-pink-400" />
                  <span>@astro.expression</span>
                  <ExternalLink className="w-3 h-3 opacity-60 ml-1" />
                </a>
              )}

              {curatore.email && (
                <a
                  href={`mailto:${curatore.email}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/15 text-zinc-200 hover:border-amber-400/50 hover:text-white transition-all text-xs font-mono"
                >
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>{curatore.email}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs font-mono text-zinc-400">
          <span>AAA &bull; Astrology Art Atlas</span>
          {onOpenAdmin && (
            <button
              onClick={() => {
                onClose();
                onOpenAdmin();
              }}
              className="text-[#e5b869] hover:underline flex items-center gap-1"
            >
              <span>Modifica Biografia nel Backend</span>
              <span className="text-[10px]">🔒</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
