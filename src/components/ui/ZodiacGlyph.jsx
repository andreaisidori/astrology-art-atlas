import React from 'react';

/**
 * Authentic, ultra-crisp glyphs extracted directly from curator assets for all 12 Zodiac signs.
 */
export default function ZodiacGlyph({ sign, className = 'w-5 h-5', color, variant = 'gold' }) {
  const normalized = (sign || '').toLowerCase().trim();

  let signId = 'ariete';
  if (normalized.includes('ari')) signId = 'ariete';
  else if (normalized.includes('tor') || normalized.includes('tau')) signId = 'toro';
  else if (normalized.includes('gem')) signId = 'gemelli';
  else if (normalized.includes('can')) signId = 'cancro';
  else if (normalized.includes('leo') || normalized.includes('leon')) signId = 'leone';
  else if (normalized.includes('ver') || normalized.includes('vir')) signId = 'vergine';
  else if (normalized.includes('bil') || normalized.includes('lib')) signId = 'bilancia';
  else if (normalized.includes('sco')) signId = 'scorpione';
  else if (normalized.includes('sag')) signId = 'sagittario';
  else if (normalized.includes('cap')) signId = 'capricorno';
  else if (normalized.includes('acq') || normalized.includes('aqu')) signId = 'acquario';
  else if (normalized.includes('pes') || normalized.includes('pis')) signId = 'pesci';

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
