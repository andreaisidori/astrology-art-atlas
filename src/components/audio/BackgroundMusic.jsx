import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const YOUTUBE_VIDEO_ID = 'm86mBRKZHY0';

export default function BackgroundMusic({ isHome = true }) {
  const [isMuted, setIsMuted] = useState(false);
  const playerRef = useRef(null);
  const isMutedRef = useRef(false);

  // Synchronize ref with state
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    let isCancelled = false;

    // Initialize YouTube Player once API is ready
    const initPlayer = () => {
      if (isCancelled || !window.YT || !window.YT.Player) return;

      try {
        if (playerRef.current) return;

        playerRef.current = new window.YT.Player('aaa-youtube-bg-player', {
          height: '100',
          width: '100',
          videoId: YOUTUBE_VIDEO_ID,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            loop: 1,
            playlist: YOUTUBE_VIDEO_ID,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            origin: typeof window !== 'undefined' ? window.location.origin : '',
          },
          events: {
            onReady: (event) => {
              if (isCancelled) return;
              try {
                event.target.setVolume(75);
                if (!isMutedRef.current) {
                  event.target.unMute();
                  event.target.playVideo();
                }
              } catch (e) {
                console.warn('YouTube onReady playback error:', e);
              }
            },
            onError: (e) => {
              console.warn('YouTube Player error code:', e.data);
            },
          },
        });
      } catch (err) {
        console.warn('YouTube Player setup exception:', err);
      }
    };

    // Load official YouTube Iframe API script if not already present
    if (!window.YT) {
      const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        if (firstScriptTag && firstScriptTag.parentNode) {
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
          document.head.appendChild(tag);
        }
      }

      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevCallback === 'function') prevCallback();
        initPlayer();
      };
    } else if (window.YT && window.YT.Player) {
      initPlayer();
    }

    // Modern browser autoplay policy: unlock audio on first user gesture anywhere
    const unlockOnUserGesture = () => {
      window.removeEventListener('click', unlockOnUserGesture);
      window.removeEventListener('touchstart', unlockOnUserGesture);
      window.removeEventListener('pointerdown', unlockOnUserGesture);
      window.removeEventListener('keydown', unlockOnUserGesture);

      if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
        if (!isMutedRef.current) {
          try {
            playerRef.current.unMute();
            playerRef.current.setVolume(75);
            playerRef.current.playVideo();
          } catch (e) {
            // ignore
          }
        }
      }
    };

    window.addEventListener('click', unlockOnUserGesture, { once: true, passive: true });
    window.addEventListener('touchstart', unlockOnUserGesture, { once: true, passive: true });
    window.addEventListener('pointerdown', unlockOnUserGesture, { once: true, passive: true });
    window.addEventListener('keydown', unlockOnUserGesture, { once: true, passive: true });

    return () => {
      isCancelled = true;
      window.removeEventListener('click', unlockOnUserGesture);
      window.removeEventListener('touchstart', unlockOnUserGesture);
      window.removeEventListener('pointerdown', unlockOnUserGesture);
      window.removeEventListener('keydown', unlockOnUserGesture);

      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
          playerRef.current = null;
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  const toggleMute = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const player = playerRef.current;

    if (isMuted) {
      // --- UNMUTE ---
      setIsMuted(false);
      isMutedRef.current = false;
      if (player) {
        try {
          if (typeof player.unMute === 'function') player.unMute();
          if (typeof player.setVolume === 'function') player.setVolume(75);
          if (typeof player.playVideo === 'function') player.playVideo();
        } catch (err) {
          console.warn('Error unmuting YouTube:', err);
        }
      }
    } else {
      // --- MUTE ---
      setIsMuted(true);
      isMutedRef.current = true;
      if (player) {
        try {
          if (typeof player.mute === 'function') player.mute();
          if (typeof player.pauseVideo === 'function') player.pauseVideo();
        } catch (err) {
          console.warn('Error muting YouTube:', err);
        }
      }
    }
  };

  return (
    <>
      {/* Hidden YouTube Iframe Player element */}
      <div
        style={{
          position: 'fixed',
          top: -9999,
          left: -9999,
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: -1,
        }}
        aria-hidden="true"
      >
        <div id="aaa-youtube-bg-player" />
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
