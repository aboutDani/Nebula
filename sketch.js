'use strict';

const MODE_NAMES = ['GALACTIC SPIRAL', 'NEBULA FLOW', 'QUANTUM STORM', 'ORBITAL DANCE'];
const PALETTES = [
  [[45,120,255],[255,75,200]],
  [[0,245,210],[80,95,255]],
  [[255,85,35],[255,225,85]],
  [[175,235,255],[255,255,255]]
];
const MOBILE = matchMedia('(pointer: coarse)').matches;
const MAX_PARTICLES = MOBILE ? 1800 : 5500;
let count = MOBILE ? 650 : 1800;
let particles = [], mode = 0, palette = 0;
let paused = false, showHUD = true, dragging = false;
let attractor, cx, cy, globalTime = 0, pulse = 0;
let trails;
let lastPointer = 0;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-host');
  pixelDensity(1); // limita il costo grafico su smartphone Retina
  frameRate(60);
  cx = width / 2; cy = height / 2;
  attractor = createVector(cx, cy);
  trails = createGraphics(width, height);
  trails.pixelDensity(1);
  trails.background(2, 4, 13);
  particles = Array.from({length: MAX_PARTICLES}, (_, i) => new Particle(i));
  bindUI();
  updateUI();
}

function draw() {
  if (!paused) {
    globalTime += 0.009;
    pulse *= 0.96;
    if (!dragging) {
      attractor.x = lerp(attractor.x, cx + sin(globalTime * .27) * width * .13, .012);
      attractor.y = lerp(attractor.y, cy + cos(globalTime * .33) * height * .11, .012);
    }
    trails.blendMode(BLEND);
    trails.noStroke();
    trails.fill(2, 4, 13, mode === 2 ? 24 : 13);
    trails.rect(0, 0, width, height);
    trails.blendMode(ADD);
    for (let i = 0; i < count; i++) particles[i].updateAndDraw(trails);
    trails.blendMode(BLEND);
  }
  background(2, 4, 13);
  image(trails, 0, 0);
  drawCore();
  if (frameCount % 20 === 0) updateUI();
}

function drawCore() {
  blendMode(ADD);
  noStroke();
  const glow = 28 + pulse * .12;
  for (let k = 10; k >= 1; k--) {
    fill(90, 125, 255, 2);
    circle(attractor.x, attractor.y, glow + k * 13);
  }
  fill(180, 205, 255, 55);
  circle(attractor.x, attractor.y, 12 + pulse * .09);
  fill(255, 255, 255, 180);
  circle(attractor.x, attractor.y, 3);
  blendMode(BLEND);
}

class Particle {
  constructor(index) {
    this.seed = random(10000);
    this.arm = index % 5;
    this.reset();
  }
  reset() {
    let angle = random(TWO_PI);
    let radius = pow(random(1), .68) * min(width, height) * .62;
    if (mode === 0) angle = this.arm * TWO_PI / 5 + radius * .018 + randomGaussian() * .38;
    if (mode === 3) radius = 85 + (this.arm + 1) * 66 + randomGaussian() * 18;
    this.x = cx + cos(angle) * radius;
    this.y = cy + sin(angle) * radius * (mode === 0 ? .72 : 1);
    this.px = this.x; this.py = this.y;
    this.vx = random(-.8, .8); this.vy = random(-.8, .8);
    this.life = random(100, 500);
    this.maxLife = random(400, 1100);
    this.size = random(.65, 2.15);
  }
  updateAndDraw(pg) {
    this.px = this.x; this.py = this.y;
    const dx = attractor.x - this.x, dy = attractor.y - this.y;
    const d = sqrt(max(140, dx * dx + dy * dy));
    let fx = 0, fy = 0;
    if (mode === 0) {
      const gravity = 58 / (d + 55);
      fx = dx / d * gravity - dy / d * .22;
      fy = dy / d * gravity + dx / d * .22;
    } else if (mode === 1) {
      const n = noise(this.x * .003, this.y * .003, globalTime * .32);
      const n2 = noise(this.x * .009 + 80, this.y * .009, globalTime * .2);
      const a = TWO_PI * (n * 3.5 + n2 * .8);
      fx = cos(a) * .28 + dx / d * .035;
      fy = sin(a) * .28 + dy / d * .035;
    } else if (mode === 2) {
      const a = noise(this.x * .007, this.y * .007, globalTime) * TWO_PI * 5;
      fx = cos(a) * .65 - dy / d * .15 + random(-.13, .13);
      fy = sin(a) * .65 + dx / d * .15 + random(-.13, .13);
    } else {
      const desired = 85 + (this.arm + 1) * 66;
      const radial = (d - desired) * .0018;
      fx = dx / d * radial - dy / d * .2;
      fy = dy / d * radial + dx / d * .2;
    }
    const damping = mode === 2 ? .966 : .986;
    this.vx = (this.vx + fx) * damping;
    this.vy = (this.vy + fy) * damping;
    const speed = sqrt(this.vx ** 2 + this.vy ** 2);
    const maxSpeed = mode === 2 ? 8 : 5.5;
    if (speed > maxSpeed) {
      this.vx *= maxSpeed / speed;
      this.vy *= maxSpeed / speed;
    }
    this.x += this.vx; this.y += this.vy; this.life++;
    if (this.x < -60 || this.x > width + 60 || this.y < -60 || this.y > height + 60 || this.life > this.maxLife) {
      this.reset(); return;
    }
    const h = (this.seed * .01 + d * .17 + globalTime * 22) % 360;
    const t = constrain((sin(radians(h)) + 1) * .5, 0, 1);
    const a = PALETTES[palette][0], b = PALETTES[palette][1];
    const r = lerp(a[0], b[0], t), g = lerp(a[1], b[1], t), bl = lerp(a[2], b[2], t);
    pg.stroke(r, g, bl, mode === 2 ? 105 : 75);
    pg.strokeWeight(this.size);
    pg.line(this.px, this.py, this.x, this.y);
    if (this.size > 1.65 && random(1) < .13) {
      pg.stroke(r, g, bl, 38);
      pg.strokeWeight(this.size * 3.5);
      pg.point(this.x, this.y);
    }
  }
}

function shockwave(x, y) {
  dragging = true;
  attractor.set(x, y);
  pulse = 180;
  for (let i = 0; i < count; i++) {
    const p = particles[i];
    const dx = p.x - x, dy = p.y - y;
    const d = max(24, sqrt(dx * dx + dy * dy));
    const kick = 18 * exp(-d / 230);
    p.vx += dx / d * kick;
    p.vy += dy / d * kick;
  }
}

// Pointer Events gestiscono mouse, touch e penna con lo stesso codice.
function bindPointer() {
  const el = document.querySelector('#canvas-host canvas');
  el.addEventListener('pointerdown', e => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.preventDefault();
    el.setPointerCapture(e.pointerId);
    shockwave(e.clientX, e.clientY);
    lastPointer = e.pointerId;
  });
  el.addEventListener('pointermove', e => {
    if (dragging && e.pointerId === lastPointer) {
      e.preventDefault();
      attractor.set(e.clientX, e.clientY);
    }
  });
  for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    el.addEventListener(name, e => { if (e.pointerId === lastPointer) dragging = false; });
  }
}

function resetParticles() {
  cx = width / 2; cy = height / 2;
  for (const p of particles) p.reset();
  trails.background(2, 4, 13);
}
function changeMode(value) { mode = value; resetParticles(); updateUI(); }
function changeCount(delta) { count = constrain(count + delta, 150, MAX_PARTICLES); updateUI(); }
function togglePause() { paused = !paused; updateUI(); }
function toggleHUD() {
  showHUD = !showHUD;
  document.getElementById('hud').hidden = !showHUD;
  document.getElementById('controls').hidden = !showHUD;
  document.getElementById('show-controls').hidden = showHUD;
}
function updateUI() {
  document.getElementById('mode-label').textContent = MODE_NAMES[mode];
  document.getElementById('stats-label').textContent = `${count} PARTICELLE · ${Math.round(frameRate())} FPS`;
  document.getElementById('count-label').textContent = count;
  document.getElementById('pause').innerHTML = paused ? '▶ <span>Riprendi</span>' : '⏸ <span>Pausa</span>';
  document.querySelectorAll('[data-mode]').forEach(btn => {
    btn.classList.toggle('active', Number(btn.dataset.mode) === mode);
    btn.setAttribute('aria-pressed', String(Number(btn.dataset.mode) === mode));
  });
}
function bindUI() {
  bindPointer();
  document.querySelectorAll('[data-mode]').forEach(btn => btn.addEventListener('click', () => changeMode(Number(btn.dataset.mode))));
  document.getElementById('palette').addEventListener('click', () => { palette = (palette + 1) % 4; });
  document.getElementById('less').addEventListener('click', () => changeCount(MOBILE ? -150 : -500));
  document.getElementById('more').addEventListener('click', () => changeCount(MOBILE ? 150 : 500));
  document.getElementById('pause').addEventListener('click', togglePause);
  document.getElementById('reset').addEventListener('click', resetParticles);
  document.getElementById('save').addEventListener('click', () => saveCanvas('nebula', 'png'));
  document.getElementById('hide').addEventListener('click', toggleHUD);
  document.getElementById('show-controls').addEventListener('click', toggleHUD);
}
function keyPressed() {
  if (key >= '1' && key <= '4') changeMode(Number(key) - 1);
  else if (key === ' ') { togglePause(); return false; }
  else if (key === 'r' || key === 'R') resetParticles();
  else if (key === 'c' || key === 'C') palette = (palette + 1) % 4;
  else if (key === 'h' || key === 'H') toggleHUD();
  else if (key === 's' || key === 'S') saveCanvas('nebula', 'png');
  else if (key === '+' || key === '=') changeCount(500);
  else if (key === '-' || key === '_') changeCount(-500);
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  trails = createGraphics(width, height);
  trails.pixelDensity(1);
  trails.background(2, 4, 13);
  cx = width / 2; cy = height / 2;
  attractor.set(cx, cy);
  resetParticles();
}
