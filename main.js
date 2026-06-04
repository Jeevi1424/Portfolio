/* =============================================
   JEEVITHA K — 3D Portfolio JS
   Three.js particle fields + rotating cube
   ============================================= */

// ──────────────────────────────────────────────
// 1.  HERO PARTICLE FIELD — Colorful square particles
// ──────────────────────────────────────────────
(function initHeroParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  camera.position.z = 6;

  // Colorful square sprite texture drawn on a small canvas
  function makeSquareTexture(color) {
    const c = document.createElement('canvas');
    c.width = 16; c.height = 16;
    const ctx = c.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(2, 2, 12, 12);
    return new THREE.CanvasTexture(c);
  }

  // Palette matching the image: pink/red, green, cyan, purple, yellow
  const palette = [
    { color: '#ff6b9d', count: 500 },  // pink
    { color: '#4ade80', count: 400 },  // green
    { color: '#22d3ee', count: 300 },  // cyan
    { color: '#a78bfa', count: 350 },  // purple
    { color: '#facc15', count: 150 },  // yellow
    { color: '#f87171', count: 200 },  // red-pink
  ];

  const groups = [];

  palette.forEach(({ color, count }) => {
    const tex = makeSquareTexture(color);
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.PointsMaterial({
      map: tex,
      size: 0.12 + Math.random() * 0.1,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      alphaTest: 0.1,
    });

    const pts = new THREE.Points(geo, mat);
    scene.add(pts);
    groups.push(pts);
  });

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.8;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
  });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.0003;
    groups.forEach((g, i) => {
      g.rotation.y = t * (0.3 + i * 0.05) + mouseX * 0.2;
      g.rotation.x = mouseY * 0.1;
    });
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.04;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }
  animate();
})();

// ──────────────────────────────────────────────
// 3.  SKILLS SECTION — FLOATING ORBS BACKGROUND
// ──────────────────────────────────────────────
(function initSkillsBG() {
  const canvas = document.getElementById('skillsCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 8;

  const torusGeo = new THREE.TorusGeometry(3, 0.02, 8, 80);
  const torusMat = new THREE.MeshBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.3 });
  for (let i = 0; i < 4; i++) {
    const t = new THREE.Mesh(torusGeo, torusMat);
    t.rotation.x = Math.random() * Math.PI;
    t.rotation.y = Math.random() * Math.PI;
    scene.add(t);
  }

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  scene.children.forEach((t, i) => {
    function animTorus() {
      requestAnimationFrame(animTorus);
      t.rotation.z += 0.002 + i * 0.001;
      t.rotation.y += 0.001;
      renderer.render(scene, camera);
    }
    animTorus();
  });
})();

// ──────────────────────────────────────────────
// 4.  EXPERIENCE SECTION — GRID LINES BACKGROUND
// ──────────────────────────────────────────────
(function initExpBG() {
  const canvas = document.getElementById('expCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.set(0, 10, 12);
  camera.lookAt(0, 0, 0);

  // Grid lines
  const gridHelper = new THREE.GridHelper(30, 30, 0x7c3aed, 0x7c3aed);
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.08;
  scene.add(gridHelper);

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  function animate() {
    requestAnimationFrame(animate);
    gridHelper.position.z += 0.02;
    if (gridHelper.position.z > 1) gridHelper.position.z = 0;
    renderer.render(scene, camera);
  }
  animate();
})();

// ──────────────────────────────────────────────
// 5.  CONTACT SECTION — DNA-LIKE HELIX PARTICLES
// ──────────────────────────────────────────────
(function initContactBG() {
  const canvas = document.getElementById('contactCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 6;

  // Helix points
  const geo = new THREE.BufferGeometry();
  const pts = [];
  for (let i = 0; i < 400; i++) {
    const t = (i / 400) * Math.PI * 10;
    pts.push(Math.cos(t) * 3, (i / 400) * 10 - 5, Math.sin(t) * 3);
    pts.push(Math.cos(t + Math.PI) * 3, (i / 400) * 10 - 5, Math.sin(t + Math.PI) * 3);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3));
  const mat = new THREE.PointsMaterial({ color: 0x7c3aed, size: 0.06, transparent: true, opacity: 0.6 });
  const helix = new THREE.Points(geo, mat);
  scene.add(helix);

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  function animate() {
    requestAnimationFrame(animate);
    helix.rotation.y += 0.004;
    renderer.render(scene, camera);
  }
  animate();
})();

// ──────────────────────────────────────────────
// 6.  NAVBAR — SCROLL EFFECT
// ──────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ──────────────────────────────────────────────
// 7.  MOBILE NAV TOGGLE
// ──────────────────────────────────────────────
document.getElementById('navToggle').addEventListener('click', function () {
  document.querySelector('.nav-links').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => document.querySelector('.nav-links').classList.remove('open'));
});

// ──────────────────────────────────────────────
// 8.  SCROLL REVEAL
// ──────────────────────────────────────────────
const revealEls = document.querySelectorAll('.card-3d, .timeline-item, .skill-orb, .soft-tag');
revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObserver.observe(el));

// ──────────────────────────────────────────────
// 9.  ANIMATED STAT COUNTERS
// ──────────────────────────────────────────────
const statNums = document.querySelectorAll('.stat-num[data-target]');

const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target  = parseFloat(el.dataset.target);
    const decimal = parseInt(el.dataset.decimal || 0);
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = (ease * target).toFixed(decimal);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
    countObserver.unobserve(el);
  });
}, { threshold: 0.5 });

statNums.forEach(el => countObserver.observe(el));

// ──────────────────────────────────────────────
// 10.  SKILL ORB — 3D MOUSE TILT (enhanced)
// ──────────────────────────────────────────────
document.querySelectorAll('.skill-orb').forEach(orb => {
  orb.addEventListener('mousemove', e => {
    const rect = orb.getBoundingClientRect();
    const cx   = rect.left + rect.width / 2;
    const cy   = rect.top  + rect.height / 2;
    const rx   = ((e.clientY - cy) / (rect.height / 2)) * -15;
    const ry   = ((e.clientX - cx) / (rect.width  / 2)) *  15;
    orb.style.transform = `perspective(400px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.05)`;
  });
  orb.addEventListener('mouseleave', () => {
    orb.style.transform = '';
  });
});

// ──────────────────────────────────────────────
// 11.  CARD 3D MOUSE PARALLAX
// ──────────────────────────────────────────────
document.querySelectorAll('.project-card, .cert-card, .stat-box').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width / 2;
    const cy   = rect.top  + rect.height / 2;
    const rx   = ((e.clientY - cy) / (rect.height / 2)) * -8;
    const ry   = ((e.clientX - cx) / (rect.width  / 2)) *  8;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(12px)`;
    const glow = card.querySelector('.project-glow');
    if (glow) {
      const px = ((e.clientX - rect.left) / rect.width)  * 100;
      const py = ((e.clientY - rect.top)  / rect.height) * 100;
      glow.style.background = `radial-gradient(ellipse at ${px}% ${py}%, rgba(124,58,237,0.15) 0%, transparent 60%)`;
    }
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ──────────────────────────────────────────────
// 12.  SMOOTH ACTIVE NAV HIGHLIGHT
// ──────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');

const secObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAs.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => secObserver.observe(s));
