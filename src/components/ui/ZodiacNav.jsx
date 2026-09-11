import React from 'react';
import { ZODIAC_SIGNS } from '../../utils/astronomy';
import ZodiacGlyph from './ZodiacGlyph';

export default function ZodiacNav({ activeSignId, onSelectSign, onResetSign }) {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 max-w-[95vw] md:max-w-4xl pointer-events-auto">
      <div className="flex items-center gap-1 md:gap-1.5 p-1.5 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/15 shadow-2xl overflow-x-auto no-scrollbar">
        {/* Reset / All Signs Button */}
        <button
          onClick={onResetSign}
          title="Mostra intera volta celeste"
          className={`px-3 py-2 rounded-xl text-[11px] font-mono tracking-wider uppercase transition-all whitespace-nowrap ${
            !activeSignId
              ? 'bg-white text-black font-semibold shadow-md'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          Cielo Intero
        </button>

        <div className="w-[1px] h-5 bg-white/20 mx-1 flex-shrink-0" />

        {/* 12 Zodiac Glyphs */}
        {ZODIAC_SIGNS.map((sign) => {
          const isActive = activeSignId === sign.id;
          return (
            <button
              key={sign.id}
              onClick={() => onSelectSign(isActive ? null : sign.id)}
              title={`${sign.latin} (${sign.name}) — ${sign.element}`}
              className={`group relative flex items-center justify-center gap-1.5 px-2.5 py-1.5 md:px-3 md:py-2 rounded-xl text-xs transition-all flex-shrink-0 ${
                isActive
                  ? 'bg-white/25 text-white border border-white/40 shadow-inner'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <ZodiacGlyph
                sign={sign.id}
                className="w-4 h-4 transition-transform group-hover:scale-110"
                color={isActive ? '#ffffff' : '#e4e4e7'}
                strokeWidth={2.0}
              />
              <span className="hidden md:inline text-[11px] font-mono tracking-wider text-white/90">
                {sign.latin.slice(0, 3)}
              </span>

              {/* Element Pip indicator */}
              <span
                className="absolute bottom-1 w-1 h-1 rounded-full opacity-60 group-hover:opacity-100"
                style={{ backgroundColor: sign.color }}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
