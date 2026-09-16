/* ==========================================================================
   GRUPO EMPRESARIAL SERUMA - ULTRA-PRO CYBER INTERACTION ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. WEB AUDIO API SYNTHESIZER (Sci-Fi Sound FX)
  // -------------------------------------------------------------------------
  let audioCtx = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSound(type = 'click') {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'radar') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(660, now + 0.08);
        osc.frequency.setValueAtTime(880, now + 0.16);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (e) {
      // Audio fallback silent
    }
  }

  // Audio Toggle
  const soundToggleBtn = document.getElementById('sound-toggle');
  const soundText = document.getElementById('sound-text');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        initAudio();
        soundText.textContent = 'AUDIO: ON';
        soundToggleBtn.classList.remove('muted');
        playSound('click');
      } else {
        soundText.textContent = 'AUDIO: OFF';
        soundToggleBtn.classList.add('muted');
      }
    });
  }

  // -------------------------------------------------------------------------
  // 2. PRECISION CYBER CURSOR
  // -------------------------------------------------------------------------
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (dot) {
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }
  });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    if (ring) {
      ring.style.transform = `translate3d(${ringX - 16}px, ${ringY - 16}px, 0)`;
    }
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  document.querySelectorAll('.magnetic-target, a, button, input').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (ring) ring.classList.add('active');
      playSound('hover');
    });
    el.addEventListener('mouseleave', () => {
      if (ring) ring.classList.remove('active');
    });
  });

  // -------------------------------------------------------------------------
  // 3. THREE.JS 3D INTERACTIVE SCENE (TESLA ASTEROIDS & SPACE DEBRIS)
  // -------------------------------------------------------------------------
  const container = document.getElementById('webgl-container');
  if (container && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xC9A227, 2.2);
    dirLight1.position.set(20, 20, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x00E5FF, 1.8);
    dirLight2.position.set(-20, -10, -10);
    scene.add(dirLight2);

    // Group for mode 1: Floating Low-Poly Asteroids (Tesla Cyber Theme)
    const asteroidsGroup = new THREE.Group();
    const asteroidGeom = new THREE.DodecahedronGeometry(1, 1);
    const asteroidMat = new THREE.MeshStandardMaterial({
      color: 0x111622,
      roughness: 0.35,
      metalness: 0.85,
      wireframe: false
    });
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xC9A227,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });

    const asteroids = [];
    for (let i = 0; i < 28; i++) {
      const scale = 0.6 + Math.random() * 2.2;
      const mesh = new THREE.Mesh(asteroidGeom, asteroidMat);
      const wire = new THREE.Mesh(asteroidGeom, wireMat);
      mesh.add(wire);

      mesh.position.set(
        (Math.random() - 0.5) * 45,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 20
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      mesh.scale.set(scale, scale, scale);

      asteroids.push({
        mesh,
        rotSpeedX: (Math.random() - 0.5) * 0.015,
        rotSpeedY: (Math.random() - 0.5) * 0.015
      });
      asteroidsGroup.add(mesh);
    }
    scene.add(asteroidsGroup);

    // Group for mode 2: Central Holographic Shield Core
    const shieldGroup = new THREE.Group();
    const coreGeom = new THREE.IcosahedronGeometry(6, 2);
    const coreWire = new THREE.Mesh(
      coreGeom,
      new THREE.MeshBasicMaterial({ color: 0xC9A227, wireframe: true, transparent: true, opacity: 0.4 })
    );
    const innerGeom = new THREE.SphereGeometry(3.5, 16, 16);
    const innerMesh = new THREE.Mesh(
      innerGeom,
      new THREE.MeshStandardMaterial({ color: 0x00E5FF, wireframe: true, transparent: true, opacity: 0.5 })
    );
    shieldGroup.add(coreWire);
    shieldGroup.add(innerMesh);
    shieldGroup.visible = false;
    scene.add(shieldGroup);

    // Group for mode 3: Satellite Radar Rings
    const radarGroup = new THREE.Group();
    for (let r = 0; r < 5; r++) {
      const ringGeom = new THREE.RingGeometry(3 + r * 3, 3.1 + r * 3, 64);
      const ringMesh = new THREE.Mesh(
        ringGeom,
        new THREE.MeshBasicMaterial({ color: 0xC9A227, side: THREE.DoubleSide, transparent: true, opacity: 0.3 })
      );
      ringMesh.rotation.x = Math.PI / 2;
      radarGroup.add(ringMesh);
    }
    radarGroup.visible = false;
    scene.add(radarGroup);

    // Particle Dust
    const dustCount = 350;
    const dustGeom = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i++) {
      dustPositions[i] = (Math.random() - 0.5) * 60;
    }
    dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({ color: 0xC9A227, size: 0.12, transparent: true, opacity: 0.6 });
    const dust = new THREE.Points(dustGeom, dustMat);
    scene.add(dust);

    // Mouse Parallax Interaction
    let targetRotX = 0;
    let targetRotY = 0;

    window.addEventListener('mousemove', (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotY = normX * 0.35;
      targetRotX = normY * 0.25;
    });

    // Scene Switcher Buttons
    document.querySelectorAll('.scene-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.scene-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        playSound('click');

        const mode = btn.dataset.mode;
        if (mode === 'asteroids') {
          asteroidsGroup.visible = true;
          shieldGroup.visible = false;
          radarGroup.visible = false;
        } else if (mode === 'shield') {
          asteroidsGroup.visible = false;
          shieldGroup.visible = true;
          radarGroup.visible = false;
        } else if (mode === 'radar') {
          asteroidsGroup.visible = false;
          shieldGroup.visible = false;
          radarGroup.visible = true;
        }
      });
    });

    // Render loop
    function animate3D() {
      requestAnimationFrame(animate3D);

      asteroids.forEach(a => {
        a.mesh.rotation.x += a.rotSpeedX;
        a.mesh.rotation.y += a.rotSpeedY;
      });

      asteroidsGroup.rotation.y += 0.002;
      asteroidsGroup.rotation.x += (targetRotX - asteroidsGroup.rotation.x) * 0.05;
      asteroidsGroup.rotation.y += (targetRotY - asteroidsGroup.rotation.y) * 0.05;

      coreWire.rotation.x += 0.005;
      coreWire.rotation.y += 0.008;
      innerMesh.rotation.y -= 0.01;

      radarGroup.rotation.z += 0.005;

      dust.rotation.y += 0.0008;

      renderer.render(scene, camera);
    }
    animate3D();

    window.addEventListener('resize', () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
  }
  // -------------------------------------------------------------------------
  // 4. INTERACTIVE COTIZADOR 3D CALCULATOR
  // -------------------------------------------------------------------------
  const rangePuestos = document.getElementById('range-puestos');
  const valPuestos = document.getElementById('val-puestos');
  const sumPuestos = document.getElementById('sum-puestos');
  const sumHoras = document.getElementById('sum-horas');
  const sumAddons = document.getElementById('sum-addons');
  const displayPrice = document.getElementById('display-price');
  const btnSendQuoteWA = document.getElementById('btn-send-quote-wa');

  const addonCCTV = document.getElementById('addon-cctv');
  const addonCanino = document.getElementById('addon-canino');
  const addonPatrulla = document.getElementById('addon-patrulla');
  const addonEscolta = document.getElementById('addon-escolta');

  let currentTurn = 24; // 24 or 12

  document.querySelectorAll('#turn-chips .chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#turn-chips .chip-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTurn = parseInt(btn.dataset.turn, 10);
      playSound('click');
      updateQuote();
    });
  });

  function updateQuote() {
    const puestos = parseInt(rangePuestos.value, 10);
    valPuestos.textContent = `${puestos} Puesto${puestos > 1 ? 's' : ''}`;

    // Base rate SuperVigilancia approx in COP
    const basePuesto24h = 5200000;
    const basePuesto12h = 3200000;
    const ratePerPost = currentTurn === 24 ? basePuesto24h : basePuesto12h;

    let subtotal = puestos * ratePerPost;
    const activeAddonsList = [];

    if (addonCCTV && addonCCTV.checked) {
      subtotal += 850000;
      activeAddonsList.push('CCTV IA');
    }
    if (addonCanino && addonCanino.checked) {
      subtotal += 1400000;
      activeAddonsList.push('Canino');
    }
    if (addonPatrulla && addonPatrulla.checked) {
      subtotal += 500000;
      activeAddonsList.push('Patrulla GPS');
    }
    if (addonEscolta && addonEscolta.checked) {
      subtotal += 2200000;
      activeAddonsList.push('Escolta VIP');
    }

    // Format COP
    const formattedPrice = '$ ' + subtotal.toLocaleString('es-CO');
    if (displayPrice) displayPrice.textContent = formattedPrice;

    if (sumPuestos) sumPuestos.textContent = `${puestos} Puesto${puestos > 1 ? 's' : ''} ${currentTurn}H`;
    if (sumHoras) sumHoras.textContent = currentTurn === 24 ? '24/7 Continuo (720 hrs/mes)' : '12H Diurno/Nocturno (360 hrs/mes)';
    if (sumAddons) sumAddons.textContent = activeAddonsList.length ? activeAddonsList.join(' + ') : 'Sin adicionales';

    playSound('hover');
  }

  if (rangePuestos) {
    rangePuestos.addEventListener('input', updateQuote);
  }
  [addonCCTV, addonCanino, addonPatrulla, addonEscolta].forEach(ch => {
    if (ch) ch.addEventListener('change', updateQuote);
  });

  if (btnSendQuoteWA) {
    btnSendQuoteWA.addEventListener('click', () => {
      playSound('click');
      const puestos = rangePuestos ? rangePuestos.value : '2';
      const precio = displayPrice ? displayPrice.textContent : '$ 11.850.000';
      const addons = sumAddons ? sumAddons.textContent : '';
      const text = `Hola GRUPO EMPRESARIAL SERUMA, generé una cotización web con los siguientes parámetros:\n\n` +
                   `🛡️ Puestos: ${puestos} (${currentTurn} Horas)\n` +
                   `➕ Módulos: ${addons}\n` +
                   `💰 Estimado Mensual: ${precio} COP\n\n` +
                   `Solicito contacto de un asesor comercial para formalizar propuesta y visita técnica.`;
      const url = `https://wa.me/573001234567?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    });
  }

  // -------------------------------------------------------------------------
  // 5. CCTV COMMAND VIRTUAL MATRIX
  // -------------------------------------------------------------------------
  const cctvClock = document.getElementById('cctv-clock');
  function updateCCTVClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    if (cctvClock) cctvClock.textContent = `${h}:${m}:${s} GMT-5`;
  }
  setInterval(updateCCTVClock, 1000);
  updateCCTVClock();

  // Cam tabs switcher
  const camTabs = document.querySelectorAll('.cam-tab');
  const feedBoxes = document.querySelectorAll('.feed-box');
  const cctvGrid = document.getElementById('cctvGrid');

  camTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      camTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      playSound('click');

      const cam = tab.dataset.cam;
      if (cam === 'all') {
        if (cctvGrid) cctvGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        feedBoxes.forEach(fb => fb.style.display = 'block');
      } else {
        if (cctvGrid) cctvGrid.style.gridTemplateColumns = '1fr';
        feedBoxes.forEach((fb, idx) => {
          fb.style.display = (idx + 1) === parseInt(cam, 10) ? 'block' : 'none';
        });
      }
    });
  });

  // Thermal & Night Vision toggles
  const terminalHud = document.querySelector('.cctv-terminal-hud');
  const toggleThermal = document.getElementById('toggle-thermal');
  const toggleNight = document.getElementById('toggle-night');

  if (toggleThermal) {
    toggleThermal.addEventListener('click', () => {
      playSound('click');
      terminalHud.classList.toggle('thermal-active');
      terminalHud.classList.remove('night-active');
    });
  }
  if (toggleNight) {
    toggleNight.addEventListener('click', () => {
      playSound('click');
      terminalHud.classList.toggle('night-active');
      terminalHud.classList.remove('thermal-active');
    });
  }

  // -------------------------------------------------------------------------
  // 6. COLOMBIA RADAR MAP TOOLTIPS
  // -------------------------------------------------------------------------
  const mapNodes = document.querySelectorAll('.map-node');
  const radarTooltip = document.getElementById('radarTooltip');
  const tipCity = document.getElementById('tipCity');
  const tipUnits = document.getElementById('tipUnits');
  const tipDesc = document.getElementById('tipDesc');

  mapNodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      playSound('radar');
      mapNodes.forEach(n => n.classList.remove('node-active'));
      node.classList.add('node-active');

      if (tipCity) tipCity.textContent = node.dataset.city;
      if (tipUnits) tipUnits.textContent = node.dataset.units;
      if (tipDesc) tipDesc.textContent = node.dataset.desc;
    });
  });

  // -------------------------------------------------------------------------
  // 7. TESTIMONIALS CAROUSEL
  // -------------------------------------------------------------------------
  const testiSlides = document.querySelectorAll('.testi-slide');
  const carDots = document.querySelectorAll('.car-dot');
  const carPrev = document.getElementById('carPrev');
  const carNext = document.getElementById('carNext');
  let currentTesti = 0;

  function showTesti(index) {
    if (index < 0) index = testiSlides.length - 1;
    if (index >= testiSlides.length) index = 0;
    currentTesti = index;

    testiSlides.forEach((s, i) => s.classList.toggle('active', i === currentTesti));
    carDots.forEach((d, i) => d.classList.toggle('active', i === currentTesti));
  }

  if (carPrev) {
    carPrev.addEventListener('click', () => {
      playSound('click');
      showTesti(currentTesti - 1);
    });
  }
  if (carNext) {
    carNext.addEventListener('click', () => {
      playSound('click');
      showTesti(currentTesti + 1);
    });
  }
  carDots.forEach(dot => {
    dot.addEventListener('click', () => {
      playSound('click');
      showTesti(parseInt(dot.dataset.index, 10));
    });
  });

  setInterval(() => {
    showTesti(currentTesti + 1);
  }, 6000);

  // -------------------------------------------------------------------------
  // 8. CONTACT LEAD FORM
  // -------------------------------------------------------------------------
  const leadForm = document.getElementById('leadForm');
  const formFeedback = document.getElementById('formFeedback');

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      playSound('success');

      if (formFeedback) {
        formFeedback.hidden = false;
        leadForm.reset();
        setTimeout(() => {
          formFeedback.hidden = true;
        }, 7000);
      }
    });
  }

  // -------------------------------------------------------------------------
  // 9. ANIMATED COUNTERS ON SCROLL
  // -------------------------------------------------------------------------
  const counters = document.querySelectorAll('.stat-counter');
  let animated = false;

  function runCounters() {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const speed = 40;
      const step = Math.ceil(target / speed);
      let count = 0;

      const timer = setInterval(() => {
        count += step;
        if (count >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = count;
        }
      }, 35);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        runCounters();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('stats');
  if (statsSection) observer.observe(statsSection);

  // -------------------------------------------------------------------------
  // 10. MOBILE MENU & HEADER SCROLL
  // -------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileClose = document.getElementById('mobileClose');
  const mobileOverlay = document.getElementById('mobileOverlay');

  if (mobileToggle && mobileOverlay) {
    mobileToggle.addEventListener('click', () => {
      mobileOverlay.classList.add('open');
      playSound('click');
    });
  }
  if (mobileClose && mobileOverlay) {
    mobileClose.addEventListener('click', () => {
      mobileOverlay.classList.remove('open');
      playSound('click');
    });
  }
  document.querySelectorAll('.mob-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileOverlay) mobileOverlay.classList.remove('open');
    });
  });

  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      if (navbar) navbar.classList.add('scrolled');
    } else {
      if (navbar) navbar.classList.remove('scrolled');
    }
  });

  // Footer Year
  const yearSpan = document.getElementById('year-span');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // PIP Video Expand / Retract
  const pipToggle = document.getElementById('pipToggle');
  const pipCard = document.getElementById('pipCard');
  if (pipToggle && pipCard) {
    pipToggle.addEventListener('click', () => {
      playSound('click');
      pipCard.classList.toggle('pip-expanded');
    });
  }

      // -------------------------------------------------------------------------
  // 12. CONTINUOUS 3D EYE VIDEO SCRUBBING & STAGE TRANSITIONS
  // -------------------------------------------------------------------------
  const TOTAL_EYE_FRAMES = 40;
  const eyeImages = [];
  let eyeImagesLoaded = 0;

  // ── FULLSCREEN HERO EYE CANVAS & CONTEXT ──
  const fsCanvas = document.getElementById('fullscreenEyeCanvas');
  const fsCtx = fsCanvas ? fsCanvas.getContext('2d') : null;

  function resizeFullscreenCanvas() {
    if (fsCanvas) {
      fsCanvas.width = window.innerWidth;
      fsCanvas.height = window.innerHeight;
    }
  }
  window.addEventListener('resize', resizeFullscreenCanvas, { passive: true });
  resizeFullscreenCanvas();

  // ── DRAW EYE COVER (CRISP, BRIGHT, 100% SHARP HERO CENTERPIECE) ──
  function drawEyeCover(ctx, img, cw, ch, px = 0, py = 0) {
    if (!img || !img.complete || !img.naturalWidth) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, cw, ch);
    const iw = img.naturalWidth || 1280;
    const ih = img.naturalHeight || 720;
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const ox = (cw - dw) / 2 + px;
    const oy = (ch - dh) / 2 + py;
    ctx.drawImage(img, ox, oy, dw, dh);
  }

  // ── GLOBAL SMOOTH MOUSE / TOUCH TRACKER ──
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      targetX = e.touches[0].clientX;
      targetY = e.touches[0].clientY;
    }
  }, { passive: true });

  // ── HUD RETICLES & TELEMETRY ──
  const reticleEl = document.getElementById('heroReticleTracker');
  const reticleDegEl = document.getElementById('heroReticleDeg');
  const telemetryEl = document.getElementById('heroEyeTelemetryText');

  // ── CCTV Eye (feeds) ──
  const cctvEyeCanvas = document.getElementById('cctvEyeCanvas');
  const cctvEyeCtx = cctvEyeCanvas ? cctvEyeCanvas.getContext('2d') : null;
  const cctvEyeAngle = document.getElementById('cctvEyeAngle');
  const cctvEyeBox = document.getElementById('cctvEyeBox');

  // ── 6 IMMERSIVE 3D STAGE DECKS ──
  const STAGES = [
    { id: 'hero',       name: 'INICIO',         targetFrame: 0,  label: 'VENTANA 01/06 · VISTA PERIMETRAL EXTERIOR' },
    { id: 'servicios',  name: 'SERVICIOS',      targetFrame: 10, label: 'VENTANA 02/06 · MATRIZ DE SERVICIOS TÁCTICOS 360°' },
    { id: 'cotizador',  name: 'COTIZADOR 3D',   targetFrame: 20, label: 'VENTANA 03/06 · SIMULADOR Y COTIZADOR 3D' },
    { id: 'monitoreo',  name: 'COMANDO CCTV',   targetFrame: 30, label: 'VENTANA 04/06 · CENTRO DE COMANDO CCTV BIOMÉTRICO' },
    { id: 'cobertura',  name: 'COBERTURA RADAR',targetFrame: 36, label: 'VENTANA 05/06 · RADAR DE COBERTURA NACIONAL' },
    { id: 'contacto',   name: 'DESPACHO VIP',   targetFrame: 39, label: 'VENTANA 06/06 · TERMINAL DE DESPACHO INMEDIATO' }
  ];

  let currentStage = 0;
  let targetVirtualDepth = 0; // continuous 0.0 to 5.0
  let currentVirtualDepth = 0;
  let currentEyeFrame = 0;

  // ── PRELOAD 40 EYE FRAMES ──
  for (let i = 1; i <= TOTAL_EYE_FRAMES; i++) {
    const img = new Image();
    const num = String(i).padStart(3, '0');
    img.src = `EYE_FRAMES/ezgif-frame-${num}.jpg`;
    img.onerror = () => { img.src = `MATERIAL/eye_frames/ezgif-frame-${num}.jpg`; };
    img.onload = () => {
      eyeImagesLoaded++;
      if (eyeImagesLoaded === 1 && fsCtx && fsCanvas) {
        drawEyeCover(fsCtx, img, fsCanvas.width, fsCanvas.height);
      }
    };
    eyeImages.push(img);
  }

  // ── TRANSITION TO STAGE FUNCTION ──
  function applyActiveStage(activeIdx) {
    if (activeIdx < 0) activeIdx = 0;
    if (activeIdx >= STAGES.length) activeIdx = STAGES.length - 1;
    currentStage = activeIdx;

    STAGES.forEach((st, idx) => {
      const el = document.getElementById(st.id);
      if (el) {
        el.classList.remove('stage-active', 'stage-exit-forward', 'stage-exit-backward');
        if (idx === activeIdx) {
          el.classList.add('stage-active');
        } else if (idx < activeIdx) {
          el.classList.add('stage-exit-forward');
        } else {
          el.classList.add('stage-exit-backward');
        }
      }
    });

    // Update navbar active pill
    document.querySelectorAll('.nav-menu .nav-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href.replace('#', '') === STAGES[activeIdx].id) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update vertical HUD dots
    document.querySelectorAll('.hud-win-dot').forEach((dot, dotIdx) => {
      if (dotIdx === activeIdx) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update Telemetry badge
    if (telemetryEl && !telemetryEl.style.color) {
      const zoomPct = Math.round((STAGES[activeIdx].targetFrame / (TOTAL_EYE_FRAMES - 1)) * 100);
      telemetryEl.textContent = `${STAGES[activeIdx].label} · ${zoomPct}% PROFUNDIDAD`;
    }
  }

  function goToStage(idx) {
    idx = Math.max(0, Math.min(STAGES.length - 1, idx));
    targetVirtualDepth = idx;
    applyActiveStage(idx);
  }

  // ── CONTINUOUS MOUSE WHEEL SCRUBBING ──
  // Every wheel delta smoothly scrubs the eye video frames AND transitions stages!
  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    const speed = 0.0028; // Smooth continuous sensitivity
    targetVirtualDepth = Math.max(0, Math.min(STAGES.length - 1, targetVirtualDepth + e.deltaY * speed));
    const nearestStage = Math.round(targetVirtualDepth);
    if (nearestStage !== currentStage) {
      applyActiveStage(nearestStage);
    }
  }, { passive: false });

  // ── TOUCH SWIPE SUPPORT ──
  let touchStart = 0;
  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) touchStart = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      const diff = touchStart - e.touches[0].clientY;
      touchStart = e.touches[0].clientY;
      targetVirtualDepth = Math.max(0, Math.min(STAGES.length - 1, targetVirtualDepth + diff * 0.005));
      const nearestStage = Math.round(targetVirtualDepth);
      if (nearestStage !== currentStage) {
        applyActiveStage(nearestStage);
      }
    }
  }, { passive: true });

  // ── KEYBOARD NAVIGATION ──
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      goToStage(currentStage + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      goToStage(currentStage - 1);
    }
  });

  // ── CLICKING NAVBAR & DOTS NAVIGATES STAGES ──
  document.querySelectorAll('.nav-menu .nav-link, .hud-win-dot').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href') || '';
      const targetId = href.replace('#', '');
      const stageIdx = STAGES.findIndex(s => s.id === targetId);
      if (stageIdx !== -1) {
        goToStage(stageIdx);
      }
    });
  });

  // Initialize stage 0 active
  applyActiveStage(0);

  function renderEyeTracker() {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;

    // ── 0. PERSISTENT 3D EYE (ZOOMS AS YOU ENTER EACH STAGE) ──
    currentVirtualDepth += (targetVirtualDepth - currentVirtualDepth) * 0.12;
    const targetFrameForDepth = (currentVirtualDepth / (STAGES.length - 1)) * (TOTAL_EYE_FRAMES - 1);
    currentEyeFrame += (targetFrameForDepth - currentEyeFrame) * 0.20;
    const frameIndex = Math.min(TOTAL_EYE_FRAMES - 1, Math.max(0, Math.round(currentEyeFrame)));

    if (fsCanvas && fsCtx) {
      const img = eyeImages[frameIndex];
      if (img && img.complete && img.naturalWidth) {
        // Subtle mouse parallax for immersive 3D depth
        const parallaxX = (currentX - window.innerWidth / 2) * 0.025;
        const parallaxY = (currentY - window.innerHeight / 2) * 0.025;
        drawEyeCover(fsCtx, img, fsCanvas.width, fsCanvas.height, parallaxX, parallaxY);
      }

      // ── Reticle follows cursor ──
      if (reticleEl) {
        reticleEl.style.left = currentX + 'px';
        reticleEl.style.top  = currentY + 'px';
      }
      const zoomPct = Math.round((currentEyeFrame / (TOTAL_EYE_FRAMES - 1)) * 100);
      if (reticleDegEl) reticleDegEl.textContent = `INMERSIÓN: ${zoomPct}%`;
      if (telemetryEl && !telemetryEl.style.color) {
        telemetryEl.textContent = `ESCÁNER OCULAR 3D: ${zoomPct}% PROFUNDIDAD RETINAL`;
      }
    }

    // ── 1. CCTV Eye ──
    if (cctvEyeCanvas && cctvEyeCtx) {
      const cctvRect = cctvEyeCanvas.getBoundingClientRect();
      if (cctvRect.bottom >= -100 && cctvRect.top <= window.innerHeight + 100) {
        const eyeCx = cctvRect.left + cctvRect.width  * 0.46;
        const eyeCy = cctvRect.top  + cctvRect.height * 0.50;
        const dx = currentX - eyeCx;
        const dy = currentY - eyeCy;

        let deg = Math.atan2(dy, dx) * (180 / Math.PI);
        if (deg < 0) deg += 360;

        let frame = Math.round(5 + (deg / 360) * TOTAL_EYE_FRAMES);
        while (frame > TOTAL_EYE_FRAMES) frame -= TOTAL_EYE_FRAMES;
        while (frame < 1) frame += TOTAL_EYE_FRAMES;

        const img = eyeImages[frame - 1];
        if (img && img.complete && img.naturalWidth) {
          drawEyeCover(cctvEyeCtx, img, cctvEyeCanvas.width, cctvEyeCanvas.height);
        }
        if (cctvEyeAngle) cctvEyeAngle.textContent = `ÁNGULO: ${Math.round(deg)}° · ACTIVO`;
        if (cctvEyeBox) {
          const moveX = (dx / window.innerWidth)  * 35;
          const moveY = (dy / window.innerHeight) * 25;
          cctvEyeBox.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
      }
    }

    requestAnimationFrame(renderEyeTracker);
  }

  requestAnimationFrame(renderEyeTracker);

  // 11. DYNAMIC SCROLL-VELOCITY MARQUEE EFFECT
  let lastScrollTop = 0;
  let scrollSpeedTimeout = null;
  const marqueeTracks = document.querySelectorAll('.yventu-bg-marquee-track, .kinetic-ribbon-track, .ticker-track');

  window.addEventListener('scroll', () => {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    const diff = Math.abs(st - lastScrollTop);
    lastScrollTop = st <= 0 ? 0 : st;

    if (diff > 4) {
      marqueeTracks.forEach(track => {
        track.style.animationDuration = '14s';
      });
      clearTimeout(scrollSpeedTimeout);
      scrollSpeedTimeout = setTimeout(() => {
        marqueeTracks.forEach(track => {
          track.style.animationDuration = '';
        });
      }, 350);
    }
  }, { passive: true });
});
