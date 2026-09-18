#!/usr/bin/env python3
from pathlib import Path
from datetime import datetime
import shutil
import sys

ROOT = Path.cwd()
INDEX = ROOT / "index.html"
PATCH_ASSET = Path(__file__).resolve().parent / "patch_assets" / "fr-usinagens-hero.webp"
TARGET = ROOT / "assets" / "projects" / "fr-usinagens.webp"

if not INDEX.exists():
    print("ERRO: index.html não encontrado. Rode este script na raiz do repositório devarity-web.")
    sys.exit(1)

if not PATCH_ASSET.exists():
    print("ERRO: imagem FR Usinagens não encontrada no pacote.")
    sys.exit(1)

stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
backup = ROOT / f".devarity-fr-image-backup-{stamp}"
backup.mkdir(parents=True, exist_ok=True)
shutil.copy2(INDEX, backup / "index.html")

TARGET.parent.mkdir(parents=True, exist_ok=True)
shutil.copy2(PATCH_ASSET, TARGET)

html = INDEX.read_text(encoding="utf-8")

# Current static version after the live-preview removal patch.
old_static = '<img src="https://fr-usinagens.vercel.app/images/og-fr-usinagens.jpg" width="1200" height="630" loading="lazy" alt="Preview estático publicado da FR Usinagens">'
new_static = '<img src="assets/projects/fr-usinagens.webp" width="1244" height="646" loading="lazy" alt="Hero publicado do site FR Usinagens com torno mecânico e identidade industrial">'

if old_static in html:
    html = html.replace(old_static, new_static, 1)
elif 'assets/projects/fr-usinagens.webp' in html:
    pass
else:
    # Fallback for the old live-preview card, if that patch is still present.
    old_live = '<div class="project-preview-placeholder"><span>FR</span><small>USINAGENS / LIVE PREVIEW</small></div>'
    if old_live in html:
        html = html.replace(
            old_live,
            '<img class="project-preview-fallback" src="assets/projects/fr-usinagens.webp" width="1244" height="646" loading="lazy" alt="Hero publicado do site FR Usinagens com torno mecânico e identidade industrial">',
            1
        )
    else:
        print("ERRO: não encontrei o card da FR Usinagens no index.html.")
        sys.exit(2)

INDEX.write_text(html, encoding="utf-8")

print("OK — imagem do hero da FR Usinagens aplicada.")
print("- arquivo criado: assets/projects/fr-usinagens.webp")
print("- card da FR Usinagens atualizado para usar a imagem local")
print("- nenhum live preview foi adicionado")
print("Backup:", backup.name)
