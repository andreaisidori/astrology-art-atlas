import React from 'react';
import { X, Orbit, Compass, BookOpen } from 'lucide-react';

export default function InfoModal({ isOpen, onClose, infoData }) {
  if (!isOpen) return null;

  const titolo = infoData?.titolo || "AAA — Astrology Art Atlas";
  const crediti = infoData?.crediti || "Curatela e ricerca di Giacomo Isidori • Ispirato ad Aby Warburg";
  const testoConcettuale = infoData?.testo_concettuale || "Questo atlante celeste dinamico in 3D costituisce la parte pratica di una ricerca di storia dell'arte ispirata al metodo di Aby Warburg e al suo celebre Bilderatlas Mnemosyne: un sistema aperto, non gerarchico, per orientarsi nell'immaginario collettivo attraverso il montaggio associativo di immagini anziché una narrazione lineare.";
  const testoStruttura = infoData?.testo_struttura || "Non si tratta di un progetto astrologico in senso divinatorio: lo zodiaco è impiegato come struttura archivistica e mnemotecnica, un sistema di 12 categorie simboliche per organizzare un vasto corpus di opere d'arte contemporanea.";
  const testoCupola = infoData?.testo_cupola || "Il sito è progettato per essere fruibile nel browser ed essere successivamente proiettato dall'alto su una semisfera/cupola tramite specchio sferico. Nel buio dell'installazione, il pubblico sdraiato a terra \"naviga\" tra le immagini con lo sguardo rivolto verso l'alto — un'esperienza di pensiero associativo, orizzontale e onirico.";

  // Dynamic 3 boxes titles and texts
  const box1Titolo = infoData?.box_1_titolo || "Esplorazione 360°";
  const box1Testo = infoData?.box_1_testo || "Trascina per guardare in alto e intorno a te; usa la rotella per zoomare.";
  const box2Titolo = infoData?.box_2_titolo || "Riconfigurazioni";
  const box2Testo = infoData?.box_2_testo || "Usa i tasti di layout per riordinare le stelle in modo cronologico o cromatico.";
  const box3Titolo = infoData?.box_3_titolo || "Archivio Bianco";
  const box3Testo = infoData?.box_3_testo || "Passa alla vista Giorno per consultare la catalogazione tassonomica delle opere.";

  // Split multi-paragraph custom text cleanly
  const renderParagraphs = (text) => {
    if (!text) return null;
    return text.split('\n\n').flatMap((chunk, i) =>
      chunk.split('\n').map((line, j) => (
        <p key={`${i}-${j}`} className="leading-relaxed">
          {line}
        </p>
      ))
    );
  };

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

        {/* Title & Credits */}
        <div className="flex items-center gap-4">
          <img
            src="/images/aaa-logo-gold.png"
            alt="AAA Astrolabe Logo"
            className="w-14 h-14 object-contain drop-shadow-[0_0_15px_rgba(243,203,114,0.4)] flex-shrink-0"
          />
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight font-serif">{titolo}</h2>
            <p className="text-xs font-mono text-zinc-400">{crediti}</p>
          </div>
        </div>

        {/* Conceptual Text */}
        <div className="space-y-4 text-sm text-zinc-300 leading-relaxed font-sans border-y border-white/10 py-5">
          {renderParagraphs(testoConcettuale)}
          {renderParagraphs(testoStruttura)}
          {renderParagraphs(testoCupola)}
        </div>

        {/* Navigation Instructions / 3 Customizable Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-1">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <Orbit className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono text-[11px]">{box1Titolo}</span>
            </div>
            <p className="text-zinc-400 text-[11px]">{box1Testo}</p>
          </div>

          <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-1">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono text-[11px]">{box2Titolo}</span>
            </div>
            <p className="text-zinc-400 text-[11px]">{box2Testo}</p>
          </div>

          <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-1">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-[11px]">{box3Titolo}</span>
            </div>
            <p className="text-zinc-400 text-[11px]">{box3Testo}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
