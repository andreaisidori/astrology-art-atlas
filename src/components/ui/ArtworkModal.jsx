import React from 'react';
import { X, ExternalLink, Calendar, Tag, Sparkles, Compass } from 'lucide-react';
import { ZODIAC_SIGNS } from '../../utils/astronomy';
import ZodiacGlyph from './ZodiacGlyph';

export default function ArtworkModal({ artwork, onClose, onSelectSign, onSelectKeyword }) {
  if (!artwork) return null;

  const signInfo = ZODIAC_SIGNS.find(
    s => s.name.toLowerCase() === (artwork.segno || '').toLowerCase() || s.id === artwork.segno
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] bg-zinc-950/95 border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 hover:bg-white/20 text-white/80 hover:text-white border border-white/10 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Artwork Image Display */}
        <div className="md:w-1/2 bg-black flex items-center justify-center p-4 relative group overflow-hidden min-h-[260px] md:min-h-0">
          <img
            src={artwork.immagine}
            alt={`${artwork.artista} - ${artwork.titolo}`}
            className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg shadow-lg transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Dominant Color Swatch Badge */}
          {artwork.colore_dominante && (
            <div
              className="absolute bottom-3 left-3 px-2 py-1 rounded-md text-[10px] font-mono flex items-center gap-1.5 bg-black/70 backdrop-blur-md border border-white/10"
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: artwork.colore_dominante }}
              />
              <span className="text-white/70">{artwork.colore_dominante}</span>
            </div>
          )}
        </div>

        {/* Right: Artwork Metadata & Warburgian Symbolic Note */}
        <div className="md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between gap-6 border-t md:border-t-0 md:border-l border-white/10">
          <div className="space-y-4">
            {/* Zodiac Category Tag */}
            {signInfo && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (onSelectSign) onSelectSign(signInfo.id);
                    onClose();
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider transition-all border"
                  style={{
                    backgroundColor: `${signInfo.color}20`,
                    borderColor: `${signInfo.color}60`,
                    color: '#fff',
                  }}
                >
                  <ZodiacGlyph sign={signInfo.id} className="w-4 h-4 text-white" />
                  <span className="font-bold">{signInfo.latin}</span>
                  <span className="opacity-60 text-[10px]">({signInfo.name} &bull; {signInfo.element})</span>
                </button>
              </div>
            )}

            {/* Title & Artist */}
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">{artwork.artista}</h2>
              {artwork.date_biografiche && (
                <p className="text-xs text-zinc-400 font-mono mt-0.5">({artwork.date_biografiche})</p>
              )}
              <p className="text-sm text-zinc-300 italic font-serif mt-1">{artwork.titolo}</p>
            </div>

            {/* Natal Chart Anagrafica (Sole, Luna, Venere, Mercurio) */}
            {artwork.tema_natale && (
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 space-y-2">
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Tema Natale (Pianeti Personali)</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-amber-400 flex items-center gap-1">☉ Sole:</span>
                    <span className="text-white flex items-center gap-1.5">
                      {artwork.tema_natale.sole && <ZodiacGlyph sign={artwork.tema_natale.sole} className="w-3.5 h-3.5 text-amber-300" />}
                      <span>{artwork.tema_natale.sole || '—'}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-blue-300 flex items-center gap-1">☽ Luna:</span>
                    <span className="text-white flex items-center gap-1.5">
                      {artwork.tema_natale.luna && <ZodiacGlyph sign={artwork.tema_natale.luna} className="w-3.5 h-3.5 text-blue-300" />}
                      <span>{artwork.tema_natale.luna || '—'}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-emerald-300 flex items-center gap-1">♀ Venere:</span>
                    <span className="text-white flex items-center gap-1.5">
                      {artwork.tema_natale.venere && <ZodiacGlyph sign={artwork.tema_natale.venere} className="w-3.5 h-3.5 text-emerald-300" />}
                      <span>{artwork.tema_natale.venere || '—'}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-purple-300 flex items-center gap-1">☿ Mercurio:</span>
                    <span className="text-white flex items-center gap-1.5">
                      {artwork.tema_natale.mercurio && <ZodiacGlyph sign={artwork.tema_natale.mercurio} className="w-3.5 h-3.5 text-purple-300" />}
                      <span>{artwork.tema_natale.mercurio || '—'}</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Technical Metadata */}
            <div className="space-y-1 text-xs text-zinc-400 font-mono">
              {artwork.anno && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Anno: {artwork.anno}</span>
                </div>
              )}
              {artwork.tecnica && (
                <div className="text-zinc-400 text-xs">
                  <span className="text-zinc-500">Tecnica / Stato:</span> {artwork.tecnica}
                </div>
              )}
            </div>

            {/* Warburgian Symbolic Note */}
            {artwork.nota_simbolica && (
              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-400/90 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Affinità Mnemotecnica</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  {artwork.nota_simbolica}
                </p>
              </div>
            )}

            {/* Keywords */}
            {artwork.parole_chiave && artwork.parole_chiave.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  <Tag className="w-3 h-3" />
                  <span>Motivi Ricorrenti / Simboli</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {artwork.parole_chiave.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[11px] bg-white/10 text-zinc-300 font-mono border border-white/10"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* External Source Link */}
          {artwork.link_fonte && (
            <div className="pt-4 border-t border-white/10">
              <a
                href={artwork.link_fonte}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline"
              >
                <span>Archivio / Fonte esterna</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
