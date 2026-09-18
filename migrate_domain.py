#!/usr/bin/env python3
from pathlib import Path
import subprocess
import sys

ROOT = Path.cwd()
OLD = "devarity-web.devarity-web.workers.dev"
NEW = "devarity.com.br"

FILES = [
    Path("index.html"),
    Path("llms.txt"),
    Path("projetos/atipicos-frios/index.html"),
    Path("projetos/cuidar-odontologia/index.html"),
    Path("projetos/entretempos/index.html"),
    Path("robots.txt"),
    Path("sitemap.xml"),
    Path("sobre/index.html"),
]

missing = [str(p) for p in FILES if not (ROOT / p).exists()]
if missing:
    print("ERRO: rode este script na raiz do repositório devarity-web.")
    print("Arquivos ausentes:")
    for p in missing:
        print(" -", p)
    sys.exit(1)

changed = []
total = 0

for rel in FILES:
    path = ROOT / rel
    text = path.read_text(encoding="utf-8")
    count = text.count(OLD)
    if count:
        path.write_text(text.replace(OLD, NEW), encoding="utf-8")
        changed.append((str(rel), count))
        total += count

# Verify no old production host remains anywhere in tracked text files.
grep = subprocess.run(
    ["git", "grep", "-n", OLD],
    cwd=ROOT,
    text=True,
    capture_output=True,
)

if grep.returncode == 0 and grep.stdout.strip():
    print("ERRO: ainda existem referências ao domínio antigo:")
    print(grep.stdout)
    sys.exit(2)

print(f"OK — {total} referências migradas para https://{NEW}")
for path, count in changed:
    print(f"- {path}: {count}")

# Show final diff before committing.
subprocess.run(["git", "diff", "--check"], cwd=ROOT, check=True)
subprocess.run(["git", "diff", "--stat"], cwd=ROOT, check=True)

# Commit + push, as requested.
subprocess.run(["git", "add", *[str(p) for p in FILES]], cwd=ROOT, check=True)

status = subprocess.run(
    ["git", "diff", "--cached", "--quiet"],
    cwd=ROOT,
)
if status.returncode == 0:
    print("Nenhuma mudança nova para commit.")
    sys.exit(0)

subprocess.run(
    ["git", "commit", "-m", "seo: migrate canonical URLs to devarity.com.br"],
    cwd=ROOT,
    check=True,
)

subprocess.run(["git", "push", "origin", "main"], cwd=ROOT, check=True)

print("DONE — commit criado e push enviado para origin/main.")
