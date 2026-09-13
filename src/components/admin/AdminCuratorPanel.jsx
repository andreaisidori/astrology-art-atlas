import React, { useState, useRef, useEffect } from "react";
import { X, Plus, Trash2, Edit3, Save, Download, Copy, Check, Lock, Sparkles, Image, Compass, Calendar, Moon, User, BookOpen, ExternalLink, Mail, Instagram, CopyPlus, Layers, Quote, UploadCloud, Loader2 } from "lucide-react";
import { ZODIAC_SIGNS, parseBiographicalDates, formatBiographicalDates } from "../../utils/astronomy";

export default function AdminCuratorPanel({
  isOpen,
  onClose,
  artworks,
  onUpdateArtworks,
  onFocusArtwork3D,
  bioData,
  onUpdateBio,
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState(false);
  const [sliderProgress, setSliderProgress] = useState(0);
  const sliderTrackRef = useRef(null);
  const isDraggingSlider = useRef(false);

  // File Upload Ref & State for Image Optimization
  const fileInputRef = useRef(null);
  const [imageUploadStatus, setImageUploadStatus] = useState("");
  const [isOptimizingImage, setIsOptimizingImage] = useState(false);

  // Tab: "artworks" | "bio"
  const [activeTab, setActiveTab] = useState("artworks");

  // Selected artwork for editing or null for new
  const [editingArt, setEditingArt] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  // Bio Form State
  const [bioForm, setBioForm] = useState({
    nome: bioData?.nome || "Giacomo Isidori",
    ruolo: bioData?.ruolo || "Curatore & Ideatore",
    biografia: bioData?.biografia || "",
    visione: bioData?.visione || "",
    instagram: bioData?.instagram || "https://instagram.com/astro.expression",
    email: bioData?.email || "astro.expression@gmail.com",
  });
  const [bioSaved, setBioSaved] = useState(false);

  useEffect(() => {
    if (bioData) {
      setBioForm({
        nome: bioData.nome || "Giacomo Isidori",
        ruolo: bioData.ruolo || "Curatore & Ideatore",
        biografia: bioData.biografia || "",
        visione: bioData.visione || "",
        instagram: bioData.instagram || "https://instagram.com/astro.expression",
        email: bioData.email || "astro.expression@gmail.com",
      });
    }
  }, [bioData]);

  // Artwork Form State
  // Artwork Form State
  const [formData, setFormData] = useState({
    id: "",
    segno: "Ariete",
    artista: "",
    citazione: "",
    commento: "",
    titolo: "",
    data_nascita: "",
    anno_morte: "",
    date_biografiche: "",
    anno: new Date().getFullYear(),
    tecnica: "",
    immagine: "",
    tema_natale: { sole: "Ariete", luna: "", venere: "", mercurio: "" },
    posizione_manuale: { x: 40, y: 0, z: 10 },
    parole_chiave_str: "",
    nota_simbolica: "",
    colore_dominante: "#e63946",
    link_fonte: "",
    clonedFromArtist: "",
  });

  // Client-Side Image File Upload & Automatic WebGL Canvas Compression
  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Seleziona un file immagine valido (PNG, JPG, WebP, ecc.)");
      return;
    }

    setIsOptimizingImage(true);
    setImageUploadStatus("Ottimizzazione dell'immagine in corso...");

    const originalSizeKb = Math.round(file.size / 1024);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        // Max dimension for crystal clear display without lagging WebGL 3D rendering
        const MAX_DIMENSION = 1400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIMENSION) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to high quality JPEG at 0.84 quality
        const optimizedDataUrl = canvas.toDataURL("image/jpeg", 0.84);
        const optimizedSizeKb = Math.round((optimizedDataUrl.length * 3) / 4 / 1024);

        setFormData(prev => ({ ...prev, immagine: optimizedDataUrl }));
        setIsOptimizingImage(false);
        setImageUploadStatus(`✓ Ottimizzata con successo: ${originalSizeKb} KB → ${optimizedSizeKb} KB (${width}×${height}px)`);

        if (fileInputRef.current) fileInputRef.current.value = "";
      };

      img.onerror = () => {
        setIsOptimizingImage(false);
        setImageUploadStatus("Errore durante la lettura dell'immagine");
      };

      img.src = event.target.result;
    };

    reader.onerror = () => {
      setIsOptimizingImage(false);
      setImageUploadStatus("Errore durante il caricamento del file");
    };

    reader.readAsDataURL(file);
  };

  // Authentication check - Only triggered by physical slider swipe completion
  const verifyPasswordOnSwipe = () => {
    const valid = passwordInput.trim() === "warburg" || passwordInput.trim() === "aaa" || passwordInput.trim() === "admin";
    if (valid) {
      setIsAuthenticated(true);
      setAuthError(false);
      setSliderProgress(100);
    } else {
      setAuthError(true);
      // Reset slider to 0 on wrong password
      setSliderProgress(0);
    }
  };

  // Prevent form submission on Enter
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setAuthError(true);
    }
    // Form submission does not bypass the slider
  };

  // Slider Drag & Swipe Logic
  const handleSliderStart = (e) => {
    // Only allow starting drag from near the thumb (left side initially or current position)
    isDraggingSlider.current = true;
    updateSlider(e, false);
  };

  const updateSlider = (e, checkUnlock = false) => {
    if (!sliderTrackRef.current) return;
    const rect = sliderTrackRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const offsetX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const percent = Math.round((offsetX / rect.width) * 100);
    setSliderProgress(percent);

    if (checkUnlock) {
      if (percent >= 88) {
        verifyPasswordOnSwipe();
      } else {
        // Did not reach end, snap back to 0
        setSliderProgress(0);
      }
    }
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!isDraggingSlider.current) return;
      updateSlider(e, false);
    };

    const handleEnd = (e) => {
      if (!isDraggingSlider.current) return;
      isDraggingSlider.current = false;
      const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      if (sliderTrackRef.current && clientX !== undefined) {
        const rect = sliderTrackRef.current.getBoundingClientRect();
        const offsetX = Math.max(0, Math.min(rect.width, clientX - rect.left));
        const percent = Math.round((offsetX / rect.width) * 100);
        if (percent >= 88) {
          verifyPasswordOnSwipe();
        } else {
          setSliderProgress(0);
        }
      } else {
        setSliderProgress(0);
      }
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [passwordInput]);

  if (!isOpen) return null;

  // Start creating new artwork
  const handleStartNew = () => {
    setEditingArt(null);
    setIsCreatingNew(true);
    setImageUploadStatus("");
    const newId = `art_${Date.now()}`;
    setFormData({
      id: newId,
      segno: "Ariete",
      artista: "",
      citazione: "",
      commento: "",
      titolo: "",
      data_nascita: "",
      anno_morte: "",
      date_biografiche: "",
      anno: 2024,
      tecnica: "",
      immagine: "",
      tema_natale: { sole: "Ariete", luna: "", venere: "", mercurio: "" },
      posizione_manuale: { x: 45, y: 0, z: 10 },
      parole_chiave_str: "",
      nota_simbolica: "",
      colore_dominante: "#e63946",
      link_fonte: "",
      clonedFromArtist: "",
    });
  };

  // Start editing existing
  const handleStartEdit = (art) => {
    setIsCreatingNew(false);
    setEditingArt(art);
    setImageUploadStatus("");
    const parsedDates = parseBiographicalDates(art.date_biografiche, art.data_nascita, art.anno_morte);
    setFormData({
      ...art,
      citazione: art.citazione || "",
      commento: art.commento || "",
      data_nascita: parsedDates.data_nascita,
      anno_morte: parsedDates.anno_morte,
      date_biografiche: formatBiographicalDates({ ...art, ...parsedDates }),
      tema_natale: art.tema_natale || { sole: art.segno || "Ariete", luna: "", venere: "", mercurio: "" },
      posizione_manuale: art.posizione_manuale || { x: 40, y: 0, z: 10 },
      parole_chiave_str: (art.parole_chiave || []).join(", "),
      clonedFromArtist: "",
    });
  };

  // Clone artwork to quickly add another piece for the same artist
  const handleCloneArtwork = (artToClone) => {
    const baseArt = artToClone || editingArt || formData;
    if (!baseArt) return;

    setEditingArt(null);
    setIsCreatingNew(true);
    setImageUploadStatus("");
    const newId = `art_${Date.now()}`;
    const parsedDates = parseBiographicalDates(baseArt.date_biografiche, baseArt.data_nascita, baseArt.anno_morte);

    setFormData({
      id: newId,
      segno: baseArt.segno || "Ariete",
      artista: baseArt.artista || "",
      citazione: baseArt.citazione || "",
      commento: "",
      titolo: "",
      data_nascita: parsedDates.data_nascita,
      anno_morte: parsedDates.anno_morte,
      date_biografiche: formatBiographicalDates({ ...baseArt, ...parsedDates }),
      anno: baseArt.anno || new Date().getFullYear(),
      tecnica: baseArt.tecnica || "",
      immagine: "",
      tema_natale: baseArt.tema_natale
        ? { ...baseArt.tema_natale }
        : { sole: baseArt.segno || "Ariete", luna: "", venere: "", mercurio: "" },
      posizione_manuale: {
        x: (baseArt.posizione_manuale?.x || 40) + (Math.random() * 2 - 1),
        y: (baseArt.posizione_manuale?.y || 0) + (Math.random() * 2 - 1),
        z: (baseArt.posizione_manuale?.z || 10) + (Math.random() * 2 - 1),
      },
      parole_chiave_str: Array.isArray(baseArt.parole_chiave)
        ? baseArt.parole_chiave.join(", ")
        : (baseArt.parole_chiave_str || ""),
      nota_simbolica: baseArt.nota_simbolica || "",
      colore_dominante: baseArt.colore_dominante || "#e63946",
      link_fonte: baseArt.link_fonte || "",
      clonedFromArtist: baseArt.artista || "",
    });
  };

  // Save artwork form
  const handleSaveForm = (e) => {
    e.preventDefault();
    const keywordsArray = formData.parole_chiave_str
      .split(",")
      .map(k => k.trim())
      .filter(Boolean);

    const bioStr = formatBiographicalDates({
      data_nascita: formData.data_nascita,
      anno_morte: formData.anno_morte,
      date_biografiche: formData.date_biografiche,
    });

    const updatedItem = {
      id: formData.id || `art_${Date.now()}`,
      segno: formData.segno,
      artista: formData.artista,
      citazione: formData.citazione || "",
      commento: (formData.commento || "").trim(),
      titolo: formData.titolo,
      data_nascita: (formData.data_nascita || "").trim(),
      anno_morte: (formData.anno_morte || "").trim(),
      date_biografiche: bioStr,
      anno: parseInt(formData.anno, 10) || null,
      tecnica: formData.tecnica,
      immagine: formData.immagine || "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800",
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
    setEditingArt(updatedItem);
    setIsCreatingNew(false);
  };

  // Save Bio Form
  const handleSaveBio = (e) => {
    e.preventDefault();
    if (onUpdateBio) {
      onUpdateBio(bioForm);
    }
    setBioSaved(true);
    setTimeout(() => setBioSaved(false), 2500);
  };

  // Delete artwork
  const handleDelete = (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questa voce dall’atlante?")) {
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
        curatore: bioForm,
        descrizione: "Atlante mnemotecnico e archivio dinamico in 3D per l'immaginario artistico contemporaneo.",
        ispirazione: "Aby Warburg — Bilderatlas Mnemosyne",
        totale_artisti: artworks.length,
        aggiornato_il: new Date().toISOString(),
      },
      opere: artworks,
    };

    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "atlas.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copy JSON to clipboard
  const handleCopyJSON = () => {
    const exportObject = {
      progetto: {
        titolo: "AAA — Astrology Art Atlas",
        curatore: bioForm,
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
    (a.artista || "").toLowerCase().includes(searchFilter.toLowerCase()) ||
    (a.titolo || "").toLowerCase().includes(searchFilter.toLowerCase()) ||
    (a.segno || "").toLowerCase().includes(searchFilter.toLowerCase()) ||
    (a.date_biografiche || "").toLowerCase().includes(searchFilter.toLowerCase())
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
                Gestione {artworks.length} artisti, temi natali, posizioni 3D e profilo curatore
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
                  <span>{copied ? "Copiato!" : "Copia JSON"}</span>
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

        {/* Tab Switcher (Visible when Authenticated) */}
        {isAuthenticated && (
          <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-white/10 bg-zinc-900/60">
            <button
              onClick={() => setActiveTab("artworks")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                activeTab === "artworks"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Catalogo Opere & Artisti ({artworks.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("bio")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                activeTab === "bio"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Biografia & Profilo Curatore (Giacomo Isidori)</span>
            </button>
          </div>
        )}

        {/* Auth Barrier if not logged in */}
        {!isAuthenticated ? (
          <div className="p-8 md:p-12 flex flex-col items-center justify-center my-auto text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/20 flex items-center justify-center text-amber-300 shadow-2xl shadow-amber-500/10">
              <Lock className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold tracking-tight">Curator Studio &bull; Accesso Riservato</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Area protetta per la gestione delle schede degli artisti, dei temi natali, delle coordinate tridimensionali e della pagina biografia.
              </p>
            </div>
            <form onSubmit={handleFormSubmit} className="w-full space-y-4">
              <div className="relative">
                <input
                  type="password"
                  placeholder="Inserisci password di sicurezza"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError(false);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/20 text-sm text-center text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono tracking-widest"
                />
                {authError && (
                  <p className="text-xs text-rose-400 font-mono mt-1.5 animate-shake">
                    Password non valida. Inserisci la password corretta e trascina il cursore.
                  </p>
                )}
              </div>

              {/* Slider Drag-to-Unlock Component */}
              <div className="pt-2">
                <div
                  ref={sliderTrackRef}
                  className="relative w-full h-12 rounded-xl bg-zinc-900 border border-white/15 overflow-hidden flex items-center justify-center select-none"
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-cyan-600/40 to-cyan-400/60"
                    style={{ width: `${sliderProgress}%` }}
                  />
                  <span className="relative z-0 text-xs font-mono tracking-wider text-zinc-400 pointer-events-none">
                    {sliderProgress > 80 ? "Rilascia per sbloccare..." : "Trascina il lucchetto verso destra →"}
                  </span>
                  <div
                    onMouseDown={handleSliderStart}
                    onTouchStart={handleSliderStart}
                    className="absolute top-1 bottom-1 w-11 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black flex items-center justify-center shadow-lg transition-transform cursor-grab active:cursor-grabbing z-10"
                    style={{
                      left: `calc(${sliderProgress}% - ${(sliderProgress / 100) * 44}px)`,
                    }}
                  >
                    <Lock className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-[10px] font-mono text-zinc-500 mt-2 text-center">
                  Digitare la password e trascinare il lucchetto fino all'estremità destra
                </p>
              </div>
            </form>
          </div>
        ) : activeTab === "bio" ? (
          /* TAB 2: CURATOR BIOGRAPHY EDITOR */
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <form onSubmit={handleSaveBio} className="max-w-3xl mx-auto space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-[#e5b869]">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-bold text-white">Pagina Biografia & Profilo</h3>
                    <p className="text-xs font-mono text-zinc-400">
                      Modifica il testo visualizzato quando gli utenti cliccano "a cura di Giacomo Isidori"
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs shadow-lg shadow-amber-500/20 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{bioSaved ? "Biografia Salvata!" : "Salva Biografia"}</span>
                </button>
              </div>

              {bioSaved && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Modifiche salvate con successo! La pagina biografia è aggiornata.</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5">Nome e Cognome</label>
                  <input
                    type="text"
                    value={bioForm.nome}
                    onChange={(e) => setBioForm({ ...bioForm, nome: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs focus:ring-1 focus:ring-amber-400"
                    placeholder="Giacomo Isidori"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5">Ruolo / Titolo</label>
                  <input
                    type="text"
                    value={bioForm.ruolo}
                    onChange={(e) => setBioForm({ ...bioForm, ruolo: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs focus:ring-1 focus:ring-amber-400"
                    placeholder="Curatore & Ideatore"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5 flex items-center justify-between">
                  <span>Biografia Completa</span>
                  <span className="text-[10px] text-zinc-500">Supporta ritorni a capo per i paragrafi</span>
                </label>
                <textarea
                  rows={6}
                  value={bioForm.biografia}
                  onChange={(e) => setBioForm({ ...bioForm, biografia: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs leading-relaxed focus:ring-1 focus:ring-amber-400"
                  placeholder="Scrivi qui la tua biografia, il percorso accademico, curatoriale e di ricerca..."
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5 flex items-center justify-between">
                  <span>Dichiarazione di Visione & Metodo Curatoriale</span>
                  <span className="text-[10px] text-zinc-500">Opzionale: citazione o testo metodologico</span>
                </label>
                <textarea
                  rows={4}
                  value={bioForm.visione}
                  onChange={(e) => setBioForm({ ...bioForm, visione: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs leading-relaxed focus:ring-1 focus:ring-amber-400 font-serif"
                  placeholder="La visione del progetto AAA, il riferimento ad Aby Warburg, la metodologia simbolica..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5 flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5 text-pink-400" />
                    <span>Profilo Instagram</span>
                  </label>
                  <input
                    type="text"
                    value={bioForm.instagram}
                    onChange={(e) => setBioForm({ ...bioForm, instagram: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs focus:ring-1 focus:ring-amber-400 font-mono"
                    placeholder="https://instagram.com/astro.expression"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>Email di Contatto</span>
                  </label>
                  <input
                    type="email"
                    value={bioForm.email}
                    onChange={(e) => setBioForm({ ...bioForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs focus:ring-1 focus:ring-amber-400 font-mono"
                    placeholder="astro.expression@gmail.com"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs shadow-lg shadow-amber-500/20 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{bioSaved ? "Salvato!" : "Salva Tutte le Modifiche"}</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* TAB 1: ARTWORKS CATALOGUE WORKSPACE */
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
                  const sign = ZODIAC_SIGNS.find(s => s.name.toLowerCase() === (art.segno || "").toLowerCase() || s.id === art.segno);

                  return (
                    <div
                      key={art.id}
                      onClick={() => handleStartEdit(art)}
                      className={`p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isSelected
                          ? "bg-white/15 border border-white/30 shadow"
                          : "hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={art.immagine}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover bg-zinc-800 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{art.artista || "Senza autore"}</p>
                          {art.titolo && (
                            <p className="text-[11px] text-cyan-300/80 truncate italic">{art.titolo}</p>
                          )}
                          {(art.data_nascita || art.anno_morte || art.date_biografiche) && (
                            <p className="text-[10px] text-zinc-400 font-mono truncate">
                              {formatBiographicalDates(art)}
                            </p>
                          )}
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className="text-[9px] font-mono px-1.5 py-0.2 rounded"
                              style={{
                                backgroundColor: `${sign?.color || "#555"}30`,
                                color: sign?.color || "#fff",
                              }}
                            >
                              {art.segno}
                            </span>
                            {art.tema_natale && (
                              <span className="text-[9px] font-mono text-zinc-500">
                                ☉{art.tema_natale.sole?.slice(0, 2) || "?"} ☽{art.tema_natale.luna?.slice(0, 2) || "?"} ♀{art.tema_natale.venere?.slice(0, 2) || "?"} ☿{art.tema_natale.mercurio?.slice(0, 2) || "?"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCloneArtwork(art);
                          }}
                          className="p-1.5 rounded-lg hover:bg-amber-500/20 text-zinc-400 hover:text-amber-300 transition-all"
                          title="Clona quest'opera per inserire velocemente un'altra opera dello stesso artista"
                        >
                          <CopyPlus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(art.id);
                          }}
                          className="p-1.5 rounded-lg hover:bg-rose-500/20 text-zinc-500 hover:text-rose-300 transition-all"
                          title="Elimina"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Artwork & Natal Chart Editor Form (7 cols) */}
            <div className="lg:col-span-7 flex flex-col overflow-y-auto p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {isCreatingNew ? (
                      formData.clonedFromArtist ? (
                        <>
                          <span className="text-amber-300">Nuova Opera Clonata:</span>
                          <span>{formData.clonedFromArtist}</span>
                        </>
                      ) : (
                        "Aggiungi Nuovo Artista all’Atlante"
                      )
                    ) : editingArt ? (
                      `Scheda Opera: ${editingArt.artista} ${editingArt.titolo ? `— "${editingArt.titolo}"` : ""}`
                    ) : (
                      "Seleziona o Crea Artista"
                    )}
                  </h3>
                  <p className="text-[11px] font-mono text-zinc-400">
                    {isCreatingNew
                      ? formData.clonedFromArtist
                        ? `Dati artista, biografia e tema natale clonati da ${formData.clonedFromArtist}. Inserisci il nuovo titolo e l'immagine.`
                        : "Compila i dati dell'artista e della prima opera"
                      : editingArt
                      ? "Compila o aggiorna i dati dell'artista e dell'opera"
                      : "Scegli una voce dall'elenco a sinistra per iniziare a modificare"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {editingArt && (
                    <button
                      type="button"
                      onClick={() => handleCloneArtwork(editingArt)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:bg-amber-500/30 text-xs font-mono transition-all shadow"
                      title="Clona questo quadro per inserire velocemente un'altra opera di questo artista"
                    >
                      <CopyPlus className="w-3.5 h-3.5" />
                      <span>Clona Opera</span>
                    </button>
                  )}
                  {editingArt && onFocusArtwork3D && (
                    <button
                      type="button"
                      onClick={() => onFocusArtwork3D(editingArt)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 hover:bg-indigo-500/30 text-xs font-mono transition-all"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Visualizza in 3D</span>
                    </button>
                  )}
                </div>
              </div>

              {editingArt || isCreatingNew ? (
                <form onSubmit={handleSaveForm} className="space-y-4">
                  {formData.clonedFromArtist && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-xs flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CopyPlus className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <span>
                          Inserimento rapido per <strong>{formData.clonedFromArtist}</strong>: i dati biografici, il segno e il tema natale sono già impostati. Inserisci il titolo della nuova opera e la sua immagine.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Row 1: Segno & Artista */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">Segno Zodiacale / Categoria Simbolica</label>
                      <select
                        value={formData.segno}
                        onChange={(e) => setFormData({ ...formData, segno: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs font-mono focus:ring-1 focus:ring-cyan-400"
                      >
                        {ZODIAC_SIGNS.map(s => (
                          <option key={s.id} value={s.name}>{s.name} ({s.latin})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">Nome Artista *</label>
                      <input
                        type="text"
                        required
                        value={formData.artista}
                        onChange={(e) => setFormData({ ...formData, artista: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs focus:ring-1 focus:ring-cyan-400"
                        placeholder="Es: Lucio Fontana"
                      />
                    </div>
                  </div>

                  {/* Row 2: Data di Nascita, Anno di Morte & Anno Opera */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">Data di Nascita</label>
                      <input
                        type="text"
                        value={formData.data_nascita || ""}
                        onChange={(e) => setFormData({ ...formData, data_nascita: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs"
                        placeholder="Es: 19 Febbraio 1899"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1 flex items-center justify-between">
                        <span>Anno di Morte</span>
                        <span className="text-[9px] text-zinc-500 font-mono">Opzionale</span>
                      </label>
                      <input
                        type="text"
                        value={formData.anno_morte || ""}
                        onChange={(e) => setFormData({ ...formData, anno_morte: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs font-mono"
                        placeholder="Es: 1968"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">Anno Opera</label>
                      <input
                        type="number"
                        value={formData.anno || ""}
                        onChange={(e) => setFormData({ ...formData, anno: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs font-mono"
                        placeholder="1958"
                      />
                    </div>
                  </div>

                  {/* Citazione dell'Artista (Opzionale) */}
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-amber-300">
                        <Quote className="w-3.5 h-3.5" />
                        <span>Citazione dell'Artista (mostrata nella scheda Archivio)</span>
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">Opzionale</span>
                    </label>
                    <textarea
                      rows={2}
                      value={formData.citazione || ""}
                      onChange={(e) => setFormData({ ...formData, citazione: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs leading-relaxed italic font-serif focus:ring-1 focus:ring-amber-400 placeholder:font-sans placeholder:not-italic"
                      placeholder='Es: "L’arte non riproduce ciò che è visibile, ma rende visibile ciò che non sempre lo è."'
                    />
                  </div>

                  {/* Row 3: Titolo Opera & Tecnica */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">Titolo Opera *</label>
                      <input
                        type="text"
                        required
                        value={formData.titolo}
                        onChange={(e) => setFormData({ ...formData, titolo: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs focus:ring-1 focus:ring-cyan-400"
                        placeholder="Es: Concetto Spaziale, Attese"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">Tecnica / Materiali</label>
                      <input
                        type="text"
                        value={formData.tecnica}
                        onChange={(e) => setFormData({ ...formData, tecnica: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs"
                        placeholder="Es: Idropittura su tela"
                      />
                    </div>
                  </div>

                  {/* Row 4: Caricamento & Ottimizzazione Immagine */}
                  <div className="space-y-3 p-4 rounded-2xl bg-zinc-900/60 border border-white/10">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-mono text-zinc-300 font-semibold flex items-center gap-1.5">
                        <UploadCloud className="w-4 h-4 text-cyan-400" />
                        <span>Immagine dell'Opera (Upload & Ottimizzazione WebGL 3D)</span>
                      </label>
                      {formData.immagine && (
                        <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                          <Check className="w-3 h-3" /> Immagine pronta
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                      {formData.immagine ? (
                        <div className="relative group">
                          <img
                            src={formData.immagine}
                            alt="Anteprima"
                            onError={(e) => { e.target.style.display = 'none'; }}
                            className="w-16 h-16 rounded-xl object-cover border border-cyan-400/30 bg-zinc-900 flex-shrink-0 shadow-md"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl border border-dashed border-white/20 bg-zinc-900 flex flex-col items-center justify-center text-zinc-500 flex-shrink-0">
                          <Image className="w-6 h-6 opacity-60" />
                        </div>
                      )}

                      <div className="flex-1 w-full space-y-2">
                        {/* Hidden file input */}
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          className="hidden"
                        />

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            disabled={isOptimizingImage}
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 text-xs font-mono transition-all disabled:opacity-50"
                          >
                            {isOptimizingImage ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-300" />
                            ) : (
                              <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
                            )}
                            <span>{isOptimizingImage ? "Ottimizzazione in corso..." : "Carica file da Computer"}</span>
                          </button>

                          {formData.immagine && (
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, immagine: "" }));
                                setImageUploadStatus("");
                              }}
                              className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-300 text-xs font-mono transition-all"
                            >
                              Rimuovi
                            </button>
                          )}
                        </div>

                        {imageUploadStatus && (
                          <div className={`text-[11px] font-mono leading-tight ${imageUploadStatus.startsWith("✓") ? "text-emerald-400" : "text-amber-300"}`}>
                            {imageUploadStatus}
                          </div>
                        )}

                        <div>
                          <input
                            type="url"
                            value={formData.immagine}
                            onChange={(e) => setFormData({ ...formData, immagine: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-lg bg-zinc-950/80 border border-white/10 text-white text-xs font-mono placeholder:text-zinc-600"
                            placeholder="Oppure incolla qui un link URL esterno (https://...)"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">Link Fonte / Documentazione Esterna</label>
                      <input
                        type="url"
                        value={formData.link_fonte}
                        onChange={(e) => setFormData({ ...formData, link_fonte: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs font-mono"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  {/* Commento Critico dell'Opera */}
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Commento Critico dell'Opera</span>
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">Opzionale</span>
                    </label>
                    <textarea
                      rows={3}
                      value={formData.commento || ""}
                      onChange={(e) => setFormData({ ...formData, commento: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs leading-relaxed focus:ring-1 focus:ring-cyan-400 placeholder:text-zinc-600"
                      placeholder="Inserisci qui un commento critico, l'analisi dell'opera, il contesto storico o l'interpretazione visiva..."
                    />
                  </div>

                  {/* Row 5: Tema Natale */}
                  <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-3">
                    <p className="text-xs font-mono text-amber-300 font-bold flex items-center gap-1.5">
                      <Moon className="w-3.5 h-3.5" />
                      <span>Tema Natale & Posizioni Planetarie</span>
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 mb-1">☉ Sole</label>
                        <select
                          value={formData.tema_natale?.sole || ""}
                          onChange={(e) => setFormData({ ...formData, tema_natale: { ...formData.tema_natale, sole: e.target.value } })}
                          className="w-full px-2 py-1.5 rounded-lg bg-zinc-900 border border-white/15 text-white text-xs font-mono"
                        >
                          <option value="">Non noto</option>
                          {ZODIAC_SIGNS.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 mb-1">☽ Luna</label>
                        <select
                          value={formData.tema_natale?.luna || ""}
                          onChange={(e) => setFormData({ ...formData, tema_natale: { ...formData.tema_natale, luna: e.target.value } })}
                          className="w-full px-2 py-1.5 rounded-lg bg-zinc-900 border border-white/15 text-white text-xs font-mono"
                        >
                          <option value="">Non noto</option>
                          {ZODIAC_SIGNS.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 mb-1">♀ Venere</label>
                        <select
                          value={formData.tema_natale?.venere || ""}
                          onChange={(e) => setFormData({ ...formData, tema_natale: { ...formData.tema_natale, venere: e.target.value } })}
                          className="w-full px-2 py-1.5 rounded-lg bg-zinc-900 border border-white/15 text-white text-xs font-mono"
                        >
                          <option value="">Non noto</option>
                          {ZODIAC_SIGNS.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-400 mb-1">☿ Mercurio</label>
                        <select
                          value={formData.tema_natale?.mercurio || ""}
                          onChange={(e) => setFormData({ ...formData, tema_natale: { ...formData.tema_natale, mercurio: e.target.value } })}
                          className="w-full px-2 py-1.5 rounded-lg bg-zinc-900 border border-white/15 text-white text-xs font-mono"
                        >
                          <option value="">Non noto</option>
                          {ZODIAC_SIGNS.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Row 6: Parole chiave & Note */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">Parole Chiave (separate da virgola)</label>
                      <input
                        type="text"
                        value={formData.parole_chiave_str}
                        onChange={(e) => setFormData({ ...formData, parole_chiave_str: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs font-mono"
                        placeholder="spazialismo, taglio, gesto, infinito"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                        Nota Simbolica / Mnemotecnica (Aby Warburg)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.nota_simbolica || ""}
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
                      <span>
                        {isCreatingNew
                          ? formData.clonedFromArtist
                            ? `Aggiungi Opera per ${formData.clonedFromArtist}`
                            : "Aggiungi Artista all’Atlante"
                          : "Salva Modifiche"}
                      </span>
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
