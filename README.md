# MNEMOSYNE CELESTE — Atlante Zodiacale 3D

> Atlante celeste dinamico in 3D e archivio mnemotecnico per l'immaginario artistico contemporaneo, ispirato al *Bilderatlas Mnemosyne* di Aby Warburg e strutturato sui 12 segni zodiacali come categorie simboliche aperte.
>
> Progetto e ricerca di **Giacomo Isidori**.

---

## 🌟 Caratteristiche Principali

1. **Volta Celeste 3D Navigabile a 360° (Notte)**:
   - Visuale dall'interno verso l'esterno (stile planetario / cupola).
   - 12 costellazioni disposte lungo la fascia dell'Eclittica con linee di congiunzione stellare.
   - Nodi-stella interattivi: al passaggio del mouse si illuminano con il loro colore dominante e mostrano titolo/artista; al click aprono la scheda dettagliata.
   - Algoritmo astronomico real-time: all'ingresso orienta la visuale verso il segno zodiacale in cui transita attualmente la Luna.

2. **Riconfigurazione Spaziale Warburghiana**:
   - **Manuale (Warburg)**: Disposizione curatoriale libera basata sulle coordinate nel file JSON.
   - **Cronologico**: Le opere si dispongono a spirale ascendente ordinata per anno.
   - **Cromatico**: Le opere si ordinano nello spazio 3D lungo lo spettro dei colori dominanti.

3. **Polarità Notte / Giorno (Cosmo 3D ↔ Archivio Bianco Tassonomico)**:
   - Con un click puoi passare dalla vista cosmica immersiva a una tavola bianca razionale, con filtri per segno zodiacale, ricerca per parole chiave/artisti e ordinamento cronologico.

4. **Simulatore per Cupola (Dome / Fisheye Preview)**:
   - Maschera circolare fisheye a 180° con reticolo di calibrazione (Zenith, anelli di altitudine, punti cardinali) per testare l'output prima dell'installazione su cupola e specchio sferico.

---

## 📂 Come aggiungere o modificare Opere e Immagini

Tutti i contenuti sono separati dal codice e gestiti tramite il file:
```
public/data/atlas.json
```

### Struttura di ogni opera nel JSON:
```json
{
  "id": "ariete_001",
  "segno": "Ariete",
  "artista": "Lucio Fontana",
  "titolo": "Concetto Spaziale, Attese",
  "anno": 1964,
  "tecnica": "Idropittura su tela squarciata",
  "immagine": "/images/ariete/fontana_attese.jpg",
  "posizione_manuale": { "x": 46.2, "y": 12.5, "z": 8.1 },
  "parole_chiave": ["taglio", "impulso primario", "spazio"],
  "nota_simbolica": "Il gesto istantaneo del taglio apre un nuovo spazio.",
  "colore_dominante": "#e63946",
  "link_fonte": "https://www.fondazioneluciofontana.it"
}
```

- **Per usare le tue immagini**: puoi posizionarle dentro `public/images/nome_segno/` e impostare `"immagine": "/images/nome_segno/tua_immagine.jpg"`, oppure usare qualsiasi URL web diretto.
- **Per modificare la posizione manuale 3D**: puoi cambiare i valori `x`, `y`, `z` (il raggio della sfera celeste è circa `50`). Se ometti `posizione_manuale`, l'algoritmo distribuirà automaticamente l'opera nel settore del suo segno zodiacale.

---

## 🚀 Avvio Locale e Sviluppo

```bash
# Installa le dipendenze
npm install

# Avvia il server di sviluppo locale
npm run dev

# Compila per la produzione
npm run build
```

---

## 🌐 Deploy su Vercel (Gratuito)

1. Crea un account su [Vercel](https://vercel.com).
2. Collega il tuo repository GitHub o trascina semplicemente la cartella del progetto tramite la CLI Vercel:
   ```bash
   npx vercel
   ```
3. Il framework verrà rilevato automaticamente come **Vite**.
4. Nelle impostazioni del tuo dominio su Vercel potrai agganciare il tuo dominio personale `giacomoisidori.it` (o un sottodominio come `atlas.giacomoisidori.it`).
