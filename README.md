# NEBULA — Generative Universe ✨

Un universo generativo interattivo realizzato con **p5.js** 

## Demo
https://aboutdani.github.io/Nebula/

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
