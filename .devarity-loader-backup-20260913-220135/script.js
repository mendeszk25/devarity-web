(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer:fine)').matches;
  const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
  const lerp = (a, b, t) => a + (b - a) * t;

  // Short cinematic loader + FLIP-like transition into the hero DEVARITY word.
  const loader = document.querySelector('[data-loader]');
  const loaderWord = document.querySelector('[data-loader-word]');
  const loaderProgress = document.querySelector('[data-loader-progress]');
  const loaderBar = document.querySelector('[data-loader-bar]');
  const heroBrand = document.querySelector('[data-hero-brand]');

  let loaderFinished = false;
  const finishLoader = async () => {
    if (loaderFinished) return;
    loaderFinished = true;
    if (!loader) {
      document.body.classList.add('site-ready');
      return;
    }
    if (reduceMotion) {
      loader.remove();
      document.body.classList.remove('is-loading');
      document.body.classList.add('site-ready');
      return;
    }

    if (loaderProgress) loaderProgress.textContent = '100';
    if (loaderBar) loaderBar.style.transform = 'scaleX(1)';
    await new Promise(resolve => setTimeout(resolve, 100));

    if (loaderWord && heroBrand) {
      heroBrand.style.visibility = 'hidden';
      const from = loaderWord.getBoundingClientRect();
      const to = heroBrand.getBoundingClientRect();
      const scale = to.width / Math.max(from.width, 1);
      const dx = to.left - from.left;
      const dy = to.top - from.top;
      const morph = loaderWord.animate([
        { transform: 'translate3d(0,0,0) scale(1)', opacity: 1 },
        { transform: `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`, opacity: .96 }
      ], { duration: 620, easing: 'cubic-bezier(.2,.75,.2,1)', fill: 'forwards' });
      loader.animate([{ backgroundColor: '#050505' }, { backgroundColor: 'rgba(5,5,5,0)' }], { duration: 500, delay: 180, easing: 'ease', fill: 'forwards' });
      loader.querySelectorAll('.loader-kicker,.loader-footer,.loader-grid').forEach(el => {
        el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, fill: 'forwards' });
      });
      await morph.finished.catch(() => {});
      heroBrand.style.visibility = 'visible';
    }

    loader.classList.add('is-leaving');
    loader.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: 'ease', fill: 'forwards' });
    document.body.classList.remove('is-loading');
    document.body.classList.add('site-ready');
    setTimeout(() => loader.remove(), 290);
  };

  if (loader && !reduceMotion) {
    document.body.classList.add('is-loading');
    let progress = 0;
    const started = performance.now();
    const tick = (now) => {
      const elapsed = now - started;
      const target = document.readyState === 'complete' ? 100 : Math.min(92, 18 + elapsed * .085);
      progress += (target - progress) * .12;
      if (loaderProgress) loaderProgress.textContent = String(Math.floor(progress)).padStart(2, '0');
      if (loaderBar) loaderBar.style.transform = `scaleX(${progress / 100})`;
      if (progress < 99 || document.readyState !== 'complete') requestAnimationFrame(tick);
      else finishLoader();
    };
    requestAnimationFrame(tick);
    // Safety: never let the loader feel slow on a cached/static site.
    setTimeout(() => {
      if (document.body.classList.contains('is-loading')) finishLoader();
    }, 1150);
  } else {
    finishLoader();
  }

  // Mobile menu
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-menu');
  const menuLinks = menu?.querySelectorAll('a') || [];
  const closeMenu = (restoreFocus = false) => {
    toggle?.setAttribute('aria-expanded', 'false');
    menu?.classList.remove('open');
    menu?.setAttribute('aria-hidden', 'true');
    menu?.setAttribute('inert', '');
    document.body.classList.remove('menu-open');
    if (toggle) toggle.setAttribute('aria-label', 'Abrir menu');
    if (restoreFocus) toggle?.focus();
  };
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    menu?.classList.toggle('open', !open);
    menu?.setAttribute('aria-hidden', String(open));
    if (open) menu?.setAttribute('inert', ''); else menu?.removeAttribute('inert');
    document.body.classList.toggle('menu-open', !open);
    toggle.setAttribute('aria-label', open ? 'Abrir menu' : 'Fechar menu');
    if (!open) menuLinks[0]?.focus();
  });
  menuLinks.forEach(link => link.addEventListener('click', () => closeMenu()));
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) closeMenu(true);
    if (e.key !== 'Tab' || !document.body.classList.contains('menu-open') || !toggle || !menuLinks.length) return;
    const first = menuLinks[0];
    const last = menuLinks[menuLinks.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); toggle.focus(); }
    else if (e.shiftKey && document.activeElement === toggle) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); toggle.focus(); }
    else if (!e.shiftKey && document.activeElement === toggle) { e.preventDefault(); first.focus(); }
  });

  // Reveal on scroll, with existing CSS stagger.
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
    }, { threshold: 0.1, rootMargin: '0px 0px -4% 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  // Hide header on downward scroll
  const header = document.querySelector('[data-header]');
  let lastY = window.scrollY;
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (scrollTicking || document.body.classList.contains('menu-open')) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y > 180 && y > lastY + 8) header?.classList.add('hidden');
      else if (y < lastY - 8 || y < 80) header?.classList.remove('hidden');
      lastY = y;
      scrollTicking = false;
    });
  }, { passive: true });

  // Custom cursor on fine pointers
  const cursor = document.querySelector('.cursor');
  const cursorText = cursor?.querySelector('span');
  if (cursor && finePointer && !reduceMotion) {
    let x = -100, y = -100, cx = -100, cy = -100;
    let cursorFrame = 0;
    const loop = () => {
      cx += (x - cx) * .18;
      cy += (y - cy) * .18;
      cursor.style.left = `${cx}px`;
      cursor.style.top = `${cy}px`;
      if (Math.abs(x - cx) > .1 || Math.abs(y - cy) > .1) cursorFrame = requestAnimationFrame(loop);
      else cursorFrame = 0;
    };
    window.addEventListener('mousemove', e => {
      x = e.clientX; y = e.clientY;
      if (!cursorFrame) cursorFrame = requestAnimationFrame(loop);
    }, { passive: true });
    document.querySelectorAll('.cursor-label').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        if (cursorText) cursorText.textContent = el.dataset.cursor || 'ABRIR';
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        if (cursorText) cursorText.textContent = '';
      });
    });
  }

  // Project cards: subtle pointer parallax/tilt, no layout shifts.
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.project').forEach(card => {
      const media = card.querySelector('.project-media');
      const image = card.querySelector('.project-media img');
      if (!media || !image) return;
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const nx = clamp((e.clientX - r.left) / r.width, 0, 1) - .5;
        const ny = clamp((e.clientY - r.top) / r.height, 0, 1) - .5;
        card.classList.add('is-tilting');
        media.style.transform = `perspective(900px) rotateX(${(-ny * 2.8).toFixed(2)}deg) rotateY(${(nx * 3.8).toFixed(2)}deg) translateZ(0)`;
        image.style.transform = `scale(1.035) translate3d(${(-nx * 5).toFixed(1)}px, ${(-ny * 5).toFixed(1)}px, 0)`;
      });
      card.addEventListener('pointerleave', () => {
        card.classList.remove('is-tilting');
        media.style.transform = '';
        image.style.transform = '';
      });
    });
  }

  // Small magnetic response on primary actions: premium feel without changing layout.
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.btn, .contact-cta').forEach(control => {
      control.addEventListener('pointermove', e => {
        const r = control.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        control.style.transform = `translate3d(${(x * 6).toFixed(1)}px, ${(y * 5).toFixed(1)}px, 0)`;
      });
      control.addEventListener('pointerleave', () => { control.style.transform = ''; });
    });
  }

  // Scroll-scrubbed 3D forge + hero brand depth. Inspired by cinematic scroll scenes,
  // implemented locally with requestAnimationFrame so the static site keeps zero runtime dependencies.
  const forgeSection = document.querySelector('.process');
  const forge = document.querySelector('[data-scroll-forge] .forge-orbit');
  const hero = document.querySelector('.hero');
  const heroMark = document.querySelector('.hero-mark');
  const brandWord = document.querySelector('[data-hero-brand]');
  let motionFrame = 0;
  const updateScrollMotion = () => {
    motionFrame = 0;
    if (reduceMotion) return;
    const vh = Math.max(window.innerHeight, 1);

    if (hero) {
      const r = hero.getBoundingClientRect();
      const p = clamp(-r.top / Math.max(r.height - vh * .2, 1), 0, 1);
      if (brandWord) brandWord.style.transform = `translate3d(${lerp(0, 28, p)}px, ${lerp(0, -26, p)}px, 0) rotateY(${lerp(0, -7, p)}deg) scale(${lerp(1, .965, p)})`;
      if (heroMark) heroMark.style.transform = `translate3d(0, ${lerp(0, -70, p)}px, 0) rotate(${lerp(0, 9, p)}deg) scale(${lerp(1, 1.08, p)})`;
    }

    if (forgeSection && forge) {
      const r = forgeSection.getBoundingClientRect();
      const p = clamp((vh - r.top) / (vh + r.height), 0, 1);
      const turn = lerp(-34, 34, p);
      const tilt = lerp(18, -12, p);
      const lift = Math.sin(p * Math.PI) * -16;
      forge.style.transform = `translate3d(0, ${lift.toFixed(1)}px, 0) rotateX(${tilt.toFixed(1)}deg) rotateY(${turn.toFixed(1)}deg) rotateZ(${lerp(-6, 8, p).toFixed(1)}deg)`;
      forge.style.setProperty('--forge-progress', p.toFixed(3));
    }
  };
  const requestScrollMotion = () => {
    if (!motionFrame) motionFrame = requestAnimationFrame(updateScrollMotion);
  };
  window.addEventListener('scroll', requestScrollMotion, { passive: true });
  window.addEventListener('resize', requestScrollMotion, { passive: true });
  requestScrollMotion();

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
