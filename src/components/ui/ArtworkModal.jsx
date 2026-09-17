import React, { useState, useMemo, useEffect } from 'react';
import { X, ExternalLink, Calendar, Tag, Sparkles, Compass, Quote, BookOpen, ChevronLeft, ChevronRight, Maximize2, ZoomIn, Layers } from 'lucide-react';
import { ZODIAC_SIGNS, formatBiographicalDates } from '../../utils/astronomy';
import ZodiacGlyph from './ZodiacGlyph';

export default function ArtworkModal({
  artwork,
  allArtworks = [],
  onSelectArtwork,
  onClose,
  onSelectSign,
  onSelectKeyword,
}) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Group artworks by same artist
  const artistArtworks = useMemo(() => {
    if (!artwork) return [];
    if (!allArtworks || allArtworks.length === 0) return [artwork];
    const artistName = (artwork.artista || '').trim().toLowerCase();
    const list = allArtworks.filter(a => (a.artista || '').trim().toLowerCase() === artistName);
    return list.length > 0 ? list : [artwork];
  }, [artwork, allArtworks]);

  const currentIndex = useMemo(() => {
    if (!artwork) return 0;
    const idx = artistArtworks.findIndex(a => a.id === artwork.id);
    return idx >= 0 ? idx : 0;
  }, [artwork, artistArtworks]);

  const handlePrev = (e) => {
    e?.stopPropagation();
    if (artistArtworks.length <= 1 || !onSelectArtwork) return;
    const prevIdx = (currentIndex - 1 + artistArtworks.length) % artistArtworks.length;
    onSelectArtwork(artistArtworks[prevIdx]);
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    if (artistArtworks.length <= 1 || !onSelectArtwork) return;
    const nextIdx = (currentIndex + 1) % artistArtworks.length;
    onSelectArtwork(artistArtworks[nextIdx]);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!artwork) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
        } else {
          onClose?.();
        }
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [artwork, isLightboxOpen, currentIndex, artistArtworks]);

  if (!artwork) return null;

  const signInfo = ZODIAC_SIGNS.find(
    s => s.name.toLowerCase() === (artwork.segno || '').toLowerCase() || s.id === artwork.segno
  );

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
        {/* Click outside backdrop */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Modal Dialog Card */}
        <div className="relative z-10 w-full max-w-4xl lg:max-w-5xl max-h-[92vh] bg-zinc-950/95 border border-white/20 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row text-white">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 z-30 p-2 rounded-full bg-black/70 hover:bg-white/20 text-white/80 hover:text-white border border-white/10 transition-all shadow-lg"
            title="Chiudi scheda"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Left: Artwork Image Display & Artist Carousel */}
          <div className="md:w-1/2 bg-black/90 flex flex-col justify-between relative group overflow-hidden min-h-[280px] md:min-h-0 border-b md:border-b-0 md:border-r border-white/10">
            {/* Main Image Container */}
            <div
              onClick={() => setIsLightboxOpen(true)}
              className="relative flex-1 flex items-center justify-center p-4 md:p-6 cursor-zoom-in group/img overflow-hidden"
            >
              <img
                src={artwork.immagine}
                alt={`${artwork.artista} - ${artwork.titolo}`}
                className="max-h-[55vh] md:max-h-[68vh] w-auto max-w-full object-contain rounded-xl shadow-2xl transition-all duration-500 group-hover/img:scale-[1.02]"
                loading="lazy"
              />

              {/* Hover Zoom Prompt Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 pointer-events-none">
                <span className="px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs font-mono flex items-center gap-1.5 shadow-xl">
                  <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Ingrandisci Opera</span>
                </span>
              </div>

              {/* Prev / Next Floating Arrows for multiple artworks by the same artist */}
              {artistArtworks.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/75 hover:bg-cyan-500 hover:text-black text-white border border-white/20 backdrop-blur-md transition-all shadow-xl hover:scale-110 active:scale-95"
                    title="Opera precedente dell'artista"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/75 hover:bg-cyan-500 hover:text-black text-white border border-white/20 backdrop-blur-md transition-all shadow-xl hover:scale-110 active:scale-95"
                    title="Opera successiva dell'artista"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Bar on Image (Color Swatch & Multi-artwork Indicators) */}
            <div className="p-3 bg-black/60 backdrop-blur-md border-t border-white/10 flex items-center justify-between gap-2 text-[11px] font-mono">
              {/* Dominant Color Swatch Badge */}
              {artwork.colore_dominante ? (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/30"
                    style={{ backgroundColor: artwork.colore_dominante }}
                  />
                  <span className="text-zinc-400">{artwork.colore_dominante}</span>
                </div>
              ) : <div />}

              {/* Multi-artwork indicator & switcher */}
              {artistArtworks.length > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-cyan-300 font-medium">
                    Opera {currentIndex + 1} di {artistArtworks.length}
                  </span>
                  <div className="flex items-center gap-1">
                    {artistArtworks.map((item, idx) => (
                      <button
                        key={item.id || idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectArtwork?.(item);
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentIndex
                            ? 'bg-cyan-400 w-4'
                            : 'bg-white/30 hover:bg-white/60'
                        }`}
                        title={item.titolo || `Opera ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Artwork Metadata & Warburgian Symbolic Note */}
          <div className="md:w-1/2 p-6 md:p-7 overflow-y-auto flex flex-col justify-between gap-6">
            <div className="space-y-4">
              {/* Header Info: Zodiac Category & Multi-work badge */}
              <div className="flex items-center justify-between gap-2 flex-wrap pr-8">
                {signInfo && (
                  <button
                    onClick={() => {
                      if (onSelectSign) onSelectSign(signInfo.id);
                      onClose();
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider transition-all border shadow-sm hover:scale-105"
                    style={{
                      backgroundColor: `${signInfo.color}25`,
                      borderColor: `${signInfo.color}70`,
                      color: '#fff',
                    }}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white/40 flex-shrink-0"
                      style={{ backgroundColor: signInfo.color }}
                    />
                    <ZodiacGlyph sign={signInfo.id} className="w-3.5 h-3.5 text-white" />
                    <span className="font-bold tracking-widest">{signInfo.latin}</span>
                  </button>
                )}

                {artistArtworks.length > 1 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[10px] font-mono">
                    <Layers className="w-3 h-3" />
                    <span>{artistArtworks.length} opere archiviate</span>
                  </span>
                )}
              </div>

              {/* Title & Artist */}
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-tight">
                  {artwork.artista}
                </h2>
                {formatBiographicalDates(artwork) && (
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">
                    ({formatBiographicalDates(artwork)})
                  </p>
                )}
                <p className="text-sm md:text-base text-zinc-300 italic font-serif mt-1">
                  {artwork.titolo || "Senza titolo"}
                </p>
              </div>

              {/* Artist Quote */}
              {artwork.citazione && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-100 italic font-serif text-xs leading-relaxed relative">
                  <Quote className="w-3.5 h-3.5 text-amber-400 mb-1 opacity-80 inline mr-1 -mt-1" />
                  <span>{artwork.citazione}</span>
                </div>
              )}

              {/* Natal Chart Anagrafica (Sole, Luna, Venere, Mercurio) */}
              {artwork.tema_natale && (
                <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-2.5">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Tema Natale &bull; Pianeti Personali</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {/* Sole */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-black/50 border border-white/10 min-w-0">
                      <span className="text-amber-400 font-medium shrink-0">☉ Sole:</span>
                      <span className="text-white flex items-center gap-1.5 truncate ml-1.5">
                        {artwork.tema_natale.sole && (
                          <ZodiacGlyph sign={artwork.tema_natale.sole} className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                        )}
                        <span className="truncate">{artwork.tema_natale.sole || '—'}</span>
                      </span>
                    </div>

                    {/* Luna */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-black/50 border border-white/10 min-w-0">
                      <span className="text-blue-300 font-medium shrink-0">☽ Luna:</span>
                      <span className="text-white flex items-center gap-1.5 truncate ml-1.5">
                        {artwork.tema_natale.luna && (
                          <ZodiacGlyph sign={artwork.tema_natale.luna} className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                        )}
                        <span className="truncate">{artwork.tema_natale.luna || '—'}</span>
                      </span>
                    </div>

                    {/* Venere */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-black/50 border border-white/10 min-w-0">
                      <span className="text-emerald-300 font-medium shrink-0">♀ Venere:</span>
                      <span className="text-white flex items-center gap-1.5 truncate ml-1.5">
                        {artwork.tema_natale.venere && (
                          <ZodiacGlyph sign={artwork.tema_natale.venere} className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                        )}
                        <span className="truncate">{artwork.tema_natale.venere || '—'}</span>
                      </span>
                    </div>

                    {/* Mercurio */}
                    <div className="flex items-center justify-between p-2 rounded-lg bg-black/50 border border-white/10 min-w-0">
                      <span className="text-purple-300 font-medium shrink-0">☿ Mercurio:</span>
                      <span className="text-white flex items-center gap-1.5 truncate ml-1.5">
                        {artwork.tema_natale.mercurio && (
                          <ZodiacGlyph sign={artwork.tema_natale.mercurio} className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                        )}
                        <span className="truncate">{artwork.tema_natale.mercurio || '—'}</span>
                      </span>
                    </div>
                  </div>

                  {artwork.link_tema_natale && (
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <a
                        href={artwork.link_tema_natale}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono text-amber-300 hover:text-amber-200 hover:underline transition-colors"
                      >
                        <Compass className="w-3.5 h-3.5 text-amber-400" />
                        <span>Consulta Tema Natale (Astro-Databank)</span>
                        <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Technical Metadata */}
              <div className="space-y-1.5 text-xs text-zinc-400 font-mono">
                {artwork.anno && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Anno opera: <strong className="text-zinc-200">{artwork.anno}</strong></span>
                  </div>
                )}
                {artwork.tecnica && (
                  <div className="text-zinc-400 text-xs">
                    <span className="text-zinc-500">Tecnica / Supporto:</span> <span className="text-zinc-300">{artwork.tecnica}</span>
                  </div>
                )}
              </div>

              {/* Curatorial Commentary */}
              {artwork.commento && (
                <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-300 uppercase tracking-wider">
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Commento Critico</span>
                  </div>
                  <p className="text-xs text-zinc-200 leading-relaxed font-sans whitespace-pre-line">
                    {artwork.commento}
                  </p>
                </div>
              )}

              {/* Recurring Symbols / Keywords */}
              {artwork.parole_chiave && artwork.parole_chiave.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    <Tag className="w-3 h-3" />
                    <span>Simboli Ricorrenti</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {artwork.parole_chiave.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-md text-[11px] bg-white/10 text-zinc-300 font-mono border border-white/10"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* External Source Link */}
            {artwork.link_fonte && (
              <div className="pt-3 border-t border-white/10">
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

      {/* FULLSCREEN IMAGE LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-2xl animate-fadeIn"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all shadow-2xl"
            title="Chiudi ingrandimento (Esc)"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev / Next Arrows in Lightbox */}
          {artistArtworks.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3.5 rounded-full bg-black/80 hover:bg-cyan-500 hover:text-black text-white border border-white/20 transition-all shadow-2xl hover:scale-110"
                title="Opera precedente"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3.5 rounded-full bg-black/80 hover:bg-cyan-500 hover:text-black text-white border border-white/20 transition-all shadow-2xl hover:scale-110"
                title="Opera successiva"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Centered Large Artwork Image */}
          <div
            className="relative flex flex-col items-center justify-center max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={artwork.immagine}
              alt={`${artwork.artista} - ${artwork.titolo}`}
              className="max-h-[82vh] max-w-[92vw] object-contain rounded-xl shadow-2xl border border-white/10"
            />
            {/* Lightbox Caption */}
            <div className="mt-3 text-center text-white/90">
              <p className="text-sm md:text-base font-bold">{artwork.artista} &bull; <span className="italic font-serif font-normal">{artwork.titolo || "Senza titolo"}</span> {artwork.anno && `(${artwork.anno})`}</p>
              {artwork.tecnica && <p className="text-xs text-zinc-400 font-mono mt-0.5">{artwork.tecnica}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
