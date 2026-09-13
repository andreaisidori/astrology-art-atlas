const fs = require('fs');
const https = require('https');

const found = JSON.parse(fs.readFileSync('scripts/artist_natal_charts.json', 'utf8'));
const atlas = JSON.parse(fs.readFileSync('public/data/atlas.json', 'utf8'));
const artists = Array.from(new Set(atlas.opere.map(o => o.artista))).filter(Boolean);

const remaining = artists.filter(a => !found[a]);
console.log('Remaining artists to check:', remaining.length);
console.log(remaining);
