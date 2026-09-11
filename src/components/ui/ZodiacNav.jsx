import React from 'react';
import { ZODIAC_SIGNS } from '../../utils/astronomy';
import ZodiacGlyph from './ZodiacGlyph';

export default function ZodiacNav({ activeSignId, onSelectSign, onResetSign }) {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 max-w-[98vw] xl:max-w-7xl pointer-events-auto">
      <div className="flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 p-1.5 sm:p-2 rounded-2xl bg-black/85 backdrop-blur-2xl border border-white/20 shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex-nowrap">
        {/* Reset / All Signs Button */}
        <button
          onClick={onResetSign}
          title="Mostra intera volta celeste"
          className={`px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-mono tracking-wider uppercase transition-all whitespace-nowrap flex-shrink-0 ${
            !activeSignId
              ? 'bg-white text-black font-bold shadow-lg scale-105'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          Cielo Intero
        </button>

        <div className="w-[1px] h-6 bg-white/20 mx-1 flex-shrink-0" />

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
                className={`absolute bottom-0.5 w-1.5 h-1.5 rounded-full transition-all ${
                  isActive ? 'opacity-100 scale-125' : 'opacity-40 group-hover:opacity-100'
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
