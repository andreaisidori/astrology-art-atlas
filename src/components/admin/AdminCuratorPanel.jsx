import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Trash2, Edit3, Save, Download, Copy, Check, Lock, Sparkles, Image, Compass, Calendar, Moon } from 'lucide-react';
import { ZODIAC_SIGNS } from '../../utils/astronomy';

export default function AdminCuratorPanel({
  isOpen,
  onClose,
  artworks,
  onUpdateArtworks,
  onFocusArtwork3D,
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [sliderProgress, setSliderProgress] = useState(0);
  const sliderTrackRef = useRef(null);
  const isDraggingSlider = useRef(false);

  // Selected artwork for editing or null for new
  const [editingArt, setEditingArt] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    segno: 'Ariete',
    artista: '',
    titolo: '',
    date_biografiche: '',
    anno: new Date().getFullYear(),
    tecnica: '',
    immagine: '',
    tema_natale: { sole: 'Ariete', luna: '', venere: '', mercurio: '' },
    posizione_manuale: { x: 40, y: 0, z: 10 },
    parole_chiave_str: '',
    nota_simbolica: '',
    colore_dominante: '#e63946',
    link_fonte: '',
  });

  // Authentication check
  const verifyPassword = () => {
    if (passwordInput === 'warburg' || passwordInput === 'aaa' || passwordInput === 'admin') {
      setIsAuthenticated(true);
      setAuthError(false);
      setSliderProgress(100);
    } else {
      setAuthError(true);
      setSliderProgress(0);
    }
  };

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    verifyPassword();
  };

  // Slider Drag & Swipe Logic
  const handleSliderStart = (e) => {
    isDraggingSlider.current = true;
    updateSlider(e);
  };

  const updateSlider = (e) => {
    if (!sliderTrackRef.current) return;
    const rect = sliderTrackRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const offsetX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const percent = Math.round((offsetX / rect.width) * 100);
    setSliderProgress(percent);

    if (percent >= 90) {
      isDraggingSlider.current = false;
      verifyPassword();
    }
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!isDraggingSlider.current) return;
      updateSlider(e);
    };

    const handleEnd = () => {
      if (!isDraggingSlider.current) return;
      isDraggingSlider.current = false;
      setSliderProgress(prev => (prev >= 90 ? prev : 0));
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [passwordInput]);

  if (!isOpen) return null;

  // Start creating new artwork
  const handleStartNew = () => {
    setEditingArt(null);
    setIsCreatingNew(true);
    const newId = `art_${Date.now()}`;
    setFormData({
      id: newId,
      segno: 'Ariete',
      artista: '',
      titolo: '',
      date_biografiche: '',
      anno: 2024,
      tecnica: '',
      immagine: '',
      tema_natale: { sole: 'Ariete', luna: '', venere: '', mercurio: '' },
      posizione_manuale: { x: 45, y: 0, z: 10 },
      parole_chiave_str: '',
      nota_simbolica: '',
      colore_dominante: '#e63946',
      link_fonte: '',
    });
  };

  // Start editing existing
  const handleStartEdit = (art) => {
    setIsCreatingNew(false);
    setEditingArt(art);
    setFormData({
      ...art,
      date_biografiche: art.date_biografiche || '',
      tema_natale: art.tema_natale || { sole: art.segno || 'Ariete', luna: '', venere: '', mercurio: '' },
      posizione_manuale: art.posizione_manuale || { x: 40, y: 0, z: 10 },
      parole_chiave_str: (art.parole_chiave || []).join(', '),
    });
  };

  // Save form (Add or Edit)
  const handleSaveForm = (e) => {
    e.preventDefault();
    const keywordsArray = formData.parole_chiave_str
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    const updatedItem = {
      id: formData.id || `art_${Date.now()}`,
      segno: formData.segno,
      artista: formData.artista,
      titolo: formData.titolo,
      date_biografiche: formData.date_biografiche,
      anno: parseInt(formData.anno, 10) || null,
      tecnica: formData.tecnica,
      immagine: formData.immagine || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800',
      tema_natale: {
        sole: formData.tema_natale?.sole || null,
        luna: formData.tema_natale?.luna || null,
        venere: formData.tema_natale?.venere || null,
        mercurio: formData.tema_natale?.mercurio || null,
      },
      posizione_manuale: {
        x: parseFloat(formData.posizione_manuale?.x) || 0,
        y: parseFloat(formData.posizione_manuale?.y) || 0,
        z: parseFloat(formData.posizione_manuale?.z) || 0,
      },
      parole_chiave: keywordsArray,
      nota_simbolica: formData.nota_simbolica,
      colore_dominante: formData.colore_dominante,
      link_fonte: formData.link_fonte,
    };

    let newArtworksList;
    if (editingArt) {
      newArtworksList = artworks.map(a => (a.id === editingArt.id ? updatedItem : a));
    } else {
      newArtworksList = [...artworks, updatedItem];
    }

    onUpdateArtworks(newArtworksList);
    setEditingArt(null);
    setIsCreatingNew(false);
  };

  // Delete artwork
  const handleDelete = (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa voce dall’atlante?')) {
      const updated = artworks.filter(a => a.id !== id);
      onUpdateArtworks(updated);
      if (editingArt && editingArt.id === id) {
        setEditingArt(null);
        setIsCreatingNew(false);
      }
    }
  };

  // Export JSON file download
  const handleDownloadJSON = () => {
    const exportObject = {
      progetto: {
        titolo: "AAA — Astrology Art Atlas",
        curatore: "Giacomo Isidori",
        descrizione: "Atlante mnemotecnico e archivio dinamico in 3D per l'immaginario artistico contemporaneo.",
        ispirazione: "Aby Warburg — Bilderatlas Mnemosyne",
        totale_artisti: artworks.length,
        aggiornato_il: new Date().toISOString(),
      },
      opere: artworks,
    };

    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'atlas.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copy JSON to clipboard
  const handleCopyJSON = () => {
    const exportObject = {
      progetto: {
        titolo: "AAA — Astrology Art Atlas",
        curatore: "Giacomo Isidori",
        descrizione: "Atlante mnemotecnico e archivio dinamico in 3D per l'immaginario artistico contemporaneo.",
        ispirazione: "Aby Warburg — Bilderatlas Mnemosyne",
        totale_artisti: artworks.length,
      },
      opere: artworks,
    };
    navigator.clipboard.writeText(JSON.stringify(exportObject, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter artworks list
  const filteredList = artworks.filter(a =>
    (a.artista || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
    (a.titolo || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
    (a.segno || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
    (a.date_biografiche || '').toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn text-white">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Panel Box */}
      <div className="relative z-10 w-full max-w-6xl max-h-[92vh] bg-zinc-950 border border-white/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-wide">AAA &bull; Curator Studio</h2>
              <p className="text-[11px] font-mono text-zinc-400">
                Gestione {artworks.length} artisti, temi natali, opere e posizionamento 3D
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <>
                <button
                  onClick={handleCopyJSON}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-mono transition-all"
                  title="Copia l'intero database negli appunti"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiato!' : 'Copia JSON'}</span>
                </button>
                <button
                  onClick={handleDownloadJSON}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 text-black font-semibold text-xs font-mono hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
                  title="Scarica atlas.json per salvare i dati su disco"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Scarica atlas.json</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Auth Barrier if not logged in */}
        {!isAuthenticated ? (
          <div className="p-8 md:p-12 flex flex-col items-center justify-center my-auto text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/20 flex items-center justify-center text-amber-300 shadow-2xl shadow-amber-500/10">
              <Lock className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold tracking-tight">Curator Studio &bull; Accesso Riservato</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Area protetta per la gestione delle schede degli artisti, dei temi natali e delle coordinate tridimensionali.
              </p>
            </div>
            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="relative">
                <input
                  type="password"
                  placeholder="Inserisci password di sicurezza"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError(false);
                  }}
                  className="w-full px-4 py-3 rounded-2xl bg-black/80 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-center font-mono placeholder:text-zinc-600 transition-all shadow-inner"
                  autoFocus
                />
              </div>

              {authError && (
                <p className="text-xs text-rose-400 font-mono animate-shake">
                  Password non corretta. Verifica e riprova.
                </p>
              )}

              {/* Interactive Swipe Captcha Slider */}
              <div className="pt-2">
                <div
                  ref={sliderTrackRef}
                  onMouseDown={handleSliderStart}
                  onTouchStart={handleSliderStart}
                  className="relative w-full h-12 rounded-2xl bg-zinc-900/90 border border-white/15 overflow-hidden flex items-center select-none cursor-pointer shadow-inner"
                >
                  {/* Fill progress track */}
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-amber-500/30 via-amber-400/40 to-amber-300/60 transition-all duration-75"
                    style={{ width: `${Math.max(sliderProgress, 8)}%` }}
                  />

                  {/* Centered track instruction label */}
                  <span
                    className="absolute inset-0 flex items-center justify-center text-[11px] font-mono tracking-wider uppercase text-zinc-400 pointer-events-none transition-opacity duration-200"
                    style={{ opacity: Math.max(0, 1 - sliderProgress / 60) }}
                  >
                    Trascina per verificare ➔
                  </span>

                  {/* Draggable handle knob */}
                  <div
                    className={`absolute top-1 bottom-1 w-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-200 text-black flex items-center justify-center shadow-lg transition-transform duration-75 ${
                      sliderProgress >= 95 ? 'bg-emerald-400 text-black' : ''
                    }`}
                    style={{
                      left: `calc(${sliderProgress}% - ${(sliderProgress / 100) * 40}px)`,
                    }}
                  >
                    <Lock className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-[10px] font-mono text-zinc-500 mt-2 text-center">
                  Inserisci la password e trascina il cursore verso destra per sbloccare
                </p>
              </div>
            </form>
          </div>
        ) : (
          /* Authenticated Curator Workspace */
          <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            {/* Left Sidebar: Artwork/Artist List (5 cols) */}
            <div className="lg:col-span-5 border-r border-white/10 flex flex-col bg-black/40 overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center justify-between gap-3">
                <input
                  type="text"
                  placeholder="Cerca artista, segno, date..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
                <button
                  onClick={handleStartNew}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-all shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nuovo Artista</span>
                </button>
              </div>

              {/* Scrollable list */}
              <div className="flex-1 overflow-y-auto divide-y divide-white/5 p-2 space-y-1">
                {filteredList.map((art) => {
                  const isSelected = (editingArt && editingArt.id === art.id) || (formData.id === art.id);
                  const sign = ZODIAC_SIGNS.find(s => s.name.toLowerCase() === (art.segno || '').toLowerCase() || s.id === art.segno);

                  return (
                    <div
                      key={art.id}
                      onClick={() => handleStartEdit(art)}
                      className={`p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-white/15 border border-white/30 shadow'
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={art.immagine}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover bg-zinc-800 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{art.artista || 'Senza autore'}</p>
                          {art.date_biografiche && (
                            <p className="text-[10px] text-zinc-400 font-mono truncate">{art.date_biografiche}</p>
                          )}
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className="text-[9px] font-mono px-1.5 py-0.2 rounded"
                              style={{
                                backgroundColor: `${sign?.color || '#555'}30`,
                                color: sign?.color || '#fff',
                              }}
                            >
                              {art.segno}
                            </span>
                            {art.tema_natale && (
                              <span className="text-[9px] font-mono text-zinc-500">
                                ☉{art.tema_natale.sole?.slice(0, 2) || '?'} ☽{art.tema_natale.luna?.slice(0, 2) || '?'} ♀{art.tema_natale.venere?.slice(0, 2) || '?'} ☿{art.tema_natale.mercurio?.slice(0, 2) || '?'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(art.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-rose-500/20 text-zinc-500 hover:text-rose-300 transition-all flex-shrink-0"
                        title="Elimina"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Artwork & Natal Chart Editor Form (7 cols) */}
            <div className="lg:col-span-7 flex flex-col overflow-y-auto p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">
                    {isCreatingNew ? 'Aggiungi Nuovo Artista / Occorrenza' : editingArt ? `Scheda: ${editingArt.artista}` : 'Seleziona un artista o creane uno nuovo'}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    Compila anagrafica, tema natale, opera associata e coordinate 3D.
                  </p>
                </div>
              </div>

              {(isCreatingNew || editingArt) ? (
                <form onSubmit={handleSaveForm} className="space-y-5">
                  {/* Basic Anagrafica Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">Nome Artista *</label>
                      <input
                        type="text"
                        required
                        value={formData.artista}
                        onChange={(e) => setFormData({ ...formData, artista: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs focus:ring-1 focus:ring-cyan-400"
                        placeholder="Es. Yayoi Kusama"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">Date Biografiche / Nascita</label>
                      <input
                        type="text"
                        value={formData.date_biografiche || ''}
                        onChange={(e) => setFormData({ ...formData, date_biografiche: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs focus:ring-1 focus:ring-cyan-400 font-mono"
                        placeholder="Es. 22 March 1929 oppure 1483–1520"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">Segno Zodiacale Principale *</label>
                      <select
                        value={formData.segno}
                        onChange={(e) => setFormData({ ...formData, segno: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs focus:ring-1 focus:ring-cyan-400 font-mono"
                      >
                        {ZODIAC_SIGNS.map(s => (
                          <option key={s.id} value={s.name}>
                            {s.symbol} {s.name} ({s.latin}) — {s.element}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">Titolo dell’Opera Associata</label>
                      <input
                        type="text"
                        value={formData.titolo || ''}
                        onChange={(e) => setFormData({ ...formData, titolo: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs focus:ring-1 focus:ring-cyan-400"
                        placeholder="Es. Infinity Mirror Room / In attesa..."
                      />
                    </div>
                  </div>

                  {/* Natal Chart Planets (Sole, Luna, Venere, Mercurio) */}
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
                    <div className="text-xs font-mono text-cyan-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Tema Natale &bull; Pianeti Personali</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono text-amber-400 mb-1">☉ Sole</label>
                        <select
                          value={formData.tema_natale?.sole || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              tema_natale: { ...formData.tema_natale, sole: e.target.value },
                            })
                          }
                          className="w-full px-2 py-1.5 rounded-lg bg-zinc-900 border border-white/15 text-white text-xs font-mono"
                        >
                          <option value="">(Non specificato)</option>
                          {ZODIAC_SIGNS.map(s => (
                            <option key={s.id} value={s.name}>{s.symbol} {s.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-blue-300 mb-1">☽ Luna</label>
                        <select
                          value={formData.tema_natale?.luna || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              tema_natale: { ...formData.tema_natale, luna: e.target.value },
                            })
                          }
                          className="w-full px-2 py-1.5 rounded-lg bg-zinc-900 border border-white/15 text-white text-xs font-mono"
                        >
                          <option value="">(Non specificato)</option>
                          {ZODIAC_SIGNS.map(s => (
                            <option key={s.id} value={s.name}>{s.symbol} {s.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-emerald-300 mb-1">♀ Venere</label>
                        <select
                          value={formData.tema_natale?.venere || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              tema_natale: { ...formData.tema_natale, venere: e.target.value },
                            })
                          }
                          className="w-full px-2 py-1.5 rounded-lg bg-zinc-900 border border-white/15 text-white text-xs font-mono"
                        >
                          <option value="">(Non specificato)</option>
                          {ZODIAC_SIGNS.map(s => (
                            <option key={s.id} value={s.name}>{s.symbol} {s.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-purple-300 mb-1">☿ Mercurio</label>
                        <select
                          value={formData.tema_natale?.mercurio || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              tema_natale: { ...formData.tema_natale, mercurio: e.target.value },
                            })
                          }
                          className="w-full px-2 py-1.5 rounded-lg bg-zinc-900 border border-white/15 text-white text-xs font-mono"
                        >
                          <option value="">(Non specificato)</option>
                          {ZODIAC_SIGNS.map(s => (
                            <option key={s.id} value={s.name}>{s.symbol} {s.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Image & Color */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">URL Immagine Opera o File Locale</label>
                      <input
                        type="text"
                        value={formData.immagine || ''}
                        onChange={(e) => setFormData({ ...formData, immagine: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs focus:ring-1 focus:ring-cyan-400 font-mono"
                        placeholder="https://... oppure /images/ariete/opera1.jpg"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">Colore Dominante</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.colore_dominante || '#e63946'}
                          onChange={(e) => setFormData({ ...formData, colore_dominante: e.target.value })}
                          className="w-10 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.colore_dominante}
                          onChange={(e) => setFormData({ ...formData, colore_dominante: e.target.value })}
                          className="flex-1 px-2 py-1.5 rounded-lg bg-zinc-900 border border-white/15 text-white text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3D Coordinate Modifiers (Regolazione Posizione Manuale 3D) */}
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-cyan-300 flex items-center gap-1.5 uppercase tracking-wider">
                        <Compass className="w-3.5 h-3.5" />
                        <span>Posizione Manuale 3D (Fascia Orizzontale)</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                          <span>Asse X</span>
                          <span className="text-white">{formData.posizione_manuale?.x?.toFixed(1)}</span>
                        </div>
                        <input
                          type="range"
                          min="-50"
                          max="50"
                          step="0.5"
                          value={formData.posizione_manuale?.x || 0}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              posizione_manuale: {
                                ...formData.posizione_manuale,
                                x: parseFloat(e.target.value),
                              },
                            })
                          }
                          className="w-full accent-cyan-400"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                          <span>Asse Y (Altezza)</span>
                          <span className="text-white">{formData.posizione_manuale?.y?.toFixed(1)}</span>
                        </div>
                        <input
                          type="range"
                          min="-10"
                          max="10"
                          step="0.5"
                          value={formData.posizione_manuale?.y || 0}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              posizione_manuale: {
                                ...formData.posizione_manuale,
                                y: parseFloat(e.target.value),
                              },
                            })
                          }
                          className="w-full accent-cyan-400"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                          <span>Asse Z</span>
                          <span className="text-white">{formData.posizione_manuale?.z?.toFixed(1)}</span>
                        </div>
                        <input
                          type="range"
                          min="-50"
                          max="50"
                          step="0.5"
                          value={formData.posizione_manuale?.z || 0}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              posizione_manuale: {
                                ...formData.posizione_manuale,
                                z: parseFloat(e.target.value),
                              },
                            })
                          }
                          className="w-full accent-cyan-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Technique, Keywords & Symbolic Note */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">Tecnica / Supporto</label>
                      <input
                        type="text"
                        value={formData.tecnica || ''}
                        onChange={(e) => setFormData({ ...formData, tecnica: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs"
                        placeholder="Es. Scultura / Olio su tela / Performance"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                        Parole Chiave / Simboli Ricorrenti (separate da virgola)
                      </label>
                      <input
                        type="text"
                        value={formData.parole_chiave_str}
                        onChange={(e) => setFormData({ ...formData, parole_chiave_str: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs font-mono"
                        placeholder="rosso, fuoco, taglio, corna, armi"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                        Nota Simbolica / Mnemotecnica (Aby Warburg)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.nota_simbolica || ''}
                        onChange={(e) => setFormData({ ...formData, nota_simbolica: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs leading-relaxed"
                        placeholder="Spiegazione dell'affinità simbolica dell'artista e delle sue opere con il segno..."
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingArt(null);
                        setIsCreatingNew(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white"
                    >
                      Annulla
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs shadow-lg shadow-cyan-500/20 transition-all"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isCreatingNew ? 'Aggiungi Artista all’Atlante' : 'Salva Modifiche'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-zinc-500 space-y-3">
                  <Edit3 className="w-8 h-8 opacity-40" />
                  <p className="text-sm">Seleziona un artista dall'elenco a sinistra per visualizzarne la scheda, aggiungere l'opera o regolarne la posizione 3D.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
