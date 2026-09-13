import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const YOUTUBE_VIDEO_ID = 'm86mBRKZHY0';

export default function BackgroundMusic({ isHome = true }) {
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(false);
  const iframeRef = useRef(null);
  const audioCtxRef = useRef(null);
  const synthNodesRef = useRef(null);
  const synthGainRef = useRef(null);

  // Keep isMutedRef in sync
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Send command to YouTube Iframe via postMessage
  const sendIframeCommand = (func, args = '') => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func, args }),
        '*'
      );
    }
  };

  // Ethereal Celestial Web Audio Synthesizer (Harmonic 432Hz ambient drone) as backup
  const initCelestialSynth = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      if (synthNodesRef.current) return;

      const ctx = audioCtxRef.current;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.20, ctx.currentTime + 2);
      masterGain.connect(ctx.destination);
      synthGainRef.current = masterGain;

      // Celestial Frequencies (Cosmic F# Major / 432Hz harmonic constellation chord)
      const freqs = [108, 144, 216, 288, 432, 648];
      const oscillators = freqs.map((freq, i) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Subtle slow frequency shimmer
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.08 + i * 0.02;
        lfoGain.gain.value = 0.8;
        lfo.connect(osc.frequency);
        lfo.start();

        const vol = (0.16 / freqs.length) * (1 - i * 0.1);
        oscGain.gain.setValueAtTime(vol, ctx.currentTime);

        if (panner) {
          panner.pan.value = (i / (freqs.length - 1)) * 1.6 - 0.8;
          osc.connect(panner);
          panner.connect(oscGain);
        } else {
          osc.connect(oscGain);
        }

        oscGain.connect(masterGain);
        osc.start();
        return osc;
      });

      synthNodesRef.current = oscillators;
    } catch (e) {
      console.warn('Web Audio synth unavailable:', e);
    }
  };

  const startAudio = () => {
    if (isMutedRef.current) return;

    // 1. Unmute and play YouTube
    sendIframeCommand('unMute');
    sendIframeCommand('setVolume', [80]);
    sendIframeCommand('playVideo');

    // 2. Initialize Web Audio harmonic synth
    initCelestialSynth();
  };

  useEffect(() => {
    let hasUnlocked = false;

    // One-time unlock listener to satisfy browser autoplay policy on initial entry
    const unlockOnce = () => {
      if (hasUnlocked) return;
      hasUnlocked = true;

      // Immediately remove all unlock listeners so they NEVER trigger again on subsequent clicks!
      window.removeEventListener('click', unlockOnce);
      window.removeEventListener('touchstart', unlockOnce);
      window.removeEventListener('pointerdown', unlockOnce);
      window.removeEventListener('keydown', unlockOnce);

      if (!isMutedRef.current) {
        startAudio();
      }
    };

    window.addEventListener('click', unlockOnce, { once: true, passive: true });
    window.addEventListener('touchstart', unlockOnce, { once: true, passive: true });
    window.addEventListener('pointerdown', unlockOnce, { once: true, passive: true });
    window.addEventListener('keydown', unlockOnce, { once: true, passive: true });

    // Initial silent kick
    const timer = setTimeout(() => {
      if (!isMutedRef.current) {
        sendIframeCommand('playVideo');
      }
    }, 600);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', unlockOnce);
      window.removeEventListener('touchstart', unlockOnce);
      window.removeEventListener('pointerdown', unlockOnce);
      window.removeEventListener('keydown', unlockOnce);
    };
  }, []);

  const toggleMute = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (isMuted) {
      // --- UNMUTE ---
      setIsMuted(false);
      isMutedRef.current = false;

      // 1. Resume YouTube
      sendIframeCommand('unMute');
      sendIframeCommand('setVolume', [80]);
      sendIframeCommand('playVideo');

      // 2. Resume Web Audio
      if (audioCtxRef.current) {
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
        if (synthGainRef.current) {
          synthGainRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime);
          synthGainRef.current.gain.setValueAtTime(0.20, audioCtxRef.current.currentTime);
        }
      } else {
        initCelestialSynth();
      }
    } else {
      // --- MUTE ---
      setIsMuted(true);
      isMutedRef.current = true;

      // 1. Mute & Pause YouTube
      sendIframeCommand('mute');
      sendIframeCommand('pauseVideo');

      // 2. Mute & Suspend Web Audio
      if (audioCtxRef.current && synthGainRef.current) {
        synthGainRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime);
        synthGainRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
        audioCtxRef.current.suspend();
      }
    }
  };

  return (
    <>
      {/* 
        YouTube IFrame Player (rendered on-screen with near-zero opacity so YouTube API doesn't suspend it)
      */}
      <div
        className="fixed bottom-0 left-0 w-8 h-8 opacity-[0.01] pointer-events-none z-[-1] overflow-hidden"
        aria-hidden="true"
      >
        <iframe
          ref={iframeRef}
          title="AAA Background Audio"
          src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?enablejsapi=1&autoplay=1&mute=0&loop=1&playlist=${YOUTUBE_VIDEO_ID}&playsinline=1&controls=0&disablekb=1&fs=0&rel=0&origin=${typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : ''}`}
          allow="autoplay; encrypted-media"
          className="w-full h-full"
        />
      </div>

      {/* Floating Bottom-Left Audio Control Button */}
      {isHome && (
        <button
          type="button"
          onClick={toggleMute}
          onPointerDown={(e) => e.stopPropagation()}
          title={isMuted ? 'Attiva Musica (Unmute)' : 'Silenziatore Audio (Mute)'}
          aria-label={isMuted ? 'Attiva audio' : 'Silenzia audio'}
          style={{ touchAction: 'manipulation' }}
          className={`p-2.5 rounded-xl border backdrop-blur-xl transition-all duration-300 shadow-2xl flex items-center justify-center cursor-pointer pointer-events-auto select-none ${
            !isMuted
              ? 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-400/40 text-amber-300 shadow-amber-500/15 ring-1 ring-amber-400/30'
              : 'bg-black/80 hover:bg-black/95 border-white/15 text-white/50 hover:text-white hover:border-white/40'
          }`}
        >
          {!isMuted ? (
            <Volume2 className="w-4 h-4 animate-pulse" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>
      )}
    </>
  );
}
