// ============================================================
//  ULTRA MEGA ANIMATIONS — index.js (ULTRA EDITION)
// ============================================================

// ===== GSAP-STYLE EASING UTILITIES =====
const Ease = {
  outExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  outElastic: t => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  inOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  outBounce: t => {
    const n1 = 7.5625, d1 = 2.75;
    if (t < 1/d1) return n1*t*t;
    if (t < 2/d1) return n1*(t-=1.5/d1)*t+0.75;
    if (t < 2.5/d1) return n1*(t-=2.25/d1)*t+0.9375;
    return n1*(t-=2.625/d1)*t+0.984375;
  }
};

// ===== MASTER ANIMATION FRAME =====
const RAF = { callbacks: new Set() };
(function masterLoop() {
  RAF.callbacks.forEach(cb => cb());
  requestAnimationFrame(masterLoop);
})();

// ===== HEAVY CANVAS PARTICLES WITH CONNECTIONS =====
(function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;';
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext('2d');
  let W, H;
  const NUM = 120;
  let particles = [];
  let mouse = { x: -1000, y: -1000 };

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : H + 10;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = -(Math.random() * 0.8 + 0.2);
      this.r = Math.random() * 2 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.maxAlpha = this.alpha;
      this.life = 0;
      this.maxLife = Math.random() * 400 + 200;
      this.hue = 120 + Math.random() * 40 - 20; // green hue variations
    }
    update() {
      // Mouse repulsion
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const d = Math.hypot(dx, dy);
      if (d < 150) {
        const f = (150 - d) / 150 * 0.8;
        this.vx += (dx / d) * f * 0.3;
        this.vy += (dy / d) * f * 0.3;
      }
      this.vx *= 0.99; this.vy *= 0.99;
      this.x += this.vx; this.y += this.vy;
      this.life++;
      const lt = this.life / this.maxLife;
      this.alpha = lt < 0.1 ? lt * 10 * this.maxAlpha : lt > 0.8 ? (1 - (lt - 0.8) * 5) * this.maxAlpha : this.maxAlpha;
      if (this.y < -20 || this.life > this.maxLife) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 3);
      grd.addColorStop(0, `hsla(${this.hue},100%,60%,1)`);
      grd.addColorStop(1, `hsla(${this.hue},100%,60%,0)`);
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < NUM; i++) particles.push(new Particle());
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  // Particle explosion on click
  window.addEventListener('click', e => {
    for (let i = 0; i < 20; i++) {
      const p = new Particle();
      p.x = e.clientX; p.y = e.clientY;
      const angle = (Math.PI * 2 / 20) * i;
      const speed = Math.random() * 4 + 2;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.r = Math.random() * 3 + 1;
      p.maxAlpha = 0.9;
      p.alpha = 0.9;
      p.maxLife = 60 + Math.random() * 60;
      particles.push(p);
    }
    // Remove extras
    if (particles.length > NUM + 200) particles.splice(0, particles.length - NUM);
  });

  RAF.callbacks.add(() => {
    ctx.clearRect(0, 0, W, H);
    // Connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < Math.min(particles.length, i + 15); j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.hypot(dx, dy);
        if (d < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,255,106,${(1 - d / 100) * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
      particles[i].update();
      particles[i].draw();
    }
  });
})();

// ===== NEXT-LEVEL CURSOR =====
(function initCursor() {
  const dot = document.getElementById('cursor') || document.createElement('div');
  dot.id = 'cursor';
  if (!dot.parentNode) document.body.appendChild(dot);

  const ring = document.createElement('div');
  ring.id = 'cursor-ring';
  document.body.appendChild(ring);

  // Extra glow orb
  const orb = document.createElement('div');
  orb.style.cssText = `position:fixed;width:200px;height:200px;border-radius:50%;
    background:radial-gradient(circle,rgba(0,255,106,0.04) 0%,transparent 70%);
    pointer-events:none;z-index:0;transform:translate(-50%,-50%);transition:none;`;
  document.body.appendChild(orb);

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my, ox = mx, oy = my;
  let isHover = false, isClick = false;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  document.addEventListener('mousedown', () => { isClick = true; dot.style.transform = 'translate(-50%,-50%) scale(0.5)'; ring.style.transform = 'translate(-50%,-50%) scale(1.5)'; });
  document.addEventListener('mouseup', () => { isClick = false; dot.style.transform = 'translate(-50%,-50%) scale(1)'; ring.style.transform = 'translate(-50%,-50%) scale(1)'; });

  const hoverSel = 'a,button,.service-card,.tool-chip,.exp-item,.ty-social-btn,.whatsapp-float,.scroll-top,.stat-item,.nav-cta,.btn-primary,.btn-outline';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverSel)) {
      isHover = true;
      dot.classList.add('hovered'); ring.classList.add('hovered');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverSel)) {
      isHover = false;
      dot.classList.remove('hovered'); ring.classList.remove('hovered');
    }
  });

  // Trail sparks
  let lastSpark = 0;
  document.addEventListener('mousemove', e => {
    const now = performance.now();
    if (now - lastSpark < 30) return;
    lastSpark = now;
    const s = document.createElement('div');
    const size = Math.random() * 6 + 2;
    s.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;
      width:${size}px;height:${size}px;background:rgba(0,255,106,${Math.random()*0.5+0.2});
      border-radius:50%;pointer-events:none;z-index:99990;transform:translate(-50%,-50%);`;
    document.body.appendChild(s);
    const vx = (Math.random() - 0.5) * 60;
    const vy = (Math.random() - 0.5) * 60 - 20;
    let t = 0, alpha = 0.8;
    const anim = () => {
      t += 0.05;
      alpha -= 0.05;
      if (alpha <= 0) { s.remove(); return; }
      s.style.transform = `translate(calc(-50% + ${vx*t}px), calc(-50% + ${vy*t + 30*t*t}px)) scale(${1-t})`;
      s.style.opacity = alpha;
      requestAnimationFrame(anim);
    };
    requestAnimationFrame(anim);
  });

  RAF.callbacks.add(() => {
    const ease = isHover ? 0.08 : 0.14;
    rx += (mx - rx) * ease; ry += (my - ry) * ease;
    ox += (mx - ox) * 0.05; oy += (my - oy) * 0.05;
    dot.style.cssText += `left:${mx}px;top:${my}px;`;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    orb.style.left = ox + 'px'; orb.style.top = oy + 'px';
  });
})();

// ===== RIPPLE ON CLICK =====
document.addEventListener('click', e => {
  const r = document.createElement('div');
  r.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;
    width:0;height:0;border-radius:50%;
    border:2px solid rgba(0,255,106,0.6);
    transform:translate(-50%,-50%);pointer-events:none;z-index:99996;`;
  document.body.appendChild(r);
  let size = 0, alpha = 1;
  const grow = () => {
    size += 8; alpha -= 0.03;
    if (alpha <= 0) { r.remove(); return; }
    r.style.width = size + 'px'; r.style.height = size + 'px';
    r.style.opacity = alpha;
    requestAnimationFrame(grow);
  };
  requestAnimationFrame(grow);
  // Second ring
  const r2 = r.cloneNode();
  document.body.appendChild(r2);
  setTimeout(() => {
    let s2 = 0, a2 = 0.8;
    const g2 = () => {
      s2 += 12; a2 -= 0.04;
      if (a2 <= 0) { r2.remove(); return; }
      r2.style.width = s2+'px'; r2.style.height = s2+'px'; r2.style.opacity = a2;
      requestAnimationFrame(g2);
    };
    requestAnimationFrame(g2);
  }, 80);
});

// ===== TEXT SCRAMBLE =====
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#●◆■▲ابتثجحخدذرزسشصضطظعغفقكلمنهوي';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const old = this.el.innerText;
    const len = Math.max(old.length, newText.length);
    const promise = new Promise(r => this.resolve = r);
    this.queue = Array.from({ length: len }, (_, i) => ({
      from: old[i] || '',
      to: newText[i] || '',
      start: Math.floor(Math.random() * 15),
      end: Math.floor(Math.random() * 15) + Math.floor(Math.random() * 15)
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
        out += `<span style="color:rgba(0,255,106,0.7);text-shadow:0 0 8px rgba(0,255,106,0.5)">${q.char}</span>`;
      } else out += from;
    }
    this.el.innerHTML = out;
    if (done === this.queue.length) this.resolve();
    else { this.frame = requestAnimationFrame(this.update); this.frameN++; }
  }
}

// ===== SPLIT TEXT INTO CHARS =====
function splitChars(el, className = 'split-char') {
  const text = el.textContent;
  el.innerHTML = text.split('').map((c, i) =>
    c === ' ' ? ' ' : `<span class="${className}" style="display:inline-block;animation-delay:${i*0.04}s">${c}</span>`
  ).join('');
}

// ===== LOADING SCREEN (ULTRA) =====
(function initLoader() {
  const loaderEl = document.getElementById('loader');
  const loaderBar = document.getElementById('loaderBar');
  const loaderPct = document.getElementById('loaderPct');
  const loaderLabel = document.getElementById('loaderLabel');
  const navbar = document.getElementById('navbar');

  if (!loaderEl) return;

  // Add scanline to loader
  const scan = document.createElement('div');
  scan.style.cssText = `position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,106,0.015) 2px,rgba(0,255,106,0.015) 4px);pointer-events:none;z-index:1;animation:scanAnim 4s linear infinite;`;
  loaderEl.appendChild(scan);

  const labels = ['Initializing Systems...','Loading Visual Assets...','Crafting Design Elements...','Building Magic...','Rendering Experience...','Almost There...','Welcome!'];
  let pct = 0;

  function advance() {
    const step = Math.random() * 12 + 4;
    pct = Math.min(pct + step, 100);
    if (loaderBar) loaderBar.style.width = pct + '%';
    if (loaderPct) loaderPct.textContent = Math.floor(pct) + '%';
    if (loaderLabel) loaderLabel.textContent = labels[Math.floor((pct / 100) * (labels.length - 1))];
    if (pct < 100) setTimeout(advance, Math.random() * 100 + 50);
    else {
      if (loaderPct) loaderPct.textContent = '100%';
      if (loaderLabel) loaderLabel.textContent = 'Welcome!';
      setTimeout(finish, 700);
    }
  }

  function finish() {
    // Glitch exit
    loaderEl.style.animation = 'loaderExit 0.8s cubic-bezier(0.22,1,0.36,1) forwards';
    const style = document.createElement('style');
    style.textContent = `
      @keyframes loaderExit {
        0% { transform:none; opacity:1; clip-path:inset(0); }
        30% { transform:skewX(-5deg) skewY(-1deg); clip-path:inset(10% 0 10% 0); filter:hue-rotate(90deg); }
        60% { transform:skewX(3deg) translateY(-10px); clip-path:inset(40% 0 40% 0); }
        100% { transform:translateY(-100%); opacity:0; clip-path:inset(0 0 100% 0); }
      }
      @keyframes scanAnim { 0%{background-position:0 0} 100%{background-position:0 100%} }
    `;
    document.head.appendChild(style);
    setTimeout(() => {
      loaderEl.classList.add('hidden');
      loaderEl.style.display = 'none';
      if (navbar) navbar.classList.add('visible');
      revealHero();
    }, 800);
  }

  function revealHero() {
    const items = [
      { id: 'heroEyebrow', delay: 200 },
      { id: 'heroName', delay: 400, scramble: true },
      { id: 'heroDesc', delay: 700 },
      { id: 'heroBtns', delay: 900 },
      { id: 'heroRight', delay: 500 },
      { id: 'heroScroll', delay: 1200 },
    ];
    items.forEach(({ id, delay, scramble }) => {
      const el = document.getElementById(id);
      if (!el) return;
      setTimeout(() => {
        el.style.transition = 'opacity 1s cubic-bezier(0.22,1,0.36,1), transform 1s cubic-bezier(0.22,1,0.36,1)';
        el.style.opacity = '1';
        el.style.transform = 'none';
        if (scramble) {
          const nameOnly = el.querySelector('em') ? el.firstChild.textContent : el.textContent;
          // Apply char-by-char entrance
          const spans = el.querySelectorAll('.char') || [];
        }
      }, delay);
    });
  }

  window.addEventListener('load', () => setTimeout(advance, 200));
  setTimeout(() => { if (pct === 0) advance(); }, 600);
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

// ===== ULTRA SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-img,.reveal-img-left,.reveal-img-right,.reveal-stagger');
const revObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      revObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
revealEls.forEach(el => revObs.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, dur = 1800) {
  const sup = el.querySelector('sup');
  const start = performance.now();
  const tick = now => {
    const p = Math.min((now - start) / dur, 1);
    const val = Math.floor(Ease.outExpo(p) * target);
    const first = el.childNodes[0];
    if (first && first.nodeType === Node.TEXT_NODE) first.textContent = val;
    else { el.textContent = val; if (sup) el.appendChild(sup); }
    if (p < 1) requestAnimationFrame(tick);
    else { if (first && first.nodeType === Node.TEXT_NODE) first.textContent = target; else el.textContent = target; if (sup) el.appendChild(sup); }
  };
  requestAnimationFrame(tick);
}
const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-num[data-target]').forEach((num, i) => {
        const t = parseInt(num.dataset.target);
        if (!isNaN(t)) setTimeout(() => animateCounter(num, t), i * 250);
      });
      statsObs.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
const stats = document.querySelector('.about-stats');
if (stats) statsObs.observe(stats);

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ===== NAV SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ===== SCROLL TO TOP =====
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => scrollTopBtn.classList.toggle('visible', window.scrollY > 500), { passive: true });
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===== MEGA PARALLAX SYSTEM =====
let lastTick = false;
const parallaxTargets = [
  { el: document.querySelector('.hero-grid-lines'), speed: 0.3 },
  { el: document.querySelector('.hero-bg'), speed: 0.12 },
  { el: document.querySelector('.hero-name'), speed: 0.08, xspeed: 0 },
  { el: document.querySelector('.about-photo-accent'), speed: -0.15 },
];
window.addEventListener('scroll', () => {
  if (!lastTick) {
    requestAnimationFrame(() => {
      const y = window.scrollY;
      parallaxTargets.forEach(({ el, speed }) => {
        if (el) el.style.transform = `translateY(${y * speed}px)`;
      });
      lastTick = false;
    });
    lastTick = true;
  }
}, { passive: true });

// ===== MOUSE-FOLLOWING SPOTLIGHT =====
(function initSpotlight() {
  const spotlight = document.createElement('div');
  spotlight.style.cssText = `
    position:fixed;inset:0;pointer-events:none;z-index:1;
    background:radial-gradient(600px circle at var(--mx,50%) var(--my,50%), rgba(0,255,106,0.035), transparent 60%);
    transition:background 0.1s;
  `;
  document.body.appendChild(spotlight);
  document.addEventListener('mousemove', e => {
    spotlight.style.setProperty('--mx', e.clientX + 'px');
    spotlight.style.setProperty('--my', e.clientY + 'px');
  });
})();

// ===== MAGNETIC BUTTONS (ULTRA) =====
document.querySelectorAll('.btn-primary,.btn-outline,.nav-cta,.ty-social-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    const dist = Math.hypot(x, y);
    const maxDist = Math.max(r.width, r.height);
    const strength = Math.max(0, 1 - dist / maxDist) * 0.35;
    btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transition = 'transform 0.6s cubic-bezier(0.22,1,0.36,1)';
    btn.style.transform = '';
    setTimeout(() => btn.style.transition = '', 600);
  });
});

// ===== 3D TILT - HERO IMAGE =====
const heroRight = document.querySelector('.hero-right');
const heroFrame = document.querySelector('.hero-photo-frame');
if (heroRight && heroFrame) {
  heroRight.addEventListener('mousemove', e => {
    const r = heroRight.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    heroFrame.style.transform = `perspective(800px) rotateY(${x * 18}deg) rotateX(${-y * 13}deg) scale(1.04)`;
    heroFrame.style.transition = 'transform 0.1s';
  });
  heroRight.addEventListener('mouseleave', () => {
    heroFrame.style.transition = 'transform 0.8s cubic-bezier(0.22,1,0.36,1)';
    heroFrame.style.transform = '';
  });
}

// ===== 3D TILT - SERVICE CARDS (ULTRA) =====
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(500px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateY(-8px) scale(1.02)`;
    card.style.transition = 'transform 0.1s, box-shadow 0.2s';
    card.style.boxShadow = `${-x * 30}px ${y * 30}px 50px rgba(0,0,0,0.5), 0 0 40px rgba(0,255,106,${0.05 + Math.abs(x) * 0.1})`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.7s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s';
    card.style.transform = '';
    card.style.boxShadow = '';
  });
  // Shockwave on click
  card.addEventListener('click', e => {
    const wave = document.createElement('div');
    const r = card.getBoundingClientRect();
    wave.style.cssText = `position:absolute;border-radius:50%;border:2px solid rgba(0,255,106,0.7);
      pointer-events:none;transform:translate(-50%,-50%) scale(0);
      left:${e.clientX - r.left}px;top:${e.clientY - r.top}px;
      width:20px;height:20px;transition:all 0.8s cubic-bezier(0.22,1,0.36,1);z-index:10;`;
    card.style.position = 'relative'; card.style.overflow = 'hidden';
    card.appendChild(wave);
    requestAnimationFrame(() => {
      wave.style.transform = 'translate(-50%,-50%) scale(20)';
      wave.style.opacity = '0';
    });
    setTimeout(() => wave.remove(), 800);
  });
});

// ===== EXPERIENCE TEXT SCRAMBLE =====
document.querySelectorAll('.exp-company').forEach(el => {
  const orig = el.textContent;
  const sc = new TextScramble(el);
  el.closest('.exp-item').addEventListener('mouseenter', () => sc.setText(orig));
  el.closest('.exp-item').addEventListener('mouseleave', () => sc.setText(orig));
});

// ===== ABOUT PHOTO 3D TILT =====
const aboutPhoto = document.querySelector('.about-photo-wrap');
if (aboutPhoto) {
  aboutPhoto.addEventListener('mousemove', e => {
    const r = aboutPhoto.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    aboutPhoto.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 8}deg) scale(1.03)`;
    aboutPhoto.style.transition = 'transform 0.1s';
    const img = aboutPhoto.querySelector('img');
    if (img) img.style.transform = `scale(1.08) translate(${x * -10}px, ${y * -8}px)`;
  });
  aboutPhoto.addEventListener('mouseleave', () => {
    aboutPhoto.style.transition = 'transform 0.8s cubic-bezier(0.22,1,0.36,1)';
    aboutPhoto.style.transform = '';
    const img = aboutPhoto.querySelector('img');
    if (img) { img.style.transition = 'transform 0.8s'; img.style.transform = ''; }
  });
}

// ===== ABOUT PHOTO SCROLL PARALLAX =====
const aboutSection = document.getElementById('about');
const aboutImg = document.querySelector('.about-photo-wrap img');
window.addEventListener('scroll', () => {
  if (!aboutSection || !aboutImg) return;
  const r = aboutSection.getBoundingClientRect();
  if (r.top < window.innerHeight && r.bottom > 0) {
    const p = 1 - (r.top + r.height) / (window.innerHeight + r.height);
    aboutImg.style.transform = `scale(1.05) translateY(${p * -25}px)`;
  }
}, { passive: true });

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
  // Speed up on scroll
  let mSpeed = 18;
  window.addEventListener('scroll', () => {
    const delta = Math.abs(window.scrollY - (window._lastY || 0));
    window._lastY = window.scrollY;
    mSpeed = Math.max(8, Math.min(18, mSpeed - delta * 0.05));
    mt.style.animationDuration = mSpeed + 's';
    setTimeout(() => { mSpeed = 18; mt.style.animationDuration = '18s'; }, 300);
  }, { passive: true });
}

// ===== MAGNETIC WHATSAPP =====
const waBtn = document.querySelector('.whatsapp-float');
if (waBtn) {
  waBtn.addEventListener('mousemove', e => {
    const r = waBtn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    waBtn.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px) scale(1.2)`;
    waBtn.style.animation = 'none';
  });
  waBtn.addEventListener('mouseleave', () => {
    waBtn.style.transform = '';
    waBtn.style.animation = '';
  });
}

// ===== TOOL CHIPS STAGGER =====
(function staggerChips() {
  const chips = document.querySelectorAll('.tool-chip');
  chips.forEach((c, i) => {
    c.style.cssText += `opacity:0;transform:translateY(20px);transition:opacity 0.5s ${i*0.1}s cubic-bezier(0.22,1,0.36,1),transform 0.5s ${i*0.1}s cubic-bezier(0.22,1,0.36,1);`;
  });
  const obs = new IntersectionObserver(e => {
    if (e[0].isIntersecting) { chips.forEach(c => { c.style.opacity='1'; c.style.transform=''; }); obs.disconnect(); }
  }, { threshold: 0.2 });
  const t = document.getElementById('tools');
  if (t) obs.observe(t);
})();

// ===== SERVICE CARDS STAGGER =====
(function staggerCards() {
  const cards = document.querySelectorAll('.service-card');
  cards.forEach((c, i) => {
    c.style.cssText += `opacity:0;transform:translateY(50px) scale(0.95);transition:opacity 0.7s ${i*0.1}s cubic-bezier(0.22,1,0.36,1),transform 0.7s ${i*0.1}s cubic-bezier(0.22,1,0.36,1);`;
  });
  const obs = new IntersectionObserver(e => {
    if (e[0].isIntersecting) { cards.forEach(c => { c.style.opacity='1'; c.style.transform=''; }); obs.disconnect(); }
  }, { threshold: 0.05 });
  const s = document.getElementById('services');
  if (s) obs.observe(s);
})();

// ===== EXP ITEMS STAGGER =====
(function staggerExp() {
  const items = document.querySelectorAll('.exp-item');
  items.forEach((item, i) => {
    item.style.cssText += `opacity:0;transform:translateX(-40px);transition:opacity 0.6s ${i*0.15}s cubic-bezier(0.22,1,0.36,1),transform 0.6s ${i*0.15}s cubic-bezier(0.22,1,0.36,1);`;
  });
  const obs = new IntersectionObserver(e => {
    if (e[0].isIntersecting) { items.forEach(i => { i.style.opacity='1'; i.style.transform=''; }); obs.disconnect(); }
  }, { threshold: 0.1 });
  const exp = document.getElementById('experience');
  if (exp) obs.observe(exp);
})();

// ===== HERO TYPING EFFECT =====
(function typeHeroDesc() {
  const desc = document.getElementById('heroDesc');
  if (!desc) return;
  const full = desc.textContent.trim();
  desc.innerHTML = '';
  let started = false;
  const obs = new IntersectionObserver(e => {
    if (e[0].isIntersecting && !started) {
      started = true;
      obs.disconnect();
      const checkVisible = setInterval(() => {
        if (parseFloat(getComputedStyle(desc).opacity) > 0.3) {
          clearInterval(checkVisible);
          let i = 0;
          const type = setInterval(() => {
            desc.textContent = full.slice(0, i);
            i++;
            if (i > full.length) clearInterval(type);
          }, 14);
        }
      }, 100);
    }
  }, { threshold: 0.5 });
  obs.observe(desc);
})();

// ===== FOOTER YEAR =====
const footerCopy = document.querySelector('.footer-copy');
if (footerCopy) footerCopy.textContent = footerCopy.textContent.replace('2025', new Date().getFullYear());

// ===== SCROLL-SPEED REACTIVE BG =====
let bgHue = 0, lastY2 = 0;
window.addEventListener('scroll', () => {
  const delta = Math.abs(window.scrollY - lastY2);
  lastY2 = window.scrollY;
  bgHue = Math.min(delta * 0.1, 0.04);
  const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  const g = Math.sin(progress * Math.PI) * 0.025;
  document.body.style.background = `hsl(0,0%,${3 + g}%)`;
}, { passive: true });

// ===== SECTION ENTRANCE CINEMATIC =====
(function cinematicSections() {
  const sects = document.querySelectorAll('#about, #experience, #services, #contact, #thankyou');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.transition = 'filter 0.8s ease';
        e.target.style.filter = 'blur(0px)';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.05 });
  sects.forEach(s => {
    s.style.filter = 'blur(2px)';
    obs.observe(s);
  });
})();

// ===== INJECT GLOBAL ANIMATION STYLES =====
(function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .nav-links a.nav-active { color: var(--green) !important; }
    .nav-links a.nav-active::after { transform: scaleX(1) !important; }

    /* Char reveal animation */
    @keyframes charReveal {
      0% { opacity:0; transform:translateY(20px) rotate(5deg); }
      100% { opacity:1; transform:none; }
    }
    .split-char { animation: charReveal 0.5s cubic-bezier(0.22,1,0.36,1) both; }

    /* Spark fade */
    @keyframes sparkFade {
      0% { opacity:0.9; transform:translate(-50%,-50%) scale(1); }
      100% { opacity:0; transform:translate(-50%,-50%) scale(0); }
    }

    /* Section blur entrance */
    section { will-change: filter; }

    /* Nav active glow */
    .nav-links a.nav-active {
      text-shadow: 0 0 20px rgba(0,255,106,0.5);
    }

    /* Stat item entrance animation */
    .stat-item { transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), border-color 0.4s, background 0.4s; }

    /* Service card shimmer */
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }

    /* Tool chips 3D on hover */
    .tool-chip { transform-style: preserve-3d; }

    /* Exp item bar animation */
    .exp-item::after { transition: height 0.5s cubic-bezier(0.22,1,0.36,1); }

    /* Glowing cursor ring while hovering */
    #cursor-ring.hovered {
      box-shadow: 0 0 20px rgba(0,255,106,0.3), 0 0 40px rgba(0,255,106,0.1) !important;
    }

    /* Section label animation */
    .section-label::before {
      animation: labelPulse 2s ease-in-out infinite;
    }
    @keyframes labelPulse {
      0%,100% { width:24px; opacity:0.7; box-shadow: none; }
      50% { width:36px; opacity:1; box-shadow: 0 0 8px rgba(0,255,106,0.5); }
    }

    /* WhatsApp pulse ring */
    .whatsapp-float::before {
      content: '';
      position: absolute;
      inset: -6px;
      border-radius: 50%;
      border: 2px solid rgba(37,211,102,0.4);
      animation: waPulse 2s ease-in-out infinite;
    }
    @keyframes waPulse {
      0%,100% { transform:scale(1); opacity:0.8; }
      50% { transform:scale(1.3); opacity:0; }
    }

    /* Scroll top glow */
    .scroll-top.visible {
      animation: scrollBtnGlow 3s ease-in-out infinite;
    }
    @keyframes scrollBtnGlow {
      0%,100% { box-shadow:none; }
      50% { box-shadow: 0 0 20px rgba(0,255,106,0.2); }
    }

    /* Marquee item active */
    .marquee-item:hover {
      color: rgba(0,0,0,0.6);
      text-shadow: 0 0 20px rgba(0,0,0,0.3);
    }

    /* About stat counter glow */
    .stat-num {
      transition: text-shadow 0.3s;
    }
    .stat-item:hover .stat-num {
      text-shadow: 0 0 30px rgba(0,255,106,0.8), 0 0 60px rgba(0,255,106,0.4);
    }

    /* Hero desc cursor blink */
    #heroDesc {
      border-right: none !important;
    }

    /* Exp item transition fix */
    .exp-item {
      will-change: transform, background;
    }

    /* Contact email glow on hover */
    .contact-email {
      cursor: none;
      transition: color 0.3s, text-shadow 0.3s;
    }
    .contact-email:hover {
      text-shadow: 0 0 30px rgba(0,255,106,0.4);
    }

    /* Thank you star continuous */
    .ty-star {
      animation: starSpin 4s linear infinite !important;
    }
    @keyframes starSpin {
      0% { transform:rotate(0deg) scale(1); filter:drop-shadow(0 0 10px rgba(0,255,106,0.6)); }
      25% { transform:rotate(90deg) scale(1.2); filter:drop-shadow(0 0 30px rgba(0,255,106,1)); }
      50% { transform:rotate(180deg) scale(1); filter:drop-shadow(0 0 10px rgba(0,255,106,0.6)); }
      75% { transform:rotate(270deg) scale(1.3); filter:drop-shadow(0 0 40px rgba(0,255,106,1)); }
      100% { transform:rotate(360deg) scale(1); filter:drop-shadow(0 0 10px rgba(0,255,106,0.6)); }
    }

    /* Eyebrow dot ring */
    .eyebrow-dot::after {
      animation: dotRingExpand 1.5s ease-out infinite !important;
    }

    /* Service num counter */
    .service-num {
      transition: color 0.4s, transform 0.4s cubic-bezier(0.22,1,0.36,1), text-shadow 0.3s !important;
    }
    .service-card:hover .service-num {
      text-shadow: 0 0 40px rgba(0,255,106,0.3) !important;
    }

    /* Status badge breathing */
    .status-active {
      animation: statusGlow 2s ease-in-out infinite !important;
    }
    @keyframes statusGlow {
      0%,100% { box-shadow: 0 0 0 0 rgba(0,255,106,0.3); text-shadow: none; }
      50% { box-shadow: 0 0 0 6px rgba(0,255,106,0), 0 0 20px rgba(0,255,106,0.3); text-shadow: 0 0 10px rgba(0,255,106,0.5); }
    }

    /* Footer dot pulse */
    .footer-dot {
      animation: footerDot 1.5s ease-in-out infinite !important;
    }
    @keyframes footerDot {
      0%,100% { transform:scale(1); box-shadow:0 0 4px rgba(0,255,106,0.4); }
      50% { transform:scale(1.5); box-shadow:0 0 16px rgba(0,255,106,0.8); }
    }

    /* Noise overlay subtle move */
    body::before {
      animation: noiseShift 8s steps(4) infinite;
    }
    @keyframes noiseShift {
      0%   { background-position: 0 0; }
      25%  { background-position: 50px 20px; }
      50%  { background-position: 20px 60px; }
      75%  { background-position: 70px 40px; }
      100% { background-position: 0 0; }
    }
  `;
  document.head.appendChild(style);
})();

// ===== HERO NAME GLITCH PERIODIC =====
(function heroGlitch() {
  const name = document.getElementById('heroName');
  if (!name) return;
  setInterval(() => {
    name.style.animation = 'none';
    name.style.transform = `skewX(${(Math.random()-0.5)*4}deg) translateX(${(Math.random()-0.5)*6}px)`;
    name.style.filter = `hue-rotate(${Math.random()*360}deg)`;
    setTimeout(() => {
      name.style.transform = '';
      name.style.filter = '';
    }, 80);
    setTimeout(() => {
      name.style.transform = `skewX(${(Math.random()-0.5)*2}deg)`;
      setTimeout(() => { name.style.transform = ''; }, 60);
    }, 130);
  }, 4000 + Math.random() * 3000);
})();

// ===== SECTION COUNTER VISIBLE BADGE =====
(function sectionProgress() {
  const badge = document.createElement('div');
  badge.style.cssText = `position:fixed;left:28px;top:50%;transform:translateY(-50%);
    display:flex;flex-direction:column;gap:8px;z-index:500;
    transition:opacity 0.5s;`;
  const sectionIds = ['home','about','tools','experience','services','contact','thankyou'];
  const dots = sectionIds.map((id, i) => {
    const d = document.createElement('div');
    d.style.cssText = `width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.2);
      border:1px solid rgba(0,255,106,0.3);transition:all 0.4s cubic-bezier(0.22,1,0.36,1);cursor:none;`;
    d.title = id;
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

  // Hide on mobile
  if (window.innerWidth < 900) badge.style.display = 'none';
})();

// ===== CONTACT PHOTO 3D TILT =====
const contactPhoto = document.querySelector('.contact-photo-frame');
if (contactPhoto) {
  contactPhoto.addEventListener('mousemove', e => {
    const r = contactPhoto.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    contactPhoto.style.transform = `perspective(600px) rotateY(${x * 14}deg) rotateX(${-y * 10}deg) scale(1.03)`;
    contactPhoto.style.transition = 'transform 0.1s';
  });
  contactPhoto.addEventListener('mouseleave', () => {
    contactPhoto.style.transition = 'transform 0.8s cubic-bezier(0.22,1,0.36,1)';
    contactPhoto.style.transform = '';
  });
}

// ===== LOADER RING FOLLOW CURSOR =====
// (already handled above)

// ===== THANK YOU SECTION FIREWORKS =====
(function tyFireworks() {
  const ty = document.getElementById('thankyou');
  if (!ty) return;
  let fired = false;
  const obs = new IntersectionObserver(e => {
    if (e[0].isIntersecting && !fired) {
      fired = true;
      for (let burst = 0; burst < 3; burst++) {
        setTimeout(() => {
          const bx = Math.random() * window.innerWidth;
          const by = Math.random() * window.innerHeight * 0.6;
          for (let i = 0; i < 30; i++) {
            const p = document.createElement('div');
            const angle = (Math.PI * 2 / 30) * i;
            const speed = Math.random() * 5 + 2;
            const hue = Math.random() * 60 + 100; // greens
            p.style.cssText = `position:fixed;left:${bx}px;top:${by}px;
              width:${Math.random()*4+2}px;height:${Math.random()*4+2}px;
              border-radius:50%;background:hsl(${hue},100%,60%);
              pointer-events:none;z-index:99995;transform:translate(-50%,-50%);`;
            document.body.appendChild(p);
            let t = 0;
            const vx = Math.cos(angle) * speed, vy = Math.sin(angle) * speed;
            const anim = () => {
              t += 0.03;
              const opacity = Math.max(0, 1 - t);
              p.style.left = (bx + vx * t * 60) + 'px';
              p.style.top = (by + vy * t * 60 + 100 * t * t) + 'px';
              p.style.opacity = opacity;
              p.style.transform = `translate(-50%,-50%) scale(${1 - t})`;
              if (opacity > 0) requestAnimationFrame(anim);
              else p.remove();
            };
            requestAnimationFrame(anim);
          }
        }, burst * 400);
      }
    }
  }, { threshold: 0.3 });
  obs.observe(ty);
})();

console.log('%c✦ ULTRA ANIMATIONS LOADED ✦', 'color:#00ff6a;font-size:16px;font-weight:bold;text-shadow:0 0 10px #00ff6a;');