import React from 'react';

/**
 * Minimalist, ultra-crisp white vector glyphs for the 12 Zodiac signs.
 * Replaces platform-dependent standard emojis with elegant astrological line vectors.
 */
export default function ZodiacGlyph({ sign, className = 'w-5 h-5', color = 'currentColor', strokeWidth = 1.8 }) {
  const normalized = (sign || '').toLowerCase().trim();

  // Normalize sign name / latin / id
  let signId = normalized;
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

  const props = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className: `inline-block flex-shrink-0 ${className}`,
  };

  switch (signId) {
    case 'ariete': // Aries
      return (
        <svg {...props}>
          <path d="M12 21V8" />
          <path d="M12 8C10 3 3 4 3 9c0 4 4.5 4 4.5 1" />
          <path d="M12 8C14 3 21 4 21 9c0 4-4.5 4-4.5 1" />
        </svg>
      );

    case 'toro': // Taurus
      return (
        <svg {...props}>
          <circle cx="12" cy="14" r="5.5" />
          <path d="M5 5.5C7 9.5 17 9.5 19 5.5" />
        </svg>
      );

    case 'gemelli': // Gemini
      return (
        <svg {...props}>
          <path d="M4 4.5C9 6.5 15 6.5 20 4.5" />
          <path d="M4 19.5C9 17.5 15 17.5 20 19.5" />
          <path d="M8.5 5.5V18.5" />
          <path d="M15.5 5.5V18.5" />
        </svg>
      );

    case 'cancro': // Cancer
      return (
        <svg {...props}>
          <circle cx="7" cy="9" r="2.8" />
          <path d="M7 6.2C13 6.2 18 10 18 10" />
          <circle cx="17" cy="15" r="2.8" />
          <path d="M17 17.8C11 17.8 6 14 6 14" />
        </svg>
      );

    case 'leone': // Leo
      return (
        <svg {...props}>
          <circle cx="6" cy="15.5" r="2.5" />
          <path d="M7.5 13.5C9 9 12 4.5 16 5c3.5 .5 4 4 2.5 7.5C17 16 14 20 18 20" />
        </svg>
      );

    case 'vergine': // Virgo
      return (
        <svg {...props}>
          <path d="M4 5v12" />
          <path d="M4 7.5C6 4.5 9 4.5 10 7.5v9.5" />
          <path d="M10 7.5C12 4.5 15 4.5 16 7.5v9.5c0 2.5 3 2.5 4 0v-4" />
          <path d="M17 14c2.5 0 4 4.5 1.5 6.5s-4.5 -1 -3.5 -3.5" />
        </svg>
      );

    case 'bilancia': // Libra
      return (
        <svg {...props}>
          <path d="M4 19.5h16" />
          <path d="M4 15h4.5a3.5 3.5 0 1 1 7 0H20" />
        </svg>
      );

    case 'scorpione': // Scorpio
      return (
        <svg {...props}>
          <path d="M3.5 5.5v11" />
          <path d="M3.5 8C5.5 5 8.5 5 9.5 8v8.5" />
          <path d="M9.5 8C11.5 5 14.5 5 15.5 8v8.5c0 2 1.5 3 3.5 3h2" />
          <path d="M18.5 17l3 2.5-3 2.5" />
        </svg>
      );

    case 'sagittario': // Sagittarius
      return (
        <svg {...props}>
          <path d="M5 19L19 5" />
          <path d="M11 5h8v8" />
          <path d="M8.5 12.5l3 3" />
        </svg>
      );

    case 'capricorno': // Capricornus
      return (
        <svg {...props}>
          <path d="M4 6.5l4 11.5l4 -9c1 -2 3.5 -2 4.5 0v7c0 3 3 5 4.5 2s0.5 -5.5 -3.5 -4.5" />
        </svg>
      );

    case 'acquario': // Aquarius
      return (
        <svg {...props}>
          <path d="M3.5 8.5l3.5-3 4 4 4-4 4 4 2.5-2" />
          <path d="M3.5 15.5l3.5-3 4 4 4-4 4 4 2.5-2" />
        </svg>
      );

    case 'pesci': // Pisces
      return (
        <svg {...props}>
          <path d="M6 4.5C9.5 9 9.5 15 6 19.5" />
          <path d="M18 4.5C14.5 9 14.5 15 18 19.5" />
          <path d="M4.5 12h15" />
        </svg>
      );

    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}
