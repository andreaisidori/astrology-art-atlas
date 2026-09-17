import React, { useState, useRef, useEffect, useMemo } from "react";
import { X, Plus, Trash2, Edit3, Save, Download, Copy, Check, Lock, Sparkles, Image, Compass, Calendar, Moon, User, BookOpen, ExternalLink, Mail, Instagram, CopyPlus, Layers, Quote, UploadCloud, Loader2, Move, ChevronDown, ChevronRight, Users, ShieldCheck, Scale, FileText } from "lucide-react";
import { ZODIAC_SIGNS, parseBiographicalDates, formatBiographicalDates } from "../../utils/astronomy";

export default function AdminCuratorPanel({
  isOpen,
  onClose,
  artworks,
  onUpdateArtworks,
  onFocusArtwork3D,
  onStartSpatialEdit,
  bioData,
  onUpdateBio,
  infoData,
  onUpdateInfo,
  legalData,
  onUpdateLegal,
  onCommitAtlas,
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

  // Tab: "artworks" | "bio" | "info" | "legal"
  const [activeTab, setActiveTab] = useState("artworks");

  // Selected artwork for editing or null for new
  const [editingArt, setEditingArt] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");

  // Sync / Commit State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null); // { type: 'success' | 'error', message: string }
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem("aaa_github_token") || "");
  const [showTokenInput, setShowTokenInput] = useState(false);

  // Bio Form State
  const [bioForm, setBioForm] = useState({
    nome: bioData?.nome || "Giacomo Isidori",
    ruolo: bioData?.ruolo || "Curatore & Ideatore",
    titolo_biografia: bioData?.titolo_biografia || "Biografia",
    biografia: bioData?.biografia || "",
    titolo_visione: bioData?.titolo_visione || "Visione & Metodo Curatoriale",
    visione: bioData?.visione || "",
    titolo_contatti: bioData?.titolo_contatti || "Contatti Ufficiali & Curatela",
    instagram: bioData?.instagram || "https://instagram.com/astro.expression",
    email: bioData?.email || "astro.expression@gmail.com",
  });
  const [bioSaved, setBioSaved] = useState(false);

  useEffect(() => {
    if (bioData) {
      setBioForm({
        nome: bioData.nome || "Giacomo Isidori",
        ruolo: bioData.ruolo || "Curatore & Ideatore",
        titolo_biografia: bioData.titolo_biografia || "Biografia",
        biografia: bioData.biografia || "",
        titolo_visione: bioData.titolo_visione || "Visione & Metodo Curatoriale",
        visione: bioData.visione || "",
        titolo_contatti: bioData.titolo_contatti || "Contatti Ufficiali & Curatela",
        instagram: bioData.instagram || "",
        email: bioData.email || "",
      });
    }
  }, [bioData]);

  // Info & Vision Statement Form State
  const [infoForm, setInfoForm] = useState({
    titolo: infoData?.titolo || "AAA — Astrology Art Atlas",
    sottotitolo: infoData?.sottotitolo || "Visione Concettuale • Dottorato di Ricerca",
    crediti: infoData?.crediti || "Curatela e ricerca di Giacomo Isidori • Ispirato ad Aby Warburg",
    titolo_concettuale: infoData?.titolo_concettuale || "1. Premessa Teorica & Metodo Mnemosyne (Aby Warburg)",
    testo_concettuale: infoData?.testo_concettuale || "Questo atlante celeste dinamico in 3D costituisce la parte pratica di una ricerca di storia dell'arte ispirata al metodo di Aby Warburg e al suo celebre Bilderatlas Mnemosyne: un sistema aperto, non gerarchico, per orientarsi nell'immaginario collettivo attraverso il montaggio associativo di immagini anziché una narrazione lineare.",
    titolo_struttura: infoData?.titolo_struttura || "2. La Struttura Astrologica come Archivio Non Divinatorio",
    testo_struttura: infoData?.testo_struttura || "Non si tratta di un progetto astrologico in senso divinatorio: lo zodiaco è impiegato come struttura archivistica e mnemotecnica, un sistema di 12 categorie simboliche per organizzare un vasto corpus di opere d'arte contemporanea.",
    titolo_cupola: infoData?.titolo_cupola || "3. Dalla Volta Web all'Installazione su Cupola",
    testo_cupola: infoData?.testo_cupola || "Il sito è progettato per essere fruibile nel browser ed essere successivamente proiettato dall'alto su una semisfera/cupola tramite specchio sferico. Nel buio dell'installazione, il pubblico sdraiato a terra \"naviga\" tra le immagini con lo sguardo rivolto verso l'alto — un'esperienza di pensiero associativo, orizzontale e onirico.",
    box_1_titolo: infoData?.box_1_titolo || "Esplorazione 360°",
    box_1_testo: infoData?.box_1_testo || "Trascina per guardare in alto e intorno a te; usa la rotella per zoomare.",
    box_2_titolo: infoData?.box_2_titolo || "Riconfigurazioni",
    box_2_testo: infoData?.box_2_testo || "Usa i tasti di layout per riordinare le stelle in modo cronologico o cromatico.",
    box_3_titolo: infoData?.box_3_titolo || "Archivio Bianco",
    box_3_testo: infoData?.box_3_testo || "Passa alla vista Giorno per consultare la catalogazione tassonomica delle opere.",
  });
  const [infoSaved, setInfoSaved] = useState(false);

  useEffect(() => {
    if (infoData) {
      setInfoForm({
        titolo: infoData.titolo || "AAA — Astrology Art Atlas",
        sottotitolo: infoData.sottotitolo || "Visione Concettuale • Dottorato di Ricerca",
        crediti: infoData.crediti || "Curatela e ricerca di Giacomo Isidori • Ispirato ad Aby Warburg",
        titolo_concettuale: infoData.titolo_concettuale || "1. Premessa Teorica & Metodo Mnemosyne (Aby Warburg)",
        testo_concettuale: infoData.testo_concettuale || "",
        titolo_struttura: infoData.titolo_struttura || "2. La Struttura Astrologica come Archivio Non Divinatorio",
        testo_struttura: infoData.testo_struttura || "",
        titolo_cupola: infoData.titolo_cupola || "3. Dalla Volta Web all'Installazione su Cupola",
        testo_cupola: infoData.testo_cupola || "",
        box_1_titolo: infoData.box_1_titolo || "Esplorazione 360°",
        box_1_testo: infoData.box_1_testo || "Trascina per guardare in alto e intorno a te; usa la rotella per zoomare.",
        box_2_titolo: infoData.box_2_titolo || "Riconfigurazioni",
        box_2_testo: infoData.box_2_testo || "Usa i tasti di layout per riordinare le stelle in modo cronologico o cromatico.",
        box_3_titolo: infoData.box_3_titolo || "Archivio Bianco",
        box_3_testo: infoData.box_3_testo || "Passa alla vista Giorno per consultare la catalogazione tassonomica delle opere.",
      });
    }
  }, [infoData]);

  // Legal / Disclaimer Form State
  const [legalForm, setLegalForm] = useState({
    titolo: legalData?.titolo || "Note Legali e Disclaimer",
    sezione_1_titolo: legalData?.sezione_1_titolo || "Atlante e Condivisione della Ricerca",
    sezione_1_testo: legalData?.sezione_1_testo || "I materiali, le raccolte e le analisi presenti su questo sito nascono come un progetto di studi aperti e condivisi. L'intero impianto e i testi originali sono pensati per la diffusione e la libera consultazione nell'ambito della ricerca; tuttavia, si richiede di citare la fonte e l'autore in caso di riutilizzo o condivisione dei contenuti.",
    sezione_2_titolo: legalData?.sezione_2_titolo || "Immagini e materiali di terze parti",
    sezione_2_testo: legalData?.sezione_2_testo || "Le immagini di opere d'arte o di artisti eventualmente presenti nel sito sono utilizzate esclusivamente a fini di studio, ricerca, critica e documentazione, senza alcun intento di lucro o sfruttamento commerciale, ai sensi dell'articolo 70 della Legge sul Diritto d'Autore (L. 633/1941).",
    sezione_3_titolo: legalData?.sezione_3_titolo || "Tutela e rimozione contenuti",
    sezione_3_testo: legalData?.sezione_3_testo || "Qualora il titolare di qualsiasi diritto sulle immagini o sui materiali pubblicati ritenesse che la loro presenza leda in alcun modo i propri interessi o diritti, è pregato di darne immediata comunicazione via email giacomo.isidori@gmail.com . L'autore provvederà alla loro tempestiva verifica e rimozione.",
    email_contatto: legalData?.email_contatto || "giacomo.isidori@gmail.com",
  });
  const [legalSaved, setLegalSaved] = useState(false);

  useEffect(() => {
    if (legalData) {
      setLegalForm({
        titolo: legalData.titolo || "Note Legali e Disclaimer",
        sezione_1_titolo: legalData.sezione_1_titolo || "Atlante e Condivisione della Ricerca",
        sezione_1_testo: legalData.sezione_1_testo || "I materiali, le raccolte e le analisi presenti su questo sito nascono come un progetto di studi aperti e condivisi. L'intero impianto e i testi originali sono pensati per la diffusione e la libera consultazione nell'ambito della ricerca; tuttavia, si richiede di citare la fonte e l'autore in caso di riutilizzo o condivisione dei contenuti.",
        sezione_2_titolo: legalData.sezione_2_titolo || "Immagini e materiali di terze parti",
        sezione_2_testo: legalData.sezione_2_testo || "Le immagini di opere d'arte o di artisti eventualmente presenti nel sito sono utilizzate esclusivamente a fini di studio, ricerca, critica e documentazione, senza alcun intento di lucro o sfruttamento commerciale, ai sensi dell'articolo 70 della Legge sul Diritto d'Autore (L. 633/1941).",
        sezione_3_titolo: legalData.sezione_3_titolo || "Tutela e rimozione contenuti",
        sezione_3_testo: legalData.sezione_3_testo || "Qualora il titolare di qualsiasi diritto sulle immagini o sui materiali pubblicati ritenesse che la loro presenza leda in alcun modo i propri interessi o diritti, è pregato di darne immediata comunicazione via email giacomo.isidori@gmail.com . L'autore provvederà alla loro tempestiva verifica e rimozione.",
        email_contatto: legalData.email_contatto || "giacomo.isidori@gmail.com",
      });
    }
  }, [legalData]);

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
    posizione_manuale: undefined,
    parole_chiave_str: "",
    nota_simbolica: "",
    colore_dominante: "#E0362F",
    link_fonte: "",
    link_tema_natale: "",
    clonedFromArtist: "",
  });

  // Sidebar Grouping Mode: "artists" (1-to-N) vs "artworks" (flat)
  const [listGroupingMode, setListGroupingMode] = useState("artists");
  const [expandedArtists, setExpandedArtists] = useState({});

  const toggleArtistExpand = (artistName) => {
    setExpandedArtists(prev => ({
      ...prev,
      [artistName]: prev[artistName] === undefined ? false : !prev[artistName]
    }));
  };

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

  // Start creating new artist with first artwork
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
      anno: new Date().getFullYear(),
      tecnica: "",
      immagine: "",
      tema_natale: { sole: "Ariete", luna: "", venere: "", mercurio: "" },
      posizione_manuale: undefined,
      parole_chiave_str: "",
      nota_simbolica: "",
      colore_dominante: "#E0362F",
      link_fonte: "",
      link_tema_natale: "",
      clonedFromArtist: "",
    });
  };

  // Start editing existing artwork
  const handleStartEdit = (art) => {
    setIsCreatingNew(false);
    setEditingArt(art);
    setImageUploadStatus("");
    const parsedDates = parseBiographicalDates(art.date_biografiche, art.data_nascita, art.anno_morte);
    
    // Only keep manual position if it is a real 3D custom coordinate (not dummy [40, 0, 10])
    const isDummy = art.posizione_manuale &&
      Math.abs(art.posizione_manuale.x - 40) < 6 &&
      Math.abs(art.posizione_manuale.y) < 3 &&
      Math.abs(art.posizione_manuale.z - 10) < 6 &&
      (art.segno || "").toLowerCase() !== "ariete";

    setFormData({
      ...art,
      citazione: art.citazione || "",
      commento: art.commento || "",
      link_tema_natale: art.link_tema_natale || "",
      data_nascita: parsedDates.data_nascita,
      anno_morte: parsedDates.anno_morte,
      date_biografiche: formatBiographicalDates({ ...art, ...parsedDates }),
      tema_natale: art.tema_natale || { sole: art.segno || "Ariete", luna: "", venere: "", mercurio: "" },
      posizione_manuale: isDummy ? undefined : art.posizione_manuale,
      parole_chiave_str: (art.parole_chiave || []).join(", "),
      clonedFromArtist: "",
    });
  };

  // Add a new artwork directly for an existing artist (1-to-N relation)
  const handleAddArtworkToArtist = (artistData) => {
    setEditingArt(null);
    setIsCreatingNew(true);
    setImageUploadStatus("");
    const newId = `art_${Date.now()}`;
    const baseArt = (artistData.artworks && artistData.artworks[0]) ? artistData.artworks[0] : (artistData || {});
    const parsedDates = parseBiographicalDates(baseArt.date_biografiche, baseArt.data_nascita, baseArt.anno_morte);

    setFormData({
      id: newId,
      segno: baseArt.segno || "Ariete",
      artista: artistData.name || baseArt.artista || "",
      citazione: baseArt.citazione || "",
      commento: "",
      link_tema_natale: baseArt.link_tema_natale || "",
      titolo: "",
      data_nascita: parsedDates.data_nascita,
      anno_morte: parsedDates.anno_morte,
      date_biografiche: formatBiographicalDates({ ...baseArt, ...parsedDates }),
      anno: new Date().getFullYear(),
      tecnica: "",
      immagine: "",
      tema_natale: baseArt.tema_natale
        ? { ...baseArt.tema_natale }
        : { sole: baseArt.segno || "Ariete", luna: "", venere: "", mercurio: "" },
      posizione_manuale: undefined,
      parole_chiave_str: "",
      nota_simbolica: "",
      colore_dominante: baseArt.colore_dominante || "#E0362F",
      link_fonte: baseArt.link_fonte || "",
      clonedFromArtist: artistData.name || baseArt.artista || "",
    });
  };

  // Clone artwork to quickly duplicate and add another piece for the same artist
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
      link_tema_natale: baseArt.link_tema_natale || "",
      titolo: baseArt.titolo ? `${baseArt.titolo} (Nuova Versione)` : "",
      data_nascita: parsedDates.data_nascita,
      anno_morte: parsedDates.anno_morte,
      date_biografiche: formatBiographicalDates({ ...baseArt, ...parsedDates }),
      anno: baseArt.anno || new Date().getFullYear(),
      tecnica: baseArt.tecnica || "",
      immagine: "",
      tema_natale: baseArt.tema_natale
        ? { ...baseArt.tema_natale }
        : { sole: baseArt.segno || "Ariete", luna: "", venere: "", mercurio: "" },
      posizione_manuale: undefined,
      parole_chiave_str: Array.isArray(baseArt.parole_chiave)
        ? baseArt.parole_chiave.join(", ")
        : (baseArt.parole_chiave_str || ""),
      nota_simbolica: baseArt.nota_simbolica || "",
      colore_dominante: baseArt.colore_dominante || "#E0362F",
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

    const manualPos = (formData.posizione_manuale && typeof formData.posizione_manuale.x === 'number' && !(Math.abs(formData.posizione_manuale.x - 40) < 6 && Math.abs(formData.posizione_manuale.y) < 3 && Math.abs(formData.posizione_manuale.z - 10) < 6))
      ? {
          x: parseFloat(formData.posizione_manuale.x),
          y: parseFloat(formData.posizione_manuale.y),
          z: parseFloat(formData.posizione_manuale.z),
        }
      : undefined;

    const updatedItem = {
      id: formData.id || `art_${Date.now()}`,
      segno: formData.segno,
      artista: formData.artista,
      citazione: formData.citazione || "",
      commento: (formData.commento || "").trim(),
      link_tema_natale: (formData.link_tema_natale || "").trim(),
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
      ...(manualPos ? { posizione_manuale: manualPos } : {}),
      parole_chiave: keywordsArray,
      nota_simbolica: formData.nota_simbolica,
      colore_dominante: formData.colore_dominante,
      link_fonte: formData.link_fonte,
      scala: typeof (editingArt?.scala || formData.scala) === 'number' ? (editingArt?.scala || formData.scala) : 1.0,
      dimensione: typeof (editingArt?.dimensione || formData.dimensione) === 'number' ? (editingArt?.dimensione || formData.dimensione) : 1.0,
      miniatura: editingArt?.miniatura || formData.miniatura || formData.immagine,
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
  const handleSaveBio = async (e) => {
    e.preventDefault();
    if (onUpdateBio) {
      onUpdateBio(bioForm);
    }
    setBioSaved(true);
    setTimeout(() => setBioSaved(false), 2500);
    await handleCommitAndSync();
  };

  // Save Project Info & Vision Form
  const handleSaveInfo = async (e) => {
    e.preventDefault();
    if (onUpdateInfo) {
      onUpdateInfo(infoForm);
    }
    setInfoSaved(true);
    setTimeout(() => setInfoSaved(false), 2500);
    await handleCommitAndSync();
  };

  // Save Legal & Disclaimer Form
  const handleSaveLegal = async (e) => {
    e.preventDefault();
    if (onUpdateLegal) {
      onUpdateLegal(legalForm);
    }
    setLegalSaved(true);
    setTimeout(() => setLegalSaved(false), 2500);
    await handleCommitAndSync();
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

  // Commit & Sync directly to public/data/atlas.json (via centralized onCommitAtlas)
  const handleCommitAndSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncStatus(null);

    // 1. Always propagate bioForm and infoForm to parent state
    if (onUpdateBio) {
      onUpdateBio(bioForm);
    }
    if (onUpdateInfo) {
      onUpdateInfo(infoForm);
    }

    // If currently editing or creating an artwork with valid artist/title, merge it first
    let currentArtworks = [...artworks];
    if ((editingArt || isCreatingNew) && (formData.artista || formData.titolo)) {
      const keywordsArray = (formData.parole_chiave_str || "")
        .split(",")
        .map(k => k.trim())
        .filter(Boolean);

      const bioStr = formatBiographicalDates({
        data_nascita: formData.data_nascita,
        anno_morte: formData.anno_morte,
        date_biografiche: formData.date_biografiche,
      });

      const manualPos = (formData.posizione_manuale && typeof formData.posizione_manuale.x === 'number' && !(Math.abs(formData.posizione_manuale.x - 40) < 6 && Math.abs(formData.posizione_manuale.y) < 3 && Math.abs(formData.posizione_manuale.z - 10) < 6))
        ? {
            x: parseFloat(formData.posizione_manuale.x),
            y: parseFloat(formData.posizione_manuale.y),
            z: parseFloat(formData.posizione_manuale.z),
          }
        : undefined;

      const activeItem = {
        id: formData.id || (editingArt?.id) || `art_${Date.now()}`,
        segno: formData.segno,
        artista: formData.artista,
        citazione: formData.citazione || "",
        commento: (formData.commento || "").trim(),
        link_tema_natale: (formData.link_tema_natale || "").trim(),
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
        ...(manualPos ? { posizione_manuale: manualPos } : {}),
        parole_chiave: keywordsArray,
        nota_simbolica: formData.nota_simbolica,
        colore_dominante: formData.colore_dominante,
        link_fonte: formData.link_fonte,
        scala: typeof (editingArt?.scala || formData.scala) === 'number' ? (editingArt?.scala || formData.scala) : 1.0,
        dimensione: typeof (editingArt?.dimensione || formData.dimensione) === 'number' ? (editingArt?.dimensione || formData.dimensione) : 1.0,
        miniatura: editingArt?.miniatura || formData.miniatura || formData.immagine,
      };

      if (editingArt) {
        currentArtworks = currentArtworks.map(a => (a.id === editingArt.id ? activeItem : a));
      } else {
        currentArtworks = [...currentArtworks, activeItem];
      }
      onUpdateArtworks(currentArtworks);
    }

    if (githubToken) {
      try {
        localStorage.setItem("aaa_github_token", githubToken);
      } catch (e) {}
    }

    try {
      if (onCommitAtlas) {
        const result = await onCommitAtlas({
          bio: bioForm,
          info: infoForm,
          legal: legalForm,
          artworks: currentArtworks,
        });

        if (result?.success) {
          setSyncStatus({
            type: "success",
            message: result.message || `Atlante sincronizzato e committato con successo (${currentArtworks.length} opere)!`,
          });
        } else {
          setSyncStatus({
            type: "error",
            message: result?.error || "Errore durante il salvataggio su GitHub.",
          });
        }
      }
    } catch (err) {
      setSyncStatus({
        type: "error",
        message: `Errore durante il commit: ${err.message}`,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Export JSON file download
  const handleDownloadJSON = () => {
    const exportObject = {
      progetto: {
        titolo: infoForm.titolo || "AAA — Astrology Art Atlas",
        curatore: bioForm,
        info: infoForm,
        legal: legalForm,
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
        titolo: infoForm.titolo || "AAA — Astrology Art Atlas",
        curatore: bioForm,
        info: infoForm,
        legal: legalForm,
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

  // Group artworks by artist (1-to-N relation)
  const groupedArtists = useMemo(() => {
    const map = new Map();
    const q = (searchFilter || "").toLowerCase().trim();

    artworks.forEach(art => {
      const artistName = (art.artista || "Senza Autore").trim();
      if (!map.has(artistName)) {
        map.set(artistName, {
          name: artistName,
          segno: art.segno || "Ariete",
          date_biografiche: art.date_biografiche || "",
          data_nascita: art.data_nascita || "",
          anno_morte: art.anno_morte || "",
          tema_natale: art.tema_natale || null,
          citazione: art.citazione || "",
          link_tema_natale: art.link_tema_natale || "",
          colore_dominante: art.colore_dominante || "#E0362F",
          artworks: []
        });
      }
      map.get(artistName).artworks.push(art);
    });

    const list = Array.from(map.values());

    if (!q) return list;

    // Filter artists and their artworks
    return list.filter(group => {
      const matchArtist = (group.name || "").toLowerCase().includes(q) ||
        (group.segno || "").toLowerCase().includes(q) ||
        (group.date_biografiche || "").toLowerCase().includes(q);
      const matchAnyWork = group.artworks.some(w =>
        (w.titolo || "").toLowerCase().includes(q) ||
        (w.anno ? String(w.anno) : "").includes(q) ||
        (w.tecnica || "").toLowerCase().includes(q) ||
        (w.nota_simbolica || "").toLowerCase().includes(q) ||
        (w.commento || "").toLowerCase().includes(q)
      );
      return matchArtist || matchAnyWork;
    });
  }, [artworks, searchFilter]);

  if (!isOpen) return null;

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

          <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-end">
            {isAuthenticated && (
              <>
                {/* 0. Live 3D Spatial Editor Mode */}
                <button
                  type="button"
                  onClick={() => {
                    onClose?.();
                    onStartSpatialEdit?.();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-200 text-xs font-mono transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
                  title="Apri l'Editor 3D Live per trascinare e ridimensionare le opere nella volta celeste"
                >
                  <Move className="w-3.5 h-3.5 text-purple-300" />
                  <span>Curatela 3D (Editor Live)</span>
                </button>

                {/* 1. Main Commit & Direct Sync Button */}
                <button
                  onClick={handleCommitAndSync}
                  disabled={isSyncing}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-semibold text-xs font-mono hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer"
                  title="Salva e sincronizza istantaneamente tutte le modifiche nell'Atlante perenne"
                >
                  {isSyncing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <UploadCloud className="w-3.5 h-3.5" />
                  )}
                  <span>{isSyncing ? "Salvataggio..." : "Salva & Committa"}</span>
                </button>

                {/* 2. Download JSON Backup */}
                <button
                  onClick={handleDownloadJSON}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-mono transition-all text-white/90"
                  title="Scarica atlas.json come backup locale"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Scarica</span>
                </button>

                {/* 3. Copy JSON */}
                <button
                  onClick={handleCopyJSON}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-mono transition-all text-white/90"
                  title="Copia l'intero database negli appunti"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{copied ? "Copiato!" : "Copia"}</span>
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

        {/* Sync Status Banner */}
        {syncStatus && (
          <div
            className={`px-6 py-2.5 text-xs font-mono flex items-center justify-between border-b ${
              syncStatus.type === "success"
                ? "bg-emerald-950/70 border-emerald-500/30 text-emerald-300"
                : "bg-red-950/70 border-red-500/30 text-red-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {syncStatus.type === "success" ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-red-400" />}
              <span>{syncStatus.message}</span>
            </div>
            <button
              onClick={() => setSyncStatus(null)}
              className="text-white/60 hover:text-white text-xs underline ml-4"
            >
              Chiudi
            </button>
          </div>
        )}

        {/* Tab Switcher (Visible when Authenticated) */}
        {isAuthenticated && (
          <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-white/10 bg-zinc-900/60 overflow-x-auto">
            <button
              onClick={() => setActiveTab("artworks")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
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
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                activeTab === "bio"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Biografia & Profilo Curatore (Giacomo Isidori)</span>
            </button>
            <button
              onClick={() => setActiveTab("info")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                activeTab === "info"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-400/40 shadow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Visione & Info Progetto (AAA)</span>
            </button>
            <button
              onClick={() => setActiveTab("legal")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                activeTab === "legal"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Note Legali & Disclaimer</span>
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

              <div className="p-4 rounded-xl bg-zinc-900/90 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono text-amber-300">Titolo Sezione Biografia</label>
                  <span className="text-[10px] text-zinc-500">Titolo visualizzato nella scheda</span>
                </div>
                <input
                  type="text"
                  value={bioForm.titolo_biografia}
                  onChange={(e) => setBioForm({ ...bioForm, titolo_biografia: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:ring-1 focus:ring-amber-400"
                  placeholder="Biografia"
                />
                <label className="block text-xs font-mono text-zinc-400 mt-2 flex items-center justify-between">
                  <span>Testo Biografia Completa</span>
                  <span className="text-[10px] text-zinc-500">Supporta ritorni a capo per i paragrafi</span>
                </label>
                <textarea
                  rows={6}
                  value={bioForm.biografia}
                  onChange={(e) => setBioForm({ ...bioForm, biografia: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-xs leading-relaxed focus:ring-1 focus:ring-amber-400"
                  placeholder="Scrivi qui la tua biografia, il percorso accademico, curatoriale e di ricerca..."
                />
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/90 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono text-amber-300">Titolo Sezione Visione & Metodo</label>
                  <span className="text-[10px] text-zinc-500">Titolo visualizzato nella scheda</span>
                </div>
                <input
                  type="text"
                  value={bioForm.titolo_visione}
                  onChange={(e) => setBioForm({ ...bioForm, titolo_visione: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:ring-1 focus:ring-amber-400"
                  placeholder="Visione & Metodo Curatoriale"
                />
                <label className="block text-xs font-mono text-zinc-400 mt-2 flex items-center justify-between">
                  <span>Dichiarazione di Visione & Metodo Curatoriale</span>
                  <span className="text-[10px] text-zinc-500">Opzionale: citazione o testo metodologico</span>
                </label>
                <textarea
                  rows={4}
                  value={bioForm.visione}
                  onChange={(e) => setBioForm({ ...bioForm, visione: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-xs leading-relaxed focus:ring-1 focus:ring-amber-400 font-serif"
                  placeholder="La visione del progetto AAA, il riferimento ad Aby Warburg, la metodologia simbolica..."
                />
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/90 border border-white/10 space-y-3">
                <div>
                  <label className="block text-xs font-mono text-amber-300 mb-1.5">Titolo Sezione Contatti</label>
                  <input
                    type="text"
                    value={bioForm.titolo_contatti}
                    onChange={(e) => setBioForm({ ...bioForm, titolo_contatti: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:ring-1 focus:ring-amber-400"
                    placeholder="Contatti Ufficiali & Curatela"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1.5 flex items-center gap-1.5">
                      <Instagram className="w-3.5 h-3.5 text-pink-400" />
                      <span>Profilo Instagram</span>
                    </label>
                    <input
                      type="text"
                      value={bioForm.instagram}
                      onChange={(e) => setBioForm({ ...bioForm, instagram: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:ring-1 focus:ring-amber-400 font-mono"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:ring-1 focus:ring-amber-400 font-mono"
                      placeholder="astro.expression@gmail.com"
                    />
                  </div>
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
        ) : activeTab === "info" ? (
          /* TAB 3: PROJECT INFO & VISION STATEMENT EDITOR */
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <form onSubmit={handleSaveInfo} className="max-w-3xl mx-auto space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-400/30 flex items-center justify-center text-purple-300">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-bold text-white">Visione, Metodo Mnemosyne & Info Progetto</h3>
                    <p className="text-xs font-mono text-zinc-400">
                      Modifica il testo visualizzato quando gli utenti cliccano "AAA" nell'intestazione
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-semibold text-xs shadow-lg shadow-purple-500/20 transition-all font-mono"
                >
                  <Save className="w-4 h-4" />
                  <span>{infoSaved ? "Info Salvate!" : "Salva Info Progetto"}</span>
                </button>
              </div>

              {infoSaved && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Modifiche salvate con successo! La finestra informativa AAA è aggiornata in tempo reale.</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5">Titolo Principale</label>
                  <input
                    type="text"
                    value={infoForm.titolo}
                    onChange={(e) => setInfoForm({ ...infoForm, titolo: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs focus:ring-1 focus:ring-purple-400 font-mono"
                    placeholder="AAA — Astrology Art Atlas"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5">Sottotitolo / Dottorato</label>
                  <input
                    type="text"
                    value={infoForm.sottotitolo}
                    onChange={(e) => setInfoForm({ ...infoForm, sottotitolo: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs focus:ring-1 focus:ring-purple-400 font-mono"
                    placeholder="Visione Concettuale • Dottorato di Ricerca"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">Crediti di Ricerca & Curatela</label>
                <input
                  type="text"
                  value={infoForm.crediti}
                  onChange={(e) => setInfoForm({ ...infoForm, crediti: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-xs focus:ring-1 focus:ring-purple-400 font-mono"
                  placeholder="Curatela e ricerca di Giacomo Isidori • Ispirato ad Aby Warburg"
                />
              </div>

              {/* Paragrafo 1 */}
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono text-purple-300">Titolo Paragrafo 1</label>
                  <span className="text-[10px] text-zinc-500">Intestazione o tema del paragrafo</span>
                </div>
                <input
                  type="text"
                  value={infoForm.titolo_concettuale}
                  onChange={(e) => setInfoForm({ ...infoForm, titolo_concettuale: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:ring-1 focus:ring-purple-400"
                  placeholder="1. Premessa Teorica & Metodo Mnemosyne (Aby Warburg)"
                />
                <label className="block text-xs font-mono text-zinc-400 mt-2 flex items-center justify-between">
                  <span>Testo Premessa Teorica & Metodo Mnemosyne</span>
                  <span className="text-[10px] text-zinc-500">Paragrafo principale di inquadramento</span>
                </label>
                <textarea
                  rows={4}
                  value={infoForm.testo_concettuale}
                  onChange={(e) => setInfoForm({ ...infoForm, testo_concettuale: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-xs leading-relaxed focus:ring-1 focus:ring-purple-400"
                  placeholder="Questo atlante celeste dinamico in 3D costituisce la parte pratica di una ricerca di storia dell'arte ispirata al metodo di Aby Warburg..."
                />
              </div>

              {/* Paragrafo 2 */}
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono text-purple-300">Titolo Paragrafo 2</label>
                  <span className="text-[10px] text-zinc-500">Intestazione o tema del paragrafo</span>
                </div>
                <input
                  type="text"
                  value={infoForm.titolo_struttura}
                  onChange={(e) => setInfoForm({ ...infoForm, titolo_struttura: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs font-mono focus:ring-1 focus:ring-purple-400"
                  placeholder="2. La Struttura Astrologica come Archivio Non Divinatorio"
                />
                <label className="block text-xs font-mono text-zinc-400 mt-2 flex items-center justify-between">
                  <span>Testo Struttura Astrologica come Archivio</span>
                  <span className="text-[10px] text-zinc-500">Spiegazione delle 12 categorie mnemotecniche</span>
                </label>
                <textarea
                  rows={3}
                  value={infoForm.testo_struttura}
                  onChange={(e) => setInfoForm({ ...infoForm, testo_struttura: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-xs leading-relaxed focus:ring-1 focus:ring-purple-400"
                  placeholder="Non si tratta di un progetto astrologico in senso divinatorio: lo zodiaco è impiegato come struttura archivistica e mnemotecnica..."
                />
              </div>

              {/* Paragrafo 3 */}
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-amber-400/30 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono text-amber-300">Titolo Paragrafo 3</label>
                  <span className="text-[10px] text-zinc-500">Intestazione per cupola / proiezione</span>
                </div>
                <input
                  type="text"
                  value={infoForm.titolo_cupola}
                  onChange={(e) => setInfoForm({ ...infoForm, titolo_cupola: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-amber-400/30 text-white text-xs font-mono focus:ring-1 focus:ring-amber-400"
                  placeholder="3. Dalla Volta Web all'Installazione su Cupola"
                />
                <label className="block text-xs font-mono text-zinc-400 mt-2 flex items-center justify-between">
                  <span>Testo Dalla Volta Web all'Installazione su Cupola</span>
                  <span className="text-[10px] text-zinc-500">Testo per proiezione semisferica</span>
                </label>
                <textarea
                  rows={4}
                  value={infoForm.testo_cupola}
                  onChange={(e) => setInfoForm({ ...infoForm, testo_cupola: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-xs leading-relaxed focus:ring-1 focus:ring-amber-400"
                  placeholder="Il sito è progettato per essere fruibile nel browser ed essere successivamente proiettato dall'alto su una semisfera/cupola tramite specchio sferico..."
                />
              </div>

              {/* 3 Box Informativi / Feature nella Modale */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>3 Box Informativi / Istruzioni nella Modale</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Box 1 */}
                  <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-white/10 space-y-2">
                    <label className="block text-[11px] font-mono text-cyan-300">Box 1 — Titolo</label>
                    <input
                      type="text"
                      value={infoForm.box_1_titolo}
                      onChange={(e) => setInfoForm({ ...infoForm, box_1_titolo: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono focus:ring-1 focus:ring-cyan-400"
                      placeholder="Esplorazione 360°"
                    />
                    <label className="block text-[11px] font-mono text-zinc-400 mt-2">Box 1 — Testo</label>
                    <textarea
                      rows={3}
                      value={infoForm.box_1_testo}
                      onChange={(e) => setInfoForm({ ...infoForm, box_1_testo: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/15 text-white text-xs leading-relaxed focus:ring-1 focus:ring-cyan-400"
                      placeholder="Trascina per guardare in alto e intorno a te; usa la rotella per zoomare."
                    />
                  </div>

                  {/* Box 2 */}
                  <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-white/10 space-y-2">
                    <label className="block text-[11px] font-mono text-amber-300">Box 2 — Titolo</label>
                    <input
                      type="text"
                      value={infoForm.box_2_titolo}
                      onChange={(e) => setInfoForm({ ...infoForm, box_2_titolo: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono focus:ring-1 focus:ring-amber-400"
                      placeholder="Riconfigurazioni"
                    />
                    <label className="block text-[11px] font-mono text-zinc-400 mt-2">Box 2 — Testo</label>
                    <textarea
                      rows={3}
                      value={infoForm.box_2_testo}
                      onChange={(e) => setInfoForm({ ...infoForm, box_2_testo: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/15 text-white text-xs leading-relaxed focus:ring-1 focus:ring-amber-400"
                      placeholder="Usa i tasti di layout per riordinare le stelle in modo cronologico o cromatico."
                    />
                  </div>

                  {/* Box 3 */}
                  <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-white/10 space-y-2">
                    <label className="block text-[11px] font-mono text-emerald-300">Box 3 — Titolo</label>
                    <input
                      type="text"
                      value={infoForm.box_3_titolo}
                      onChange={(e) => setInfoForm({ ...infoForm, box_3_titolo: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono focus:ring-1 focus:ring-emerald-400"
                      placeholder="Archivio Bianco"
                    />
                    <label className="block text-[11px] font-mono text-zinc-400 mt-2">Box 3 — Testo</label>
                    <textarea
                      rows={3}
                      value={infoForm.box_3_testo}
                      onChange={(e) => setInfoForm({ ...infoForm, box_3_testo: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/15 text-white text-xs leading-relaxed focus:ring-1 focus:ring-emerald-400"
                      placeholder="Passa alla vista Giorno per consultare la catalogazione tassonomica delle opere."
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-semibold text-xs shadow-lg shadow-purple-500/20 transition-all font-mono"
                >
                  <Save className="w-4 h-4" />
                  <span>{infoSaved ? "Salvato!" : "Salva Tutte le Modifiche Info"}</span>
                </button>
              </div>
            </form>
          </div>
        ) : activeTab === "legal" ? (
          /* TAB 4: LEGAL & DISCLAIMER EDITOR */
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <form onSubmit={handleSaveLegal} className="max-w-3xl mx-auto space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>Gestione Note Legali & Disclaimer</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Modifica i testi di copyright, liberatoria e i contatti mostrati nella finestra modale del sito.
                  </p>
                </div>
                {legalSaved && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-mono animate-fade-in">
                    <Check className="w-3.5 h-3.5" />
                    <span>Salvato nella sessione! Ricorda di cliccare "Salva &amp; Sincronizza su GitHub".</span>
                  </div>
                )}
              </div>

              {/* General Settings */}
              <div className="space-y-4 bg-zinc-900/60 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">Intestazione & Contatto</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">Titolo Modale</label>
                    <input
                      type="text"
                      value={legalForm.titolo || ""}
                      onChange={(e) => setLegalForm({ ...legalForm, titolo: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 font-serif"
                      placeholder="Note Legali e Disclaimer"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">Email per segnalazioni / rimozione</label>
                    <input
                      type="email"
                      value={legalForm.email_contatto || ""}
                      onChange={(e) => setLegalForm({ ...legalForm, email_contatto: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 font-mono"
                      placeholder="giacomo.isidori@gmail.com"
                    />
                  </div>
                </div>
              </div>

              {/* Section 1 */}
              <div className="space-y-3 bg-zinc-900/60 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <Scale className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">Sezione 1: Ricerca e Condivisione</h4>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">Titolo Sezione 1</label>
                  <input
                    type="text"
                    value={legalForm.sezione_1_titolo || ""}
                    onChange={(e) => setLegalForm({ ...legalForm, sezione_1_titolo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 font-medium"
                    placeholder="Atlante e Condivisione della Ricerca"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">Testo Sezione 1</label>
                  <textarea
                    rows={4}
                    value={legalForm.sezione_1_testo || ""}
                    onChange={(e) => setLegalForm({ ...legalForm, sezione_1_testo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 font-sans leading-relaxed resize-y"
                    placeholder="I materiali, le raccolte e le analisi presenti su questo sito..."
                  />
                </div>
              </div>

              {/* Section 2 */}
              <div className="space-y-3 bg-zinc-900/60 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <Scale className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">Sezione 2: Immagini e Materiali di Terze Parti</h4>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">Titolo Sezione 2</label>
                  <input
                    type="text"
                    value={legalForm.sezione_2_titolo || ""}
                    onChange={(e) => setLegalForm({ ...legalForm, sezione_2_titolo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 font-medium"
                    placeholder="Immagini e materiali di terze parti"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">Testo Sezione 2</label>
                  <textarea
                    rows={4}
                    value={legalForm.sezione_2_testo || ""}
                    onChange={(e) => setLegalForm({ ...legalForm, sezione_2_testo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 font-sans leading-relaxed resize-y"
                    placeholder="Le immagini di opere d'arte o di artisti eventualmente presenti nel sito..."
                  />
                </div>
              </div>

              {/* Section 3 */}
              <div className="space-y-3 bg-zinc-900/60 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <Scale className="w-4 h-4 text-rose-400" />
                  <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">Sezione 3: Tutela e Rimozione Contenuti</h4>
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">Titolo Sezione 3</label>
                  <input
                    type="text"
                    value={legalForm.sezione_3_titolo || ""}
                    onChange={(e) => setLegalForm({ ...legalForm, sezione_3_titolo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 font-medium"
                    placeholder="Tutela e rimozione contenuti"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">Testo Sezione 3</label>
                  <textarea
                    rows={4}
                    value={legalForm.sezione_3_testo || ""}
                    onChange={(e) => setLegalForm({ ...legalForm, sezione_3_testo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 font-sans leading-relaxed resize-y"
                    placeholder="Qualora il titolare di qualsiasi diritto sulle immagini..."
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20 transition-all font-mono"
                >
                  <Save className="w-4 h-4" />
                  <span>{legalSaved ? "Salvato!" : "Salva Note Legali"}</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* TAB 1: ARTWORKS CATALOGUE WORKSPACE */
          <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            {/* Left Sidebar: Artwork/Artist List (5 cols) */}
            <div className="lg:col-span-5 border-r border-white/10 flex flex-col bg-black/40 overflow-hidden">
              {/* Search & Actions Header */}
              <div className="p-3 border-b border-white/10 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    placeholder="Cerca artista, opera, segno..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                  <button
                    onClick={handleStartNew}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-all shadow shrink-0"
                    title="Aggiungi un nuovo artista con prima opera"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nuovo Artista</span>
                  </button>
                </div>

                {/* View Mode Toggle: Per Artista (1 a N) vs Tutte le Opere */}
                <div className="flex items-center p-0.5 rounded-lg bg-zinc-900/90 border border-white/10 text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() => setListGroupingMode("artists")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1 rounded-md transition-all ${
                      listGroupingMode === "artists"
                        ? "bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-400/30"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Users className="w-3 h-3" />
                    <span>Per Artista</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10">
                      {groupedArtists.length}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setListGroupingMode("artworks")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1 rounded-md transition-all ${
                      listGroupingMode === "artworks"
                        ? "bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-400/30"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Layers className="w-3 h-3" />
                    <span>Tutte le Opere</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10">
                      {artworks.length}
                    </span>
                  </button>
                </div>
              </div>

              {/* Scrollable list */}
              <div className="flex-1 overflow-y-auto divide-y divide-white/5 p-2 space-y-1">
                {listGroupingMode === "artists" ? (
                  /* 1-to-N ARTISTS VIEW */
                  groupedArtists.map((artistGroup) => {
                    const isExpanded = expandedArtists[artistGroup.name] !== false; // expanded by default
                    const sign = ZODIAC_SIGNS.find(s => s.name.toLowerCase() === (artistGroup.segno || "").toLowerCase() || s.id === artistGroup.segno);
                    const isArtistActive = formData.artista?.toLowerCase() === artistGroup.name.toLowerCase();

                    return (
                      <div
                        key={artistGroup.name}
                        className={`rounded-xl border transition-all overflow-hidden mb-1.5 ${
                          isArtistActive
                            ? "bg-white/[0.07] border-cyan-500/40 shadow-sm"
                            : "bg-zinc-950/60 border-white/10 hover:border-white/20"
                        }`}
                      >
                        {/* Artist Header Bar */}
                        <div
                          onClick={() => toggleArtistExpand(artistGroup.name)}
                          className="p-2.5 flex items-center justify-between gap-2 cursor-pointer select-none bg-white/[0.02] hover:bg-white/[0.06] transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleArtistExpand(artistGroup.name);
                              }}
                              className="p-0.5 text-zinc-400 hover:text-white"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-bold text-white truncate">
                                  {artistGroup.name}
                                </p>
                                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-400/20 shrink-0">
                                  {artistGroup.artworks.length} {artistGroup.artworks.length === 1 ? "opera" : "opere"}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 mt-0.5">
                                <span
                                  className="text-[9px] font-mono px-1.5 py-0.2 rounded shrink-0"
                                  style={{
                                    backgroundColor: `${sign?.color || "#555"}30`,
                                    color: sign?.color || "#fff",
                                  }}
                                >
                                  {artistGroup.segno}
                                </span>
                                {artistGroup.date_biografiche && (
                                  <span className="text-[10px] text-zinc-400 font-mono truncate">
                                    {artistGroup.date_biografiche}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Quick Add Artwork to this artist */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddArtworkToArtist(artistGroup);
                              }}
                              className="flex items-center gap-1 px-2 py-1 rounded-md bg-cyan-600/80 hover:bg-cyan-500 text-white text-[10px] font-mono font-medium transition-all shadow"
                              title={`Aggiungi un'altra opera a ${artistGroup.name}`}
                            >
                              <Plus className="w-3 h-3" />
                              <span>+ Opera</span>
                            </button>
                          </div>
                        </div>

                        {/* Artworks Sub-list (1-to-N) */}
                        {isExpanded && (
                          <div className="border-t border-white/5 divide-y divide-white/5 bg-black/40 pl-3">
                            {artistGroup.artworks.map((art, idx) => {
                              const isSelected = (editingArt && editingArt.id === art.id) || (formData.id === art.id);

                              return (
                                <div
                                  key={art.id || idx}
                                  onClick={() => handleStartEdit(art)}
                                  className={`p-2 pr-3 flex items-center justify-between gap-2.5 cursor-pointer transition-all ${
                                    isSelected
                                      ? "bg-cyan-500/15 border-l-2 border-cyan-400 shadow-sm"
                                      : "hover:bg-white/5 border-l-2 border-transparent"
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                    <img
                                      src={art.immagine}
                                      alt=""
                                      className="w-8 h-8 rounded-md object-cover bg-zinc-800 shrink-0 border border-white/10"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <p className="text-[11px] font-medium text-white truncate italic">
                                        {art.titolo || "Senza titolo"}
                                      </p>
                                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono truncate">
                                        {art.anno && <span>{art.anno}</span>}
                                        {art.tecnica && (
                                          <>
                                            <span>&bull;</span>
                                            <span className="truncate">{art.tecnica}</span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCloneArtwork(art);
                                      }}
                                      className="p-1 rounded-md hover:bg-amber-500/20 text-zinc-400 hover:text-amber-300 transition-all"
                                      title="Clona quest'opera per crearne una variante"
                                    >
                                      <CopyPlus className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(art.id);
                                      }}
                                      className="p-1 rounded-md hover:bg-rose-500/20 text-zinc-500 hover:text-rose-300 transition-all"
                                      title="Elimina quest'opera"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  /* FLAT ARTWORKS VIEW */
                  filteredList.map((art) => {
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
                  })
                )}
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

                    {/* Link Scheda Tema Natale (Astro.com / Astro-Seek / Astrodienst) */}
                    <div className="pt-2.5 border-t border-white/10">
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-zinc-300">
                          <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                          <span>Link Scheda Tema Natale (Astro.com / Astro-Seek / Astrodienst)</span>
                        </span>
                        {formData.link_tema_natale && (
                          <a
                            href={formData.link_tema_natale}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono hover:underline"
                          >
                            <span>Verifica Scheda</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </label>
                      <input
                        type="url"
                        value={formData.link_tema_natale || ""}
                        onChange={(e) => setFormData({ ...formData, link_tema_natale: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950/80 border border-white/15 text-white text-xs font-mono placeholder:text-zinc-600 focus:ring-1 focus:ring-amber-400"
                        placeholder="Es: https://www.astro.com/astro-databank/Kusama,_Yayoi"
                      />
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
