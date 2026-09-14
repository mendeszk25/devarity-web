(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer:fine)').matches;
  const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
  const lerp = (a, b, t) => a + (b - a) * t;


  // Cinematic Devarity loader:
  // each letter takes the spotlight, the word settles, then morphs into the hero.
  const loader = document.querySelector('[data-loader]');
  const loaderWord = document.querySelector('[data-loader-word]');
  const loaderProgress = document.querySelector('[data-loader-progress]');
  const loaderBar = document.querySelector('[data-loader-bar]');
  const heroBrand = document.querySelector('[data-hero-brand]');

  const LOADER_WORD = 'DEVARITY';
  const LETTER_STEP = 185;
  const LETTER_CYCLES = 2;
  const SETTLE_TIME = 460;
  const MORPH_TIME = 860;
  const MIN_LOADER_TIME = (LOADER_WORD.length * LETTER_STEP * LETTER_CYCLES) + SETTLE_TIME;

  let loaderFinished = false;
  let loaderStartedAt = performance.now();

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  const setLoaderProgress = value => {
    const safe = Math.max(0, Math.min(100, value));
    if (loaderProgress) loaderProgress.textContent = String(Math.floor(safe)).padStart(2, '0');
    if (loaderBar) loaderBar.style.transform = `scaleX(${safe / 100})`;
  };

  const prepareLoaderWord = () => {
    if (!loaderWord) return [];
    loaderWord.setAttribute('aria-label', LOADER_WORD);
    loaderWord.innerHTML = [...LOADER_WORD]
      .map((letter, index) => `<span class="loader-letter" data-loader-letter="${index}">${letter}</span>`)
      .join('');
    if (heroBrand) heroBrand.textContent = LOADER_WORD;
    return [...loaderWord.querySelectorAll('[data-loader-letter]')];
  };

  const animateLetters = async () => {
    const letters = prepareLoaderWord();
    if (!letters.length || reduceMotion) return;

    const totalSteps = letters.length * LETTER_CYCLES;
    let step = 0;

    for (let cycle = 0; cycle < LETTER_CYCLES; cycle += 1) {
      for (let index = 0; index < letters.length; index += 1) {
        const letter = letters[index];

        letters.forEach((item, itemIndex) => item.classList.toggle('is-active', itemIndex === index));

        letter.animate(
          [
            { transform: 'translateY(0) scale(1,1)' },
            { transform: 'translateY(-.21em) scale(1.09,1.11)', offset: .42 },
            { transform: 'translateY(.025em) scale(.995,.975)', offset: .7 },
            { transform: 'translateY(-.012em) scale(1.005,1.015)', offset: .86 },
            { transform: 'translateY(0) scale(1,1)' }
          ],
          {
            duration: LETTER_STEP * .96,
            easing: 'cubic-bezier(.22,.8,.28,1)',
            fill: 'none'
          }
        );

        step += 1;
        setLoaderProgress(8 + (step / totalSteps) * 78);
        await sleep(LETTER_STEP);
      }
    }

    letters.forEach((item, index) => {
      item.classList.remove('is-active');
      item.textContent = LOADER_WORD[index];
    });

    setLoaderProgress(91);

    loaderWord.animate(
      [
        { transform: 'translateY(0) scale(1)', letterSpacing: '-.075em' },
        { transform: 'translateY(-.025em) scale(1.012)', letterSpacing: '-.06em', offset: .5 },
        { transform: 'translateY(0) scale(1)', letterSpacing: '-.075em' }
      ],
      {
        duration: SETTLE_TIME,
        easing: 'cubic-bezier(.2,.75,.2,1)',
        fill: 'none'
      }
    );

    await sleep(SETTLE_TIME);
  };

  const waitForPage = async () => {
    if (document.readyState === 'complete') return;
    await new Promise(resolve => window.addEventListener('load', resolve, { once: true }));
  };

  const finishLoader = async () => {
    if (loaderFinished) return;
    loaderFinished = true;

    if (!loader) {
      document.body.classList.add('site-ready');
      return;
    }

    if (reduceMotion) {
      if (heroBrand) heroBrand.textContent = LOADER_WORD;
      loader.remove();
      document.body.classList.remove('is-loading');
      document.body.classList.add('site-ready');
      return;
    }

    const elapsed = performance.now() - loaderStartedAt;
    if (elapsed < MIN_LOADER_TIME) await sleep(MIN_LOADER_TIME - elapsed);

    setLoaderProgress(100);
    await sleep(180);

    if (loaderWord && heroBrand) {
      heroBrand.textContent = LOADER_WORD;
      heroBrand.style.visibility = 'hidden';

      const from = loaderWord.getBoundingClientRect();
      const to = heroBrand.getBoundingClientRect();
      const scale = to.width / Math.max(from.width, 1);
      const dx = to.left - from.left;
      const dy = to.top - from.top;

      loader.querySelectorAll('.loader-kicker,.loader-footer,.loader-grid').forEach(el => {
        el.animate(
          [{ opacity: 1 }, { opacity: 0 }],
          { duration: 330, easing: 'ease', fill: 'forwards' }
        );
      });

      const morph = loaderWord.animate(
        [
          {
            transform: 'translate3d(0,0,0) scale(1)',
            opacity: 1,
            filter: 'blur(0)'
          },
          {
            transform: `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`,
            opacity: 1,
            color: 'rgba(241,241,236,0)',
            WebkitTextStroke: '1px rgba(255,255,255,.13)',
            filter: 'blur(0)'
          }
        ],
        {
          duration: MORPH_TIME,
          easing: 'cubic-bezier(.16,.78,.2,1)',
          fill: 'forwards'
        }
      );

      loader.animate(
        [
          { backgroundColor: '#050505' },
          { backgroundColor: 'rgba(5,5,5,.94)', offset: .55 },
          { backgroundColor: 'rgba(5,5,5,0)' }
        ],
        {
          duration: MORPH_TIME + 180,
          delay: 120,
          easing: 'cubic-bezier(.2,.75,.2,1)',
          fill: 'forwards'
        }
      );

      await morph.finished.catch(() => {});
      heroBrand.style.visibility = 'visible';
    }

    document.body.classList.remove('is-loading');
    document.body.classList.add('site-ready');

    loader.classList.add('is-leaving');
    loader.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 360, easing: 'ease', fill: 'forwards' }
    );

    setTimeout(() => loader.remove(), 390);
  };

  if (loader && !reduceMotion) {
    document.body.classList.add('is-loading');
    loaderStartedAt = performance.now();
    setLoaderProgress(0);

    Promise.all([
      animateLetters(),
      waitForPage()
    ]).then(finishLoader);

    setTimeout(() => {
      if (document.body.classList.contains('is-loading') && !loaderFinished) finishLoader();
    }, 7000);
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

  // Scroll-scrubbed hero depth. The process objects live in the shared WebGL scene.
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
