(() => {
  const cards = [...document.querySelectorAll('#work [data-live-preview]')];
  if (!cards.length) return;

  const connection = navigator.connection;
  const shouldKeepStatic =
    window.matchMedia('(max-width: 820px)').matches ||
    connection?.saveData ||
    /(^|-)2g$/.test(connection?.effectiveType || '');

  if (shouldKeepStatic) return;

  const styles = document.createElement('style');
  styles.textContent = `
    .project-media[data-live-preview] > img {
      position: relative;
      z-index: 1;
      opacity: 1;
      transition: opacity .45s var(--ease);
    }

    .project-live-preview {
      position: absolute;
      z-index: 2;
      top: 34px;
      left: 0;
      width: 1440px;
      margin: 0;
      padding: 0;
      border: 0;
      opacity: 0;
      pointer-events: none;
      transform-origin: 0 0;
      background: #0a0a0a;
      transition: opacity .45s var(--ease);
    }

    .project-media[data-live-preview].preview-ready .project-live-preview {
      opacity: 1;
    }

    .project-media[data-live-preview].preview-ready > img {
      opacity: 0;
    }

    .project-media[data-live-preview] .project-browser {
      z-index: 5;
    }

    .project-live-badge {
      position: absolute;
      z-index: 5;
      right: .72rem;
      bottom: .72rem;
      display: inline-flex;
      align-items: center;
      gap: .38rem;
      padding: .42rem .56rem;
      border: 1px solid rgba(255,255,255,.18);
      background: rgba(5,5,5,.76);
      backdrop-filter: blur(8px);
      color: #f1f1ec;
      font: 600 .48rem/1 var(--mono);
      letter-spacing: .08em;
      pointer-events: none;
      opacity: 0;
      transform: translateY(5px);
      transition: opacity .3s ease, transform .3s ease;
    }

    .project-live-badge::before {
      content: "";
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--accent);
      box-shadow: 0 0 0 3px rgba(255,59,48,.12);
    }

    .project-media[data-live-preview].preview-ready .project-live-badge {
      opacity: 1;
      transform: translateY(0);
    }

    @media (max-width: 820px) {
      .project-live-preview,
      .project-live-badge {
        display: none !important;
      }

      .project-media[data-live-preview] > img {
        opacity: 1 !important;
      }
    }
  `;
  document.head.append(styles);

  const PREVIEW_WIDTH = 1440;
  const BROWSER_BAR_HEIGHT = 34;

  const mountPreview = media => {
    if (media.dataset.previewMounted === 'true') return;
    media.dataset.previewMounted = 'true';

    const frame = document.createElement('iframe');
    const badge = document.createElement('span');

    frame.className = 'project-live-preview';
    frame.title = `Prévia ao vivo de ${media.querySelector('.project-browser b')?.textContent || 'projeto'}`;
    frame.tabIndex = -1;
    frame.loading = 'lazy';
    frame.setAttribute('aria-hidden', 'true');
    frame.setAttribute('scrolling', 'no');
    frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    frame.setAttribute(
      'allow',
      "autoplay 'none'; camera 'none'; microphone 'none'; geolocation 'none'"
    );

    badge.className = 'project-live-badge';
    badge.textContent = 'LIVE PREVIEW';

    const fit = () => {
      const width = media.clientWidth;
      const visibleHeight = Math.max(media.clientHeight - BROWSER_BAR_HEIGHT, 1);
      const scale = width / PREVIEW_WIDTH;

      frame.style.height = `${Math.ceil(visibleHeight / Math.max(scale, 0.01))}px`;
      frame.style.transform = `scale(${scale})`;
    };

    const fallback = () => {
      media.classList.remove('preview-ready');
      frame.remove();
      badge.remove();
      media.dataset.previewMounted = 'failed';
    };

    const timeout = window.setTimeout(fallback, 12000);

    frame.addEventListener(
      'load',
      () => {
        window.clearTimeout(timeout);
        fit();

        // Keep the screenshot as the fallback until the remote page has loaded.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => media.classList.add('preview-ready'));
        });
      },
      { once: true }
    );

    frame.addEventListener('error', () => {
      window.clearTimeout(timeout);
      fallback();
    }, { once: true });

    media.append(frame, badge);
    fit();
    frame.src = media.href;

    if ('ResizeObserver' in window) {
      const resizeObserver = new ResizeObserver(fit);
      resizeObserver.observe(media);
    } else {
      window.addEventListener('resize', fit, { passive: true });
    }
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          mountPreview(entry.target);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.01,
        rootMargin: '300px 0px'
      }
    );

    cards.forEach(card => observer.observe(card));
  } else {
    cards.forEach(mountPreview);
  }
})();
