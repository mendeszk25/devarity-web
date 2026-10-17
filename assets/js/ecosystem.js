/* Progressive enhancement only. No timers or continuous rendering loops. */
(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const running = new Set();
  const animate = (element, frames, options = {}) => {
    if (!element || motion.matches || !element.animate) return;
    const animation = element.animate(frames, { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)', ...options });
    running.add(animation);
    animation.finished.catch(() => {}).finally(() => running.delete(animation));
    return animation;
  };
  motion.addEventListener('change', () => { if (motion.matches) running.forEach(a => a.cancel()); });

  const studio = document.querySelector('.studio-console');
  if (studio) {
    const buttons = [...studio.querySelectorAll('[data-studio-mode]')];
    buttons.forEach(button => button.addEventListener('click', event => {
      if (button.getAttribute('aria-pressed') === 'true') return;
      const mode = button.dataset.studioMode;
      studio.dataset.active = mode;
      buttons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      studio.querySelectorAll('[data-studio-panel]').forEach(panel => {
        panel.hidden = panel.dataset.studioPanel !== mode;
        if (!panel.hidden && event.detail !== 0) {
          animate(panel, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0)' }], { duration: 420 });
          panel.querySelectorAll('.studio-file-line>span').forEach((token, i) => animate(token,
            [{ transform: `translateX(${60 - i * 15}px) rotate(${12 - i * 6}deg)` }, { transform: 'translateX(0) rotate(0)' }], { delay: 60 + i * 45 }));
        }
      });
    }));
  }

  const modes = {
    image: { input: 'FOTO.PNG', format: 'SAÍDA / WEBP', output: 'Imagem convertida.', href: './converter-imagem/', label: 'imagem' },
    text: { input: 'OLÁ, MUNDO.', format: 'SAÍDA / CONTAGEM', output: '11 caracteres · 2 palavras', href: './contador-caracteres/', label: 'texto' },
    link: { input: 'DEVARITY.COM.BR', format: 'SAÍDA / MATRIZ VISUAL', output: 'Prévia de link em QR.', href: './gerar-qr-code/', label: 'link' }
  };
  document.querySelectorAll('[data-transform-demo]').forEach(demo => {
    let animations = [];
    const stop = () => { animations.forEach(a => a?.cancel()); animations = []; };
    const play = (keyboard = false) => {
      stop();
      if (motion.matches || keyboard) return;
      const engine = demo.querySelector('.transform-engine');
      animations.push(animate(engine, [{ transform: 'rotate(-9deg)' }, { transform: 'rotate(0deg)', offset: .45 }, { transform: 'rotate(-9deg)' }], { duration: 760 }));
      demo.querySelectorAll('.file-token').forEach((token, i) => {
        const base = getComputedStyle(token).transform;
        animations.push(animate(token, [{ transform: base, opacity: 1 }, { transform: 'translate(85px, 0) rotate(0deg)', opacity: .25, offset: .5 }, { transform: base, opacity: 1 }], { duration: 850, delay: i * 65 }));
      });
      const input = demo.querySelector('.instrument-input');
      animations.push(animate(input, [{ transform: 'rotate(-7deg)' }, { transform: 'translate(55px, 30px) rotate(0)', opacity: .2, offset: .5 }, { transform: 'rotate(-7deg)', opacity: 1 }], { duration: 700 }));
      demo.querySelectorAll('.pixel-art i').forEach((pixel, i) => {
        animations.push(animate(pixel, [{ transform: `translate(${(i % 5 - 2) * -16}px,${(Math.floor(i / 5) - 2) * -16}px) rotate(45deg)`, opacity: 0 }, { transform: 'translate(0,0) rotate(0)', opacity: 1 }], { duration: 440, delay: 180 + (i % 5 + Math.floor(i / 5)) * 27 }));
      });
      const path = demo.querySelector('path');
      animations.push(animate(path, [{ strokeDashoffset: 120 }, { strokeDashoffset: 0 }], { duration: 850 }));
    };
    demo.querySelector('[data-transform-play]')?.addEventListener('click', event => {
      play(event.detail === 0);
      const status = demo.querySelector('[data-demo-status]');
      if (status) status.textContent = `Prévia de ${modes[demo.dataset.mode].label}. Abra a ferramenta para usar seus próprios dados.`;
    });
    demo.querySelectorAll('[data-transform-mode]').forEach(button => button.addEventListener('click', event => {
      stop();
      const mode = button.dataset.transformMode;
      const content = modes[mode];
      demo.dataset.mode = mode;
      demo.querySelectorAll('[data-transform-mode]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      for (const [key, selector] of [['input','[data-demo-input]'], ['format','[data-demo-format]'], ['output','[data-demo-output]']]) demo.querySelector(selector).textContent = content[key];
      demo.querySelector('[data-demo-link]').href = content.href;
      demo.querySelector('[data-demo-status]').textContent = `Prévia de ${content.label}. Nenhum arquivo é processado aqui.`;
      play(event.detail === 0);
    }));
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        if (entries.some(e => e.isIntersecting)) { play(); observer.disconnect(); }
      }, { threshold: .35 });
      observer.observe(demo);
    }
    // Direct, bounded pointer feedback; rAF only while the pointer actually moves.
    const engine = demo.querySelector('.transform-engine');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    let frame = 0;
    demo.addEventListener('pointermove', event => {
      if (motion.matches || !fine.matches || frame || animations.some(a => a?.playState === 'running')) return;
      frame = requestAnimationFrame(() => {
        const box = demo.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - .5;
        const y = (event.clientY - box.top) / box.height - .5;
        engine.style.transform = `perspective(700px) rotateX(${-y * 9}deg) rotateY(${x * 12}deg) rotate(-9deg)`;
        frame = 0;
      });
    }, { passive: true });
    demo.addEventListener('pointerleave', () => { cancelAnimationFrame(frame); frame = 0; engine.style.transform = ''; });
    motion.addEventListener('change', () => { if (motion.matches) { stop(); cancelAnimationFrame(frame); frame = 0; engine.style.transform = ''; } });
  });
})();
