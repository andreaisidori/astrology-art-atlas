/**
 * Astronomical and Zodiac Utility Functions
 * Handles Ecliptic mapping, 3D spherical coordinates, and real-time Moon calculation.
 */

export const ZODIAC_SIGNS = [
  { id: 'ariete', name: 'Ariete', latin: 'Aries', symbol: '♈', element: 'Fuoco', angle: 0, color: '#E0362F', keywords: ['Impulso', 'Nascita', 'Origine', 'Combattività'] },
  { id: 'toro', name: 'Toro', latin: 'Taurus', symbol: '♉', element: 'Terra', angle: 30, color: '#469F5B', keywords: ['Materia', 'Corpo', 'Permanenza', 'Sensorialità'] },
  { id: 'gemelli', name: 'Gemelli', latin: 'Gemini', symbol: '♊', element: 'Aria', angle: 60, color: '#F17A38', keywords: ['Dualità', 'Linguaggio', 'Rete', 'Metamorfosi'] },
  { id: 'cancro', name: 'Cancro', latin: 'Cancer', symbol: '♋', element: 'Acqua', angle: 90, color: '#16329F', keywords: ['Memoria', 'Inconscio', 'Grembo', 'Origine'] },
  { id: 'leone', name: 'Leone', latin: 'Leo', symbol: '♌', element: 'Fuoco', angle: 120, color: '#E6B841', keywords: ['Centro', 'Splendore', 'Ego', 'Sovranità'] },
  { id: 'vergine', name: 'Vergine', latin: 'Virgo', symbol: '♍', element: 'Terra', angle: 150, color: '#FFFFFF', keywords: ['Tassonomia', 'Dettaglio', 'Misura', 'Archivio'] },
  { id: 'bilancia', name: 'Bilancia', latin: 'Libra', symbol: '♎', element: 'Aria', angle: 180, color: '#4DB6B1', keywords: ['Equilibrio', 'Forma', 'Relazione', 'Simmetria'] },
  { id: 'scorpione', name: 'Scorpione', latin: 'Scorpio', symbol: '♏', element: 'Acqua', angle: 210, color: '#31353D', keywords: ['Metamorfosi', 'Abisso', 'Dionisiaco', 'Eros'] },
  { id: 'sagittario', name: 'Sagittario', latin: 'Sagittarius', symbol: '♐', element: 'Fuoco', angle: 240, color: '#433ACB', keywords: ['Orizzonte', 'Visione', 'Traiettoria', 'Mito'] },
  { id: 'capricorno', name: 'Capricorno', latin: 'Capricornus', symbol: '♑', element: 'Terra', angle: 270, color: '#7C4B2A', keywords: ['Struttura', 'Tempo', 'Pietra', 'Limite'] },
  { id: 'acquario', name: 'Acquario', latin: 'Aquarius', symbol: '♒', element: 'Aria', angle: 300, color: '#A9AEB4', keywords: ['Utopia', 'Dispersione', 'Cosmo', 'Futuro'] },
  { id: 'pesci', name: 'Pesci', latin: 'Pisces', symbol: '♓', element: 'Acqua', angle: 330, color: '#9D45D9', keywords: ['Dissoluzione', 'Oceano', 'Sogno', 'Indistinto'] }
];

/**
 * Calculates the approximate real-time Moon position in the zodiac (tropical longitude 0-360°)
 */
export function getCurrentMoonPosition(date = new Date()) {
  // Epoch: J2000.0 (January 1, 2000, 12:00 UTC)
  const J2000 = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
  const daysSinceJ2000 = (date.getTime() - J2000.getTime()) / (1000 * 60 * 60 * 24);

  // Mean longitude of the Moon (in degrees)
  let L0 = 218.316 + 13.176396 * daysSinceJ2000;
  // Mean anomaly of the Moon
  let M = 134.963 + 13.064993 * daysSinceJ2000;
  // Mean anomaly of the Sun
  let Ms = 357.529 + 0.985600 * daysSinceJ2000;

  // Convert to radians for trig functions
  const deg2rad = Math.PI / 180;
  const rad2deg = 180 / Math.PI;

  // Perturbations
  const lambda = L0 + 6.289 * Math.sin(M * deg2rad) 
                    - 1.274 * Math.sin((M - 2 * (L0 - Ms)) * deg2rad)
                    + 0.658 * Math.sin(2 * (L0 - Ms) * deg2rad);

  // Normalize between 0 and 360
  let normLambda = ((lambda % 360) + 360) % 360;

  // Determine Zodiac Sign (each sign covers 30 degrees)
  const signIndex = Math.floor(normLambda / 30);
  const degreeInSign = normLambda % 30;
  const currentSign = ZODIAC_SIGNS[signIndex] || ZODIAC_SIGNS[0];

  return {
    longitude: normLambda,
    signIndex,
    sign: currentSign,
    degreeInSign: parseFloat(degreeInSign.toFixed(1)),
    formatted: `${currentSign.name} (${currentSign.symbol}) a ${degreeInSign.toFixed(1)}°`
  };
}

/**
 * Convert spherical coordinates to 3D Cartesian coordinates on celestial sphere of radius R
 * @param {number} radius - Sphere radius (e.g. 50)
 * @param {number} eclipticLongitudeDeg - Angle along the ecliptic (0-360)
 * @param {number} eclipticLatitudeDeg - Latitude above/below ecliptic plane (-90 to +90)
 * @param {number} eclipticTiltDeg - Axial tilt of the ecliptic (approx 23.44°)
 */
export function sphericalToCartesian(radius, eclipticLongitudeDeg, eclipticLatitudeDeg = 0, eclipticTiltDeg = 23.44) {
  const lambda = (eclipticLongitudeDeg * Math.PI) / 180;
  const beta = (eclipticLatitudeDeg * Math.PI) / 180;
  const epsilon = (eclipticTiltDeg * Math.PI) / 180;

  // Position on un-tilted ecliptic
  const x0 = radius * Math.cos(beta) * Math.cos(lambda);
  const y0 = radius * Math.sin(beta);
  const z0 = radius * Math.cos(beta) * Math.sin(lambda);

  // Rotate around X-axis by ecliptic inclination epsilon
  const x = x0;
  const y = y0 * Math.cos(epsilon) - z0 * Math.sin(epsilon);
  const z = y0 * Math.sin(epsilon) + z0 * Math.cos(epsilon);

  return [x, y, z];
}

/**
 * Parses a biographical string into separate birth and death parts
 */
export function parseBiographicalDates(dateStr, existingBirth, existingDeath) {
  if (existingBirth !== undefined && existingBirth !== null && existingBirth !== '') {
    return {
      data_nascita: existingBirth || '',
      anno_morte: existingDeath || '',
    };
  }
  if (!dateStr || typeof dateStr !== 'string') {
    return { data_nascita: '', anno_morte: existingDeath || '' };
  }
  const clean = dateStr.trim();
  const parts = clean.split(/[–—\-]/);
  if (parts.length >= 2) {
    return {
      data_nascita: parts[0].trim(),
      anno_morte: existingDeath || parts.slice(1).join('–').trim(),
    };
  }
  return {
    data_nascita: clean,
    anno_morte: existingDeath || '',
  };
}

/**
 * Formats separate birth and death date fields into standard biographical string
 */
export function formatBiographicalDates(art) {
  if (!art) return '';
  const birth = (art.data_nascita || '').trim();
  const death = (art.anno_morte || '').trim();
  if (birth && death) return `${birth}–${death}`;
  if (birth) return birth;
  if (death) return `†${death}`;
  return art.date_biografiche || '';
}

