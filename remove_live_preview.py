#!/usr/bin/env python3
from pathlib import Path
from datetime import datetime
import re
import shutil
import sys

ROOT = Path.cwd()
INDEX = ROOT / "index.html"
SCRIPT = ROOT / "script.js"
STYLE = ROOT / "style.css"
CASE_CSS = ROOT / "case.css"
ENTRE = ROOT / "projetos" / "entretempos" / "index.html"

for path in (INDEX, SCRIPT, STYLE, CASE_CSS, ENTRE):
    if not path.exists():
        print(f"ERRO: {path} não encontrado. Rode este script na raiz do repositório devarity-web.")
        sys.exit(1)

index = INDEX.read_text(encoding="utf-8")
script = SCRIPT.read_text(encoding="utf-8")
style = STYLE.read_text(encoding="utf-8")
case_css = CASE_CSS.read_text(encoding="utf-8")
entre = ENTRE.read_text(encoding="utf-8")

stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
backup = ROOT / f".devarity-remove-live-preview-backup-{stamp}"
backup.mkdir(parents=True, exist_ok=True)
for path in (INDEX, SCRIPT, STYLE, CASE_CSS, ENTRE):
    dest = backup / path.relative_to(ROOT)
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, dest)

# ------------------------------------------------------------
# 1) HOME: restore static project media cards.
# Keep FR Usinagens and the social icons.
# ------------------------------------------------------------
static_media = {
    "https://cuidar-odontologia.vercel.app/":
        '<a class="project-media cursor-label" data-cursor="VISITAR" href="https://cuidar-odontologia.vercel.app/" target="_blank" rel="noopener noreferrer" aria-label="Ver o site Cuidar Odontologia Integrada"><img src="assets/projects/cuidar-odontologia.webp" width="1440" height="1000" loading="lazy" alt="Página inicial publicada da Cuidar Odontologia Integrada"><span class="project-browser"><i></i><i></i><i></i><b>cuidar-odontologia.vercel.app</b></span></a>',
    "https://taianealmeida.com.br/":
        '<a class="project-media cursor-label" data-cursor="VISITAR" href="https://taianealmeida.com.br/" target="_blank" rel="noopener noreferrer" aria-label="Ver o site de Taiane Almeida Santos"><img src="assets/projects/taiane-almeida.webp" width="1440" height="1000" loading="lazy" alt="Página inicial publicada do livro Necropolítica e Reflexões, de Taiane Almeida Santos"><span class="project-browser"><i></i><i></i><i></i><b>taianealmeida.com.br</b></span></a>',
    "https://portalerempaf.vercel.app/":
        '<a class="project-media cursor-label" data-cursor="VISITAR" href="https://portalerempaf.vercel.app/" target="_blank" rel="noopener noreferrer" aria-label="Ver o Portal EREMPAF"><img src="assets/projects/portal-erempaf.webp" width="1440" height="1000" loading="lazy" alt="Página inicial publicada do Portal EREMPAF com acesso por série e turma"><span class="project-browser"><i></i><i></i><i></i><b>portalerempaf.vercel.app</b></span></a>',
    "https://fr-usinagens.vercel.app/":
        '<a class="project-media cursor-label" data-cursor="VISITAR" href="https://fr-usinagens.vercel.app/" target="_blank" rel="noopener noreferrer" aria-label="Ver o site FR Usinagens"><img src="https://fr-usinagens.vercel.app/images/og-fr-usinagens.jpg" width="1200" height="630" loading="lazy" alt="Preview estático publicado da FR Usinagens"><span class="project-browser"><i></i><i></i><i></i><b>fr-usinagens.vercel.app</b></span></a>',
    "https://www.entretempos.blog.br/":
        '<a class="project-media cursor-label" data-cursor="VISITAR" href="https://www.entretempos.blog.br/" target="_blank" rel="noopener noreferrer" aria-label="Ver a revista EntreTempos"><img src="assets/projects/entretempos.webp" width="1440" height="1000" loading="lazy" alt="Página inicial publicada da revista eletrônica EntreTempos"><span class="project-browser"><i></i><i></i><i></i><b>entretempos.blog.br</b></span></a>',
    "https://enemplanner.vercel.app/":
        '<a class="project-media cursor-label" data-cursor="VISITAR" href="https://enemplanner.vercel.app/" target="_blank" rel="noopener noreferrer" aria-label="Ver o ENEM Planner"><img src="assets/projects/enem-planner.webp" width="1440" height="1000" loading="lazy" alt="Interface publicada do ENEM Planner com agenda semanal de estudos"><span class="project-browser"><i></i><i></i><i></i><b>enemplanner.vercel.app</b></span></a>',
}

lines = index.splitlines()
replaced = 0
for i, line in enumerate(lines):
    if 'class="project-media live-preview-shell' not in line:
        continue
    matched_url = next((url for url in static_media if f'data-preview-url="{url}"' in line), None)
    if not matched_url:
        continue
    indent = line[:len(line) - len(line.lstrip())]
    lines[i] = indent + static_media[matched_url]
    replaced += 1

index = "\n".join(lines) + ("\n" if index.endswith("\n") else "")

# ------------------------------------------------------------
# 2) JS: remove lazy iframe loading logic.
# ------------------------------------------------------------
js_pattern = re.compile(
    r'\n  // Lazy live previews — load external sites only when their card reaches the viewport\..*?'
    r'\n  // Project screenshots intentionally remain static on hover\.',
    re.S
)
script, js_count = js_pattern.subn(
    '\n  // Project screenshots intentionally remain static on hover.',
    script,
    count=1
)

# ------------------------------------------------------------
# 3) CSS: remove live preview CSS while preserving founder icons.
# ------------------------------------------------------------
founder_icon_css = '''
/* Founder social icons */
.founder-links a{display:inline-flex;align-items:center;gap:.38rem}
.founder-link-icon{flex:0 0 auto;width:15px;height:15px;display:inline-grid;place-items:center}
.founder-link-icon svg{width:100%;height:100%;overflow:visible;fill:none;stroke:currentColor;stroke-width:1.65;stroke-linecap:round;stroke-linejoin:round}
.founder-link-icon .icon-fill{fill:currentColor;stroke:none}

'''

css_pattern = re.compile(
    r'/\* DEVARITY LIVE PROJECT PREVIEWS \*/.*?(?=/\* DEVARITY HQ LOGO SWAP \*/)',
    re.S
)
style, css_count = css_pattern.subn(founder_icon_css, style, count=1)

# ------------------------------------------------------------
# 4) EntreTempos case: restore static screenshot.
# ------------------------------------------------------------
case_preview_pattern = re.compile(
    r'\s*<section class="case-live-preview".*?</section>\s*',
    re.S
)
static_case = '''
    <section class="case-visual" aria-label="Screenshot do projeto publicado"><div class="case-frame"><img src="../../assets/projects/entretempos.webp" width="1440" height="1000" alt="Página inicial publicada da revista eletrônica EntreTempos"></div></section>
'''
entre, entre_count = case_preview_pattern.subn(static_case, entre, count=1)

entre_script_pattern = re.compile(
    r'\s*<script>\s*\(\(\)=>\{const shell=document\.querySelector\(\'\[data-case-live-preview\]\'\).*?</script>\s*',
    re.S
)
entre, entre_js_count = entre_script_pattern.subn('\n', entre, count=1)

# ------------------------------------------------------------
# 5) case.css: remove case live preview styling.
# ------------------------------------------------------------
case_css_pattern = re.compile(
    r'\n*/\* CASE LIVE PREVIEW \*/.*\Z',
    re.S
)
case_css, case_css_count = case_css_pattern.subn('\n', case_css, count=1)

INDEX.write_text(index, encoding="utf-8")
SCRIPT.write_text(script, encoding="utf-8")
STYLE.write_text(style, encoding="utf-8")
CASE_CSS.write_text(case_css, encoding="utf-8")
ENTRE.write_text(entre, encoding="utf-8")

print("OK — live preview removido.")
print(f"- cards estáticos restaurados na home: {replaced}/6")
print(f"- JS de live preview removido: {'sim' if js_count else 'já não existia'}")
print(f"- CSS de live preview removido: {'sim' if css_count else 'já não existia'}")
print(f"- EntreTempos voltou para screenshot: {'sim' if entre_count else 'já estava estático'}")
print(f"- JS do EntreTempos removido: {'sim' if entre_js_count else 'já não existia'}")
print(f"- CSS do case live preview removido: {'sim' if case_css_count else 'já não existia'}")
print("- FR Usinagens foi mantido")
print("- ícones dos fundadores foram mantidos")
print("- logo, loader e GEO foram mantidos")
print("Backup:", backup.name)
