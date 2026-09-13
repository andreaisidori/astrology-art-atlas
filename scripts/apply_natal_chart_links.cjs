const fs = require('fs');

const atlas = JSON.parse(fs.readFileSync('public/data/atlas.json', 'utf8'));
const charts = JSON.parse(fs.readFileSync('scripts/artist_natal_charts.json', 'utf8'));

// Additional manual verified links
charts['Dante Gabriel Rossetti'] = 'https://www.astro.com/astro-databank/Rossetti,_D._G.';
charts['Giovanni Segantini'] = 'https://www.astro.com/astro-databank/Segantini,_Giovannni';

let updatedCount = 0;
atlas.opere = atlas.opere.map(opera => {
  const chartLink = charts[opera.artista] || "";
  if (chartLink) updatedCount++;
  return {
    ...opera,
    link_tema_natale: chartLink
  };
});

fs.writeFileSync('public/data/atlas.json', JSON.stringify(atlas, null, 2));
console.log(`Updated atlas.json: ${updatedCount} / ${atlas.opere.length} entries have link_tema_natale populated.`);
