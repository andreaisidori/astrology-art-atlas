import { sphericalToCartesian, ZODIAC_SIGNS } from './astronomy';

/**
 * Calculates 3D positions for an array of artworks based on the selected layout mode.
 * @param {Array} artworks - Array of artwork objects
 * @param {string} mode - 'manual' | 'chronological' | 'chromatic'
 * @param {string|null} activeSignId - If isolating a sign (e.g. 'ariete') or null for all
 * @param {number} sphereRadius - Base radius of celestial sphere
 */
export function computeArtworkPositions(artworks, mode = 'manual', activeSignId = null, sphereRadius = 48) {
  const result = {};

  if (!artworks || artworks.length === 0) return result;

  // 1. CHRONOLOGICAL MODE: Ascending ribbon by Year
  if (mode === 'chronological') {
    const sorted = [...artworks].sort((a, b) => (a.anno || 2000) - (b.anno || 2000));
    const total = sorted.length;
    
    sorted.forEach((art, index) => {
      const progress = index / Math.max(total - 1, 1);
      const angle = progress * Math.PI * 2; // Single continuous ring
      const height = (progress - 0.5) * 18; // Balanced vertical span
      const r = sphereRadius * 0.95;
      
      const x = r * Math.cos(angle);
      const y = height;
      const z = r * Math.sin(angle);
      
      result[art.id] = [x, y, z];
    });
    return result;
  }

  // 2. ARTIST MODE: Alphabetical order by Artist Name along celestial ring
  if (mode === 'artist') {
    const sorted = [...artworks].sort((a, b) => (a.artista || '').localeCompare(b.artista || ''));
    const total = sorted.length;

    sorted.forEach((art, index) => {
      const progress = index / Math.max(total, 1);
      const angle = progress * Math.PI * 2;
      const height = Math.sin(angle * 3) * 6; // Gentle wave along the ring
      const r = sphereRadius * 0.95;

      const x = r * Math.cos(angle);
      const y = height;
      const z = r * Math.sin(angle);

      result[art.id] = [x, y, z];
    });
    return result;
  }

  // 3. CHROMATIC MODE: Arranged in a horizontal color spectrum ring
  if (mode === 'chromatic') {
    const getHue = (hex) => {
      if (!hex) return 0;
      let c = hex.replace('#', '');
      if (c.length === 3) c = c.split('').map(x => x + x).join('');
      const r = parseInt(c.substring(0, 2), 16) / 255;
      const g = parseInt(c.substring(2, 4), 16) / 255;
      const b = parseInt(c.substring(4, 6), 16) / 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h = 0;
      if (max !== min) {
        const d = max - min;
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      return h * 360;
    };

    const sortedByColor = [...artworks].sort((a, b) => getHue(a.colore_dominante) - getHue(b.colore_dominante));
    const total = sortedByColor.length;

    sortedByColor.forEach((art, index) => {
      const hue = getHue(art.colore_dominante);
      const angleRad = (hue * Math.PI) / 180;
      const latOffset = Math.sin(angleRad * 3) * 10;
      const pos = sphericalToCartesian(sphereRadius * 0.95, hue, latOffset, 0);
      result[art.id] = pos;
    });
    return result;
  }

  // 3. MANUAL / DEFAULT CURATORIAL MODE (Balanced airy spacing)
  artworks.forEach((art) => {
    const signInfo = ZODIAC_SIGNS.find(s => s.name.toLowerCase() === (art.segno || '').toLowerCase() || s.id === art.segno);
    const baseAngle = signInfo ? signInfo.angle : 0;

    // Check if custom manual 3D coordinates exist in JSON
    if (art.posizione_manuale && typeof art.posizione_manuale.x === 'number') {
      const clampedY = Math.max(-10, Math.min(10, art.posizione_manuale.y));
      result[art.id] = [art.posizione_manuale.x, clampedY, art.posizione_manuale.z];
    } else {
      const idHash = (art.id || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const lonOffset = ((idHash % 22) - 11); // spread ±11 degrees in longitude
      const latOffset = (((idHash * 5) % 20) - 10); // balanced vertical spread ±10 degrees
      
      const lon = (baseAngle + 15 + lonOffset + 360) % 360;
      const lat = latOffset;
      const pos = sphericalToCartesian(sphereRadius, lon, lat, 0);
      result[art.id] = pos;
    }
  });

  return result;
}
