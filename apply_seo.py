#!/usr/bin/env python3
from pathlib import Path
from datetime import datetime
import json
import re
import shutil
import sys

ROOT = Path.cwd()
PACKAGE_DIR = Path(__file__).resolve().parent
BASE_URL = 'https://devarity-web.devarity-web.workers.dev'
TITLE = 'Devarity Web | Sites e Sistemas Sob Medida'
DESCRIPTION = 'A Devarity Web cria sites profissionais, sistemas sob medida e experiências digitais em Gravatá, PE, para marcas e empresas de todo o Brasil.'
OG_DESCRIPTION = 'Sites profissionais, sistemas sob medida e experiências digitais criadas para marcas e empresas que querem crescer com tecnologia.'
OG_IMAGE = BASE_URL + "/assets/devarity-og.png"

INDEX = ROOT / "index.html"
SITEMAP = ROOT / "sitemap.xml"
ROBOTS = ROOT / "robots.txt"

CASE_PAGES = {
    "projetos/cuidar-odontologia/index.html": {
        "title": "Cuidar Odontologia | Case — Devarity Web",
        "description": "Case da Devarity Web: site institucional responsivo desenvolvido para a Cuidar Odontologia Integrada.",
        "url": BASE_URL + "/projetos/cuidar-odontologia/"
    },
    "projetos/atipicos-frios/index.html": {
        "title": "Atípicos Frios | Case — Devarity Web",
        "description": "Case da Devarity Web: site institucional e catálogo digital desenvolvido para o Atípicos Frios.",
        "url": BASE_URL + "/projetos/atipicos-frios/"
    },
    "projetos/entretempos/index.html": {
        "title": "EntreTempos | Case — Devarity Web",
        "description": "Case da Devarity Web: revista eletrônica interativa criada para arte, literatura, música e cultura.",
        "url": BASE_URL + "/projetos/entretempos/"
    },
}

required = [INDEX, SITEMAP, ROBOTS] + [ROOT / p for p in CASE_PAGES]
missing = [str(p.relative_to(ROOT)) for p in required if not p.exists()]
if missing:
    print("ERRO: execute na raiz do repositório devarity-web.")
    print("Arquivos ausentes:", ", ".join(missing))
    sys.exit(1)

stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
backup = ROOT / f".devarity-seo-backup-{stamp}"
backup.mkdir()

for path in required:
    dest = backup / path.relative_to(ROOT)
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, dest)

assets_dir = ROOT / "assets"
assets_dir.mkdir(exist_ok=True)
og_source = PACKAGE_DIR / "devarity-og.png"
if not og_source.exists():
    print("ERRO: devarity-og.png deve ficar ao lado deste script.")
    sys.exit(2)

if (assets_dir / "devarity-og.png").exists():
    shutil.copy2(assets_dir / "devarity-og.png", backup / "devarity-og.png")

shutil.copy2(og_source, assets_dir / "devarity-og.png")

index = INDEX.read_text(encoding="utf-8")

seo_block = f"""<meta name="description" content="{DESCRIPTION}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="{BASE_URL}/">

  <meta property="og:locale" content="pt_BR">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Devarity Web">
  <meta property="og:title" content="{TITLE}">
  <meta property="og:description" content="{OG_DESCRIPTION}">
  <meta property="og:url" content="{BASE_URL}/">
  <meta property="og:image" content="{OG_IMAGE}">
  <meta property="og:image:secure_url" content="{OG_IMAGE}">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Símbolo da Devarity com a assinatura Dev + Arity em fundo preto.">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{TITLE}">
  <meta name="twitter:description" content="{OG_DESCRIPTION}">
  <meta name="twitter:image" content="{OG_IMAGE}">
  <meta name="twitter:image:alt" content="Símbolo da Devarity com a assinatura Dev + Arity em fundo preto.">

  <title>{TITLE}</title>"""

pattern = re.compile(
    r'<meta name="description"[^>]*>.*?<title>.*?</title>',
    re.S
)
index, count = pattern.subn(seo_block, index, count=1)
if count != 1:
    print("ERRO: não consegui localizar o bloco SEO atual no index.html.")
    sys.exit(3)

schema = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "@id": BASE_URL + "/#organization",
            "name": "Devarity Web",
            "alternateName": "Devarity",
            "url": BASE_URL + "/",
            "description": DESCRIPTION,
            "email": "devarity.webforge@outlook.com",
            "foundingDate": "2026",
            "areaServed": {"@type": "Country", "name": "Brasil"},
            "logo": {
                "@type": "ImageObject",
                "url": OG_IMAGE,
                "width": 1200,
                "height": 630
            },
            "image": OG_IMAGE,
            "sameAs": ["https://www.instagram.com/devarityweb/"],
            "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "sales",
                "email": "devarity.webforge@outlook.com",
                "availableLanguage": "Portuguese"
            },
            "founder": [
                {
                    "@type": "Person",
                    "name": "Davi Gabriel",
                    "sameAs": [
                        "https://instagram.com/mendeszk__",
                        "https://github.com/mendeszk25"
                    ]
                },
                {
                    "@type": "Person",
                    "name": "Murilo Gabriel",
                    "sameAs": [
                        "https://instagram.com/murilo_gabriell0",
                        "https://github.com/DevMurilo0"
                    ]
                }
            ],
            "knowsAbout": [
                "Desenvolvimento web",
                "Sites profissionais",
                "Sistemas web",
                "Experiências digitais"
            ]
        },
        {
            "@type": "WebSite",
            "@id": BASE_URL + "/#website",
            "url": BASE_URL + "/",
            "name": "Devarity Web",
            "description": DESCRIPTION,
            "publisher": {"@id": BASE_URL + "/#organization"},
            "inLanguage": "pt-BR"
        }
    ]
}

schema_text = json.dumps(schema, ensure_ascii=False, separators=(",", ":"))
schema_pattern = re.compile(
    r'<script type="application/ld\+json">.*?</script>',
    re.S
)
replacement = '<script type="application/ld+json">\n  ' + schema_text + '\n  </script>'
index, schema_count = schema_pattern.subn(replacement, index, count=1)
if schema_count != 1:
    print("ERRO: não consegui localizar o JSON-LD do index.html.")
    sys.exit(4)

INDEX.write_text(index, encoding="utf-8")

def patch_case(path, meta):
    text = path.read_text(encoding="utf-8")
    block = f"""<meta name="description" content="{meta['description']}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="{meta['url']}">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Devarity Web">
  <meta property="og:title" content="{meta['title']}">
  <meta property="og:description" content="{meta['description']}">
  <meta property="og:url" content="{meta['url']}">
  <meta property="og:image" content="{OG_IMAGE}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Símbolo da Devarity com a assinatura Dev + Arity em fundo preto.">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{meta['title']}">
  <meta name="twitter:description" content="{meta['description']}">
  <meta name="twitter:image" content="{OG_IMAGE}">
  <title>{meta['title']}</title>"""
    text, count = re.subn(
        r'<meta name="description"[^>]*>\s*<title>.*?</title>',
        block,
        text,
        count=1,
        flags=re.S
    )
    if count != 1:
        raise RuntimeError(f"Não consegui atualizar SEO de {path}")
    path.write_text(text, encoding="utf-8")

for rel, meta in CASE_PAGES.items():
    patch_case(ROOT / rel, meta)

today = "2026-09-15"
sitemap = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>{BASE_URL}/</loc>
    <lastmod>{today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>{BASE_URL}/projetos/cuidar-odontologia/</loc>
    <lastmod>{today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>{BASE_URL}/projetos/atipicos-frios/</loc>
    <lastmod>{today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>{BASE_URL}/projetos/entretempos/</loc>
    <lastmod>{today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
"""
SITEMAP.write_text(sitemap, encoding="utf-8")

robots = f"""User-agent: *
Allow: /

Sitemap: {BASE_URL}/sitemap.xml
"""
ROBOTS.write_text(robots, encoding="utf-8")

print("SEO/GSC aplicado com sucesso.")
print("Base URL:", BASE_URL)
print("Title:", TITLE)
print("Description:", DESCRIPTION)
print("OG image:", "assets/devarity-og.png (1200x630)")
print("")
print("Arquivos alterados:")
print("  - index.html")
print("  - sitemap.xml")
print("  - robots.txt")
for rel in CASE_PAGES:
    print("  -", rel)
print("  - assets/devarity-og.png")
print("")
print("Backup:", backup.name)
