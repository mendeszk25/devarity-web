(() => {
  // Keep ordinary links and screenshots when the browser or connection is limited.
  if (!('IntersectionObserver' in window) || !('ResizeObserver' in window) ||
      navigator.connection?.saveData || /(^|-)2g$/.test(navigator.connection?.effectiveType || '') ||
      matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const states = [...document.querySelectorAll('#work [data-live-preview]')].map(media => ({
    media, visible: false, frame: null, controller: null, timer: null, failed: false,
  }));

  function stop(state) {
    state.controller?.abort();
    state.controller = null;
    clearTimeout(state.timer);
    state.media.classList.remove('preview-ready');
    state.frame?.remove();
    state.frame = null;
  }

  function size(state) {
    if (!state.frame) return;
    // Render a readable miniature desktop page without changing the card geometry.
    const scale = state.media.clientWidth / 1440;
    state.frame.style.height = `${(state.media.clientHeight - 34) / scale}px`;
    state.frame.style.transform = `scale(${scale})`;
  }

  async function start(state) {
    if (!state.visible || document.hidden || state.failed || state.controller || state.frame) return;
    const controller = new AbortController();
    state.controller = controller;
    state.timer = setTimeout(() => { state.failed = true; stop(state); }, 15000);
    try {
      // iframe load also fires for blocked documents. Check framing policy server-side first.
      const response = await fetch(`/api/project-preview?id=${encodeURIComponent(state.media.dataset.livePreview)}`, {
        signal: controller.signal,
      });
      if (!response.ok || !(await response.json()).allowed) throw new Error('Preview unavailable');
      if (controller.signal.aborted) return;
      const frame = document.createElement('iframe');
      frame.className = 'project-live-preview';
      frame.title = `Preview do site ${state.media.querySelector('.project-browser b').textContent}`;
      frame.tabIndex = -1;
      frame.setAttribute('aria-hidden', 'true');
      frame.setAttribute('sandbox', 'allow-scripts allow-same-origin');
      frame.setAttribute('allow', "autoplay 'none'; camera 'none'; microphone 'none'; geolocation 'none'");
      frame.referrerPolicy = 'no-referrer';
      frame.addEventListener('load', () => {
        if (state.frame !== frame) return;
        clearTimeout(state.timer);
        state.media.classList.add('preview-ready');
      }, { once: true });
      frame.addEventListener('error', () => { state.failed = true; stop(state); }, { once: true });
      state.frame = frame;
      size(state);
      frame.src = state.media.href;
      state.media.append(frame);
    } catch (error) {
      if (controller.signal.aborted) return;
      state.failed = true;
      stop(state);
    }
  }

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const state = states.find(item => item.media === entry.target);
      state.visible = entry.isIntersecting;
      if (state.visible) start(state);
      else stop(state);
    }
  }, { threshold: 0 });
  const resize = new ResizeObserver(() => states.forEach(size));
  states.forEach(state => { observer.observe(state.media); resize.observe(state.media); });
  document.addEventListener('visibilitychange', () => states.forEach(state => document.hidden ? stop(state) : start(state)));
})();
