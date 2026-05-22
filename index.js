// ============================================================
//  OPTIMIZED ANIMATIONS — index.js (PERFORMANCE EDITION)
// ============================================================

// ===== EASING =====
const Ease = {
  outExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  outElastic: t => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }
};

// ===== DEVICE DETECTION — تقليل الأنيميشن على الموبايل =====
const isMobile = window.innerWidth < 900;
const isLowEnd = navigator.hardwareConcurrency <= 2 || isMobile;

// ===== CANVAS PARTICLES — مخفّفة جداً =====
(function initParticles() {
  // إلغاء الجسيمات على الموبايل والأجهزة الضعيفة
  if (isMobile) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;';
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: false });

  let W, H;
  // ✅ تخفيض من 120 إلى 40 جسيمة
  const NUM = isLowEnd ? 20 : 40;
  let particles = [];
  let mouse = { x: -1000, y: -1000 };

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();

  // ✅ Debounce resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  });

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : H + 10;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -(Math.random() * 0.5 + 0.2);
      this.r = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.4 + 0.1;
      this.maxAlpha = this.alpha;
      this.life = 0;
      this.maxLife = Math.random() * 400 + 200;
    }
    update() {
      // Mouse repulsion — فقط لو قريب جداً
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const d = Math.hypot(dx, dy);
      if (d < 100) {
        const f = (100 - d) / 100 * 0.5;
        this.vx += (dx / d) * f * 0.2;
        this.vy += (dy / d) * f * 0.2;
      }
      this.vx *= 0.98; this.vy *= 0.98;
      this.x += this.vx; this.y += this.vy;
      this.life++;
      const lt = this.life / this.maxLife;
      this.alpha = lt < 0.1 ? lt * 10 * this.maxAlpha : lt > 0.8 ? (1 - (lt - 0.8) * 5) * this.maxAlpha : this.maxAlpha;
      if (this.y < -20 || this.life > this.maxLife) this.reset();
    }
    draw() {
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = `rgba(0,255,106,0.9)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < NUM; i++) particles.push(new Particle());

  // ✅ Throttle mouse update
  let mouseThrottle = false;
  document.addEventListener('mousemove', e => {
    if (mouseThrottle) return;
    mouseThrottle = true;
    mouse.x = e.clientX; mouse.y = e.clientY;
    setTimeout(() => mouseThrottle = false, 50);
  }, { passive: true });

  // ✅ استخدام RAF واحد بدل loop مع callbacks
  let animId;
  function loop() {
    ctx.clearRect(0, 0, W, H);

    // ✅ Connection lines — فقط بين الجسيمات القريبة من بعض
    ctx.globalAlpha = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < Math.min(particles.length, i + 8); j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.hypot(dx, dy);
        if (d < 80) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,255,106,${(1 - d / 80) * 0.08})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
      particles[i].update();
      particles[i].draw();
    }
    ctx.globalAlpha = 1;
    animId = requestAnimationFrame(loop);
  }
  loop();

  // Click explosion — مخفّف
  window.addEventListener('click', e => {
    const count = isLowEnd ? 6 : 12;
    for (let i = 0; i < count; i++) {
      const p = new Particle();
      p.x = e.clientX; p.y = e.clientY;
      const angle = (Math.PI * 2 / count) * i;
      const speed = Math.random() * 3 + 1;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.r = Math.random() * 2 + 1;
      p.maxAlpha = 0.7;
      p.alpha = 0.7;
      p.maxLife = 50 + Math.random() * 40;
      particles.push(p);
    }
    if (particles.length > NUM + 50) particles.splice(0, particles.length - NUM);
  });
})();

// ===== CURSOR — مبسّط وبدون sparks على الموبايل =====
(function initCursor() {
  if (isMobile) return;

  const dot = document.getElementById('cursor') || document.createElement('div');
  dot.id = 'cursor';
  if (!dot.parentNode) document.body.appendChild(dot);

  const ring = document.createElement('div');
  ring.id = 'cursor-ring';
  document.body.appendChild(ring);

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  document.addEventListener('mousedown', () => { dot.style.transform = 'translate(-50%,-50%) scale(0.5)'; ring.style.transform = 'translate(-50%,-50%) scale(1.5)'; });
  document.addEventListener('mouseup', () => { dot.style.transform = 'translate(-50%,-50%) scale(1)'; ring.style.transform = 'translate(-50%,-50%) scale(1)'; });

  const hoverSel = 'a,button,.service-card,.tool-chip,.ty-social-btn,.whatsapp-float,.scroll-top';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverSel)) { dot.classList.add('hovered'); ring.classList.add('hovered'); }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverSel)) { dot.classList.remove('hovered'); ring.classList.remove('hovered'); }
  });

  // ✅ Trail sparks — مخفّفة جداً، كل 80ms بدل 30ms
  if (!isLowEnd) {
    let lastSpark = 0;
    document.addEventListener('mousemove', e => {
      const now = performance.now();
      if (now - lastSpark < 80) return;
      lastSpark = now;
      const s = document.createElement('div');
      const size = Math.random() * 4 + 2;
      s.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;
        width:${size}px;height:${size}px;background:rgba(0,255,106,0.3);
        border-radius:50%;pointer-events:none;z-index:99990;transform:translate(-50%,-50%);`;
      document.body.appendChild(s);
      let alpha = 0.6, t = 0;
      const anim = () => {
        t += 0.08; alpha -= 0.08;
        if (alpha <= 0) { s.remove(); return; }
        s.style.opacity = alpha;
        s.style.transform = `translate(-50%,-50%) scale(${1 - t})`;
        requestAnimationFrame(anim);
      };
      requestAnimationFrame(anim);
    }, { passive: true });
  }

  // ✅ Ring يتبع بـ lerp في RAF واحد
  function cursorLoop() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(cursorLoop);
  }
  cursorLoop();
})();

// ===== RIPPLE ON CLICK — مبسّط =====
document.addEventListener('click', e => {
  const r = document.createElement('div');
  r.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;
    width:0;height:0;border-radius:50%;
    border:1.5px solid rgba(0,255,106,0.5);
    transform:translate(-50%,-50%);pointer-events:none;z-index:99996;`;
  document.body.appendChild(r);
  let size = 0, alpha = 0.8;
  const grow = () => {
    size += 10; alpha -= 0.04;
    if (alpha <= 0) { r.remove(); return; }
    r.style.width = size + 'px'; r.style.height = size + 'px'; r.style.opacity = alpha;
    requestAnimationFrame(grow);
  };
  requestAnimationFrame(grow);
});

// ===== TEXT SCRAMBLE =====
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#ابتثجحدذرز';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const old = this.el.innerText;
    const len = Math.max(old.length, newText.length);
    const promise = new Promise(r => this.resolve = r);
    this.queue = Array.from({ length: len }, (_, i) => ({
      from: old[i] || '', to: newText[i] || '',
      start: Math.floor(Math.random() * 12),
      end: Math.floor(Math.random() * 12) + Math.floor(Math.random() * 10)
    }));
    cancelAnimationFrame(this.frame);
    this.frameN = 0;
    this.update();
    return promise;
  }
  update() {
    let out = '', done = 0;
    for (const q of this.queue) {
      const { from, to, start, end } = q;
      if (this.frameN >= end) { done++; out += to; }
      else if (this.frameN >= start) {
        if (!q.char || Math.random() < 0.3) q.char = this.chars[Math.floor(Math.random() * this.chars.length)];
        out += `<span style="color:rgba(0,255,106,0.7)">${q.char}</span>`;
      } else out += from;
    }
    this.el.innerHTML = out;
    if (done === this.queue.length) this.resolve();
    else { this.frame = requestAnimationFrame(this.update); this.frameN++; }
  }
}

// ===== LOADING SCREEN =====
(function initLoader() {
  const loaderEl = document.getElementById('loader');
  const loaderBar = document.getElementById('loaderBar');
  const loaderPct = document.getElementById('loaderPct');
  const loaderLabel = document.getElementById('loaderLabel');
  const navbar = document.getElementById('navbar');
  if (!loaderEl) return;

  const labels = ['Initializing...', 'Loading Assets...', 'Building Experience...', 'Almost There...', 'Welcome!'];
  let pct = 0;

  function advance() {
    const step = Math.random() * 15 + 5;
    pct = Math.min(pct + step, 100);
    if (loaderBar) loaderBar.style.width = pct + '%';
    if (loaderPct) loaderPct.textContent = Math.floor(pct) + '%';
    if (loaderLabel) loaderLabel.textContent = labels[Math.floor((pct / 100) * (labels.length - 1))];
    if (pct < 100) setTimeout(advance, Math.random() * 80 + 40);
    else { if (loaderPct) loaderPct.textContent = '100%'; setTimeout(finish, 500); }
  }

  function finish() {
    loaderEl.style.opacity = '0';
    loaderEl.style.transition = 'opacity 0.6s ease';
    setTimeout(() => {
      loaderEl.classList.add('hidden');
      loaderEl.style.display = 'none';
      if (navbar) navbar.classList.add('visible');
      revealHero();
    }, 600);
  }

  function revealHero() {
    const items = [
      { id: 'heroEyebrow', delay: 200 },
      { id: 'heroName', delay: 400 },
      { id: 'heroDesc', delay: 650 },
      { id: 'heroBtns', delay: 850 },
      { id: 'heroRight', delay: 450 },
      { id: 'heroScroll', delay: 1100 },
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

  window.addEventListener('load', () => setTimeout(advance, 150));
  setTimeout(() => { if (pct === 0) advance(); }, 500);
})();

// ===== MOBILE MENU =====
const hamburger = document.getElementById('navHamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

// ===== SCROLL REVEAL — Intersection Observer =====
const revealEls = document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-img,.reveal-img-left,.reveal-img-right,.reveal-stagger');
const revObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 50);
      revObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
revealEls.forEach(el => revObs.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, dur = 1600) {
  const sup = el.querySelector('sup');
  const start = performance.now();
  const tick = now => {
    const p = Math.min((now - start) / dur, 1);
    const val = Math.floor(Ease.outExpo(p) * target);
    if (el.firstChild && el.firstChild.nodeType === Node.TEXT_NODE) el.firstChild.textContent = val;
    else { el.textContent = val; if (sup) el.appendChild(sup); }
    if (p < 1) requestAnimationFrame(tick);
    else { if (el.firstChild && el.firstChild.nodeType === Node.TEXT_NODE) el.firstChild.textContent = target; else el.textContent = target; if (sup) el.appendChild(sup); }
  };
  requestAnimationFrame(tick);
}
const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-num[data-target]').forEach((num, i) => {
        const t = parseInt(num.dataset.target);
        if (!isNaN(t)) setTimeout(() => animateCounter(num, t), i * 200);
      });
      statsObs.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
const stats = document.querySelector('.about-stats');
if (stats) statsObs.observe(stats);

// ===== LAZY LOADING IMAGES ✅ =====
(function lazyLoadImages() {
  // ✅ استخدام loading="lazy" الـ native للصور
  document.querySelectorAll('img').forEach(img => {
    // الصور اللي في الـ hero و loader مش عايزينها تتأخر
    const isAboveFold = img.closest('#loader, #home, nav');
    if (!isAboveFold) {
      img.loading = 'lazy';
      img.decoding = 'async';
    } else {
      img.fetchpriority = 'high';
    }
  });
})();

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ===== NAV SCROLL =====
const navbarEl = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbarEl) navbarEl.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ===== SCROLL TO TOP =====
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => scrollTopBtn.classList.toggle('visible', window.scrollY > 500), { passive: true });
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===== PARALLAX — throttled بـ RAF =====
if (!isMobile) {
  let ticking = false;
  const heroGrid = document.querySelector('.hero-grid-lines');
  const heroBg = document.querySelector('.hero-bg');

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (heroGrid) heroGrid.style.transform = `translateY(${y * 0.25}px)`;
      if (heroBg) heroBg.style.transform = `translateY(${y * 0.1}px)`;
      ticking = false;
    });
  }, { passive: true });
}

// ===== SPOTLIGHT — CSS custom property فقط =====
if (!isMobile && !isLowEnd) {
  const spotlight = document.createElement('div');
  spotlight.style.cssText = `
    position:fixed;inset:0;pointer-events:none;z-index:1;
    background:radial-gradient(500px circle at var(--mx,50%) var(--my,50%), rgba(0,255,106,0.03), transparent 60%);
  `;
  document.body.appendChild(spotlight);

  let spotThrottle = false;
  document.addEventListener('mousemove', e => {
    if (spotThrottle) return;
    spotThrottle = true;
    requestAnimationFrame(() => {
      spotlight.style.setProperty('--mx', e.clientX + 'px');
      spotlight.style.setProperty('--my', e.clientY + 'px');
      spotThrottle = false;
    });
  }, { passive: true });
}

// ===== MAGNETIC BUTTONS — على الـ desktop فقط =====
if (!isMobile) {
  document.querySelectorAll('.btn-primary,.btn-outline,.nav-cta,.ty-social-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      const dist = Math.hypot(x, y);
      const maxDist = Math.max(r.width, r.height);
      const strength = Math.max(0, 1 - dist / maxDist) * 0.3;
      btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.6s cubic-bezier(0.22,1,0.36,1)';
      btn.style.transform = '';
      setTimeout(() => btn.style.transition = '', 600);
    });
  });
}

// ===== 3D TILT — Hero Image =====
if (!isMobile) {
  const heroRight = document.querySelector('.hero-right');
  const heroFrame = document.querySelector('.hero-photo-frame');
  if (heroRight && heroFrame) {
    let tiltThrottle = false;
    heroRight.addEventListener('mousemove', e => {
      if (tiltThrottle) return;
      tiltThrottle = true;
      requestAnimationFrame(() => {
        const r = heroRight.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        heroFrame.style.transform = `perspective(800px) rotateY(${x * 16}deg) rotateX(${-y * 12}deg) scale(1.03)`;
        heroFrame.style.transition = 'transform 0.1s';
        tiltThrottle = false;
      });
    });
    heroRight.addEventListener('mouseleave', () => {
      heroFrame.style.transition = 'transform 0.8s cubic-bezier(0.22,1,0.36,1)';
      heroFrame.style.transform = '';
    });
  }
}

// ===== 3D TILT — Service Cards =====
if (!isMobile) {
  document.querySelectorAll('.service-card').forEach(card => {
    let tiltThrottle = false;
    card.addEventListener('mousemove', e => {
      if (tiltThrottle) return;
      tiltThrottle = true;
      requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(500px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-6px) scale(1.02)`;
        card.style.transition = 'transform 0.1s, box-shadow 0.2s';
        tiltThrottle = false;
      });
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.7s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s';
      card.style.transform = '';
    });
  });
}

// ===== EXP TEXT SCRAMBLE =====
document.querySelectorAll('.exp-company').forEach(el => {
  const orig = el.textContent;
  const sc = new TextScramble(el);
  const item = el.closest('.exp-item');
  if (item) {
    item.addEventListener('mouseenter', () => sc.setText(orig));
  }
});

// ===== ABOUT PHOTO TILT =====
if (!isMobile) {
  const aboutPhoto = document.querySelector('.about-photo-wrap');
  if (aboutPhoto) {
    let tiltThrottle = false;
    aboutPhoto.addEventListener('mousemove', e => {
      if (tiltThrottle) return;
      tiltThrottle = true;
      requestAnimationFrame(() => {
        const r = aboutPhoto.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        aboutPhoto.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 7}deg) scale(1.02)`;
        tiltThrottle = false;
      });
    });
    aboutPhoto.addEventListener('mouseleave', () => {
      aboutPhoto.style.transition = 'transform 0.8s cubic-bezier(0.22,1,0.36,1)';
      aboutPhoto.style.transform = '';
    });
  }
}

// ===== ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');
const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) navLinksAll.forEach(l => l.classList.toggle('nav-active', l.getAttribute('href') === '#' + e.target.id));
  });
}, { threshold: 0.4 });
sections.forEach(s => secObs.observe(s));

// ===== ORBIT DOTS =====
(function addOrbitDots() {
  if (isMobile) return;
  const frame = document.querySelector('.hero-photo-frame');
  if (!frame) return;
  const wrap = document.createElement('div');
  wrap.className = 'hero-orbit';
  for (let i = 0; i < 3; i++) {
    const d = document.createElement('div');
    d.className = 'orbit-dot';
    wrap.appendChild(d);
  }
  frame.appendChild(wrap);
})();

// ===== MARQUEE =====
const mt = document.querySelector('.marquee-track');
if (mt) {
  mt.addEventListener('mouseenter', () => mt.style.animationPlayState = 'paused');
  mt.addEventListener('mouseleave', () => mt.style.animationPlayState = 'running');
}

// ===== MAGNETIC WHATSAPP =====
if (!isMobile) {
  const waBtn = document.querySelector('.whatsapp-float');
  if (waBtn) {
    waBtn.addEventListener('mousemove', e => {
      const r = waBtn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      waBtn.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px) scale(1.15)`;
      waBtn.style.animation = 'none';
    });
    waBtn.addEventListener('mouseleave', () => {
      waBtn.style.transform = '';
      waBtn.style.animation = '';
    });
  }
}

// ===== TOOL CHIPS STAGGER =====
(function staggerChips() {
  const chips = document.querySelectorAll('.tool-chip');
  chips.forEach((c, i) => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(20px)';
    c.style.transition = `opacity 0.5s ${i * 0.08}s cubic-bezier(0.22,1,0.36,1),transform 0.5s ${i * 0.08}s cubic-bezier(0.22,1,0.36,1)`;
  });
  const obs = new IntersectionObserver(e => {
    if (e[0].isIntersecting) { chips.forEach(c => { c.style.opacity = '1'; c.style.transform = ''; }); obs.disconnect(); }
  }, { threshold: 0.2 });
  const t = document.getElementById('tools');
  if (t) obs.observe(t);
})();

// ===== SERVICE CARDS STAGGER =====
(function staggerCards() {
  const cards = document.querySelectorAll('.service-card');
  cards.forEach((c, i) => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(40px) scale(0.97)';
    c.style.transition = `opacity 0.6s ${i * 0.08}s cubic-bezier(0.22,1,0.36,1),transform 0.6s ${i * 0.08}s cubic-bezier(0.22,1,0.36,1)`;
  });
  const obs = new IntersectionObserver(e => {
    if (e[0].isIntersecting) { cards.forEach(c => { c.style.opacity = '1'; c.style.transform = ''; }); obs.disconnect(); }
  }, { threshold: 0.05 });
  const s = document.getElementById('services');
  if (s) obs.observe(s);
})();

// ===== EXP ITEMS STAGGER =====
(function staggerExp() {
  const items = document.querySelectorAll('.exp-item');
  items.forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    item.style.transition = `opacity 0.6s ${i * 0.12}s cubic-bezier(0.22,1,0.36,1),transform 0.6s ${i * 0.12}s cubic-bezier(0.22,1,0.36,1)`;
  });
  const obs = new IntersectionObserver(e => {
    if (e[0].isIntersecting) { items.forEach(i => { i.style.opacity = '1'; i.style.transform = ''; }); obs.disconnect(); }
  }, { threshold: 0.1 });
  const exp = document.getElementById('experience');
  if (exp) obs.observe(exp);
})();

// ===== HERO TYPING EFFECT =====
(function typeHeroDesc() {
  const desc = document.getElementById('heroDesc');
  if (!desc) return;
  const full = desc.textContent.trim();
  desc.textContent = '';
  let started = false;

  const obs = new IntersectionObserver(e => {
    if (e[0].isIntersecting && !started) {
      started = true;
      obs.disconnect();
      const checkVisible = setInterval(() => {
        if (parseFloat(getComputedStyle(desc).opacity) > 0.3) {
          clearInterval(checkVisible);
          let i = 0;
          // ✅ Batch typing بدل character by character
          const type = setInterval(() => {
            desc.textContent = full.slice(0, i += 2);
            if (i >= full.length) { desc.textContent = full; clearInterval(type); }
          }, 16);
        }
      }, 100);
    }
  }, { threshold: 0.5 });
  obs.observe(desc);
})();

// ===== FOOTER YEAR =====
const footerCopy = document.querySelector('.footer-copy');
if (footerCopy) footerCopy.textContent = footerCopy.textContent.replace('2025', new Date().getFullYear());

// ===== SECTION PROGRESS DOTS =====
if (!isMobile) {
  (function sectionProgress() {
    const badge = document.createElement('div');
    badge.style.cssText = `position:fixed;left:20px;top:50%;transform:translateY(-50%);
      display:flex;flex-direction:column;gap:8px;z-index:500;`;
    const sectionIds = ['home', 'about', 'tools', 'experience', 'services', 'contact', 'thankyou'];
    const dots = sectionIds.map(id => {
      const d = document.createElement('div');
      d.style.cssText = `width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.2);
        border:1px solid rgba(0,255,106,0.3);transition:all 0.4s;cursor:pointer;`;
      d.addEventListener('click', () => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      });
      badge.appendChild(d);
      return { dot: d, id };
    });
    document.body.appendChild(badge);

    const dotObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const found = dots.find(d => d.id === e.target.id);
        if (found) {
          found.dot.style.background = e.isIntersecting ? 'var(--green)' : 'rgba(255,255,255,0.2)';
          found.dot.style.boxShadow = e.isIntersecting ? '0 0 8px rgba(0,255,106,0.8)' : 'none';
          found.dot.style.transform = e.isIntersecting ? 'scale(1.6)' : 'scale(1)';
        }
      });
    }, { threshold: 0.5 });
    sectionIds.forEach(id => { const el = document.getElementById(id); if (el) dotObs.observe(el); });
  })();
}

// ===== CONTACT PHOTO TILT =====
if (!isMobile) {
  const contactPhoto = document.querySelector('.contact-photo-frame');
  if (contactPhoto) {
    let tiltThrottle = false;
    contactPhoto.addEventListener('mousemove', e => {
      if (tiltThrottle) return;
      tiltThrottle = true;
      requestAnimationFrame(() => {
        const r = contactPhoto.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        contactPhoto.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 8}deg) scale(1.02)`;
        tiltThrottle = false;
      });
    });
    contactPhoto.addEventListener('mouseleave', () => {
      contactPhoto.style.transition = 'transform 0.8s cubic-bezier(0.22,1,0.36,1)';
      contactPhoto.style.transform = '';
    });
  }
}

// ===== THANK YOU FIREWORKS — مرة واحدة فقط =====
(function tyFireworks() {
  if (isMobile) return;
  const ty = document.getElementById('thankyou');
  if (!ty) return;
  let fired = false;
  const obs = new IntersectionObserver(e => {
    if (e[0].isIntersecting && !fired) {
      fired = true;
      for (let burst = 0; burst < 2; burst++) {
        setTimeout(() => {
          const bx = Math.random() * window.innerWidth;
          const by = Math.random() * window.innerHeight * 0.5 + 100;
          for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            const angle = (Math.PI * 2 / 20) * i;
            const speed = Math.random() * 4 + 2;
            const hue = Math.random() * 60 + 100;
            p.style.cssText = `position:fixed;left:${bx}px;top:${by}px;
              width:${Math.random()*3+2}px;height:${Math.random()*3+2}px;
              border-radius:50%;background:hsl(${hue},100%,60%);
              pointer-events:none;z-index:99995;transform:translate(-50%,-50%);`;
            document.body.appendChild(p);
            let t = 0;
            const vx = Math.cos(angle) * speed, vy = Math.sin(angle) * speed;
            const anim = () => {
              t += 0.04;
              const opacity = Math.max(0, 1 - t);
              p.style.left = (bx + vx * t * 50) + 'px';
              p.style.top = (by + vy * t * 50 + 80 * t * t) + 'px';
              p.style.opacity = opacity;
              if (opacity > 0) requestAnimationFrame(anim);
              else p.remove();
            };
            requestAnimationFrame(anim);
          }
        }, burst * 500);
      }
    }
  }, { threshold: 0.3 });
  obs.observe(ty);
})();

// ===== INJECT STYLES =====
(function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .nav-links a.nav-active { color: var(--green) !important; }
    .nav-links a.nav-active::after { transform: scaleX(1) !important; }
    .status-active { animation: statusGlow 2s ease-in-out infinite !important; }
    @keyframes statusGlow {
      0%,100% { box-shadow: 0 0 0 0 rgba(0,255,106,0.3); }
      50% { box-shadow: 0 0 0 6px rgba(0,255,106,0), 0 0 20px rgba(0,255,106,0.3); }
    }
    .footer-dot { animation: footerDot 1.5s ease-in-out infinite !important; }
    @keyframes footerDot {
      0%,100% { transform:scale(1); box-shadow:0 0 4px rgba(0,255,106,0.4); }
      50% { transform:scale(1.5); box-shadow:0 0 16px rgba(0,255,106,0.8); }
    }
    .whatsapp-float::before {
      content:'';position:absolute;inset:-6px;border-radius:50%;
      border:2px solid rgba(37,211,102,0.4);
      animation:waPulse 2s ease-in-out infinite;
    }
    @keyframes waPulse { 0%,100%{transform:scale(1);opacity:0.8;} 50%{transform:scale(1.3);opacity:0;} }
    .scroll-top.visible { animation: scrollBtnGlow 3s ease-in-out infinite; }
    @keyframes scrollBtnGlow { 0%,100%{box-shadow:none;} 50%{box-shadow:0 0 20px rgba(0,255,106,0.2);} }
    .stat-item:hover .stat-num { text-shadow:0 0 30px rgba(0,255,106,0.8); }
    .contact-email { cursor:none;transition:color 0.3s,text-shadow 0.3s; }
    .contact-email:hover { text-shadow:0 0 30px rgba(0,255,106,0.4); }
    #cursor-ring.hovered { box-shadow:0 0 20px rgba(0,255,106,0.3) !important; }
    /* ✅ will-change فقط على العناصر المهمة */
    .hero-photo-frame, .about-photo-wrap, .service-card { will-change: transform; }
    nav { will-change: transform; }
    /* ✅ تحسين الـ scroll performance */
    * { -webkit-overflow-scrolling: touch; }
  `;
  document.head.appendChild(style);
})();

console.log('%c✦ OPTIMIZED ANIMATIONS LOADED ✦', 'color:#00ff6a;font-size:14px;font-weight:bold;');