import React from 'react';

const SIGN_MAP = {
  ariete: 'ariete',
  aries: 'ariete',
  toro: 'toro',
  taurus: 'toro',
  gemelli: 'gemelli',
  gemini: 'gemelli',
  cancro: 'cancro',
  cancer: 'cancro',
  leone: 'leone',
  leo: 'leone',
  vergine: 'vergine',
  virgo: 'vergine',
  bilancia: 'bilancia',
  libra: 'bilancia',
  scorpione: 'scorpione',
  scorpio: 'scorpione',
  sagittario: 'sagittario',
  sagittarius: 'sagittario',
  capricorno: 'capricorno',
  capricornus: 'capricorno',
  capricorn: 'capricorno',
  acquario: 'acquario',
  aquarius: 'acquario',
  pesci: 'pesci',
  pisces: 'pesci',
};

/**
 * Authentic, ultra-crisp glyphs extracted directly from curator assets for all 12 Zodiac signs.
 */
export default function ZodiacGlyph({ sign, className = 'w-5 h-5', color, variant = 'gold' }) {
  const raw = (sign || '').toLowerCase().trim();

  let signId = SIGN_MAP[raw];
  if (!signId) {
    if (raw.startsWith('sag')) signId = 'sagittario';
    else if (raw.startsWith('acq') || raw.startsWith('aqu')) signId = 'acquario';
    else if (raw.startsWith('ari')) signId = 'ariete';
    else if (raw.startsWith('tor') || raw.startsWith('tau')) signId = 'toro';
    else if (raw.startsWith('gem')) signId = 'gemelli';
    else if (raw.startsWith('can')) signId = 'cancro';
    else if (raw.startsWith('leo')) signId = 'leone';
    else if (raw.startsWith('ver') || raw.startsWith('vir')) signId = 'vergine';
    else if (raw.startsWith('bil') || raw.startsWith('lib')) signId = 'bilancia';
    else if (raw.startsWith('sco')) signId = 'scorpione';
    else if (raw.startsWith('cap')) signId = 'capricorno';
    else if (raw.startsWith('pes') || raw.startsWith('pis')) signId = 'pesci';
    else signId = 'ariete';
  }

  const isWhite = color === '#ffffff' || color === 'white' || variant === 'white';
  const glyphSrc = isWhite ? `/images/glyphs/white/${signId}.png` : `/images/glyphs/gold/${signId}.png`;

  return (
    <img
      src={glyphSrc}
      alt={signId}
      className={`inline-block flex-shrink-0 object-contain select-none pointer-events-none drop-shadow-sm ${className}`}
      draggable={false}
    />
  );
}
