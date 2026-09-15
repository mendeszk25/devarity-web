import { animate, stagger, onScroll } from './assets/vendor/anime.esm.min.js';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const compactMotion = matchMedia('(max-width: 820px), (pointer: coarse)').matches;
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function textNodes(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: node => node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  return nodes;
}

function splitText(element, wordsOnly = false) {
  const label = [...element.childNodes]
    .map(node => node.nodeName === 'BR' ? ' ' : node.textContent)
    .join('').replace(/\s+/g, ' ').trim();
  element.setAttribute('aria-label', label);
  textNodes(element).forEach(node => {
    const fragment = document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach(token => {
      if (!token) return;
      if (/^\s+$/.test(token)) {
        fragment.append(document.createTextNode(token));
        return;
      }
      const word = document.createElement('span');
      word.className = 'motion-word';
      word.setAttribute('aria-hidden', 'true');
      if (wordsOnly) word.textContent = token;
      else [...token].forEach(character => {
        const shell = document.createElement('span');
        const glyph = document.createElement('span');
        shell.className = 'motion-char';
        glyph.className = 'motion-char-glyph';
        glyph.textContent = character;
        shell.append(glyph);
        word.append(shell);
      });
      fragment.append(word);
    });
    node.replaceWith(fragment);
  });
  element.classList.add('motion-prepared');
  return wordsOnly ? [...element.querySelectorAll('.motion-word')] : [...element.querySelectorAll('.motion-char')];
}

function observeOnce(element, callback, threshold = .16) {
  if (reduceMotion || !('IntersectionObserver' in window)) {
    callback();
    return;
  }
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect();
    callback();
  }, { threshold, rootMargin: '0px 0px -5% 0px' });
  observer.observe(element);
}

document.querySelectorAll('[data-motion-title]').forEach(title => {
  const mode = title.dataset.motionTitle;
  const wordsOnly = compactMotion || mode === 'words';
  const items = splitText(title, wordsOnly);

  if (compactMotion) title.classList.add('motion-compact-words');
  if (reduceMotion) return;

  if (mode === 'float') {
    onScroll({
      target: title,
      enter: 'top bottom',
      leave: 'bottom top',
      sync: compactMotion ? .12 : .22,
      onUpdate: self => items.forEach((item, index) => {
        const phase = (index / Math.max(items.length - 1, 1) - .5) * 2;
        const travel = compactMotion ? 5 : 13;
        item.style.transform = `translate3d(0, ${((self.progress - .5) * phase * travel).toFixed(2)}px, 0)`;
      })
    });
    return;
  }

  observeOnce(title, () => animate(items, {
    opacity: [0, 1],
    y: wordsOnly ? ['.34em', '0em'] : ['.52em', '0em'],
    filter: compactMotion ? ['blur(3px)', 'blur(0px)'] : ['blur(5px)', 'blur(0px)'],
    duration: wordsOnly ? 620 : 680,
    delay: stagger(wordsOnly ? 55 : 17),
    ease: 'out(4)'
  }));
});

document.querySelectorAll('.service-row h3').forEach(title => {
  const parts = splitText(title, compactMotion);
  if (compactMotion) {
    title.classList.add('motion-compact-words');
  } else {
    parts.forEach((char, index) => char.style.setProperty('--char-index', index));
  }
});

document.querySelectorAll('[data-blur-text]').forEach(block => {
  const words = [];
  textNodes(block).forEach(node => {
    const fragment = document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach(token => {
      if (!token) return;
      if (/^\s+$/.test(token)) fragment.append(document.createTextNode(token));
      else {
        const span = document.createElement('span');
        span.className = 'blur-word';
        span.textContent = token;
        words.push(span);
        fragment.append(span);
      }
    });
    node.replaceWith(fragment);
  });
  block.classList.add('blur-prepared');
  if (!reduceMotion) observeOnce(block, () => animate(words, {
    opacity: [0, 1], y: [compactMotion ? 7 : 12, 0], filter: compactMotion ? ['blur(2px)', 'blur(0px)'] : ['blur(7px)', 'blur(0px)'],
    duration: compactMotion ? 440 : 520, delay: stagger(compactMotion ? 18 : 32), ease: 'out(3)'
  }), .1);
});

const scrambleAlphabet = '01/<>[]{}ABCDEFGHIJKLMNOPQRSTUVWXYZ';
document.querySelectorAll('[data-decrypt]').forEach(label => {
  const nodes = textNodes(label).map(node => ({ node, value: node.textContent }));
  observeOnce(label, () => {
    if (reduceMotion) return;
    label.classList.add('decrypting');
    const start = performance.now();
    const tick = now => {
      const progress = clamp((now - start) / 420);
      nodes.forEach(({ node, value }, nodeIndex) => {
        node.textContent = [...value].map((char, index) => {
          if (/\s/.test(char) || index / Math.max(value.length, 1) < progress) return char;
          return scrambleAlphabet[(index * 7 + nodeIndex * 11 + Math.floor(now / 38)) % scrambleAlphabet.length];
        }).join('');
      });
      if (progress < 1) requestAnimationFrame(tick);
      else {
        nodes.forEach(({ node, value }) => { node.textContent = value; });
        label.classList.remove('decrypting');
      }
    };
    requestAnimationFrame(tick);
  });
});

document.querySelectorAll('[data-type-terminal]').forEach(terminal => {
  const html = terminal.innerHTML;
  const value = terminal.textContent;
  if (reduceMotion) return;
  terminal.textContent = '';
  const begin = () => {
    if (!document.body.classList.contains('site-ready')) {
      setTimeout(begin, 80);
      return;
    }
    terminal.classList.add('is-typing');
    let index = 0;
    const type = () => {
      index = Math.min(value.length, index + (value[index] === '\n' ? 1 : 2));
      terminal.textContent = value.slice(0, index);
      if (index < value.length) setTimeout(type, value[index] === '\n' ? 100 : 24);
      else {
        terminal.innerHTML = html;
        terminal.classList.remove('is-typing');
      }
    };
    type();
  };
  observeOnce(terminal, begin, .2);
});

if (finePointer && !reduceMotion && !compactMotion) {
  const proximityTitles = [...document.querySelectorAll('[data-motion-title="proximity"]')];
  proximityTitles.forEach(title => requestAnimationFrame(() => {
    title.querySelectorAll('.motion-char').forEach(char => { char.style.width = `${char.getBoundingClientRect().width}px`; });
  }));
  addEventListener('pointermove', event => proximityTitles.forEach(title => {
    const rect = title.getBoundingClientRect();
    if (event.clientY < rect.top - 150 || event.clientY > rect.bottom + 150) return;
    title.querySelectorAll('.motion-char-glyph').forEach(glyph => {
      const glyphRect = glyph.getBoundingClientRect();
      const dx = event.clientX - (glyphRect.left + glyphRect.width / 2);
      const dy = event.clientY - (glyphRect.top + glyphRect.height / 2);
      const influence = Math.exp(-(dx * dx + dy * dy) / (2 * 115 * 115));
      glyph.style.fontVariationSettings = `"wght" ${Math.round(760 + influence * 140)}, "wdth" ${Math.round(94 + influence * 6)}`;
      glyph.style.transform = `scaleX(${(1 + influence * .025).toFixed(3)})`;
    });
  }), { passive: true });
}

if (finePointer && !reduceMotion) {
  const magnets = [...document.querySelectorAll('.btn, .contact-cta')].map(element => {
    const content = document.createElement('span');
    content.className = 'magnet-content';
    content.append(...element.childNodes);
    element.append(content);
    return { element, content, x: 0, y: 0, tx: 0, ty: 0 };
  });
  let pointerX = -1000;
  let pointerY = -1000;
  let magnetFrame = 0;
  const requestMagnetFrame = () => {
    if (!magnetFrame && !document.hidden) magnetFrame = requestAnimationFrame(magneticLoop);
  };
  addEventListener('pointermove', event => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    requestMagnetFrame();
  }, { passive: true });
  const magneticLoop = () => {
    magnetFrame = 0;
    let moving = false;
    magnets.forEach(item => {
      const rect = item.element.getBoundingClientRect();
      const dx = pointerX - (rect.left + rect.width / 2);
      const dy = pointerY - (rect.top + rect.height / 2);
      const force = clamp(1 - Math.hypot(dx, dy) / Math.max(110, rect.width * .75));
      item.tx = clamp(dx * force * .08, -8, 8);
      item.ty = clamp(dy * force * .08, -7, 7);
      item.x += (item.tx - item.x) * .14;
      item.y += (item.ty - item.y) * .14;
      moving ||= Math.abs(item.tx - item.x) > .08 || Math.abs(item.ty - item.y) > .08;
      item.element.style.transform = `translate3d(${item.x.toFixed(2)}px, ${item.y.toFixed(2)}px, 0)`;
      item.content.style.transform = `translate3d(${(item.x * .3).toFixed(2)}px, ${(item.y * .3).toFixed(2)}px, 0)`;
    });
    if (moving) requestMagnetFrame();
  };
}

const marquee = document.querySelector('.marquee-track');
if (marquee && !reduceMotion) {
  let x = 0;
  let speed = 25;
  let targetSpeed = 25;
  let previousY = scrollY;
  let marqueeActive = false;
  let marqueeFrame = 0;
  let groupWidth = marquee.firstElementChild?.getBoundingClientRect().width || 1;
  let last = performance.now();
  const requestMarqueeFrame = () => {
    if (marqueeActive && !document.hidden && !marqueeFrame) {
      last = performance.now();
      marqueeFrame = requestAnimationFrame(marqueeLoop);
    }
  };
  const marqueeLoop = now => {
    marqueeFrame = 0;
    if (!marqueeActive || document.hidden) return;
    const dt = Math.min((now - last) / 1000, .05);
    last = now;
    if (!compactMotion) {
      targetSpeed += (25 - targetSpeed) * .035;
      speed += (targetSpeed - speed) * .08;
    }
    x = (x - speed * dt) % groupWidth;
    if (x > 0) x -= groupWidth;
    marquee.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
    marqueeFrame = requestAnimationFrame(marqueeLoop);
  };
  if (!compactMotion) addEventListener('scroll', () => {
    const delta = scrollY - previousY;
    previousY = scrollY;
    targetSpeed = clamp(25 + delta * 2.6, -95, 155);
  }, { passive: true });
  const marqueeObserver = new IntersectionObserver(entries => {
    marqueeActive = entries.some(entry => entry.isIntersecting);
    requestMarqueeFrame();
  }, { rootMargin: '100px 0px' });
  marqueeObserver.observe(marquee);
  addEventListener('resize', () => {
    groupWidth = marquee.firstElementChild?.getBoundingClientRect().width || 1;
  }, { passive: true });
  document.addEventListener('visibilitychange', requestMarqueeFrame);
}
