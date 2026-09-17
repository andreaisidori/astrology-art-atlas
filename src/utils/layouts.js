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

  // 4. MANUAL / CURATORIAL 3D CELESTIAL POSITIONING (With 1-to-N Artist Clustering & Anti-Overlap)
  const bySign = {};
  artworks.forEach((art) => {
    const signKey = (art.segno || 'Ariete').toLowerCase();
    if (!bySign[signKey]) bySign[signKey] = [];
    bySign[signKey].push(art);
  });

  Object.entries(bySign).forEach(([signKey, signArtworks]) => {
    const signInfo = ZODIAC_SIGNS.find(s => s.name.toLowerCase() === signKey || s.id === signKey);
    const baseAngle = signInfo ? signInfo.angle : 0;

    // Group within this sign by artist to handle 1-to-N artworks
    const byArtist = {};
    signArtworks.forEach((art) => {
      const artistKey = (art.artista || 'Senza Autore').trim().toLowerCase();
      if (!byArtist[artistKey]) byArtist[artistKey] = [];
      byArtist[artistKey].push(art);
    });

    const artistKeys = Object.keys(byArtist);
    const totalArtistsInSign = artistKeys.length;

    artistKeys.forEach((artistKey, artistIndex) => {
      const artistArtworks = byArtist[artistKey];
      
      // Calculate a stable base position for this artist within the 30° zodiac sector
      // The sign sector extends from baseAngle to baseAngle + 30°
      const artistSectorProgress = (artistIndex + 0.5) / Math.max(totalArtistsInSign, 1);
      const artistBaseLon = baseAngle + 3 + (artistSectorProgress * 24); // 24 deg span within 30 deg sector
      
      // Stable hash for artist latitude to give varied vertical elevation (-14° to +14°)
      const artistHash = artistKey.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const artistBaseLat = ((artistHash % 28) - 14);

      artistArtworks.forEach((art, artIndex) => {
        // If the artwork has a genuine manual 3D coordinate edited in Spatial Editor
        // (Filter out the legacy dummy [40, 0, 10] coordinate bug)
        const isDummyCoord = art.posizione_manuale &&
          Math.abs(art.posizione_manuale.x - 40) < 6 &&
          Math.abs(art.posizione_manuale.y) < 3 &&
          Math.abs(art.posizione_manuale.z - 10) < 6 &&
          signKey !== 'ariete';

        if (art.posizione_manuale && typeof art.posizione_manuale.x === 'number' && !isDummyCoord) {
          result[art.id] = [art.posizione_manuale.x, art.posizione_manuale.y, art.posizione_manuale.z];
          return;
        }

        // For single artwork of artist
        if (artistArtworks.length === 1) {
          const lon = (artistBaseLon + 360) % 360;
          const lat = artistBaseLat;
          result[art.id] = sphericalToCartesian(sphereRadius, lon, lat, 0);
        } else {
          // Multiple artworks of the same artist: distribute in a micro-cluster around the artist center
          const totalArt = artistArtworks.length;
          const clusterAngle = (artIndex / totalArt) * Math.PI * 2;
          const lonOffset = Math.cos(clusterAngle) * 3.8;
          const latOffset = Math.sin(clusterAngle) * 3.8;

          const lon = (artistBaseLon + lonOffset + 360) % 360;
          const lat = Math.max(-18, Math.min(18, artistBaseLat + latOffset));
          const radiusVariation = sphereRadius * (1 + ((artIndex % 3) - 1) * 0.015);
          result[art.id] = sphericalToCartesian(radiusVariation, lon, lat, 0);
        }
      });
    });
  });

  return result;
}
