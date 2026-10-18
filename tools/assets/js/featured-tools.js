// Independent homepage showcase. No hero or catalog state is shared here.
const featured = document.querySelector('#destaques-tools');

if (featured) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const activeAnimations = new Set();
  const byElement = new WeakMap();
  const ease = 'cubic-bezier(.22,1,.36,1)';

  function animate(element, keyframes, options = {}) {
    byElement.get(element)?.cancel();
    if (reduced.matches || !element.animate) return;
    const animation = element.animate(keyframes, { duration: 320, easing: ease, ...options });
    byElement.set(element, animation);
    activeAnimations.add(animation);
    animation.finished.then(() => activeAnimations.delete(animation), () => activeAnimations.delete(animation));
  }
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      activeAnimations.forEach(animation => animation.cancel());
      activeAnimations.clear();
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) activeAnimations.forEach(animation => animation.finish());
  });

  // Content is visible before enhancement. Entry is a one-time, interruptible mask.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        const children = entry.target.matches('.featured-intro')
          ? [...entry.target.children]
          : [entry.target.querySelector('h3'), entry.target.querySelector('.featured-bio-editor, .featured-qr-art, .featured-conversation')];
        children.filter(Boolean).forEach((element, index) => animate(element, [
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)' }
        ], { duration: 560, delay: index * 70 }));
      }
    }, { threshold: .12 });
    featured.querySelectorAll('[data-featured-reveal]').forEach(element => observer.observe(element));
  }

  const bios = {
    creative: { lines: ['Ideias fora', 'da caixa.'], detail: ['Design, café e novos caminhos.', 'Vamos criar algo juntos?'], signoff: 'CRIATIVIDADE EM CADA LINHA.' },
    minimal: { lines: ['Menos ruído.', 'Mais essência.'], detail: ['Lia Costa · Design independente.', 'Meu trabalho fala por mim.'], signoff: 'SÓ O QUE IMPORTA.' },
    professional: { lines: ['Design com', 'propósito.'], detail: ['Lia Costa | Designer de marcas.', 'Projetos, parcerias e novos negócios.'], signoff: 'CLAREZA TAMBÉM É IDENTIDADE.' }
  };
  const bioEditor = featured.querySelector('.featured-bio-editor');
  const bioPreview = featured.querySelector('[data-bio-preview]');
  const bioButtons = [...featured.querySelectorAll('[data-bio-preset]')];
  bioButtons.forEach(button => {
    button.disabled = false;
    button.addEventListener('click', event => {
      const key = button.dataset.bioPreset;
      if (bioEditor.dataset.bioStyle === key) return;
      const content = bios[key];
      bioEditor.dataset.bioStyle = key;
      bioEditor.toggleAttribute('data-keyboard', event.detail === 0);
      bioButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      const lines = content.lines.map(text => {
        const line = document.createElement('p');
        line.className = 'featured-bio-line';
        line.textContent = text;
        return line;
      });
      const detail = document.createElement('p');
      detail.className = 'featured-bio-detail';
      detail.append(content.detail[0], document.createElement('br'), content.detail[1]);
      // Update immediately; masks dress the new type without delaying selection.
      bioPreview.replaceChildren(...lines, detail);
      featured.querySelector('[data-bio-signoff]').textContent = content.signoff;
      if (event.detail !== 0) {
        lines.forEach((line, index) => animate(line, [
          { clipPath: 'inset(0 0 100% 0)', transform: 'translateX(12px)' },
          { clipPath: 'inset(0 0 0% 0)', transform: 'translateX(0)' }
        ], { duration: 300, delay: index * 35 }));
        animate(detail, [{ opacity: .25 }, { opacity: 1 }], { duration: 220 });
      }
    });
  });

  const qrForm = featured.querySelector('[data-featured-qr-form]');
  const qrInput = featured.querySelector('#featured-qr-url');
  const qrButton = qrForm.querySelector('button');
  const qrArea = featured.querySelector('[data-featured-qr]');
  const qrFeedback = featured.querySelector('#featured-qr-feedback');
  let qrRequest = 0;
  qrForm.noValidate = true;
  qrButton.disabled = false;
  qrInput.addEventListener('input', () => {
    qrRequest++;
    qrInput.removeAttribute('aria-invalid');
    qrFeedback.textContent = 'Endereço alterado. Atualize o QR para aplicar.';
  });
  qrForm.addEventListener('submit', async event => {
    event.preventDefault();
    const request = ++qrRequest;
    let url;
    try {
      url = new URL(qrInput.value.trim());
      if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.href.length > 600) throw new Error('Invalid URL');
    } catch {
      qrInput.setAttribute('aria-invalid', 'true');
      qrFeedback.textContent = 'Digite um endereço completo, começando com https:// ou http://, sem usuário ou senha.';
      qrInput.focus();
      return;
    }
    qrInput.removeAttribute('aria-invalid');
    qrFeedback.textContent = 'Criando o QR no seu navegador…';
    try {
      // The same local encoder as the existing QR tool; loaded only on first use.
      const { QRCode, ErrorLevel } = await import('./vendor-qrcode/index.js');
      if (request !== qrRequest) return;
      const qr = new QRCode(-1, ErrorLevel.M);
      qr.addData(url.href);
      qr.make();
      const count = qr.getModuleCount(), size = count + 8;
      const ns = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(ns, 'svg');
      svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
      svg.setAttribute('shape-rendering', 'crispEdges');
      svg.setAttribute('aria-hidden', 'true');
      const background = document.createElementNS(ns, 'path');
      background.setAttribute('fill', '#fff');
      background.setAttribute('d', `M0 0h${size}v${size}H0z`);
      const modules = document.createElementNS(ns, 'path');
      modules.setAttribute('fill', '#050505');
      let d = '';
      for (let y = 0; y < count; y++) {
        for (let x = 0; x < count; x++) {
          if (qr.isDark(y, x)) d += `M${x + 4} ${y + 4}h1v1h-1z`;
        }
      }
      modules.setAttribute('d', d);
      svg.append(background, modules);
      qrArea.replaceChildren(svg);
      qrArea.setAttribute('aria-label', `QR Code para ${url.href}`);
      featured.querySelector('[data-qr-destination]').textContent = url.href;
      qrFeedback.textContent = 'QR atualizado. Aponte a câmera para abrir seu endereço.';
      // Preserve the matrix and its four-module quiet zone; reveal without tilting.
      const keyboard = Boolean(qrForm.querySelector(':focus-visible'));
      if (!keyboard) animate(svg, [
        { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)' }
      ], { duration: 360 });
    } catch {
      if (request === qrRequest) qrFeedback.textContent = 'Não foi possível atualizar. Tente um endereço mais curto ou abra o gerador completo.';
    }
  });

  const messages = {
    work: 'Olá! Quero saber mais sobre seu trabalho.',
    quote: 'Olá! Gostaria de um orçamento para meu projeto.',
    book: 'Olá! Podemos agendar uma conversa?'
  };
  const message = featured.querySelector('#featured-wa-message');
  const messagePreview = featured.querySelector('[data-wa-preview]');
  const linkPreview = featured.querySelector('[data-wa-link-preview]');
  const messageButtons = [...featured.querySelectorAll('[data-wa-preset]')];
  const messageRoute = featured.querySelector('.featured-message-route path');
  function updateMessage() {
    messagePreview.textContent = message.value || 'Sua conversa começa com uma mensagem.';
    // Deliberately plain text, with a non-numeric placeholder. Never a wa.me link.
    linkPreview.textContent = 'wa.me/SEU-NUMERO' + (message.value ? '?text=' + encodeURIComponent(message.value) : '');
    messageButtons.forEach(button => button.setAttribute('aria-pressed', String(messages[button.dataset.waPreset] === message.value)));
  }
  message.addEventListener('input', updateMessage);
  messageButtons.forEach(button => {
    button.disabled = false;
    button.addEventListener('click', event => {
      message.value = messages[button.dataset.waPreset];
      updateMessage();
      featured.querySelector('[data-wa-status]').textContent = `Mensagem de exemplo: ${button.textContent}. Prévia atualizada.`;
      if (event.detail !== 0) {
        animate(messagePreview, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }], { duration: 240 });
        animate(messageRoute, [{ strokeDasharray: '1', strokeDashoffset: 1 }, { strokeDasharray: '1', strokeDashoffset: 0 }], { duration: 380 });
        animate(linkPreview, [{ opacity: .35 }, { opacity: 1 }], { delay: 110, duration: 180 });
      }
    });
  });
  updateMessage();
}
