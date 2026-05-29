// ===== LOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 2800);
});

// ===== RAIN EFFECT =====
(function() {
  const container = document.createElement('div');
  container.className = 'rain-container';
  document.body.appendChild(container);

  for (let i = 0; i < 80; i++) {
    const drop = document.createElement('div');
    drop.className = 'rain-drop';
    drop.style.left = Math.random() * 100 + '%';
    drop.style.height = (15 + Math.random() * 30) + 'px';
    drop.style.animationDuration = (1 + Math.random() * 2) + 's';
    drop.style.animationDelay = Math.random() * 5 + 's';
    drop.style.opacity = (0.1 + Math.random() * 0.25).toString();
    container.appendChild(drop);
  }
})();

// ===== MOON SPAWNER =====
(function() {
  const moonPositions = [
    { top: '8%', right: '5%', size: 80 },
    { top: '35%', left: '3%', size: 50 },
    { bottom: '25%', right: '8%', size: 60 },
    { top: '55%', right: '2%', size: 40 },
    { bottom: '10%', left: '5%', size: 70 },
  ];

  moonPositions.forEach((pos, i) => {
    const moon = document.createElement('div');
    moon.className = 'moon';
    moon.style.width = pos.size + 'px';
    moon.style.height = pos.size + 'px';
    if (pos.top) moon.style.top = pos.top;
    if (pos.bottom) moon.style.bottom = pos.bottom;
    if (pos.left) moon.style.left = pos.left;
    if (pos.right) moon.style.right = pos.right;
    moon.style.animationDelay = (3 + i * 2) + 's';
    moon.innerHTML = '<div class="moon-glow"></div><div class="moon-body"></div>';
    document.body.appendChild(moon);
  });
})();

// ===== PARTICLES =====
(function() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (8 + Math.random() * 12) + 's';
    p.style.animationDelay = Math.random() * 10 + 's';
    const size = (1 + Math.random() * 3) + 'px';
    p.style.width = size;
    p.style.height = size;
    container.appendChild(p);
  }
})();

// ===== CUSTOM CURSOR =====
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx - 4 + 'px';
  dot.style.top = my - 4 + 'px';
});

(function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx - 20 + 'px';
  ring.style.top = ry - 20 + 'px';
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a,button,.tool-card,.service-card,.about-tag,.tilt-card').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hover'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
});

if ('ontouchstart' in window) {
  dot.style.display = 'none';
  ring.style.display = 'none';
}

// ===== NAV SCROLL =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== MOBILE MENU =====
const menuBtn = document.getElementById('menuBtn');
const mobMenu = document.getElementById('mobMenu');
menuBtn.addEventListener('click', () => {
  menuBtn.classList.toggle('active');
  mobMenu.classList.toggle('active');
  document.body.style.overflow = mobMenu.classList.contains('active') ? 'hidden' : '';
});
function closeMenu() {
  menuBtn.classList.remove('active');
  mobMenu.classList.remove('active');
  document.body.style.overflow = '';
}

// ===== SCROLL REVEAL - ALL DIRECTIONS =====
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll(
  '.reveal-up,.reveal-down,.reveal-left,.reveal-right,' +
  '.reveal-scale,.reveal-rotate-left,.reveal-rotate-right,' +
  '.reveal-flip,.reveal-zoom-rotate,.reveal-bounce,.reveal-blur,' +
  '.reveal-slide-fade,.timeline-item'
).forEach(el => revealObs.observe(el));

// ===== COUNTER =====
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target, target = parseInt(el.dataset.target);
      let cur = 0; const inc = target / 35;
      const t = setInterval(() => {
        cur += inc;
        if (cur >= target) { el.textContent = target + '+'; clearInterval(t); }
        else el.textContent = Math.floor(cur);
      }, 50);
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

// ===== 3D TILT =====
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(1000px) rotateY(${x*12}deg) rotateX(${y*-12}deg) scale3d(1.03,1.03,1.03)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale3d(1,1,1)';
  });
});

// ===== 3D SCROLL PARALLAX =====
const scenes = document.querySelectorAll('.scene');
let ticking = false;

function update3DScroll() {
  const scrollY = window.scrollY;
  const vh = window.innerHeight;

  scenes.forEach(scene => {
    const rect = scene.getBoundingClientRect();
    if (rect.top < vh && rect.bottom > 0) {
      const progress = (vh - rect.top) / (vh + rect.height);
      const rotateX = (progress - 0.5) * 3;
      const inner = scene.querySelector('.scene-inner');
      if (inner) {
        inner.style.transform = `rotateX(${rotateX}deg) translateZ(0)`;
      }
    }
  });

  // Parallax for about image
  const aboutImg = document.querySelector('.about-image-inner');
  if (aboutImg) {
    const rect = aboutImg.getBoundingClientRect();
    if (rect.top < vh && rect.bottom > 0) {
      const p = (vh - rect.top) / (vh + rect.height);
      aboutImg.style.transform = `perspective(1000px) rotateY(${(p-0.5)*6}deg) rotateX(${(p-0.5)*-3}deg)`;
    }
  }

  // Parallax for 3D floating elements
  document.querySelectorAll('.hero-3d-element').forEach((el, i) => {
    const speed = 0.02 + (i * 0.01);
    const yPos = scrollY * speed;
    const rotateVal = scrollY * 0.02 * (i + 1);
    el.style.transform = `translateY(${-yPos}px) rotateX(${rotateVal}deg) rotateY(${rotateVal * 0.5}deg)`;
  });

  // Moon parallax
  document.querySelectorAll('.moon').forEach((moon, i) => {
    const speed = 0.01 + (i * 0.005);
    moon.style.transform = `translateY(${scrollY * speed}px)`;
  });

  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(update3DScroll);
    ticking = true;
  }
});

// ===== SCROLL PROGRESS =====
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (scrollTop / docH * 100) + '%';
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const sp = window.scrollY + 200;
  sections.forEach(s => {
    const link = document.querySelector(`.nav-center a[href="#${s.id}"]`);
    if (link) {
      link.style.color = (sp >= s.offsetTop && sp < s.offsetTop + s.offsetHeight) ? 'var(--green)' : '';
    }
  });
});

// ===== FORM =====
function handleSubmit(e) {
  e.preventDefault();
  const toast = document.getElementById('toast');
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';
  e.target.reset();
  setTimeout(() => { toast.style.transform = 'translateY(100px)'; toast.style.opacity = '0'; }, 3000);
}

// ===== SECTION TITLE SPLIT ANIMATION =====
document.querySelectorAll('.section-title').forEach(title => {
  const html = title.innerHTML;
  const parts = html.split(/(<[^>]+>)/);
  let result = '';
  let wordIndex = 0;
  parts.forEach(part => {
    if (part.startsWith('<')) {
      result += part;
    } else {
      const words = part.split(' ');
      words.forEach(word => {
        if (word.trim()) {
          result += `<span style="display:inline-block;overflow:hidden"><span style="display:inline-block;transform:translateY(110%);transition:transform .6s cubic-bezier(.16,1,.3,1);transition-delay:${wordIndex*80}ms" class="title-word">${word}</span></span> `;
          wordIndex++;
        }
      });
    }
  });
  title.innerHTML = result;
});

const titleObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.title-word').forEach(w => {
        w.style.transform = 'translateY(0)';
      });
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.section-title').forEach(el => titleObs.observe(el));

// ===== MAGNETIC BUTTONS =====
document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width/2;
    const y = e.clientY - r.top - r.height/2;
    btn.style.transform = `translate(${x*0.15}px,${y*0.15}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ===== TOOL BAR FILL ANIMATION =====
const toolBarObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const fill = e.target;
      const width = fill.getAttribute('data-width');
      fill.style.setProperty('--fill-width', width + '%');
      fill.classList.add('animated');
      toolBarObs.unobserve(fill);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.tool-bar-fill').forEach(el => toolBarObs.observe(el));

// ===== 3D MOUSE TRACKING FOR HERO =====
const hero = document.querySelector('.hero');
if (hero) {
  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const logoArea = document.querySelector('.hero-logo-area');
    if (logoArea) {
      logoArea.style.transform = `perspective(800px) rotateY(${x*8}deg) rotateX(${y*-8}deg)`;
    }

    const glow = document.querySelector('.hero-glow');
    if (glow) {
      glow.style.transform = `translate(calc(-50% + ${x*30}px), calc(-50% + ${y*30}px))`;
    }
  });

  hero.addEventListener('mouseleave', () => {
    const logoArea = document.querySelector('.hero-logo-area');
    if (logoArea) logoArea.style.transform = '';
    const glow = document.querySelector('.hero-glow');
    if (glow) glow.style.transform = 'translate(-50%, -50%)';
  });
}