(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile menu
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-menu');
  const menuLinks = menu?.querySelectorAll('a') || [];
  const closeMenu = () => {
    toggle?.setAttribute('aria-expanded', 'false');
    menu?.classList.remove('open');
    menu?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    if (toggle) toggle.setAttribute('aria-label', 'Abrir menu');
  };
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    menu?.classList.toggle('open', !open);
    menu?.setAttribute('aria-hidden', String(open));
    document.body.classList.toggle('menu-open', !open);
    toggle.setAttribute('aria-label', open ? 'Abrir menu' : 'Fechar menu');
  });
  menuLinks.forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('in-view'));
  } else {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  // Hide header on downward scroll
  const header = document.querySelector('[data-header]');
  let lastY = window.scrollY;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking || document.body.classList.contains('menu-open')) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y > 180 && y > lastY + 8) header?.classList.add('hidden');
      else if (y < lastY - 8 || y < 80) header?.classList.remove('hidden');
      lastY = y;
      ticking = false;
    });
  }, { passive: true });

  // Custom cursor on fine pointers
  const cursor = document.querySelector('.cursor');
  const cursorText = cursor?.querySelector('span');
  if (cursor && window.matchMedia('(pointer:fine)').matches && !reduceMotion) {
    let x = -100, y = -100, cx = -100, cy = -100;
    const loop = () => {
      cx += (x - cx) * .18;
      cy += (y - cy) * .18;
      cursor.style.left = `${cx}px`;
      cursor.style.top = `${cy}px`;
      requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; }, { passive: true });
    document.querySelectorAll('.cursor-label').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        if (cursorText) cursorText.textContent = el.dataset.cursor || 'OPEN';
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        if (cursorText) cursorText.textContent = '';
      });
    });
  }

  // Current navigation section state
  const navLinks = [...document.querySelectorAll('.desktop-nav a')];
  const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        navLinks.forEach(a => a.toggleAttribute('aria-current', a.getAttribute('href') === id));
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    sections.forEach(section => navObserver.observe(section));
  }
})();
