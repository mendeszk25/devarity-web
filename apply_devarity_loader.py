#!/usr/bin/env python3
from pathlib import Path
import re
import shutil
import sys
from datetime import datetime

ROOT = Path.cwd()
STYLE = ROOT / "style.css"
SCRIPT = ROOT / "script.js"

if not STYLE.exists() or not SCRIPT.exists():
    print("ERRO: execute este script na raiz do projeto devarity-web, onde estão style.css e script.js.")
    sys.exit(1)

stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
backup = ROOT / f".devarity-loader-backup-{stamp}"
backup.mkdir()

shutil.copy2(STYLE, backup / "style.css")
shutil.copy2(SCRIPT, backup / "script.js")

style = STYLE.read_text(encoding="utf-8")
script = SCRIPT.read_text(encoding="utf-8")

# ----------------------------
# CSS — loader / hero brand
# ----------------------------

style = re.sub(
    r'\.loader-word-wrap\s*\{[^}]*\}',
    '''.loader-word-wrap {
  align-self: center;
  overflow: visible;
  perspective: 900px;
}''',
    style,
    count=1,
    flags=re.S,
)

style = re.sub(
    r'\.loader-word\s*\{[^}]*\}',
    '''.loader-word {
  display: block;
  width: max-content;
  max-width: 92vw;
  font-family: var(--mono);
  font-size: clamp(3.65rem, 13.2vw, 14rem);
  font-weight: 600;
  line-height: .82;
  letter-spacing: -.075em;
  text-transform: lowercase;
  transform-origin: left center;
  will-change: transform, opacity, filter;
}''',
    style,
    count=1,
    flags=re.S,
)

if ".loader-letter {" not in style:
    marker = '''.loader-word {
  display: block;
  width: max-content;
  max-width: 92vw;
  font-family: var(--mono);
  font-size: clamp(3.65rem, 13.2vw, 14rem);
  font-weight: 600;
  line-height: .82;
  letter-spacing: -.075em;
  text-transform: lowercase;
  transform-origin: left center;
  will-change: transform, opacity, filter;
}'''
    addition = marker + '''
.loader-letter {
  display: inline-block;
  min-width: .58em;
  transform-origin: 50% 100%;
  will-change: transform, filter, color;
}
.loader-letter.is-active {
  color: var(--accent);
  text-shadow: 0 0 28px rgba(255, 59, 48, .18);
}'''
    style = style.replace(marker, addition, 1)

style = re.sub(
    r'\.hero-brand-word\s*\{[^}]*\}',
    '''.hero-brand-word {
  display: block;
  width: max-content;
  max-width: 100%;
  color: transparent;
  font-family: var(--mono);
  font-size: clamp(4.75rem, 12.5vw, 14rem);
  font-weight: 600;
  line-height: .82;
  letter-spacing: -.075em;
  text-transform: lowercase;
  -webkit-text-stroke: 1px rgba(255,255,255,.13);
  opacity: .9;
  transform-origin: left center;
  will-change: transform, opacity;
}''',
    style,
    count=1,
    flags=re.S,
)

style = re.sub(
    r'(\@media \(max-width: 520px\) \{\s*\.loader-footer\s*\{[^}]*\}\s*)\.loader-word\s*\{[^}]*\}',
    r'''\1.loader-word { font-size: clamp(3rem, 16vw, 5.4rem); }''',
    style,
    count=1,
    flags=re.S,
)

# ----------------------------
# JS — complete loader sequence
# ----------------------------

new_loader_js = r'''  // Cinematic Devarity loader:
  // each letter takes the spotlight, the word settles, then morphs into the hero.
  const loader = document.querySelector('[data-loader]');
  const loaderWord = document.querySelector('[data-loader-word]');
  const loaderProgress = document.querySelector('[data-loader-progress]');
  const loaderBar = document.querySelector('[data-loader-bar]');
  const heroBrand = document.querySelector('[data-hero-brand]');

  const LOADER_WORD = 'devarity';
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

        letters.forEach((item, itemIndex) => {
          item.classList.toggle('is-active', itemIndex === index);
          item.textContent = itemIndex === index
            ? LOADER_WORD[itemIndex].toUpperCase()
            : LOADER_WORD[itemIndex];
        });

        letter.animate(
          [
            { transform: 'translateY(0) scaleY(1)', filter: 'blur(0)' },
            { transform: 'translateY(-.22em) scaleY(1.08)', filter: 'blur(0)', offset: .42 },
            { transform: 'translateY(.035em) scaleY(.96)', filter: 'blur(.1px)', offset: .72 },
            { transform: 'translateY(0) scaleY(1)', filter: 'blur(0)' }
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
            opacity: .22,
            filter: 'blur(.15px)'
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

'''

pattern = re.compile(
    r'\s{2}// Short cinematic loader \+ FLIP-like transition into the hero DEVARITY word\..*?(?=\n\s{2}// Mobile menu)',
    re.S,
)

if not pattern.search(script):
    print("ERRO: bloco do loader atual não foi encontrado em script.js. Nenhum arquivo foi sobrescrito.")
    sys.exit(2)

script = pattern.sub("\n" + new_loader_js.rstrip("\n"), script, count=1)

STYLE.write_text(style, encoding="utf-8")
SCRIPT.write_text(script, encoding="utf-8")

print("Atualização aplicada com sucesso.")
print(f"Backup criado em: {backup}")
print("Arquivos modificados:")
print("  - style.css")
print("  - script.js")
print("")
print("Novo fluxo:")
print("  devarity -> Devarity -> dEvarity -> deVarity -> ...")
print("  duas passagens pelas letras -> devarity normal -> morph para o hero -> site aparece")
