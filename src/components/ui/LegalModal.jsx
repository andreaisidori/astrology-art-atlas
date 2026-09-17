import React from 'react';
import { X, ShieldCheck, Scale, Mail, FileText } from 'lucide-react';

export default function LegalModal({ isOpen, onClose, legalData }) {
  if (!isOpen) return null;

  const titolo = legalData?.titolo || "Note Legali e Disclaimer";

  const sez1Titolo = legalData?.sezione_1_titolo || "Atlante e Condivisione della Ricerca";
  const sez1Testo = legalData?.sezione_1_testo || "I materiali, le raccolte e le analisi presenti su questo sito nascono come un progetto di studi aperti e condivisi. L'intero impianto e i testi originali sono pensati per la diffusione e la libera consultazione nell'ambito della ricerca; tuttavia, si richiede di citare la fonte e l'autore in caso di riutilizzo o condivisione dei contenuti.";

  const sez2Titolo = legalData?.sezione_2_titolo || "Immagini e materiali di terze parti";
  const sez2Testo = legalData?.sezione_2_testo || "Le immagini di opere d'arte o di artisti eventualmente presenti nel sito sono utilizzate esclusivamente a fini di studio, ricerca, critica e documentazione, senza alcun intento di lucro o sfruttamento commerciale, ai sensi dell'articolo 70 della Legge sul Diritto d'Autore (L. 633/1941).";

  const sez3Titolo = legalData?.sezione_3_titolo || "Tutela e rimozione contenuti";
  const sez3Testo = legalData?.sezione_3_testo || "Qualora il titolare di qualsiasi diritto sulle immagini o sui materiali pubblicati ritenesse che la loro presenza leda in alcun modo i propri interessi o diritti, è pregato di darne immediata comunicazione via email giacomo.isidori@gmail.com . L'autore provvederà alla loro tempestiva verifica e rimozione.";
  const email = legalData?.email_contatto || "giacomo.isidori@gmail.com";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-2xl max-h-[88vh] bg-zinc-950/95 border border-white/20 rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 overflow-y-auto text-white space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all shadow-lg"
          title="Chiudi Note Legali"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 border-b border-white/10 pb-4">
          <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight font-serif text-white">{titolo}</h2>
            <p className="text-xs font-mono text-zinc-400">AAA &bull; Astrology Art Atlas</p>
          </div>
        </div>

        {/* Section 1 */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-cyan-300">
            <FileText className="w-4 h-4" />
            <span>{sez1Titolo}</span>
          </div>
          <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-sans">
            {sez1Testo}
          </p>
        </div>

        {/* Section 2 */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-amber-300">
            <Scale className="w-4 h-4" />
            <span>{sez2Titolo}</span>
          </div>
          <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-sans">
            {sez2Testo}
          </p>
        </div>

        {/* Section 3 */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-300">
            <Mail className="w-4 h-4" />
            <span>{sez3Titolo}</span>
          </div>
          <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-sans">
            {sez3Testo}
          </p>
          {email && (
            <div className="pt-2">
              <a
                href={`mailto:${email}?subject=AAA%20Astrology%20Art%20Atlas%20-%20Richiesta%20Informazioni%20/%20Tutela`}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 text-emerald-300 text-xs font-mono transition-all"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{email}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
