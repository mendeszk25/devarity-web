#!/usr/bin/env python3
from pathlib import Path
from datetime import datetime
import re
import shutil
import sys

ROOT = Path.cwd()
FILES = [ROOT / 'style.css', ROOT / 'script.js', ROOT / 'webgl.js']

missing = [p.name for p in FILES if not p.exists()]
if missing:
    print('ERRO: execute este script na raiz do repositório devarity-web.')
    print('Arquivos ausentes:', ', '.join(missing))
    sys.exit(1)

stamp = datetime.now().strftime('%Y%m%d-%H%M%S')
backup = ROOT / f'.devarity-final-polish-backup-{stamp}'
backup.mkdir()
for path in FILES:
    shutil.copy2(path, backup / path.name)

style = (ROOT / 'style.css').read_text(encoding='utf-8')
script = (ROOT / 'script.js').read_text(encoding='utf-8')
webgl = (ROOT / 'webgl.js').read_text(encoding='utf-8')

def replace_once(text, old, new, label):
    if old not in text:
        raise RuntimeError(f'Não encontrei o trecho esperado: {label}')
    return text.replace(old, new, 1)

def regex_once(text, pattern, repl, label, flags=0):
    new, count = re.subn(pattern, repl, text, count=1, flags=flags)
    if count != 1:
        raise RuntimeError(f'Não consegui alterar exatamente 1 ocorrência: {label} (encontrei {count})')
    return new

try:
    # ============================================================
    # STYLE.CSS — loader sem quebra + DEVARITY principal no hero
    # ============================================================
    style = replace_once(
        style,
        'grid-template-rows: auto 1fr auto;',
        'grid-template-rows: auto auto 1fr auto;',
        'grid desktop do hero'
    )

    style = regex_once(
        style,
        r'\.loader-word\s*\{.*?\n\}',
        '''.loader-word {
  display: block;
  width: max-content;
  max-width: none;
  white-space: nowrap;
  font-family: var(--display-brand);
  font-size: clamp(3.4rem, 11.6vw, 12.6rem);
  font-weight: 800;
  line-height: .82;
  letter-spacing: -.06em;
  text-transform: uppercase;
  transform-origin: left top;
  will-change: transform, opacity, filter;
}''',
        'loader-word',
        flags=re.S
    )

    style = regex_once(
        style,
        r'\.loader-letter\s*\{.*?\n\}',
        '''.loader-letter {
  display: inline-block;
  white-space: nowrap;
  transform-origin: 50% 100%;
  will-change: transform, filter, color;
}''',
        'loader-letter',
        flags=re.S
    )

    style = regex_once(
        style,
        r'\.hero-brand-stage\s*\{[^}]*\}',
        '''.hero-brand-stage {
  position: relative;
  z-index: 3;
  grid-column: 1 / -1;
  grid-row: 2;
  top: auto;
  right: auto;
  left: auto;
  width: 100%;
  min-width: 0;
  padding: clamp(1.25rem, 2.4vw, 2.5rem) 0 clamp(.4rem, 1vw, 1rem);
  overflow: hidden;
  pointer-events: none;
  perspective: 900px;
}''',
        'hero-brand-stage principal',
        flags=re.S
    )

    style = regex_once(
        style,
        r'\.hero-brand-word\s*\{.*?\n\}',
        '''.hero-brand-word {
  display: block;
  width: max-content;
  max-width: 100%;
  white-space: nowrap;
  color: var(--ink);
  font-family: var(--display-brand);
  font-size: clamp(4.35rem, 10.4vw, 11.8rem);
  font-weight: 800;
  line-height: .82;
  letter-spacing: -.06em;
  text-transform: uppercase;
  -webkit-text-stroke: 0 transparent;
  opacity: 1;
  transform-origin: left top;
  will-change: transform, opacity;
}''',
        'hero-brand-word principal',
        flags=re.S
    )

    style = regex_once(
        style,
        r'\.hero-brand-caption\s*\{[^}]*\}',
        '''.hero-brand-caption {
  position: relative;
  top: auto;
  left: .15rem;
  display: block;
  margin-top: .7rem;
  color: rgba(255,255,255,.32);
  font: 500 .5rem/1 var(--mono);
  letter-spacing: .16em;
}''',
        'hero-brand-caption',
        flags=re.S
    )

    anchor = 'body.is-loading .hero-brand-word, body.is-loading .hero-brand-caption { visibility: hidden; }'
    hero_flow = anchor + '''
.hero-topline { grid-row: 1; }
.hero-copy { grid-row: 3; padding-top: clamp(1.5rem, 2.6vw, 3.2rem); }
.terminal-card { grid-row: 3; margin-top: clamp(.75rem, 1.6vw, 1.7rem); }
.hero-meta { grid-row: 4; }
'''
    style = replace_once(style, anchor, hero_flow, 'fluxo do hero com marca principal')

    # Remover efeitos de hover/tilt/glare sobre screenshots, preservando reveal inicial.
    style = regex_once(
        style,
        r'\.project-media::before\s*\{[^}]*\}',
        '.project-media::before { display: none; }',
        'glare dos projetos',
        flags=re.S
    )
    style = regex_once(
        style,
        r'\.project-media img\s*\{\s*width: 100%; height: 100%; object-fit: cover; filter: grayscale\(\.42\) brightness\(\.82\); transform: scale\(1\.002\); transition: filter \.55s var\(--ease\), transform \.75s var\(--ease\);\s*\}',
        '.project-media img { width: 100%; height: 100%; object-fit: cover; filter: none; transform: scale(1.002); transition: transform .75s var(--ease); }',
        'imagem base dos projetos',
        flags=re.S
    )
    style = replace_once(
        style,
        '.project:hover .project-media img { filter: grayscale(0) brightness(1); transform: scale(1.022); }',
        '.project:hover .project-media img { filter: none; transform: scale(1.002); }',
        'hover de zoom/cor dos projetos'
    )
    style = replace_once(
        style,
        '.project:hover .project-media::before { opacity: 1; transform: translateX(75%); }',
        '.project:hover .project-media::before { opacity: 0; transform: none; }',
        'hover glare dos projetos'
    )
    style = replace_once(
        style,
        '.project.reveal.in-view:hover .project-media img { transform: scale(1.022); }',
        '.project.reveal.in-view:hover .project-media img { transform: scale(1.002); }',
        'hover de reveal dos projetos'
    )

    # O hero mobile precisa de uma linha extra porque a marca agora ocupa uma linha real.
    style = replace_once(
        style,
        '.hero { min-height: 100svh; grid-template-columns: 1fr; grid-template-rows: auto auto auto auto; padding-top: 68px; }',
        '.hero { min-height: 100svh; grid-template-columns: 1fr; grid-template-rows: auto auto auto auto auto; padding-top: 68px; }',
        'grid mobile do hero'
    )

    mobile_anchor = '.hero-topline { grid-column: 1; }'
    mobile_flow = mobile_anchor + '''
  .hero-brand-stage { grid-row: 2; top: auto; padding-top: 1.3rem; }
  .hero-copy { grid-row: 3; }
  .terminal-card { grid-row: 4; margin-top: 0; }
  .hero-meta { grid-row: 5; }
'''
    style = replace_once(style, mobile_anchor, mobile_flow, 'ordem mobile do hero')

    style = style.replace(
        '.hero-brand-stage { top: 7rem; }',
        '.hero-brand-stage { top: auto; padding-top: 1.3rem; }',
        1
    )
    style = style.replace(
        '.hero-brand-word { font-size: clamp(4rem, 18vw, 8rem); -webkit-text-stroke-color: rgba(255,255,255,.10); }',
        '.hero-brand-word { font-size: clamp(3.7rem, 13.4vw, 7.5rem); color: var(--ink); -webkit-text-stroke: 0 transparent; }',
        1
    )
    style = style.replace(
        '.hero-brand-stage { top: 6.5rem; }',
        '.hero-brand-stage { top: auto; padding-top: 1rem; }',
        1
    )
    style = style.replace(
        '.loader-word { font-size: clamp(3rem, 16vw, 5.4rem); }',
        '.loader-word { font-size: clamp(2.75rem, 14.2vw, 5.2rem); white-space: nowrap; }',
        1
    )

    # ============================================================
    # SCRIPT.JS — morph mais preciso + sem tilt dos projetos
    # ============================================================
    script = replace_once(script, 'const MORPH_TIME = 860;', 'const MORPH_TIME = 980;', 'tempo do morph')

    script = replace_once(
        script,
        "      heroBrand.textContent = LOADER_WORD;\n      heroBrand.style.visibility = 'hidden';",
        "      heroBrand.textContent = LOADER_WORD;\n      heroBrand.style.visibility = 'hidden';\n      loaderWord.style.transformOrigin = 'left top';\n      heroBrand.style.transformOrigin = 'left top';",
        'origem precisa do morph'
    )

    script = replace_once(
        script,
        "            opacity: 1,\n            color: 'rgba(241,241,236,0)',\n            WebkitTextStroke: '1px rgba(255,255,255,.13)',\n            filter: 'blur(0)'",
        "            opacity: 1,\n            color: 'rgb(241,241,236)',\n            filter: 'blur(0)'",
        'estado final branco do morph'
    )

    script = replace_once(
        script,
        "      await morph.finished.catch(() => {});\n      heroBrand.style.visibility = 'visible';",
        "      await morph.finished.catch(() => {});\n      heroBrand.style.visibility = 'visible';\n      loaderWord.style.visibility = 'hidden';",
        'handoff exato loader hero'
    )

    script = regex_once(
        script,
        r'\n\s*// Project cards: subtle pointer parallax/tilt, no layout shifts\..*?(?=\n\s*// Scroll-scrubbed hero depth\.)',
        '\n\n  // Project screenshots intentionally remain static on hover.\n',
        'remoção do tilt dos projetos',
        flags=re.S
    )

    script = replace_once(
        script,
        "if (brandWord) brandWord.style.transform = `translate3d(${lerp(0, 28, p)}px, ${lerp(0, -26, p)}px, 0) rotateY(${lerp(0, -7, p)}deg) scale(${lerp(1, .965, p)})`;",
        "if (brandWord) brandWord.style.transform = `translate3d(0, ${lerp(0, -9, p)}px, 0) scale(${lerp(1, .988, p)})`;",
        'movimento sutil da marca no hero'
    )

    # ============================================================
    # WEBGL.JS — centro, fluidez, X dominante e ESC mostrando topo
    # ============================================================
    webgl = replace_once(
        webgl,
        '    group.rotation.set(.72, .38, .05);',
        '    group.rotation.set(.96, .16, .025);',
        'orientação inicial da ESC'
    )

    preset_pattern = r'''    const preset = mobile \? \{.*?\n    \};\n\n    const wifiScale'''
    preset_repl = '''    const preset = mobile ? {
      wifiSize: .30, wifiXStart: .05, wifiXMid: -.025, wifiXEnd: .055, wifiYStart: .34, wifiYEnd: .10, wifiYArc: -.035,
      escSize: .32, escXStart: .045, escXMid: -.03, escXEnd: .055, escYStart: .18, escYEnd: .16, escYArc: -.16
    } : tablet ? {
      wifiSize: .205, wifiXStart: .075, wifiXMid: -.005, wifiXEnd: .08, wifiYStart: .25, wifiYEnd: .04, wifiYArc: -.07,
      escSize: .225, escXStart: .07, escXMid: -.01, escXEnd: .075, escYStart: -.06, escYEnd: .15, escYArc: -.09
    } : {
      wifiSize: .205, wifiXStart: .065, wifiXMid: -.015, wifiXEnd: .07, wifiYStart: .27, wifiYEnd: .035, wifiYArc: -.07,
      escSize: .195, escXStart: .055, escXMid: -.02, escXEnd: .065, escYStart: -.08, escYEnd: .14, escYArc: -.09
    };

    const wifiScale'''
    webgl = regex_once(webgl, preset_pattern, preset_repl, 'presets centrais dos objetos', flags=re.S)

    webgl = replace_once(
        webgl,
        "    wifi.rotation.x = -.08 + wifiRotationProgress * Math.PI * 1.6 + pointerY * .04;\n    wifi.rotation.y = -.16 + wifiRotationProgress * Math.PI * 2.5 + pointerX * .06;\n    wifi.rotation.z = -.08 * Math.PI + wifiRotationProgress * .2 * Math.PI;",
        "    wifi.rotation.x = -.08 + wifiRotationProgress * Math.PI * 2.35 + pointerY * .025;\n    wifi.rotation.y = -.10 + wifiRotationProgress * Math.PI * .42 + pointerX * .025;\n    wifi.rotation.z = -.035 * Math.PI + wifiRotationProgress * .07 * Math.PI;",
        'rotação do Wi-Fi com eixo X dominante'
    )

    webgl = replace_once(
        webgl,
        "    esc.rotation.x = .72 + escRotationProgress * Math.PI * 1.45 + pointerY * .04;\n    esc.rotation.y = .38 + escRotationProgress * Math.PI * 2.15 + pointerX * .06;\n    esc.rotation.z = .04 + escRotationProgress * Math.PI * .18;",
        "    esc.rotation.x = .96 + escRotationProgress * Math.PI * 1.18 + pointerY * .025;\n    esc.rotation.y = .16 + escRotationProgress * Math.PI * .28 + pointerX * .025;\n    esc.rotation.z = .025 + escRotationProgress * Math.PI * .055;",
        'rotação da ESC com topo mais visível'
    )

    webgl = regex_once(
        webgl,
        r'''      const x = lerp\(31, 20, arc\);\n      const y = isEsc \? lerp\(43, 32, arc\) : lerp\(61, 27, progress\);\n      element\.style\.opacity = opacity;\n      element\.style\.transform = `translate\(\$\{x\}vw, \$\{y - 50\}vh\) perspective\(800px\) rotateX\(\$\{progress \* 250\}deg\) rotateY\(\$\{progress \* 420\}deg\) scale\(\$\{mobile \? \.4 : \.25\}\)`;''',
        '''      const x = lerp(4, -3, arc);
      const y = isEsc ? lerp(45, 34, arc) : lerp(58, 30, progress);
      element.style.opacity = opacity;
      element.style.transform = `translate(${x}vw, ${y - 50}vh) perspective(900px) rotateX(${progress * 390}deg) rotateY(${progress * 78}deg) scale(${mobile ? .4 : .25})`;''',
        'fallback 2D central e X dominante',
        flags=re.S
    )

    webgl = replace_once(
        webgl,
        '    const damping = 1 - Math.exp(-deltaTime * 9);',
        '    const damping = 1 - Math.exp(-deltaTime * 5.4);',
        'damping mais fluido'
    )

    webgl = replace_once(
        webgl,
        "  function requestRender(force = false) {\n    if (force && frame) {\n      cancelAnimationFrame(frame);\n      frame = 0;\n    }\n    if (!frame) frame = requestAnimationFrame(render);\n  }",
        "  function requestRender(force = false) {\n    if (force && frame) {\n      cancelAnimationFrame(frame);\n      frame = 0;\n    }\n    if (!frame) {\n      lastFrameTime = performance.now();\n      frame = requestAnimationFrame(render);\n    }\n  }",
        'requestRender estável'
    )

    webgl = replace_once(
        webgl,
        "    onUpdate: () => {\n      targetScroll = scrollY;\n    }",
        "    onUpdate: () => {\n      targetScroll = scrollY;\n      dirty = true;\n      requestRender();\n    }",
        'Anime ScrollObserver acordando renderer'
    )

    webgl = regex_once(
        webgl,
        r'''  // ScrollObserver owns the measured range; this native signal guarantees that\n  // large programmatic jumps also wake the damped renderer in every browser\.\n  addEventListener\('scroll', \(\) => \{\n    updateBounds\(\);\n    targetScroll = scrollY;\n    if \(frame\) cancelAnimationFrame\(frame\);\n    frame = 0;\n    lastFrameTime = performance\.now\(\);\n    render\(\);\n  \}, \{ passive: true \}\);''',
        '''  // Native scroll only updates the target. Bounds are recalculated on resize,
  // avoiding layout reads and rAF restarts on every scroll event.
  addEventListener('scroll', () => {
    targetScroll = scrollY;
    dirty = true;
    requestRender();
  }, { passive: true });''',
        'scroll sem travamentos/layout thrash',
        flags=re.S
    )

except Exception as exc:
    print('ERRO AO APLICAR:', exc)
    print('Nenhum arquivo foi salvo. O backup está em:', backup)
    sys.exit(2)

(ROOT / 'style.css').write_text(style, encoding='utf-8')
(ROOT / 'script.js').write_text(script, encoding='utf-8')
(ROOT / 'webgl.js').write_text(webgl, encoding='utf-8')

print('Correções aplicadas com sucesso.')
print('Backup:', backup)
print('Arquivos alterados: style.css, script.js, webgl.js')
print('')
print('Principais mudanças:')
print('- DEVARITY do loader não quebra em duas linhas')
print('- morph loader -> hero usa origem top-left e handoff direto')
print('- DEVARITY vira elemento principal e visível do hero')
print('- conteúdo do hero é empurrado para baixo pela nova linha da marca')
print('- hover/tilt/glare das imagens de projetos removido')
print('- Wi-Fi e ESC passam pelo centro da viewport')
print('- render WebGL deixa de recalcular layout/cancelar rAF a cada scroll')
print('- damping mais suave')
print('- rotação prioriza eixo X e reduz bastante o eixo Y')
print('- ESC começa mais inclinada para mostrar melhor o topo/“esc”')
