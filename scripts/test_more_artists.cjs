const https = require('https');

const candidates = {
  'Dante Gabriel Rossetti': 'Rossetti,_Dante_Gabriel',
  'Georges Braques': 'Braque,_Georges',
  'Jasper Johns': 'Johns,_Jasper',
  'Leonora Carrington': 'Carrington,_Leonora',
  'Maurits Cornelis Escher': 'Escher,_M._C.',
  'Hilma af Klint': 'Klint,_Hilma_af',
  'Alighiero Boetti': 'Boetti,_Alighiero',
  'Alfredo Burri': 'Burri,_Alberto',
  'Richard Long': 'Long,_Richard',
  'George Frederic Watts': 'Watts,_George_Frederic',
  'Nicolas De Staël': 'Sta%C3%ABl,_Nicolas_de',
  'Giovanni Segantini': 'Segantini,_Giovanni',
  'Francesca Woodman': 'Woodman,_Francesca',
  'Fortunato Depero': 'Depero,_Fortunato',
  'Bruno Munari': 'Munari,_Bruno',
  'Piero Fornasetti': 'Fornasetti,_Piero',
  'Jannis Kounellis': 'Kounellis,_Jannis',
  'Sarah Charlesworth': 'Charlesworth,_Sarah',
  'Roman Opałka': 'Opalka,_Roman',
  'Gaetano Previati': 'Previati,_Gaetano',
  'Pino Pascali': 'Pascali,_Pino',
  'Luigi Ghirri': 'Ghirri,_Luigi',
  'Barbara Kruger': 'Kruger,_Barbara',
  'Frank Shepard Fairey': 'Fairey,_Shepard',
  'Jacob Jordaens': 'Jordaens,_Jacob',
  'Enzo Mari': 'Mari,_Enzo',
  'Domenico Gnoli': 'Gnoli,_Domenico',
  'Giuseppe Capogrossi': 'Capogrossi,_Giuseppe',
  'Vladimir Tatlin': 'Tatlin,_Vladimir',
  'Bas Jan Ader': 'Ader,_Bas_Jan'
};

function checkSlug(slug) {
  return new Promise((resolve) => {
    https.get('https://www.astro.com/wiki/astro-databank/index.php?search=' + encodeURIComponent(slug.replace(/_/g, ' ')), {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const regex = /<a href=\"\/astro-databank\/([^\"]+)\" title=\"([^\"]+)\"/g;
        let match;
        const list = [];
        while ((match = regex.exec(data)) !== null) {
          if (!match[1].startsWith('Special:') && !match[1].startsWith('Main_Page') && !match[1].startsWith('Help:')) {
            list.push({ slug: match[1], title: match[2] });
          }
        }
        resolve(list);
      });
    }).on('error', () => resolve([]));
  });
}

(async () => {
  for (const [artist, slug] of Object.entries(candidates)) {
    const list = await checkSlug(slug);
    console.log(artist, '=>', list.slice(0, 2));
    await new Promise(r => setTimeout(r, 60));
  }
})();
