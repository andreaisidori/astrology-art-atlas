import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const YOUTUBE_VIDEO_ID = 'm86mBRKZHY0';

export default function BackgroundMusic({ isHome = true }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    // 1. Load YouTube IFrame API if not already present
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // 2. Initialize player when YT API is ready
    const initPlayer = () => {
      if (window.YT && window.YT.Player && !playerRef.current) {
        playerRef.current = new window.YT.Player('youtube-audio-player', {
          height: '1',
          width: '1',
          videoId: YOUTUBE_VIDEO_ID,
          playerVars: {
            autoplay: 1,
            loop: 1,
            playlist: YOUTUBE_VIDEO_ID,
            controls: 0,
            disablekb: 1,
            fs: 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            enablejsapi: 1,
            origin: typeof window !== 'undefined' ? window.location.origin : '',
          },
          events: {
            onReady: (event) => {
              setIsReady(true);
              try {
                event.target.playVideo();
                event.target.setVolume(70);
                // Try unmuting immediately
                event.target.unMute();
              } catch (e) {
                console.warn('Autoplay waiting for user gesture:', e);
              }
            },
            onStateChange: (event) => {
              // Ensure continuous loop
              if (window.YT && event.data === window.YT.PlayerState.ENDED) {
                event.target.playVideo();
              }
            },
          },
        });
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    // 3. User interaction listener to satisfy browser autoplay policy on first click/touch
    const unlockAudio = () => {
      if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
        try {
          playerRef.current.playVideo();
          if (!isMuted) {
            playerRef.current.unMute();
            playerRef.current.setVolume(70);
          }
        } catch (e) {
          // ignore
        }
      }
    };

    window.addEventListener('click', unlockAudio, { passive: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true });
    window.addEventListener('pointerdown', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });

    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, [isMuted]);

  const toggleMute = () => {
    if (playerRef.current && typeof playerRef.current.mute === 'function') {
      if (isMuted) {
        playerRef.current.unMute();
        playerRef.current.playVideo();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    } else {
      setIsMuted(!isMuted);
    }
  };

  return (
    <>
      {/* Hidden YouTube IFrame Container */}
      <div
        className="fixed -top-96 -left-96 opacity-0 pointer-events-none w-1 h-1 overflow-hidden"
        aria-hidden="true"
      >
        <div id="youtube-audio-player" />
      </div>

      {/* Floating Bottom-Left Audio Control Button */}
      {isHome && (
        <button
          type="button"
          onClick={toggleMute}
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
