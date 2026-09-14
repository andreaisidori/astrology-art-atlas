import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpRight, Grid, List, Sparkles, Quote, ExternalLink } from 'lucide-react';
import { ZODIAC_SIGNS, formatBiographicalDates } from '../../utils/astronomy';
import ZodiacGlyph from './ZodiacGlyph';

export default function ArchiveView({
  artworks,
  onSelectArtwork,
  onBackTo3D,
  initialSignId,
}) {
  const [selectedSign, setSelectedSign] = useState(initialSignId || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('anno-asc');

  // Filter and sort artworks
  const filteredArtworks = useMemo(() => {
    return artworks
      .filter((art) => {
        // Sign filter
        if (selectedSign !== 'all') {
          const match = (art.segno || '').toLowerCase() === selectedSign.toLowerCase();
          if (!match) return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchArtist = (art.artista || '').toLowerCase().includes(q);
          const matchTitle = (art.titolo || '').toLowerCase().includes(q);
          const matchKeywords = (art.parole_chiave || []).some(k => k.toLowerCase().includes(q));
          const matchNote = (art.nota_simbolica || '').toLowerCase().includes(q);
          const matchCommento = (art.commento || '').toLowerCase().includes(q);
          const matchQuote = (art.citazione || '').toLowerCase().includes(q);
          const matchDates = (art.data_nascita || '').toLowerCase().includes(q) || (art.anno_morte || '').toLowerCase().includes(q) || (art.date_biografiche || '').toLowerCase().includes(q);
          if (!matchArtist && !matchTitle && !matchKeywords && !matchNote && !matchCommento && !matchQuote && !matchDates) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'anno-asc') return (a.anno || 0) - (b.anno || 0);
        if (sortBy === 'anno-desc') return (b.anno || 0) - (a.anno || 0);
        if (sortBy === 'artista') return (a.artista || '').localeCompare(b.artista || '');
        return 0;
      });
  }, [artworks, selectedSign, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 pt-20 pb-28 px-4 md:px-12 overflow-y-auto">
      {/* Header bar */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5 text-zinc-700" />
              <span>Tavola Tassonomica Mnemosyne</span>
            </div>
            <h2 className="text-3xl font-light tracking-tight text-zinc-950 font-serif">
              Archivio Ragionato delle Opere
            </h2>
            <p className="text-sm text-zinc-600 max-w-2xl mt-1">
              Organizzazione mnemotecnica delle risonanze simboliche tra arte contemporanea e le 12 categorie zodiacali.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-500">
              {filteredArtworks.length} / {artworks.length} opere visibili
            </span>
          </div>
        </div>

        {/* Filter controls row */}
        <div className="mt-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Cerca artista, titolo, concetto o parola chiave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent shadow-sm"
            />
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-500 uppercase">Ordina:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs bg-white border border-zinc-200 rounded-lg px-3 py-2 text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-900 shadow-sm"
            >
              <option value="anno-asc">Cronologico (più antico prima)</option>
              <option value="anno-desc">Cronologico (più recente prima)</option>
              <option value="artista">Artista (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Zodiac Sign Category Pills */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedSign('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
              selectedSign === 'all'
                ? 'bg-zinc-900 text-white font-medium shadow-sm'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            Tutti i Segni
          </button>

          {ZODIAC_SIGNS.map((sign) => {
            const isSelected = selectedSign.toLowerCase() === sign.id;
            return (
              <button
                key={sign.id}
                onClick={() => setSelectedSign(isSelected ? 'all' : sign.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all whitespace-nowrap border ${
                  isSelected
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400'
                }`}
              >
                <ZodiacGlyph
                  sign={sign.id}
                  className="w-3.5 h-3.5"
                  color={isSelected ? '#ffffff' : '#52525b'}
                />
                <span>{sign.latin}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Artworks Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredArtworks.map((art) => {
          const signInfo = ZODIAC_SIGNS.find(
            s => s.name.toLowerCase() === (art.segno || '').toLowerCase() || s.id === art.segno
          );

          return (
            <div
              key={art.id}
              onClick={() => onSelectArtwork(art)}
              className="group bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-xl hover:border-zinc-400 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
            >
              {/* Image Frame */}
              <div className="relative aspect-[4/3] bg-zinc-100 overflow-hidden">
                <img
                  src={art.miniatura || art.immagine}
                  alt={`${art.artista} - ${art.titolo}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Zodiac Pill Badge on image */}
                {signInfo && (
                  <div
                    className="absolute top-3 left-3 px-2 py-1 rounded-md text-[10px] font-mono tracking-widest uppercase flex items-center gap-1.5 shadow-md backdrop-blur-md bg-zinc-950/85 text-white border border-white/15"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white/40 flex-shrink-0"
                      style={{ backgroundColor: signInfo.color }}
                    />
                    <ZodiacGlyph sign={signInfo.id} className="w-3 h-3 text-white/90" color="#ffffff" />
                    <span className="font-semibold text-white/90">{signInfo.latin}</span>
                  </div>
                )}
                {/* Year Badge */}
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono backdrop-blur-sm">
                  {art.anno}
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <h3 className="font-bold text-base text-zinc-950 tracking-tight group-hover:text-blue-600 transition-colors">
                    {art.artista}
                  </h3>
                  {art.titolo && (
                    <p className="text-xs text-zinc-600 italic font-serif mt-0.5">
                      {art.titolo}
                    </p>
                  )}
                  {formatBiographicalDates(art) && (
                    <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                      {formatBiographicalDates(art)}
                    </p>
                  )}

                  {/* Artist Quote */}
                  {art.citazione && (
                    <div className="my-2.5 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/70 text-zinc-800 italic font-serif text-xs leading-relaxed relative">
                      <Quote className="w-3 h-3 text-amber-500 mb-1 opacity-75 inline mr-1 -mt-1" />
                      <span>{art.citazione}</span>
                    </div>
                  )}

                  {/* Natal Planets Mini Strip */}
                  {art.tema_natale && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[10px] font-mono">
                      {art.tema_natale.sole && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-800 border border-amber-500/20" title="Sole">
                          <span>☉</span>
                          <ZodiacGlyph sign={art.tema_natale.sole} className="w-2.5 h-2.5" color="#92400e" />
                          <span>{art.tema_natale.sole.slice(0, 3)}</span>
                        </span>
                      )}
                      {art.tema_natale.luna && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-800 border border-blue-500/20" title="Luna">
                          <span>☽</span>
                          <ZodiacGlyph sign={art.tema_natale.luna} className="w-2.5 h-2.5" color="#1e40af" />
                          <span>{art.tema_natale.luna.slice(0, 3)}</span>
                        </span>
                      )}
                      {art.tema_natale.venere && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-800 border border-emerald-500/20" title="Venere">
                          <span>♀</span>
                          <ZodiacGlyph sign={art.tema_natale.venere} className="w-2.5 h-2.5" color="#065f46" />
                          <span>{art.tema_natale.venere.slice(0, 3)}</span>
                        </span>
                      )}
                      {art.tema_natale.mercurio && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-800 border border-purple-500/20" title="Mercurio">
                          <span>☿</span>
                          <ZodiacGlyph sign={art.tema_natale.mercurio} className="w-2.5 h-2.5" color="#6b21a8" />
                          <span>{art.tema_natale.mercurio.slice(0, 3)}</span>
                        </span>
                      )}
                      {art.link_tema_natale && (
                        <a
                          href={art.link_tema_natale}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-500/30 text-[9px] font-mono transition-colors ml-auto"
                          title="Apri scheda tema natale su Astro-Databank"
                        >
                          <span>Tema Natale</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                        </a>
                      )}
                    </div>
                  )}

                  {/* Symbolic Note preview */}
                  {art.nota_simbolica && (
                    <p className="text-xs text-zinc-500 mt-2 line-clamp-2 leading-relaxed">
                      {art.nota_simbolica}
                    </p>
                  )}

                  {/* Curatorial Commentary preview */}
                  {art.commento && (
                    <div className="mt-2 text-[11px] text-cyan-900 bg-cyan-50/80 border border-cyan-200/60 rounded-lg p-2 leading-relaxed line-clamp-2">
                      <span className="font-semibold text-cyan-950 font-mono text-[9px] uppercase tracking-wider block mb-0.5">Commento Critico:</span>
                      {art.commento}
                    </div>
                  )}
                </div>

                {/* Keywords Chips */}
                {art.parole_chiave && art.parole_chiave.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2 border-t border-zinc-100">
                    {art.parole_chiave.slice(0, 3).map((kw, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredArtworks.length === 0 && (
        <div className="max-w-md mx-auto text-center py-16 text-zinc-500">
          <p className="text-base">Nessuna opera trovata per i criteri selezionati.</p>
          <button
            onClick={() => {
              setSelectedSign('all');
              setSearchQuery('');
            }}
            className="mt-3 text-xs font-mono text-zinc-900 underline"
          >
            Azzera tutti i filtri
          </button>
        </div>
      )}
    </div>
  );
}
