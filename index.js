  /* LOADER */
  const loader = document.getElementById('loader');
  const loaderPercent = loader.querySelector('.loader-percent');
  let pct = 0;
  const ticker = setInterval(() => {
    pct = Math.min(pct + Math.random() * 18, 99);
    if (loaderPercent) loaderPercent.textContent = Math.floor(pct) + '%';
  }, 120);
 
  window.addEventListener('load', () => {
    clearInterval(ticker);
    if (loaderPercent) loaderPercent.textContent = '100%';
    setTimeout(() => {
      loader.classList.add('hide');
      setTimeout(() => loader.classList.add('gone'), 1000);
    }, 1800);
  });
 
  /* NAV SCROLL */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
 
  /* HAMBURGER */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });
  document.querySelectorAll('.mob-link, .mobile-cta').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
 
  /* SCROLL REVEAL */
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  revealEls.forEach(el => observer.observe(el));
 
  /* SKILL BARS */
  document.querySelectorAll('.about-skill-item').forEach(item => {
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        const fill = item.querySelector('.skill-fill');
        if (fill && !fill.dataset.animated) {
          fill.dataset.animated = '1';
          requestAnimationFrame(() => requestAnimationFrame(() => {
            fill.style.width = fill.dataset.width + '%';
          }));
        }
        io.disconnect();
      }
    }, { threshold: 0.5 });
    io.observe(item);
  });
 
  /* FILTER BUTTONS */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });
 
  /* NAV ACTIVE LINK */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }, { passive: true });
 
  /* FIX HERO PHOTO FALLBACK */
  document.querySelectorAll('.hero-photo img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
      const placeholder = img.nextElementSibling;
      if (placeholder) placeholder.style.display = 'flex';
    });
  });