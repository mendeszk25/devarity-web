#!/usr/bin/env python3
from pathlib import Path
from datetime import datetime
import shutil
import sys

ROOT = Path.cwd()
STYLE = ROOT / "style.css"

if not STYLE.exists():
    print("ERRO: style.css não encontrado. Rode este script na raiz do repositório devarity-web.")
    sys.exit(1)

style = STYLE.read_text(encoding="utf-8")

stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
backup = ROOT / f".devarity-hero-logo-size-backup-{stamp}"
backup.mkdir()
shutil.copy2(STYLE, backup / "style.css")

marker = "/* DEVARITY HERO LOGO = FIRST LETTER SIZE */"

block = r'''

/* DEVARITY HERO LOGO = FIRST LETTER SIZE
   The PNG has transparent margins, so its box needs to be larger
   for the visible symbol to match the visual height of the first "d". */
.hero-brand-stage {
  --hero-word-size: clamp(4rem, 9.15vw, 10.35rem);
  align-items: center;
  gap: clamp(.35rem, .8vw, .9rem);
}

.hero-brand-word {
  font-size: var(--hero-word-size) !important;
}

.hero-brand-logo {
  flex: 0 0 auto;
  width: calc(var(--hero-word-size) * 1.24) !important;
  max-width: none !important;
  height: auto !important;
  object-fit: contain;
}

/* Keep the same visual relationship on smaller screens. */
@media (max-width: 820px) {
  .hero-brand-stage {
    --hero-word-size: clamp(2.95rem, 10.4vw, 5.55rem);
    gap: clamp(.28rem, 1.4vw, .62rem);
  }
}

@media (max-width: 520px) {
  .hero-brand-stage {
    --hero-word-size: clamp(2.55rem, 9.7vw, 3.8rem);
    gap: .28rem;
  }
}

@media (max-width: 360px) {
  .hero-brand-stage {
    --hero-word-size: 9.35vw;
  }
}
'''

if marker not in style:
    style += block

STYLE.write_text(style, encoding="utf-8")

print("OK — logo do hero ajustada para o tamanho visual da primeira letra de 'devarity'.")
print("- não altera a animação do loader")
print("- a transição existente já passa a terminar nesse novo tamanho")
print("- proporção mantida em desktop, tablet e mobile")
print("Backup:", backup.name)
