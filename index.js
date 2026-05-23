// ============================================================
//  PREMIUM PORTFOLIO — index.js
//  Optimized, GPU-friendly, production-ready
// ============================================================

'use strict';

/* ============================================================
   DEVICE / CAPABILITY DETECTION
   ============================================================ */
const Device = {
  isMobile:  window.innerWidth < 900,
  isTablet:  window.innerWidth < 1100 && window.innerWidth >= 900,
  isLowEnd:  (navigator.hardwareConcurrency || 4) <= 2,
  prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
};

const canAnimate = !Device.prefersReducedMotion;

/* ============================================================
   EASING UTILITIES
   ============================================================ */
const Ease = {
  outExpo:    t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  outQuart:   t => 1 - Math.pow(1 - t, 4),
  outElastic: t => {
    if (t === 0 || t === 1) return t;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI / 3)) + 1;
  },
};

/* ============================================================
   RAF-BASED ANIMATION HELPER
   ============================================================ */
function animate({ duration, easing = Ease.outExpo, onUpdate, onComplete }) {
  const start = performance.now();
  function tick(now) {
    const elapsed = now - start;
    const t = Math.min(elapsed / duration, 1);
    onUpdate(easing(t), t);
    if (t < 1) requestAnimationFrame(tick);
    else if (onComplete) onComplete();
  }
  requestAnimationFrame(tick);
}

/* ============================================================
   CANVAS PARTICLES
   ============================================================ */
(function initParticles() {
  if (Device.isMobile || !canAnimate) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext('2d', { alpha: true });

  let W, H;
  const COUNT = Device.isLowEnd ? 24 : 48;
  let particles = [];
  const mouse = { x: -1000, y: -1000 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  }, { passive: true });

  class Particle {
    constructor(initial = false) {
      this.x = Math.random() * (W || 1200);
      this.y = initial ? Math.random() * (H || 800) : (H || 800) + 10;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = -(Math.random() * 0.45 + 0.15);
      this.r  = Math.random() * 1.4 + 0.4;
      this.maxAlpha = Math.random() * 0.35 + 0.08;
      this.alpha = 0;
      this.life = 0;
      this.maxLife = Math.random() * 450 + 200;
    }

    update() {
      // Soft mouse repulsion
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const d = Math.hypot(dx, dy);
      if (d < 90 && d > 0) {
        const f = ((90 - d) / 90) * 0.3;
        this.vx += (dx / d) * f * 0.15;
        this.vy += (dy / d) * f * 0.15;
      }
      this.vx *= 0.985; this.vy *= 0.985;
      this.x  += this.vx; this.y  += this.vy;
      this.life++;
      const lt = this.life / this.maxLife;
      this.alpha = lt < 0.12 ? (lt / 0.12) * this.maxAlpha
                 : lt > 0.75 ? ((1 - lt) / 0.25) * this.maxAlpha
                 : this.maxAlpha;
    }

    draw() {
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = '#00ff6a';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
    }

    isDead() { return this.y < -20 || this.life > this.maxLife; }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle(true));

  // Throttled mouse
  let mouseFrame = false;
  document.addEventListener('mousemove', e => {
    if (mouseFrame) return;
    mouseFrame = true;
    mouse.x = e.clientX; mouse.y = e.clientY;
    requestAnimationFrame(() => { mouseFrame = false; });
  }, { passive: true });

  // Connection lines pool
  function drawConnections() {
    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < Math.min(particles.length, i + 6); j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 5400) { // 73^2
          const alpha = (1 - Math.sqrt(d2) / 73) * 0.06;
          ctx.strokeStyle = `rgba(0,255,106,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    drawConnections();
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].isDead()) {
        particles[i] = new Particle();
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }
  loop();

  // Click burst
  window.addEventListener('click', e => {
    if (Device.isLowEnd) return;
    const count = 10;
    for (let i = 0; i < count; i++) {
      const p = new Particle();
      p.x = e.clientX; p.y = e.clientY;
      const angle = (Math.PI * 2 / count) * i;
      const speed = Math.random() * 2.5 + 1;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.r = Math.random() * 2 + 1;
      p.maxAlpha = 0.8; p.alpha = 0.8; p.maxLife = 60;
      particles.push(p);
    }
    if (particles.length > COUNT + 40) particles.splice(0, particles.length - COUNT);
  });
})();

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
(function initCursor() {
  if (Device.isMobile) return;

  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;
  const LERP = 0.1;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  document.addEventListener('mousedown', () => {
    dot.classList.add('clicked');
    ring.style.transform = `translate(-50%,-50%) scale(0.8)`;
  });
  document.addEventListener('mouseup', () => {
    dot.classList.remove('clicked');
    ring.style.transform = `translate(-50%,-50%) scale(1)`;
  });

  const hoverSel = 'a, button, .service-card, .tool-chip, .ty-social-btn, .whatsapp-float, .scroll-top, .stat-item, .nav-progress-dot';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverSel)) {
      dot.classList.add('hovered');
      ring.classList.add('hovered');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverSel)) {
      dot.classList.remove('hovered');
      ring.classList.remove('hovered');
    }
  });

  function cursorLoop() {
    rx += (mx - rx) * LERP;
    ry += (my - ry) * LERP;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(cursorLoop);
  }
  cursorLoop();

  // Subtle trail sparks
  if (!Device.isLowEnd) {
    let lastSpark = 0;
    document.addEventListener('mousemove', e => {
      const now = performance.now();
      if (now - lastSpark < 90) return;
      lastSpark = now;
      const s = document.createElement('div');
      const sz = Math.random() * 3 + 1.5;
      s.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;
        width:${sz}px;height:${sz}px;background:rgba(0,255,106,0.35);
        border-radius:50%;pointer-events:none;z-index:99990;
        transform:translate(-50%,-50%);will-change:opacity,transform;`;
      document.body.appendChild(s);
      let a = 0.55;
      function fadeOut() {
        a -= 0.07;
        if (a <= 0) { s.remove(); return; }
        s.style.opacity = a;
        s.style.transform = `translate(-50%,-50%) scale(${1 - (0.55 - a) * 1.5})`;
        requestAnimationFrame(fadeOut);
      }
      requestAnimationFrame(fadeOut);
    }, { passive: true });
  }
})();

/* ============================================================
   SPOTLIGHT EFFECT
   ============================================================ */
(function initSpotlight() {
  if (Device.isMobile || Device.isLowEnd) return;
  const el = document.createElement('div');
  el.id = 'spotlight';
  document.body.appendChild(el);

  let throttled = false;
  document.addEventListener('mousemove', e => {
    if (throttled) return;
    throttled = true;
    requestAnimationFrame(() => {
      el.style.setProperty('--mx', e.clientX + 'px');
      el.style.setProperty('--my', e.clientY + 'px');
      throttled = false;
    });
  }, { passive: true });
})();

/* ============================================================
   RIPPLE CLICK EFFECT
   ============================================================ */
document.addEventListener('click', e => {
  if (Device.isMobile) return;
  const r = document.createElement('div');
  r.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;
    width:0;height:0;border-radius:50%;
    border:1px solid rgba(0,255,106,0.45);
    transform:translate(-50%,-50%);pointer-events:none;z-index:99996;`;
  document.body.appendChild(r);
  let size = 0, a = 0.7;
  function grow() {
    size += 12; a -= 0.035;
    if (a <= 0) { r.remove(); return; }
    r.style.width  = size + 'px';
    r.style.height = size + 'px';
    r.style.opacity = a;
    requestAnimationFrame(grow);
  }
  requestAnimationFrame(grow);
});

/* ============================================================
   LOADING SCREEN
   ============================================================ */
(function initLoader() {
  const loader   = document.getElementById('loader');
  const bar      = document.getElementById('loaderBar');
  const glow     = document.getElementById('loaderGlow');
  const pctEl    = document.getElementById('loaderPct');
  const labelEl  = document.getElementById('loaderLabel');
  const navbar   = document.getElementById('navbar');
  if (!loader) return;

  const labels = ['Initializing…', 'Loading assets…', 'Building experience…', 'Almost there…', 'Welcome ✦'];
  let pct = 0;
  let done = false;

  function setProgress(value) {
    if (bar)   bar.style.width   = value + '%';
    if (glow)  glow.style.width  = value + '%';
    if (pctEl) pctEl.textContent = Math.floor(value) + '%';
    const li = Math.min(Math.floor((value / 100) * (labels.length - 1)), labels.length - 1);
    if (labelEl) labelEl.textContent = labels[li];
  }

  function advance() {
    if (done) return;
    const step = Math.random() * 14 + 6;
    pct = Math.min(pct + step, 100);
    setProgress(pct);
    if (pct < 100) {
      setTimeout(advance, Math.random() * 75 + 35);
    } else {
      done = true;
      setTimeout(finish, 600);
    }
  }

  function finish() {
    loader.style.opacity = '0';
    loader.style.transition = 'opacity 0.7s cubic-bezier(0.22,1,0.36,1)';
    setTimeout(() => {
      loader.classList.add('hidden');
      loader.style.display = 'none';
      if (navbar) navbar.classList.add('visible');
      revealHero();
    }, 700);
  }

  function revealHero() {
    const items = [
      { id: 'heroEyebrow',  delay: 0 },
      { id: 'heroName',     delay: 180 },
      { id: 'heroRole',     delay: 380 },
      { id: 'heroDesc',     delay: 520 },
      { id: 'heroBtns',     delay: 660 },
      { id: 'heroMetrics',  delay: 800 },
      { id: 'heroRight',    delay: 280 },
      { id: 'heroScroll',   delay: 1000 },
    ];
    items.forEach(({ id, delay }) => {
      const el = document.getElementById(id);
      if (!el) return;
      setTimeout(() => {
        el.style.transition = 'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)';
        el.style.opacity = '1';
        el.style.transform = 'none';
      }, delay);
    });
  }

  window.addEventListener('load', () => setTimeout(advance, 100));
  setTimeout(() => { if (!done && pct === 0) advance(); }, 400);
})();

/* ============================================================
   MOBILE MENU
   ============================================================ */
(function initMobileMenu() {
  const hamburger  = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ============================================================
   SCROLL REVEAL — Intersection Observer
   ============================================================ */
(function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-img-left, .reveal-img-right');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.revealDelay || 0);
        setTimeout(() => el.classList.add('visible'), delay);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -24px 0px' });

  els.forEach(el => obs.observe(el));
})();

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
(function initCounters() {
  const statsEl = document.querySelector('.about-stats');
  if (!statsEl) return;
  let animated = false;

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      obs.disconnect();
      statsEl.querySelectorAll('.stat-num[data-target]').forEach((el, i) => {
        const target = parseInt(el.dataset.target);
        if (isNaN(target)) return;
        setTimeout(() => {
          animate({
            duration: 1600,
            easing: Ease.outExpo,
            onUpdate: (p) => { el.textContent = Math.floor(p * target); },
            onComplete: () => { el.textContent = target; },
          });
        }, i * 150);
      });
    }
  }, { threshold: 0.4 });

  obs.observe(statsEl);
})();

/* ============================================================
   NAVBAR SCROLL EFFECTS
   ============================================================ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 40);
    lastY = y;
  }, { passive: true });
})();

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ============================================================
   SCROLL TO TOP
   ============================================================ */
(function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ============================================================
   SECTION PROGRESS DOTS
   ============================================================ */
(function initProgressDots() {
  if (Device.isMobile) return;
  const container = document.getElementById('navProgress');
  if (!container) return;

  const sectionIds = ['home', 'about', 'tools', 'experience', 'services', 'contact', 'thankyou'];
  const dots = [];

  sectionIds.forEach(id => {
    const dot = document.createElement('button');
    dot.className = 'nav-progress-dot';
    dot.setAttribute('aria-label', `Go to ${id}`);
    dot.addEventListener('click', () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
    container.appendChild(dot);
    dots.push({ dot, id });
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const found = dots.find(d => d.id === e.target.id);
      if (found) found.dot.classList.toggle('active', e.isIntersecting);
    });
  }, { threshold: 0.5 });

  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) obs.observe(el);
  });
})();

/* ============================================================
   ACTIVE NAV LINK
   ============================================================ */
(function initActiveNav() {
  const sections    = document.querySelectorAll('section[id]');
  const navLinks    = document.querySelectorAll('.nav-links a');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.toggle('nav-active', l.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(s => obs.observe(s));
})();

/* ============================================================
   PARALLAX (throttled via RAF)
   ============================================================ */
(function initParallax() {
  if (Device.isMobile || !canAnimate) return;

  const heroGrid   = document.querySelector('.hero-grid-lines');
  const ambient1   = document.querySelector('.hero-ambient-1');
  const ambient2   = document.querySelector('.hero-ambient-2');

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (heroGrid)  heroGrid.style.transform  = `translateY(${y * 0.22}px)`;
      if (ambient1)  ambient1.style.transform   = `translateY(${y * 0.12}px)`;
      if (ambient2)  ambient2.style.transform   = `translateY(${y * -0.08}px)`;
      ticking = false;
    });
  }, { passive: true });
})();

/* ============================================================
   3D TILT — Hero Image
   ============================================================ */
(function initHeroTilt() {
  if (Device.isMobile || !canAnimate) return;
  const scene = document.querySelector('.hero-photo-scene');
  const frame = document.querySelector('.hero-photo-frame');
  if (!scene || !frame) return;

  let ticking = false;
  scene.addEventListener('mousemove', e => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const r = scene.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 2;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 2;
      frame.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 7}deg) scale(1.02)`;
      frame.style.transition = 'transform 0.08s ease';
      ticking = false;
    });
  });
  scene.addEventListener('mouseleave', () => {
    frame.style.transform = '';
    frame.style.transition = 'transform 0.8s cubic-bezier(0.22,1,0.36,1)';
  });
})();

/* ============================================================
   3D TILT — Service Cards
   ============================================================ */
(function initCardTilts() {
  if (Device.isMobile || !canAnimate) return;
  document.querySelectorAll('.service-card').forEach(card => {
    let ticking = false;
    card.addEventListener('mousemove', e => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width  - 0.5) * 2;
        const y = ((e.clientY - r.top)  / r.height - 0.5) * 2;
        card.style.transform = `perspective(600px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateY(-4px)`;
        card.style.transition = 'transform 0.08s ease, box-shadow 0.2s';
        card.style.boxShadow = `${-x * 8}px ${-y * 8}px 32px rgba(0,0,0,0.3), 0 0 24px rgba(0,255,106,0.05)`;
        ticking = false;
      });
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.boxShadow  = '';
      card.style.transition = 'transform 0.7s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s';
    });
  });
})();

/* ============================================================
   3D TILT — About Photo
   ============================================================ */
(function initAboutPhotoTilt() {
  if (Device.isMobile || !canAnimate) return;
  const el = document.querySelector('.about-photo-wrap');
  if (!el) return;
  let ticking = false;
  el.addEventListener('mousemove', e => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 2;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 2;
      el.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 5}deg) scale(1.02)`;
      el.style.transition = 'transform 0.1s ease';
      ticking = false;
    });
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform  = '';
    el.style.transition = 'transform 0.8s cubic-bezier(0.22,1,0.36,1)';
  });
})();

/* ============================================================
   MAGNETIC BUTTONS
   ============================================================ */
(function initMagnetic() {
  if (Device.isMobile || !canAnimate) return;
  const targets = document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta, .ty-social-btn, .tool-chip');
  targets.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r   = btn.getBoundingClientRect();
      const dx  = e.clientX - r.left - r.width / 2;
      const dy  = e.clientY - r.top  - r.height / 2;
      const str = Math.max(0, 1 - Math.hypot(dx, dy) / (Math.max(r.width, r.height))) * 0.22;
      btn.style.transform = `translate(${dx * str}px, ${dy * str}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.6s cubic-bezier(0.22,1,0.36,1)';
      btn.style.transform  = '';
      setTimeout(() => { btn.style.transition = ''; }, 600);
    });
  });
})();

/* ============================================================
   TEXT SCRAMBLE — Experience Companies
   ============================================================ */
class TextScramble {
  constructor(el) {
    this.el    = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#@';
    this._frame = null;
  }

  setText(text) {
    const current = this.el.textContent;
    const len = Math.max(current.length, text.length);
    cancelAnimationFrame(this._frame);
    let frame = 0;
    const queue = Array.from({ length: len }, (_, i) => ({
      from:  current[i] || '',
      to:    text[i] || '',
      start: Math.floor(Math.random() * 10),
      end:   Math.floor(Math.random() * 10) + 8,
      char:  '',
    }));
    const update = () => {
      let out = '', done = 0;
      for (const q of queue) {
        if (frame >= q.end) {
          done++;
          out += q.to;
        } else if (frame >= q.start) {
          if (!q.char || Math.random() < 0.28) {
            q.char = this.chars[Math.floor(Math.random() * this.chars.length)];
          }
          out += `<span style="color:rgba(0,255,106,0.6)">${q.char}</span>`;
        } else { out += q.from; }
      }
      this.el.innerHTML = out;
      frame++;
      if (done < queue.length) this._frame = requestAnimationFrame(update);
    };
    update();
  }
}

(function initExpScramble() {
  document.querySelectorAll('.exp-company').forEach(el => {
    const orig = el.textContent;
    const sc   = new TextScramble(el);
    const item = el.closest('.exp-item');
    if (item) {
      item.addEventListener('mouseenter', () => sc.setText(orig));
      item.addEventListener('mouseleave', () => { sc.el.textContent = orig; });
    }
  });
})();

/* ============================================================
   STAGGER — Tool Chips
   ============================================================ */
(function staggerToolChips() {
  const chips = document.querySelectorAll('.tool-chip');
  chips.forEach((c, i) => {
    c.style.opacity   = '0';
    c.style.transform = 'translateY(18px)';
  });

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      chips.forEach((c, i) => {
        setTimeout(() => {
          c.style.transition = `opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)`;
          c.style.opacity    = '1';
          c.style.transform  = '';
        }, i * 80);
      });
      obs.disconnect();
    }
  }, { threshold: 0.2 });

  const section = document.getElementById('tools');
  if (section) obs.observe(section);
})();

/* ============================================================
   STAGGER — Service Cards
   ============================================================ */
(function staggerServiceCards() {
  const cards = document.querySelectorAll('.service-card');
  cards.forEach(c => {
    c.style.opacity   = '0';
    c.style.transform = 'translateY(36px) scale(0.98)';
  });

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      cards.forEach((c, i) => {
        setTimeout(() => {
          c.style.transition = `opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1)`;
          c.style.opacity    = '1';
          c.style.transform  = '';
        }, i * 70);
      });
      obs.disconnect();
    }
  }, { threshold: 0.04 });

  const section = document.getElementById('services');
  if (section) obs.observe(section);
})();

/* ============================================================
   STAGGER — Experience Items
   ============================================================ */
(function staggerExpItems() {
  const items = document.querySelectorAll('.exp-item');
  items.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateX(-32px)';
  });

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      items.forEach((el, i) => {
        setTimeout(() => {
          el.style.transition = `opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1)`;
          el.style.opacity    = '1';
          el.style.transform  = '';
        }, i * 110);
      });
      obs.disconnect();
    }
  }, { threshold: 0.08 });

  const section = document.getElementById('experience');
  if (section) obs.observe(section);
})();

/* ============================================================
   MARQUEE — pause on hover
   ============================================================ */
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
  marqueeTrack.addEventListener('mouseenter', () => marqueeTrack.style.animationPlayState = 'paused');
  marqueeTrack.addEventListener('mouseleave', () => marqueeTrack.style.animationPlayState = 'running');
}

/* ============================================================
   WHATSAPP MAGNETIC
   ============================================================ */
(function initWaMagnetic() {
  if (Device.isMobile) return;
  const wa = document.querySelector('.whatsapp-float');
  if (!wa) return;
  wa.addEventListener('mousemove', e => {
    const r  = wa.getBoundingClientRect();
    const dx = e.clientX - r.left - r.width / 2;
    const dy = e.clientY - r.top  - r.height / 2;
    wa.style.transform = `translate(${dx * 0.35}px, ${dy * 0.35}px) scale(1.12)`;
    wa.style.animation = 'none';
  });
  wa.addEventListener('mouseleave', () => {
    wa.style.transform = '';
    wa.style.animation = '';
  });
})();

/* ============================================================
   LAZY IMAGES
   ============================================================ */
document.querySelectorAll('img').forEach(img => {
  const aboveFold = img.closest('#loader, #home, nav');
  if (!aboveFold) { img.loading = 'lazy'; img.decoding = 'async'; }
  else img.fetchpriority = 'high';
});

/* ============================================================
   THANK YOU FIREWORKS
   ============================================================ */
(function initFireworks() {
  if (Device.isMobile || !canAnimate) return;
  const ty = document.getElementById('thankyou');
  if (!ty) return;
  let fired = false;

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !fired) {
      fired = true;
      obs.disconnect();

      function burst(bx, by) {
        for (let i = 0; i < 16; i++) {
          const p   = document.createElement('div');
          const angle = (Math.PI * 2 / 16) * i;
          const spd   = Math.random() * 3 + 1.5;
          const hue   = Math.random() * 60 + 100;
          const sz    = Math.random() * 3 + 2;
          p.style.cssText = `position:fixed;left:${bx}px;top:${by}px;
            width:${sz}px;height:${sz}px;border-radius:50%;
            background:hsl(${hue},100%,60%);
            pointer-events:none;z-index:99995;
            transform:translate(-50%,-50%);`;
          document.body.appendChild(p);
          let t = 0;
          const vx = Math.cos(angle) * spd, vy = Math.sin(angle) * spd;
          (function anim() {
            t += 0.035;
            const opacity = Math.max(0, 1 - t * 1.4);
            p.style.left    = (bx + vx * t * 55) + 'px';
            p.style.top     = (by + vy * t * 55 + 70 * t * t) + 'px';
            p.style.opacity = opacity;
            if (opacity > 0) requestAnimationFrame(anim);
            else p.remove();
          })();
        }
      }

      for (let b = 0; b < 3; b++) {
        setTimeout(() => {
          burst(
            Math.random() * window.innerWidth * 0.6 + window.innerWidth * 0.2,
            Math.random() * window.innerHeight * 0.4 + 80
          );
        }, b * 400);
      }
    }
  }, { threshold: 0.3 });

  obs.observe(ty);
})();

/* ============================================================
   FOOTER YEAR
   ============================================================ */
const footerCopy = document.querySelector('.footer-copy');
if (footerCopy) {
  footerCopy.textContent = footerCopy.textContent.replace('2025', new Date().getFullYear());
}

/* ============================================================
   INJECT RUNTIME STYLES
   ============================================================ */
(function injectStyles() {
  const s = document.createElement('style');
  s.textContent = `
    .nav-links a.nav-active {
      color: var(--green) !important;
    }
    .nav-links a.nav-active::before {
      clip-path: inset(0 0% 0 0) !important;
    }
    .exp-item:hover { cursor: default; }

    /* Focus styles for accessibility */
    *:focus-visible {
      outline: 2px solid var(--green);
      outline-offset: 3px;
    }

    /* Selection */
    ::selection { background: rgba(0,255,106,0.25); color: var(--white); }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: var(--black); }
    ::-webkit-scrollbar-thumb { background: var(--gray-2); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--green); }

    /* About photo scene overflow fix */
    .about-photo-scene { overflow: visible !important; }

    /* Contact photo frame smooth transition */
    .contact-photo-frame { transition: transform 0.6s cubic-bezier(0.22,1,0.36,1); }
    .contact-photo-frame:hover { transform: scale(1.01) rotateY(-2deg); }

    /* Skill tags pointer */
    .skill-tag { cursor: default; }

    /* Float cards subtle glow on hover */
    .float-card:hover { border-color: rgba(0,255,106,0.5); }
  `;
  document.head.appendChild(s);
})();

console.log('%c✦ ABDULRAHMAN MURAD — Premium Portfolio Loaded ✦', 'color:#00ff6a;font-size:14px;font-weight:700;letter-spacing:2px;');