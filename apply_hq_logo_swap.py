#!/usr/bin/env python3
from pathlib import Path
from datetime import datetime
import shutil
import sys

ROOT = Path.cwd()
PATCH_DIR = Path(__file__).resolve().parent / 'patch_assets'
WHITE_SRC = PATCH_DIR / 'devarity-logo-white-hires.png'
BLACK_SRC = PATCH_DIR / 'devarity-logo-black-hires.png'

if not WHITE_SRC.exists() or not BLACK_SRC.exists():
    print('ERRO: arquivos de patch não encontrados ao lado do script.')
    sys.exit(1)

# Basic repo sanity check
required_any = [ROOT / 'index.html', ROOT / 'style.css', ROOT / 'script.js']
missing = [p.name for p in required_any if not p.exists()]
if missing:
    print('ERRO: execute este script na raiz do repositório devarity-web.')
    print('Arquivos ausentes:', ', '.join(missing))
    sys.exit(1)

text_candidates = [
    ROOT / 'index.html',
    ROOT / 'style.css',
    ROOT / 'script.js',
    ROOT / 'case.css',
    ROOT / 'loader-reference.css',
    ROOT / 'README.md',
    ROOT / 'sobre' / 'index.html',
]
text_candidates += sorted((ROOT / 'projetos').glob('*/index.html')) if (ROOT / 'projetos').exists() else []
text_files = [p for p in text_candidates if p.exists()]

stamp = datetime.now().strftime('%Y%m%d-%H%M%S')
backup = ROOT / f'.devarity-hq-logo-backup-{stamp}'
backup.mkdir(parents=True, exist_ok=True)
for path in text_files:
    dest = backup / path.relative_to(ROOT)
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, dest)

assets_dir = ROOT / 'assets'
assets_dir.mkdir(exist_ok=True)
white_target = assets_dir / 'devarity-logo-white.png'
black_target = assets_dir / 'devarity-logo-black.png'
shutil.copy2(WHITE_SRC, white_target)
shutil.copy2(BLACK_SRC, black_target)

# also preserve a canonical default logo for dark UI usage
canonical_png = assets_dir / 'devarity-logo.png'
shutil.copy2(WHITE_SRC, canonical_png)


def replace_known_logo_paths(text: str) -> str:
    replacements = [
        ('assets/devarity-logo.webp', 'assets/devarity-logo-white.png'),
        ('../assets/devarity-logo.webp', '../assets/devarity-logo-white.png'),
        ('./assets/devarity-logo.webp', './assets/devarity-logo-white.png'),
        ('assets/devarity-logo.png', 'assets/devarity-logo-white.png'),
        ('../assets/devarity-logo.png', '../assets/devarity-logo-white.png'),
        ('./assets/devarity-logo.png', './assets/devarity-logo-white.png'),
        ('assets/devarity-logo-white.webp', 'assets/devarity-logo-white.png'),
        ('../assets/devarity-logo-white.webp', '../assets/devarity-logo-white.png'),
    ]
    for old, new in replacements:
        text = text.replace(old, new)
    return text

changed = []
for path in text_files:
    src = path.read_text(encoding='utf-8')
    out = replace_known_logo_paths(src)

    # Ensure loader and hero logos stay crisp if those selectors exist.
    if path.name == 'style.css':
        marker = '/* DEVARITY HQ LOGO SWAP */'
        if marker not in out:
            out += '''\n\n/* DEVARITY HQ LOGO SWAP */\n.loader-logo,\n.hero-brand-logo,\n.brand-mark img,\n.brand-logo img,\n.case-brand img,\n.footer-brand img,\n.nav-brand img,\n.site-brand img {\n  image-rendering: auto;\n  backface-visibility: hidden;\n  transform: translateZ(0);\n}\n\n.loader-logo {\n  width: clamp(164px, 17vw, 276px);\n  max-width: min(32vw, 276px);\n  height: auto;\n}\n\n.hero-brand-logo {\n  width: clamp(42px, 3.4vw, 74px);\n  height: auto;\n}\n'''

    if out != src:
        path.write_text(out, encoding='utf-8')
        changed.append(str(path.relative_to(ROOT)))

report = [
    'OK — logo HQ preparada para o site.',
    f'- backup criado em: {backup.name}',
    f'- asset branco copiado para: {white_target.relative_to(ROOT)}',
    f'- asset preto copiado para: {black_target.relative_to(ROOT)}',
    f'- asset canônico copiado para: {canonical_png.relative_to(ROOT)}',
]
if changed:
    report.append('- arquivos atualizados:')
    report.extend([f'  - {item}' for item in changed])
else:
    report.append('- nenhum arquivo de texto precisou trocar caminho de logo; os assets foram apenas adicionados.')
    report.append('  Se o site já usa outros nomes/caminhos, troque manualmente para assets/devarity-logo-white.png (fundos escuros)')
    report.append('  e assets/devarity-logo-black.png (fundos claros).')
print('\n'.join(report))
