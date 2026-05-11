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
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%,-50%) scale(1.8)');
    el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');
  });
 
  /* SCROLL REVEAL */
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12 });
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
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current ? '#4ade80' : '';
    });
  }, { passive: true });