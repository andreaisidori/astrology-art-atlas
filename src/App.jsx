import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Instagram } from 'lucide-react';
import LandingScreen from './components/ui/LandingScreen';
import Header from './components/ui/Header';
import ZodiacNav from './components/ui/ZodiacNav';
import LayoutControls from './components/ui/LayoutControls';
import ArtworkModal from './components/ui/ArtworkModal';
import ArchiveView from './components/ui/ArchiveView';
import DomeOverlay from './components/ui/DomeOverlay';
import InfoModal from './components/ui/InfoModal';
import BioModal from './components/ui/BioModal';
import AdminCuratorPanel from './components/admin/AdminCuratorPanel';
import CelestialSphere from './components/3d/CelestialSphere';
import ArtworkNode from './components/3d/ArtworkNode';
import ConstellationLines from './components/3d/ConstellationLines';
import NavigationArrows from './components/ui/NavigationArrows';
import ZoomControls from './components/ui/ZoomControls';
import CameraController from './components/3d/CameraController';
import CuratorSpatialEditor from './components/3d/CuratorSpatialEditor';
import SpatialCuratorHUD from './components/ui/SpatialCuratorHUD';
import { getCurrentMoonPosition, ZODIAC_SIGNS } from './utils/astronomy';
import { computeArtworkPositions } from './utils/layouts';

export default function App() {
  const [data, setData] = useState({ progetto: {}, opere: [] });
  const [showLanding, setShowLanding] = useState(true); // Landing screen active on load
  const [isLandingTransition, setIsLandingTransition] = useState(false);
  const [viewMode, setViewMode] = useState('3d'); // '3d' | 'archive'
  const [layoutMode, setLayoutMode] = useState('manual'); // 'manual' | 'chronological' | 'chromatic'
  const [activeSignId, setActiveSignId] = useState(null);
  const [targetFlightSign, setTargetFlightSign] = useState(null);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [isDomeView, setIsDomeView] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isBioOpen, setIsBioOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [moonInfo, setMoonInfo] = useState(null);
  const [magnitude, setMagnitude] = useState(1.0); // Star and artwork scale
  const [showImages, setShowImages] = useState(false); // Default to fast lightweight square frames
  const [manualRotateVelocity, setManualRotateVelocity] = useState(0);
  const [manualZoomVelocity, setManualZoomVelocity] = useState(0);

  // 3D Spatial Curatorial Studio State
  const [isSpatialEditMode, setIsSpatialEditMode] = useState(false);
  const [selectedEditArtworkId, setSelectedEditArtworkId] = useState(null);
  const [isDragging3D, setIsDragging3D] = useState(false);
  const [modifiedCount, setModifiedCount] = useState(0);
  const [isSyncing3D, setIsSyncing3D] = useState(false);
  const [syncStatus3D, setSyncStatus3D] = useState(null);

  // Currently selected artwork object for 3D spatial transformation
  const selectedEditArtwork = useMemo(() => {
    return (data.opere || []).find((a) => a.id === selectedEditArtworkId) || null;
  }, [data.opere, selectedEditArtworkId]);

  // Update specific artwork 3D coordinates in real-time during drag
  const handleUpdateArtworkPosition = (artId, pos) => {
    setData((prev) => {
      const newOpere = (prev.opere || []).map((item) => {
        if (item.id === artId) {
          return {
            ...item,
            posizione_manuale: { x: pos.x, y: pos.y, z: pos.z },
          };
        }
        return item;
      });
      return { ...prev, opere: newOpere };
    });
    setModifiedCount((c) => c + 1);
  };

  // Update specific artwork scale/size multiplier
  const handleUpdateArtworkScale = (artId, scale) => {
    setData((prev) => {
      const newOpere = (prev.opere || []).map((item) => {
        if (item.id === artId) {
          return {
            ...item,
            scala: scale,
            dimensione: scale,
          };
        }
        return item;
      });
      return { ...prev, opere: newOpere };
    });
    setModifiedCount((c) => c + 1);
  };

  // Reset artwork position to calculated astronomical coordinates
  const handleResetArtworkPosition = (artId) => {
    setData((prev) => {
      const newOpere = (prev.opere || []).map((item) => {
        if (item.id === artId) {
          const clone = { ...item };
          delete clone.posizione_manuale;
          return clone;
        }
        return item;
      });
      return { ...prev, opere: newOpere };
    });
    setModifiedCount((c) => c + 1);
  };

  // Unified Commit & Sync handler to persist Bio, Info, and 3D Artworks directly to GitHub
  const handleSaveAndCommitAtlas = async (overrides = {}) => {
    setIsSyncing3D(true);
    setSyncStatus3D(null);

    const mergedBio = overrides.bio || data.progetto?.curatore || {};
    const mergedInfo = overrides.info || data.progetto?.info || {};
    const mergedArtworks = overrides.artworks || data.opere || [];

    const exportObject = {
      progetto: {
        titolo: mergedInfo.titolo || data.progetto?.info?.titolo || 'AAA — Astrology Art Atlas',
        curatore: mergedBio,
        info: mergedInfo,
        descrizione: "Atlante mnemotecnico e archivio dinamico in 3D per l'immaginario artistico contemporaneo.",
        ispirazione: 'Aby Warburg — Bilderatlas Mnemosyne',
        totale_artisti: mergedArtworks.length,
        aggiornato_il: new Date().toISOString(),
      },
      opere: mergedArtworks,
    };

    try {
      const githubToken = localStorage.getItem('aaa_github_token') || '';
      const res = await fetch('/api/save-atlas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: exportObject,
          githubToken: githubToken.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setData(exportObject);
        setModifiedCount(0);
        const successMsg = json.message || `Modifiche salvate e committate con successo su GitHub (${mergedArtworks.length} opere)!`;
        setSyncStatus3D({
          type: 'success',
          message: successMsg,
        });
        return { success: true, message: successMsg };
      } else {
        const errorMsg = json.error || 'Errore durante il salvataggio su GitHub.';
        setSyncStatus3D({
          type: 'error',
          message: errorMsg,
        });
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      console.error('Commit error:', err);
      setData(exportObject);
      const errMsg = `Errore di rete o server: ${err.message}`;
      setSyncStatus3D({
        type: 'error',
        message: errMsg,
      });
      return { success: false, error: errMsg };
    } finally {
      setIsSyncing3D(false);
      setTimeout(() => setSyncStatus3D(null), 6000);
    }
  };

  // Trigger Sky-Door landing dive when entering from landing screen
  const handleEnterFromLanding = () => {
    setIsLandingTransition(true);
    setTimeout(() => {
      setShowLanding(false);
    }, 1150);
  };

  // Handle updating curator bio
  const handleUpdateBio = (newBio) => {
    setData((prev) => ({
      ...prev,
      progetto: {
        ...(prev.progetto || {}),
        curatore: {
          ...(prev.progetto?.curatore || {}),
          ...newBio,
        },
      },
    }));
  };

  // Handle updating project info & vision statement
  const handleUpdateInfo = (newInfo) => {
    setData((prev) => ({
      ...prev,
      progetto: {
        ...(prev.progetto || {}),
        info: {
          ...(prev.progetto?.info || {}),
          ...newInfo,
        },
      },
    }));
  };

  // Handle updating artworks catalog
  const handleUpdateArtworks = (newArtworks) => {
    setData((prev) => ({ ...prev, opere: newArtworks }));
  };

  // Clean stale localStorage caches and load Atlas JSON from live API
  useEffect(() => {
    // 1. Calculate real-time moon position
    const moon = getCurrentMoonPosition();
    setMoonInfo(moon);

    // 2. Erase any stale localStorage cache keys so GitHub / API remains the single source of truth
    try {
      localStorage.removeItem('aaa_curator_bio');
      localStorage.removeItem('aaa_project_info');
      localStorage.removeItem('aaa_custom_artworks');
    } catch (e) {
      console.warn('LocalStorage cleanup:', e);
    }

    // 3. Load dataset asynchronously (live API from GitHub first, with static fallback)
    const loadAtlasData = async () => {
      // Live API fetch (GitHub single source of truth)
      try {
        const res = await fetch(`/api/get-atlas?t=${Date.now()}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache, no-store' },
        });
        if (res.ok) {
          const json = await res.json();
          if (json && json.progetto && json.opere && Array.isArray(json.opere) && json.opere.length > 0) {
            setData(json);
            return;
          }
        }
      } catch (e) {
        console.warn('API fetch live update:', e);
      }

      // Fallback to static atlas.json
      try {
        const staticRes = await fetch(`/data/atlas.json?t=${Date.now()}`);
        if (staticRes.ok) {
          const staticJson = await staticRes.json();
          if (staticJson && staticJson.progetto && staticJson.opere) {
            setData(staticJson);
          }
        }
      } catch (err) {
        console.warn('Fallback static file load:', err);
      }
    };

    loadAtlasData();
  }, []);

  // Compute 3D positions for all artworks with balanced airy spacing (radius 48)
  const artworkPositions = useMemo(() => {
    return computeArtworkPositions(data.opere || [], layoutMode, activeSignId, 48);
  }, [data.opere, layoutMode, activeSignId]);

  // Handle Sign selection (fly camera to sign and highlight)
  const handleSelectSign = (signId) => {
    setActiveSignId(signId);
    setTargetFlightSign(signId);
  };

  const handleResetSign = () => {
    setActiveSignId(null);
    setTargetFlightSign(null);
  };

  // Handle Left / Right Arrow Rotation (Left turns view left, Right turns view right)
  const handleRotateLeft = (speed = 0.65) => {
    setManualRotateVelocity(speed);
  };

  const handleRotateRight = (speed = 0.65) => {
    setManualRotateVelocity(-speed);
  };

  const handleStopRotate = () => {
    setManualRotateVelocity(0);
  };

  // Handle Zoom In / Zoom Out (Zoom In decreases FOV, Zoom Out increases FOV)
  const handleZoomIn = (speed = 0.9) => {
    setManualZoomVelocity(-speed);
  };

  const handleZoomOut = (speed = 0.9) => {
    setManualZoomVelocity(speed);
  };

  const handleStopZoom = () => {
    setManualZoomVelocity(0);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-space-950 select-none">
      {/* Top Header Bar */}
      <Header
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode(v => (v === '3d' ? 'archive' : '3d'))}
        moonInfo={moonInfo}
        onOpenInfo={() => setIsInfoOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenLanding={() => setShowLanding(true)}
        onOpenBio={() => setIsBioOpen(true)}
        activeSignId={activeSignId}
        onResetSign={handleResetSign}
      />

      {/* VIEW MODE 1: 3D CELESTIAL COSMOS (NIGHT) */}
      {viewMode === '3d' && (
        <div className="absolute inset-0 z-0">
          {/* 3D Three.js Canvas */}
          <Canvas
            camera={{ position: [0, 0, 0.01], fov: 70, near: 0.1, far: 200 }}
            gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          >
            <color attach="background" args={['#030307']} />
            <ambientLight intensity={1.2} />
            <pointLight position={[0, 0, 0]} intensity={1.5} distance={100} />

            {/* Background Starfield & Ecliptic Belt */}
            <CelestialSphere
              activeSignId={activeSignId}
              onSelectSign={handleSelectSign}
              sphereRadius={48}
              isLanding={isLandingTransition}
            />

            {/* Constellation Connecting Lines */}
            <ConstellationLines
              artworks={data.opere}
              positions={artworkPositions}
              activeSignId={activeSignId}
            />

            {/* Interactive 3D Artwork Nodes */}
            {(data.opere || []).map((artwork) => {
              const pos = artworkPositions[artwork.id] || [0, 0, 50];
              const isDimmed = activeSignId && (artwork.segno || '').toLowerCase() !== activeSignId.toLowerCase();
              const isSelected = selectedArtwork?.id === artwork.id;
              const isEditingSelected = isSpatialEditMode && selectedEditArtworkId === artwork.id;

              return (
                <ArtworkNode
                  key={artwork.id}
                  artwork={artwork}
                  targetPosition={pos}
                  isDimmed={isDimmed}
                  isSelected={isSelected}
                  isEditingSelected={isEditingSelected}
                  isSpatialEditMode={isSpatialEditMode}
                  magnitude={magnitude}
                  showImages={showImages}
                  onSelect={(art) => {
                    if (isSpatialEditMode) {
                      setSelectedEditArtworkId(art.id);
                    } else {
                      setSelectedArtwork(art);
                    }
                  }}
                />
              );
            })}

            {/* 3D Spatial Curatorial Transform Controls */}
            {isSpatialEditMode && selectedEditArtwork && (
              <CuratorSpatialEditor
                selectedArtwork={selectedEditArtwork}
                currentPosition={artworkPositions[selectedEditArtwork.id]}
                onUpdatePosition={handleUpdateArtworkPosition}
                onDraggingChange={setIsDragging3D}
              />
            )}

            {/* Camera Orbit, Fly-To & Sky-Landing Controller */}
            <CameraController
              targetSignId={targetFlightSign}
              initialMoonInfo={moonInfo}
              onTargetReached={() => setTargetFlightSign(null)}
              isDomeView={isDomeView}
              manualRotateVelocity={manualRotateVelocity}
              manualZoomVelocity={manualZoomVelocity}
              isLanding={isLandingTransition}
              onLandingComplete={() => setIsLandingTransition(false)}
              enabled={!isDragging3D}
            />
          </Canvas>

          {/* Left & Right Navigation Chevrons */}
          <NavigationArrows
            onRotateLeft={handleRotateLeft}
            onRotateRight={handleRotateRight}
            onStopRotate={handleStopRotate}
          />

          {/* Canonical Zoom In (+) / Zoom Out (-) Controls */}
          <ZoomControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onStopZoom={handleStopZoom}
          />

          {/* Spatial Layout Controls (Warburg / Chrono / Chromatic + Magnitude Slider + Mostra Opere Toggle) */}
          <LayoutControls
            currentMode={layoutMode}
            onSelectMode={(mode) => setLayoutMode(mode)}
            magnitude={magnitude}
            onMagnitudeChange={(mag) => setMagnitude(mag)}
            showImages={showImages}
            onToggleShowImages={() => setShowImages((prev) => !prev)}
          />

          {/* Bottom-Left Controls: Effetto Cupola */}
          <div className="fixed bottom-6 left-4 md:left-8 z-30 pointer-events-auto flex items-center gap-2.5">
            {/* Effetto Cupola Semicircle Button */}
            <button
              onClick={() => setIsDomeView(d => !d)}
              title={isDomeView ? 'Disattiva Effetto Cupola' : 'Attiva Effetto Cupola'}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all duration-300 shadow-2xl backdrop-blur-xl ${
                isDomeView
                  ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-amber-500/15 ring-1 ring-amber-400/40'
                  : 'bg-black/80 hover:bg-black/95 border-white/15 text-white/80 hover:text-white hover:border-white/40'
              }`}
            >
              {/* Semicircle / Dome Icon */}
              <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18 A 9 9 0 0 1 21 18 Z" />
              </svg>
              <span className="font-mono tracking-wider">Effetto Cupola</span>
            </button>
          </div>

          {/* Bottom Zodiac Navigation Ribbon */}
          <ZodiacNav
            activeSignId={activeSignId}
            onSelectSign={handleSelectSign}
            onResetSign={handleResetSign}
          />

          {/* Dome / Fisheye Simulation Overlay */}
          <DomeOverlay enabled={isDomeView} />

          {/* 3D Spatial Curatorial Studio HUD Overlay */}
          {isSpatialEditMode && (
            <SpatialCuratorHUD
              selectedArtwork={selectedEditArtwork}
              currentCoords={
                selectedEditArtwork
                  ? {
                      x: Math.round((artworkPositions[selectedEditArtwork.id]?.[0] || 0) * 100) / 100,
                      y: Math.round((artworkPositions[selectedEditArtwork.id]?.[1] || 0) * 100) / 100,
                      z: Math.round((artworkPositions[selectedEditArtwork.id]?.[2] || 0) * 100) / 100,
                    }
                  : null
              }
              onDeselect={() => setSelectedEditArtworkId(null)}
              onScaleChange={handleUpdateArtworkScale}
              onResetPosition={handleResetArtworkPosition}
              onExit={() => {
                setIsSpatialEditMode(false);
                setSelectedEditArtworkId(null);
              }}
              onCommitAndSync={() => handleSaveAndCommitAtlas()}
              isSyncing={isSyncing3D}
              modifiedCount={modifiedCount}
              syncStatus={syncStatus3D}
            />
          )}
        </div>
      )}

      {/* VIEW MODE 2: DAY WHITE ARCHIVE TAXONOMY (APOLLONIAN) */}
      {viewMode === 'archive' && (
        <div className="absolute inset-0 z-10 overflow-y-auto">
          <ArchiveView
            artworks={data.opere}
            onSelectArtwork={(art) => setSelectedArtwork(art)}
            onBackTo3D={() => setViewMode('3d')}
            initialSignId={activeSignId}
          />
        </div>
      )}

      {/* Artwork Detail Modal */}
      <ArtworkModal
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
        onSelectSign={(signId) => {
          setViewMode('3d');
          handleSelectSign(signId);
        }}
      />

      {/* Info & Statement Modal */}
      <InfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        infoData={data.progetto?.info}
      />

      {/* Curator Bio Modal (Giacomo Isidori) */}
      <BioModal
        isOpen={isBioOpen}
        onClose={() => setIsBioOpen(false)}
        bioData={data.progetto?.curatore}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Protected Admin / Curator Studio */}
      <AdminCuratorPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        artworks={data.opere}
        onUpdateArtworks={handleUpdateArtworks}
        bioData={data.progetto?.curatore}
        onUpdateBio={handleUpdateBio}
        infoData={data.progetto?.info}
        onUpdateInfo={handleUpdateInfo}
        onCommitAtlas={handleSaveAndCommitAtlas}
        onStartSpatialEdit={() => {
          setIsSpatialEditMode(true);
          setIsAdminOpen(false);
          setViewMode('3d');
        }}
        onFocusArtwork3D={(art) => {
          setSelectedArtwork(art);
          setIsAdminOpen(false);
          setViewMode('3d');
          const signInfo = ZODIAC_SIGNS.find(s => s.name.toLowerCase() === (art.segno || '').toLowerCase() || s.id === art.segno);
          if (signInfo) handleSelectSign(signInfo.id);
        }}
      />
      {/* Initial Landing Portal Screen */}
      {showLanding && (
        <LandingScreen onEnter={handleEnterFromLanding} />
      )}
    </main>
  );
}
