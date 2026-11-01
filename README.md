# NEBULA — Generative Universe ✨

Un universo generativo interattivo realizzato con **p5.js** e adattato da uno sketch originale in Processing (Java Mode). Funziona su desktop e smartphone, con controlli touch.

## Demo / Pubblicazione con GitHub Pages

1. Crea un repository pubblico su GitHub (es. `nebula-p5js`).
2. Carica **i file contenuti in questa cartella** nella radice del repository (`index.html`, `sketch.js`, `style.css`, `README.md`, `LICENSE`).
3. Vai su **Settings → Pages** e seleziona **Deploy from a branch**, branch `main`, cartella `/(root)`.
4. Attendi la pubblicazione. Il sito sarà raggiungibile all'indirizzo GitHub Pages mostrato nelle impostazioni.

## Avvio in locale

Apri `index.html` nel browser con una connessione Internet, oppure avvia un server locale:

```bash
python -m http.server 8000
```

Poi apri `http://localhost:8000`.

> p5.js è caricato da CDN: serve una connessione Internet per il primo caricamento e per ogni visita senza cache. Per renderlo completamente offline, scarica una copia di `p5.min.js` e sostituisci il riferimento CDN in `index.html` con un percorso locale.

## Controlli

| Azione | Desktop | Smartphone |
|---|---|---|
| Cambiare simulazione | Tasti `1`–`4` o pulsanti | Pulsanti 🌌 🌫️ ⚡ 🪐 |
| Onda d'urto | Click | Tocco sullo spazio |
| Spostare gravità | Trascina il mouse | Trascina il dito |
| Cambiare colori | `C` o 🎨 | 🎨 |
| Densità particelle | `+` / `-` | `+` / `−` |
| Pausa | `Spazio` | ⏸ |
| Reset | `R` | ↻ |
| Screenshot | `S` | 📷 |
| Nascondere/mostrare interfaccia | `H` | ◉ / ☰ |

## Le quattro modalità

- **Galactic Spiral** — particelle con attrazione gravitazionale e moto tangenziale.
- **Nebula Flow** — campo vettoriale basato su rumore di Perlin.
- **Quantum Storm** — moto turbolento e scie rapide.
- **Orbital Dance** — orbite concentriche con attrazione radiale.

## Prestazioni

Il numero iniziale di particelle è inferiore sui dispositivi touch (650 anziché 1800) e il massimo è limitato (1800 touch, 5500 desktop). Usa il pulsante `−` se il telefono rallenta. Il rendering utilizza Canvas 2D, non WebGL.

## Struttura

- `index.html` — pagina web e pulsanti.
- `style.css` — layout responsive e safe area mobile.
- `sketch.js` — simulazione, particelle e input pointer/touch.
