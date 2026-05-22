// ============================================================
//  ULTRA ANIMATIONS — index.js
// ============================================================

// ===== PARTICLES CANVAS =====
(function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;';
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const NUM_PARTICLES = 80;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  function Particle() {
    this.reset = function() {
      this.x = randomBetween(0, W);
      this.y = randomBetween(0, H);
      this.size = randomBetween(0.5, 2);
      this.speedX = randomBetween(-0.4, 0.4);
      this.speedY = randomBetween(-0.6, -0.1);
      this.opacity = randomBetween(0.1, 0.5);
      this.life = 0;
      this.maxLife = randomBetween(100, 300);
      this.connected = [];
    };
    this.reset();
    this.y = randomBetween(0, H); // random initial y
  }

  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push(new Particle());
  }

  let mouseX = -1000, mouseY = -1000;
  document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.life++;

      // Mouse repulsion
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120 * 0.3;
        p.x += (dx / dist) * force;
        p.y += (dy / dist) * force;
      }

      // Life cycle opacity
      const lifeRatio = p.life / p.maxLife;
      const currentOpacity = lifeRatio < 0.1
        ? lifeRatio * 10 * p.opacity
        : lifeRatio > 0.9
        ? (1 - (lifeRatio - 0.9) * 10) * p.opacity
        : p.opacity;

      if (p.y < -10 || p.life > p.maxLife) p.reset();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,255,106,${currentOpacity})`;
      ctx.fill();
    });

    // Connect nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const alpha = (1 - dist / 100) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,255,106,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  }

  drawParticles();
})();

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
let cursorRing = null;

// Create cursor ring
cursorRing = document.createElement('div');
cursorRing.id = 'cursor-ring';
document.body.appendChild(cursorRing);

let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;
let ringX = cursorX, ringY = cursorY;
let isHovering = false;

document.addEventListener('mousemove', e => {
  cursorX = e.clientX;
  cursorY = e.clientY;
  if (cursor) {
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
  }
});

// Smooth lagging ring
function animateRing() {
  ringX += (cursorX - ringX) * 0.12;
  ringY += (cursorY - ringY) * 0.12;
  if (cursorRing) {
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
  }
  requestAnimationFrame(animateRing);
}
animateRing();

const hoverTargets = 'a, button, .service-card, .tool-chip, .exp-item, .ty-social-btn, .whatsapp-float, .scroll-top, .stat-item';

document.addEventListener('mouseover', e => {
  if (e.target.closest(hoverTargets)) {
    cursor && cursor.classList.add('hovered');
    cursorRing && cursorRing.classList.add('hovered');
  }
});

document.addEventListener('mouseout', e => {
  if (e.target.closest(hoverTargets)) {
    cursor && cursor.classList.remove('hovered');
    cursorRing && cursorRing.classList.remove('hovered');
  }
});

// Ripple on click
document.addEventListener('click', e => {
  const ripple = document.createElement('div');
  ripple.className = 'ripple';
  const size = 80;
  ripple.style.cssText = `
    width:${size}px; height:${size}px;
    left:${e.clientX - size / 2}px;
    top:${e.clientY - size / 2}px;
    position:fixed; border-radius:50%;
    background:rgba(0,255,106,0.2);
    transform:scale(0);
    animation:rippleAnim 0.8s ease-out forwards;
    pointer-events:none; z-index:99996;
  `;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 800);
});

// ===== TEXT SCRAMBLE CLASS =====
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#●◆■▲';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const old = this.el.innerText;
    const length = Math.max(old.length, newText.length);
    const promise = new Promise(resolve => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = old[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 20);
      const end = start + Math.floor(Math.random() * 20);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;
    for (let i = 0; i < this.queue.length; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span style="color:rgba(0,255,106,0.6)">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// ===== LOADING SCREEN =====
const loaderEl = document.getElementById('loader');
const loaderBar = document.getElementById('loaderBar');
const loaderPct = document.getElementById('loaderPct');
const loaderLabel = document.getElementById('loaderLabel');
const navbar = document.getElementById('navbar');

const labels = ['Initializing...', 'Loading Assets...', 'Crafting Design...', 'Building Magic...', 'Almost Ready...', 'Welcome!'];
let pct = 0;

function advanceLoader() {
  const step = Math.random() * 10 + 5;
  pct = Math.min(pct + step, 100);
  loaderBar.style.width = pct + '%';
  loaderPct.textContent = Math.floor(pct) + '%';
  loaderLabel.textContent = labels[Math.floor((pct / 100) * (labels.length - 1))];

  if (pct < 100) {
    setTimeout(advanceLoader, Math.random() * 80 + 40);
  } else {
    loaderPct.textContent = '100%';
    loaderLabel.textContent = 'Welcome!';
    setTimeout(finishLoader, 600);
  }
}

function finishLoader() {
  loaderEl.classList.add('hidden');
  setTimeout(() => navbar.classList.add('visible'), 150);

  // Scramble hero name on reveal
  const heroNameEl = document.getElementById('heroName');

  const heroItems = [
    { el: document.getElementById('heroEyebrow'), delay: 250 },
    { el: heroNameEl, delay: 450 },
    { el: document.getElementById('heroDesc'), delay: 650 },
    { el: document.getElementById('heroBtns'), delay: 800 },
    { el: document.getElementById('heroRight'), delay: 550 },
    { el: document.getElementById('heroScroll'), delay: 1100 },
  ];

  heroItems.forEach(({ el, delay }) => {
    if (!el) return;
    setTimeout(() => {
      el.style.transition = 'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)';
      el.style.opacity = '1';
      el.style.transform = 'none';
    }, delay);
  });
}

window.addEventListener('load', () => { setTimeout(advanceLoader, 300); });
setTimeout(() => { if (pct === 0) advanceLoader(); }, 500);

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

// ===== SCROLL REVEAL =====
const revealSelectors = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-img', '.reveal-img-left', '.reveal-img-right', '.reveal-stagger'];
const allReveal = document.querySelectorAll(revealSelectors.join(','));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 70);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

allReveal.forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, duration = 1600) {
  const sup = el.querySelector('sup');
  let start = 0;
  const step = target / (duration / 16);
  const ease = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = (now - startTime) / duration;
    const progress = Math.min(elapsed, 1);
    const current = Math.floor(ease(progress) * target);
    const firstNode = el.childNodes[0];
    if (firstNode && firstNode.nodeType === Node.TEXT_NODE) {
      firstNode.textContent = current;
    } else {
      el.textContent = current;
      if (sup) el.appendChild(sup);
    }
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num[data-target]').forEach((num, i) => {
        const target = parseInt(num.dataset.target);
        if (!isNaN(target)) setTimeout(() => animateCounter(num, target), i * 200);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const stats = document.querySelector('.about-stats');
if (stats) statsObserver.observe(stats);

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const targetEl = document.querySelector(a.getAttribute('href'));
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== NAV SCROLL EFFECT =====
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ===== SCROLL TO TOP =====
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== PARALLAX =====
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const gl = document.querySelector('.hero-grid-lines');
      const bg = document.querySelector('.hero-bg');
      if (gl) gl.style.transform = `translateY(${y * 0.25}px)`;
      if (bg) bg.style.transform = `translateY(${y * 0.1}px)`;
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// ===== MAGNETIC BUTTONS =====
document.querySelectorAll('.btn-primary, .btn-outline, .nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1)';
    setTimeout(() => btn.style.transition = '', 500);
  });
});

// ===== 3D TILT ON SERVICE CARDS =====
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) scale(1.01)`;
    card.style.boxShadow = `
      ${-x * 20}px ${y * 20}px 40px rgba(0,0,0,0.4),
      ${-x * 8}px ${y * 8}px 20px rgba(0,255,106,0.06)
    `;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.boxShadow = '';
  });
});

// ===== 3D TILT ON HERO IMAGE =====
const heroFrame = document.querySelector('.hero-photo-frame');
if (heroFrame) {
  const heroRight = document.querySelector('.hero-right');
  heroRight && heroRight.addEventListener('mousemove', e => {
    const rect = heroRight.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    heroFrame.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 10}deg) scale(1.02)`;
  });
  heroRight && heroRight.addEventListener('mouseleave', () => {
    heroFrame.style.transform = '';
  });
}

// ===== ACTIVE NAV LINK HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinksAll.forEach(link => {
        link.classList.toggle('nav-active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ===== FLOATING ORBIT DOTS on HERO =====
(function addOrbitDots() {
  const heroFrameEl = document.querySelector('.hero-photo-frame');
  if (!heroFrameEl) return;
  const wrap = document.createElement('div');
  wrap.className = 'hero-orbit';
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('div');
    dot.className = 'orbit-dot';
    wrap.appendChild(dot);
  }
  heroFrameEl.appendChild(wrap);
})();

// ===== MARQUEE PAUSE ON HOVER =====
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
  marqueeTrack.addEventListener('mouseenter', () => {
    marqueeTrack.style.animationPlayState = 'paused';
  });
  marqueeTrack.addEventListener('mouseleave', () => {
    marqueeTrack.style.animationPlayState = 'running';
  });
}

// ===== SCRAMBLE TEXT EFFECT on EXP COMPANY HOVER =====
document.querySelectorAll('.exp-company').forEach(el => {
  const original = el.textContent;
  const scrambler = new TextScramble(el);
  el.closest('.exp-item').addEventListener('mouseenter', () => {
    scrambler.setText(original);
  });
});

// ===== MAGNETIC WHATSAPP BUTTON =====
const waBtn = document.querySelector('.whatsapp-float');
if (waBtn) {
  waBtn.addEventListener('mousemove', e => {
    const rect = waBtn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    waBtn.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px) scale(1.15)`;
  });
  waBtn.addEventListener('mouseleave', () => {
    waBtn.style.transform = '';
  });
}

// ===== ABOUT PHOTO PARALLAX =====
const aboutPhoto = document.querySelector('.about-photo-wrap');
if (aboutPhoto) {
  const aboutSection = document.getElementById('about');
  window.addEventListener('scroll', () => {
    if (!aboutSection) return;
    const rect = aboutSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const progress = 1 - (rect.top + rect.height) / (window.innerHeight + rect.height);
      const img = aboutPhoto.querySelector('img');
      if (img) img.style.transform = `scale(1.05) translateY(${progress * -20}px)`;
    }
  }, { passive: true });
}

// ===== HERO TEXT TYPING EFFECT FOR DESC =====
(function typeHeroDesc() {
  const desc = document.getElementById('heroDesc');
  if (!desc) return;
  const fullText = desc.textContent;
  desc.innerHTML = '';

  function startTyping() {
    if (parseFloat(desc.style.opacity) < 0.5) {
      setTimeout(startTyping, 200);
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      desc.textContent = fullText.slice(0, i);
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 18);
  }

  // Observe when heroDesc becomes visible
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { startTyping(); obs.disconnect(); } });
  }, { threshold: 0.5 });
  obs.observe(desc);
})();

// ===== FOOTER YEAR =====
const footerCopy = document.querySelector('.footer-copy');
if (footerCopy) {
  const yr = new Date().getFullYear();
  footerCopy.textContent = footerCopy.textContent.replace('2025', yr);
}

// ===== TOOL CHIPS STAGGER APPEAR =====
(function staggerChips() {
  const chips = document.querySelectorAll('.tool-chip');
  chips.forEach((chip, i) => {
    chip.style.opacity = '0';
    chip.style.transform = 'translateY(20px)';
    chip.style.transition = `opacity 0.5s ${i * 0.1}s, transform 0.5s ${i * 0.1}s cubic-bezier(0.22,1,0.36,1)`;
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        chips.forEach(chip => { chip.style.opacity = '1'; chip.style.transform = ''; });
        obs.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const toolsSection = document.getElementById('tools');
  if (toolsSection) obs.observe(toolsSection);
})();

// ===== SECTION BG COLOR SHIFT on SCROLL =====
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const totalH = document.body.scrollHeight - window.innerHeight;
  const progress = y / totalH;
  const greenIntensity = Math.sin(progress * Math.PI) * 0.03;
  document.body.style.background = `hsl(0, 0%, ${3 + greenIntensity}%)`;
}, { passive: true });

// ===== SERVICE CARDS ENTRANCE STAGGER =====
(function staggerServiceCards() {
  const cards = document.querySelectorAll('.service-card');
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = `opacity 0.6s ${i * 0.08}s, transform 0.6s ${i * 0.08}s cubic-bezier(0.22,1,0.36,1)`;
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cards.forEach(card => { card.style.opacity = '1'; card.style.transform = ''; });
        obs.disconnect();
      }
    });
  }, { threshold: 0.1 });

  const servicesSection = document.getElementById('services');
  if (servicesSection) obs.observe(servicesSection);
})();

// ===== EXPERIENCE ITEMS ENTRANCE =====
(function staggerExpItems() {
  const items = document.querySelectorAll('.exp-item');
  items.forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    item.style.transition = `opacity 0.5s ${i * 0.12}s, transform 0.5s ${i * 0.12}s cubic-bezier(0.22,1,0.36,1)`;
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        items.forEach(item => { item.style.opacity = '1'; item.style.transform = ''; });
        obs.disconnect();
      }
    });
  }, { threshold: 0.1 });

  const expSection = document.getElementById('experience');
  if (expSection) obs.observe(expSection);
})();

// ===== CURSOR TRAIL SPARKS =====
let lastX = 0, lastY = 0, sparkThrottle = 0;
document.addEventListener('mousemove', e => {
  const now = Date.now();
  if (now - sparkThrottle < 50) return;
  sparkThrottle = now;

  const dx = Math.abs(e.clientX - lastX);
  const dy = Math.abs(e.clientY - lastY);
  if (dx + dy < 10) return;
  lastX = e.clientX; lastY = e.clientY;

  const spark = document.createElement('div');
  spark.style.cssText = `
    position:fixed; left:${e.clientX}px; top:${e.clientY}px;
    width:4px; height:4px; background:rgba(0,255,106,0.6);
    border-radius:50%; pointer-events:none; z-index:99990;
    transform:translate(-50%,-50%);
    animation: sparkFade 0.6s ease-out forwards;
  `;
  document.body.appendChild(spark);
  setTimeout(() => spark.remove(), 600);
});

// Inject sparkFade keyframe
(function injectSpark() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes sparkFade {
      0% { transform: translate(-50%,-50%) scale(1); opacity: 0.8; }
      100% { transform: translate(-50%,-50%) scale(0) translateY(-${Math.random() * 20 + 10}px); opacity: 0; }
    }
    .nav-links a.nav-active { color: var(--green); }
    .nav-links a.nav-active::after { transform: scaleX(1); }
  `;
  document.head.appendChild(style);
})();