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
import AdminCuratorPanel from './components/admin/AdminCuratorPanel';
import CelestialSphere from './components/3d/CelestialSphere';
import ArtworkNode from './components/3d/ArtworkNode';
import ConstellationLines from './components/3d/ConstellationLines';
import NavigationArrows from './components/ui/NavigationArrows';
import CameraController from './components/3d/CameraController';
import { getCurrentMoonPosition } from './utils/astronomy';
import { computeArtworkPositions } from './utils/layouts';

export default function App() {
  const [data, setData] = useState({ progetto: {}, opere: [] });
  const [loading, setLoading] = useState(true);
  const [showLanding, setShowLanding] = useState(true); // Landing screen active on load
  const [isLandingTransition, setIsLandingTransition] = useState(false);
  const [viewMode, setViewMode] = useState('3d'); // '3d' | 'archive'
  const [layoutMode, setLayoutMode] = useState('manual'); // 'manual' | 'chronological' | 'chromatic'
  const [activeSignId, setActiveSignId] = useState(null);
  const [targetFlightSign, setTargetFlightSign] = useState(null);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [isDomeView, setIsDomeView] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [moonInfo, setMoonInfo] = useState(null);
  const [magnitude, setMagnitude] = useState(1.0); // Star and artwork scale
  const [showImages, setShowImages] = useState(false); // Default to fast lightweight square frames
  const [manualRotateVelocity, setManualRotateVelocity] = useState(0);

  // Trigger Sky-Door landing dive when entering from landing screen
  const handleEnterFromLanding = () => {
    setShowLanding(false);
    setIsLandingTransition(true);
  };

  // Load Atlas JSON and calculate Moon Position on Mount
  useEffect(() => {
    // 1. Calculate real-time moon position
    const moon = getCurrentMoonPosition();
    setMoonInfo(moon);

    // 2. Load dataset
    fetch('/data/atlas.json')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Errore nel caricamento del database:', err);
        setLoading(false);
      });
  }, []);

  // Compute 3D positions for all artworks with balanced airy spacing (radius 48)
  const artworkPositions = useMemo(() => {
    return computeArtworkPositions(data.opere, layoutMode, activeSignId, 48);
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

  // Handle Left / Right Arrow Rotation
  const handleRotateLeft = (speed = 0.25) => {
    setManualRotateVelocity(-speed);
    setTimeout(() => setManualRotateVelocity(0), 100);
  };

  const handleRotateRight = (speed = 0.25) => {
    setManualRotateVelocity(speed);
    setTimeout(() => setManualRotateVelocity(0), 100);
  };

  if (loading) {
    return (
      <div className="w-screen h-screen bg-space-950 flex flex-col items-center justify-center text-white gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
        <p className="font-mono text-xs tracking-widest uppercase text-white/70">
          Caricamento Atlante Mnemosyne...
        </p>
      </div>
    );
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-space-950 select-none">
      {/* Top Header Bar */}
      <Header
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode(v => (v === '3d' ? 'archive' : '3d'))}
        moonInfo={moonInfo}
        isDomeView={isDomeView}
        onToggleDomeView={() => setIsDomeView(d => !d)}
        onOpenInfo={() => setIsInfoOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenLanding={() => setShowLanding(true)}
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
            />

            {/* Constellation Connecting Lines */}
            <ConstellationLines
              artworks={data.opere}
              positions={artworkPositions}
              activeSignId={activeSignId}
            />

            {/* Interactive 3D Artwork Nodes */}
            {data.opere.map((artwork) => {
              const pos = artworkPositions[artwork.id] || [0, 0, 50];
              const isDimmed = activeSignId && (artwork.segno || '').toLowerCase() !== activeSignId.toLowerCase();
              const isSelected = selectedArtwork?.id === artwork.id;

              return (
                <ArtworkNode
                  key={artwork.id}
                  artwork={artwork}
                  targetPosition={pos}
                  isDimmed={isDimmed}
                  isSelected={isSelected}
                  magnitude={magnitude}
                  showImages={showImages}
                  onSelect={(art) => setSelectedArtwork(art)}
                />
              );
            })}

            {/* Camera Orbit, Fly-To & Sky-Landing Controller */}
            <CameraController
              targetSignId={targetFlightSign}
              initialMoonInfo={moonInfo}
              onTargetReached={() => setTargetFlightSign(null)}
              isDomeView={isDomeView}
              manualRotateVelocity={manualRotateVelocity}
              isLanding={isLandingTransition}
              onLandingComplete={() => setIsLandingTransition(false)}
            />
          </Canvas>

          {/* Left & Right Navigation Chevrons */}
          <NavigationArrows
            onRotateLeft={handleRotateLeft}
            onRotateRight={handleRotateRight}
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

          {/* Bottom Zodiac Navigation Ribbon */}
          <ZodiacNav
            activeSignId={activeSignId}
            onSelectSign={handleSelectSign}
            onResetSign={handleResetSign}
          />

          {/* Dome / Fisheye Simulation Overlay */}
          <DomeOverlay enabled={isDomeView} />
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

      {/* Bottom-Right Credits & Instagram Contact */}
      <aside className="fixed bottom-6 right-4 md:right-8 z-30 pointer-events-auto">
        <a
          href="https://instagram.com/astro.expression"
          target="_blank"
          rel="noopener noreferrer"
          title="Curatela: Giacomo Isidori • @astro.expression"
          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border backdrop-blur-xl shadow-2xl transition-all duration-300 group ${
            viewMode === '3d'
              ? 'bg-black/80 hover:bg-black/95 border-white/15 hover:border-white/40 text-white'
              : 'bg-white/90 hover:bg-white border-zinc-300 hover:border-zinc-500 text-zinc-900 shadow-md'
          }`}
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
            <Instagram className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[10px] font-semibold tracking-wide">Giacomo Isidori</span>
            <span className={`text-[9px] font-mono transition-colors ${
              viewMode === '3d' ? 'text-zinc-400 group-hover:text-pink-300' : 'text-zinc-500 group-hover:text-pink-600'
            }`}>
              @astro.expression
            </span>
          </div>
        </a>
      </aside>

      {/* Info & Statement Modal */}
      <InfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />

      {/* Protected Admin / Curator Studio */}
      <AdminCuratorPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        artworks={data.opere}
        onUpdateArtworks={(newArtworks) => setData(d => ({ ...d, opere: newArtworks }))}
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
