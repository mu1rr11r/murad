  // ============ CURSOR ============
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;
  let ringAF;
 
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });
 
  function animateRing() {
    rx += (mx - rx) * 0.10;
    ry += (my - ry) * 0.10;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    ringAF = requestAnimationFrame(animateRing);
  }
  animateRing();
 
  const hoverTargets = 'a, button, .service-card, .tool-chip, .exp-item, .ty-social-btn';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add('hovered');
      ring.classList.add('hovered');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('hovered');
      ring.classList.remove('hovered');
    }
  });
 
  // Ripple on click
  document.addEventListener('click', e => {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    const size = 60;
    ripple.style.cssText = `
      width:${size}px; height:${size}px;
      left:${e.clientX - size/2}px; top:${e.clientY - size/2}px;
      position:fixed; z-index:99996; pointer-events:none;
      border-radius:50%; background:rgba(0,255,106,0.25);
      transform:scale(0); animation:rippleAnim 0.7s ease-out forwards;
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
    const step = Math.random() * 12 + 4;
    pct = Math.min(pct + step, 100);
    loaderBar.style.width = pct + '%';
    loaderPct.textContent = Math.floor(pct) + '%';
    loaderLabel.textContent = labels[Math.floor((pct / 100) * (labels.length - 1))];
 
    if (pct < 100) {
      setTimeout(advanceLoader, Math.random() * 120 + 60);
    } else {
      loaderPct.textContent = '100%';
      loaderLabel.textContent = 'Welcome!';
      setTimeout(finishLoader, 600);
    }
  }
 
  function finishLoader() {
    loaderEl.classList.add('hidden');
    // Reveal navbar
    setTimeout(() => navbar.classList.add('visible'), 100);
    // Stagger hero elements
    const heroItems = [
      { el: document.getElementById('heroEyebrow'), delay: 200 },
      { el: document.getElementById('heroName'), delay: 400 },
      { el: document.getElementById('heroDesc'), delay: 600 },
      { el: document.getElementById('heroBtns'), delay: 750 },
      { el: document.getElementById('heroRight'), delay: 500 },
      { el: document.getElementById('heroScroll'), delay: 1000 },
    ];
    heroItems.forEach(({ el, delay }) => {
      setTimeout(() => {
        el.style.transition = 'opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1)';
        el.style.opacity = '1';
        el.style.transform = 'none';
      }, delay);
    });
  }
 
  window.addEventListener('load', () => {
    setTimeout(advanceLoader, 300);
  });
 
  // Fallback if load fires late
  setTimeout(() => {
    if (pct === 0) advanceLoader();
  }, 400);
 
  // ============ SCROLL REVEAL ============
  const revealClasses = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-img', '.reveal-img-left', '.reveal-img-right'];
  const allReveal = document.querySelectorAll(revealClasses.join(','));
 
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 70);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
 
  allReveal.forEach(el => revealObserver.observe(el));
 
  // ============ COUNTER ANIMATION ============
  function animateCounter(el, target, duration = 1400) {
    const sup = el.querySelector('sup');
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { start = target; clearInterval(timer); }
      const node = el.childNodes[0];
      if (node && node.nodeType === Node.TEXT_NODE) {
        node.textContent = Math.floor(start);
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
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
 
  // ============ NAV SCROLL EFFECT ============
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
 
  // ============ PARALLAX ============
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const gl = document.querySelector('.hero-grid-lines');
    if (gl) gl.style.transform = `translateY(${y * 0.28}px)`;
    const bg = document.querySelector('.hero-bg');
    if (bg) bg.style.transform = `translateY(${y * 0.12}px)`;
  }, { passive: true });
 
  // ============ MAGNETIC HOVER ON BUTTONS ============
  document.querySelectorAll('.btn-primary, .btn-outline, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
 
  // ============ PHONE CLICK RING ============
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
      link.style.animation = 'loaderGlow 0.4s ease-out';
      setTimeout(() => link.style.animation = '', 400);
    });
  });
 
  // ============ SERVICE CARD TILT ============
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });