const fs = require('fs');
const https = require('https');

const atlas = JSON.parse(fs.readFileSync('public/data/atlas.json', 'utf8'));
const artists = Array.from(new Set(atlas.opere.map(o => o.artista))).filter(Boolean);

console.log(`Total unique artists to check: ${artists.length}`);

// Known verified direct links on Astro-Databank (Astrodienst)
const KNOWN_ALIASES = {
  "Yayoi Kusama": "https://www.astro.com/astro-databank/Kusama,_Yayoi",
  "Vincent Van Gogh": "https://www.astro.com/astro-databank/Van_Gogh,_Vincent",
  "Leonardo Da Vinci": "https://www.astro.com/astro-databank/Da_Vinci,_Leonardo",
  "Michelangelo Buonarroti": "https://www.astro.com/astro-databank/Michelangelo",
  "Raffaello Sanzio": "https://www.astro.com/astro-databank/Raphael",
  "Salvador Dalì": "https://www.astro.com/astro-databank/Dali,_Salvador",
  "Pablo Picasso": "https://www.astro.com/astro-databank/Picasso,_Pablo",
  "Frida Kahlo": "https://www.astro.com/astro-databank/Kahlo,_Frida",
  "Andy Warhol": "https://www.astro.com/astro-databank/Warhol,_Andy",
  "Marcel Duchamp": "https://www.astro.com/astro-databank/Duchamp,_Marcel",
  "Claude Monet": "https://www.astro.com/astro-databank/Monet,_Claude",
  "Gustav Klimt": "https://www.astro.com/astro-databank/Klimt,_Gustav",
  "Egon Schiele": "https://www.astro.com/astro-databank/Schiele,_Egon",
  "Francis Bacon": "https://www.astro.com/astro-databank/Bacon,_Francis",
  "Keith Haring": "https://www.astro.com/astro-databank/Haring,_Keith",
  "Marina Abramović": "https://www.astro.com/astro-databank/Abramovi%C4%87,_Marina",
  "Jackson Pollock": "https://www.astro.com/astro-databank/Pollock,_Jackson",
  "Albrecht Dürer": "https://www.astro.com/astro-databank/D%C3%BCrer,_Albrecht",
  "Marc Chagall": "https://www.astro.com/astro-databank/Chagall,_Marc",
  "David Hockney": "https://www.astro.com/astro-databank/Hockney,_David",
  "Giorgio De Chirico": "https://www.astro.com/astro-databank/De_Chirico,_Giorgio",
  "Rembrandt van Rijn": "https://www.astro.com/astro-databank/Rembrandt",
  "Paul Cézanne": "https://www.astro.com/astro-databank/C%C3%A9zanne,_Paul",
  "Édouard Manet": "https://www.astro.com/astro-databank/Manet,_%C3%89douard",
  "Edgar Degas": "https://www.astro.com/astro-databank/Degas,_Edgar",
  "Edward Hopper": "https://www.astro.com/astro-databank/Hopper,_Edward",
  "Henri Matisse": "https://www.astro.com/astro-databank/Matisse,_Henri",
  "Paul Klee": "https://www.astro.com/astro-databank/Klee,_Paul",
  "Joan Mirò": "https://www.astro.com/astro-databank/Mir%C3%B3,_Joan",
  "Amedeo Modigliani": "https://www.astro.com/astro-databank/Modigliani,_Amedeo",
  "Joseph Beuys": "https://www.astro.com/astro-databank/Beuys,_Joseph",
  "Wassily Kandinsky": "https://www.astro.com/astro-databank/Kandinsky,_Wassily",
  "Vasilij Kandinskij": "https://www.astro.com/astro-databank/Kandinsky,_Wassily",
  "Piet Mondrian": "https://www.astro.com/astro-databank/Mondrian,_Piet",
  "Kazimir Malevič": "https://www.astro.com/astro-databank/Malevich,_Kazimir",
  "Carl Gustav Jung": "https://www.astro.com/astro-databank/Jung,_Carl_Gustav",
  "André Breton": "https://www.astro.com/astro-databank/Breton,_Andr%C3%A9",
  "Antoni Gaudí": "https://www.astro.com/astro-databank/Gaud%C3%AD,_Antoni",
  "Le Corbusier": "https://www.astro.com/astro-databank/Le_Corbusier",
  "Walter Gropius": "https://www.astro.com/astro-databank/Gropius,_Walter",
  "Rudolf Steiner": "https://www.astro.com/astro-databank/Steiner,_Rudolf",
  "Victor Hugo": "https://www.astro.com/astro-databank/Hugo,_Victor",
  "William Blake": "https://www.astro.com/astro-databank/Blake,_William",
  "Auguste Rodin": "https://www.astro.com/astro-databank/Rodin,_Auguste",
  "Henri de Toulouse-Lautrec": "https://www.astro.com/astro-databank/Toulouse-Lautrec,_Henri_de",
  "Georgia O'Keeffe": "https://www.astro.com/astro-databank/O%27Keeffe,_Georgia",
  "Louise Bourgeois": "https://www.astro.com/astro-databank/Bourgeois,_Louise",
  "Yoko Ono": "https://www.astro.com/astro-databank/Ono,_Yoko",
  "John Cage": "https://www.astro.com/astro-databank/Cage,_John",
  "Helmut Newton": "https://www.astro.com/astro-databank/Newton,_Helmut",
  "Robert Mapplethorpe": "https://www.astro.com/astro-databank/Mapplethorpe,_Robert",
  "Niki de Saint Phalle": "https://www.astro.com/astro-databank/Saint_Phalle,_Niki_de",
  "Man Ray": "https://www.astro.com/astro-databank/Ray,_Man",
  "Jean Tinguely": "https://www.astro.com/astro-databank/Tinguely,_Jean",
  "Agnès Varda": "https://www.astro.com/astro-databank/Varda,_Agn%C3%A8s",
  "Tracey Emin": "https://www.astro.com/astro-databank/Emin,_Tracey",
  "Damien Hirst": "https://www.astro.com/astro-databank/Hirst,_Damien",
  "Jeff Koons": "https://www.astro.com/astro-databank/Koons,_Jeff",
  "Matthew Barney": "https://www.astro.com/astro-databank/Barney,_Matthew",
  "Audrey Tautou": "https://www.astro.com/astro-databank/Tautou,_Audrey",
  "Alphonse Mucha": "https://www.astro.com/astro-databank/Mucha,_Alphonse",
  "Francisco Goya": "https://www.astro.com/astro-databank/De_Goya,_Francisco",
  "Gustave Courbet": "https://www.astro.com/astro-databank/Courbet,_Gustave",
  "John Constable": "https://www.astro.com/astro-databank/Constable,_John",
  "Camille Pissarro": "https://www.astro.com/astro-databank/Pissarro,_Camille",
  "James Abbott McNeill Whistler": "https://www.astro.com/astro-databank/Whistler,_James_McNeill",
  "Jean-Baptiste Camille Corot": "https://www.astro.com/astro-databank/Corot,_Camille",
  "Joshua Reynolds": "https://www.astro.com/astro-databank/Reynolds,_Joshua",
  "Auguste Bartholdi": "https://www.astro.com/astro-databank/Bartholdi,_Fr%C3%A9d%C3%A9ric-Auguste",
  "Pierre Bonnard": "https://www.astro.com/astro-databank/Bonnard,_Pierre",
  "Antoine Watteau": "https://www.astro.com/astro-databank/Watteau,_Antoine",
  "Francois Boucher": "https://www.astro.com/astro-databank/Boucher,_Fran%C3%A7ois",
  "Alexandre Cabanel": "https://www.astro.com/astro-databank/Cabanel,_Alexandre",
  "Gustave Moreau": "https://www.astro.com/astro-databank/Moreau,_Gustave",
  "Gustave Doré": "https://www.astro.com/astro-databank/Dor%C3%A9,_Gustave",
  "Albert Bierstadt": "https://www.astro.com/astro-databank/Bierstadt,_Albert",
  "Eadweard Muybridge": "https://www.astro.com/astro-databank/Muybridge,_Eadweard",
  "Brassaï": "https://www.astro.com/astro-databank/Brassa%C3%AF",
  "Sol LeWitt": "https://www.astro.com/astro-databank/LeWitt,_Sol",
  "Frank Gehry": "https://www.astro.com/astro-databank/Gehry,_Frank",
  "Constantin Brancusi": "https://www.astro.com/astro-databank/Brancusi,_Constantin",
  "Lucio Fontana": "https://www.astro.com/astro-databank/Fontana,_Lucio",
  "Benvenuto Cellini": "https://www.astro.com/astro-databank/Cellini,_Benvenuto",
  "Francesco Borromini": "https://www.astro.com/astro-databank/Borromini,_Francesco",
  "Francisco de Zurbarán": "https://www.astro.com/astro-databank/Zurbar%C3%A1n,_Francisco_de",
  "Camille Flammarion": "https://www.astro.com/astro-databank/Flammarion,_Camille",
  "Antoine de Saint-Exupéry": "https://www.astro.com/astro-databank/Saint-Exup%C3%A9ry,_Antoine_de",
  "Raoul Dufy": "https://www.astro.com/astro-databank/Dufy,_Raoul",
  "Kurt Schwitters": "https://www.astro.com/astro-databank/Schwitters,_Kurt",
  "Hans Arp": "https://www.astro.com/astro-databank/Arp,_Jean",
  "Mark Rothko": "https://www.astro.com/astro-databank/Rothko,_Mark",
  "Carl Andre": "https://www.astro.com/astro-databank/Andre,_Carl",
  "Theo van Doesburg": "https://www.astro.com/astro-databank/Doesburg,_Theo_van",
  "Vito Acconci": "https://www.astro.com/astro-databank/Acconci,_Vito",
  "Bruce Nauman": "https://www.astro.com/astro-databank/Nauman,_Bruce",
  "Chris Burden": "https://www.astro.com/astro-databank/Burden,_Chris",
  "Daniel Spoerri": "https://www.astro.com/astro-databank/Spoerri,_Daniel",
  "Claes Oldenburg": "https://www.astro.com/astro-databank/Oldenburg,_Claes",
  "Anselm Kiefer": "https://www.astro.com/astro-databank/Kiefer,_Anselm",
  "Anish Kapoor": "https://www.astro.com/astro-databank/Kapoor,_Anish"
};

function searchAstroWiki(name) {
  return new Promise((resolve) => {
    const clean = name.replace(/\([^)]*\)/g, '').trim();
    const url = 'https://www.astro.com/wiki/astro-databank/index.php?search=' + encodeURIComponent(clean);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const regex = /<a href=\"\/astro-databank\/([^\"]+)\" title=\"([^\"]+)\"/g;
        let match;
        const candidates = [];
        while ((match = regex.exec(data)) !== null) {
          const slug = match[1];
          const title = match[2];
          if (!slug.startsWith('Special:') && !slug.startsWith('Main_Page') && !slug.startsWith('Help:') && !slug.startsWith('Category:')) {
            candidates.push({ slug, title });
          }
        }
        
        const parts = clean.toLowerCase().split(/\s+/);
        const lastName = parts[parts.length - 1];
        const firstName = parts[0];
        
        const matchFound = candidates.find(c => {
          const t = c.title.toLowerCase();
          return t.includes(lastName) && (parts.length === 1 || t.includes(firstName));
        });
        
        if (matchFound) {
          resolve('https://www.astro.com/astro-databank/' + matchFound.slug);
        } else {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

(async () => {
  const artistCharts = {};
  let foundCount = 0;
  
  for (const artist of artists) {
    if (KNOWN_ALIASES[artist]) {
      artistCharts[artist] = KNOWN_ALIASES[artist];
      foundCount++;
      console.log(`[KNOWN] ${artist} => ${KNOWN_ALIASES[artist]}`);
      continue;
    }
    
    // Try online search
    const found = await searchAstroWiki(artist);
    if (found) {
      artistCharts[artist] = found;
      foundCount++;
      console.log(`[FOUND] ${artist} => ${found}`);
    } else {
      console.log(`[NOT FOUND] ${artist}`);
    }
    await new Promise(r => setTimeout(r, 60));
  }
  
  console.log(`\nFound charts for ${foundCount} / ${artists.length} artists.`);
  fs.writeFileSync('scripts/artist_natal_charts.json', JSON.stringify(artistCharts, null, 2));
})();
