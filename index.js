  /* LOADER */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hide');
      setTimeout(() => loader.classList.add('gone'), 900);
    }, 1800);
  });
 
  /* CURSOR */
  const cursor = document.getElementById('cursor');
  document.addEventListener('mousemove', e => {
    cursor.style.right = (window.innerWidth - e.clientX - 8) + 'px';
    cursor.style.top  = e.clientY + 'px';
    cursor.style.left = 'auto';
  });
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
 
  /* SCROLL PROGRESS */
  const progressBar = document.getElementById('scroll-progress-bar');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (scrolled / total * 100) + '%';
  }, { passive: true });
 
  /* SCROLL REVEAL */
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
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
      const filter = this.dataset.filter;
      document.querySelectorAll('.work-item').forEach(item => {
        if (filter === 'all' || item.dataset.cat === filter) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
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
 
  /* HAMBURGER & MOBILE MENU */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileOverlay = document.getElementById('mobile-overlay');
 
  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    mobileOverlay.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  mobileOverlay.addEventListener('click', closeMenu);
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
 
  /* BACK TO TOP */
  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
