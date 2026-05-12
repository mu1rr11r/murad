  // CUSTOM CURSOR
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;
 
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
  });
 
  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx - 20}px, ${ry - 20}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();
 
  document.querySelectorAll('a, button, .service-card, .tool-chip, .exp-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform += ' scale(2)';
      ring.style.opacity = '1';
      ring.style.transform += ' scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.opacity = '0.5';
    });
  });
 
  // SCROLL REVEAL
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
 
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
 
  // COUNTER ANIMATION
  function animateCounter(el, target, duration = 1500) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { start = target; clearInterval(timer); }
      el.textContent = Math.floor(start);
    }, 16);
  }
 
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const nums = entry.target.querySelectorAll('.stat-num');
        nums.forEach(num => {
          const text = num.textContent;
          const val = parseInt(text);
          if (!isNaN(val)) {
            const sup = num.querySelector('sup');
            num.textContent = '0';
            if (sup) num.appendChild(sup);
            animateCounter(num.childNodes[0], val);
          }
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
 
  const aboutStats = document.querySelector('.about-stats');
  if (aboutStats) statsObserver.observe(aboutStats);
 
  // SMOOTH SCROLL NAV
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
 
  // NAV SCROLL EFFECT
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
      nav.style.borderBottomColor = 'rgba(0,255,106,0.2)';
    } else {
      nav.style.borderBottomColor = 'rgba(0,255,106,0.1)';
    }
  });
 
  // PARALLAX
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const heroGridLines = document.querySelector('.hero-grid-lines');
    if (heroGridLines) {
      heroGridLines.style.transform = `translateY(${y * 0.3}px)`;
    }
  });