import React from 'react';
import { ZODIAC_SIGNS } from '../../utils/astronomy';
import ZodiacGlyph from './ZodiacGlyph';

export default function ZodiacNav({ activeSignId, onSelectSign, onResetSign }) {
  return (
    <nav className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 max-w-[calc(100vw-1.25rem)] xl:max-w-7xl pointer-events-auto">
      <div className="flex items-center justify-start sm:justify-center gap-1 sm:gap-1.5 md:gap-2 p-1.5 sm:p-2 rounded-2xl bg-black/85 backdrop-blur-2xl border border-white/20 shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex-nowrap overflow-x-auto max-w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden overscroll-x-contain touch-pan-x">
        {/* 12 Zodiac Glyphs */}
        {ZODIAC_SIGNS.map((sign) => {
          const isActive = activeSignId === sign.id;
          return (
            <button
              key={sign.id}
              onClick={() => onSelectSign(isActive ? null : sign.id)}
              title={`${sign.latin} — Costellazione`}
              className={`group relative flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 md:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs transition-all duration-200 flex-shrink-0 ${
                isActive
                  ? 'bg-white/30 text-white border border-white/50 shadow-inner scale-110'
                  : 'text-white/70 hover:text-white hover:bg-white/15 hover:scale-105'
              }`}
              style={{ borderColor: isActive ? sign.color : undefined }}
            >
              <ZodiacGlyph
                sign={sign.id}
                className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform group-hover:scale-110"
                color={isActive ? '#ffffff' : '#f4f4f5'}
                strokeWidth={2.0}
              />
              <span className="hidden sm:inline text-[10px] md:text-[11px] font-mono font-medium tracking-wider text-white">
                {sign.latin.slice(0, 3).toUpperCase()}
              </span>

              {/* Active / Element bottom glow indicator */}
              <span
                className={`absolute bottom-0.5 w-1.5 h-1.5 rounded-full transition-all border border-white/30 ${
                  isActive ? 'opacity-100 scale-125' : 'opacity-60 group-hover:opacity-100'
                }`}
                style={{ backgroundColor: sign.color }}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
