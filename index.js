// ============ CUSTOM CURSOR — fixed dot, no ring ============
const cursor = document.getElementById('cursor');
let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;

document.addEventListener('mousemove', e => {
  cursorX = e.clientX;
  cursorY = e.clientY;
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
});

const hoverTargets = 'a, button, .service-card, .tool-chip, .exp-item, .ty-social-btn, .whatsapp-float, .scroll-top';

document.addEventListener('mouseover', e => {
  if (e.target.closest(hoverTargets)) {
    cursor.classList.add('hovered');
  }
});

document.addEventListener('mouseout', e => {
  if (e.target.closest(hoverTargets)) {
    cursor.classList.remove('hovered');
  }
});

// Ripple on click
document.addEventListener('click', e => {
  const ripple = document.createElement('div');
  ripple.className = 'ripple';
  const size = 60;
  ripple.style.cssText = `
    width:${size}px; height:${size}px;
    left:${e.clientX - size / 2}px;
    top:${e.clientY - size / 2}px;
  `;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
});

// ============ LOADING SCREEN ============
const loaderEl = document.getElementById('loader');
const loaderBar = document.getElementById('loaderBar');
const loaderPct = document.getElementById('loaderPct');
const loaderLabel = document.getElementById('loaderLabel');
const navbar = document.getElementById('navbar');

const labels = ['Initializing...', 'Loading Assets...', 'Crafting Design...', 'Almost Ready...', 'Welcome!'];
let pct = 0;

function advanceLoader() {
  const step = Math.random() * 10 + 5;
  pct = Math.min(pct + step, 100);
  loaderBar.style.width = pct + '%';
  loaderPct.textContent = Math.floor(pct) + '%';
  loaderLabel.textContent = labels[Math.floor((pct / 100) * (labels.length - 1))];

  if (pct < 100) {
    setTimeout(advanceLoader, Math.random() * 100 + 60);
  } else {
    loaderPct.textContent = '100%';
    loaderLabel.textContent = 'Welcome!';
    setTimeout(finishLoader, 700);
  }
}

function finishLoader() {
  loaderEl.classList.add('hidden');

  // Reveal navbar after loader hides
  setTimeout(() => navbar.classList.add('visible'), 150);

  // Stagger hero elements in
  const heroItems = [
    { el: document.getElementById('heroEyebrow'), delay: 250 },
    { el: document.getElementById('heroName'),    delay: 450 },
    { el: document.getElementById('heroDesc'),    delay: 650 },
    { el: document.getElementById('heroBtns'),    delay: 800 },
    { el: document.getElementById('heroRight'),   delay: 550 },
    { el: document.getElementById('heroScroll'),  delay: 1100 },
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

window.addEventListener('load', () => {
  setTimeout(advanceLoader, 300);
});

// Fallback
setTimeout(() => {
  if (pct === 0) advanceLoader();
}, 500);

// ============ MOBILE MENU ============
const hamburger = document.getElementById('navHamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  // Close on link click
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

// ============ SCROLL REVEAL ============
const revealSelectors = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-img', '.reveal-img-left', '.reveal-img-right'];
const allReveal = document.querySelectorAll(revealSelectors.join(','));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

allReveal.forEach(el => revealObserver.observe(el));

// ============ COUNTER ANIMATION ============
function animateCounter(el, target, duration = 1400) {
  const sup = el.querySelector('sup');
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    // Preserve the <sup> child if present
    const firstNode = el.childNodes[0];
    if (firstNode && firstNode.nodeType === Node.TEXT_NODE) {
      firstNode.textContent = Math.floor(start);
    } else {
      el.textContent = Math.floor(start);
      if (sup) el.appendChild(sup);
    }
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num[data-target]').forEach(num => {
        const target = parseInt(num.dataset.target);
        if (!isNaN(target)) animateCounter(num, target);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const stats = document.querySelector('.about-stats');
if (stats) statsObserver.observe(stats);

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const targetEl = document.querySelector(a.getAttribute('href'));
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============ NAV SCROLL EFFECT ============
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ============ SCROLL TO TOP BUTTON ============
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============ PARALLAX ============
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const gl = document.querySelector('.hero-grid-lines');
  if (gl) gl.style.transform = `translateY(${y * 0.25}px)`;
  const bg = document.querySelector('.hero-bg');
  if (bg) bg.style.transform = `translateY(${y * 0.1}px)`;
}, { passive: true });

// ============ MAGNETIC HOVER ON BUTTONS ============
document.querySelectorAll('.btn-primary, .btn-outline, .nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.16}px, ${y * 0.16}px) translateY(-2px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ============ SERVICE CARD TILT ============
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-4px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ============ ACTIVE NAV LINK HIGHLIGHT ============
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinksAll.forEach(link => {
        link.classList.toggle(
          'nav-active',
          link.getAttribute('href') === '#' + entry.target.id
        );
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => sectionObserver.observe(s));