# Devarity — SEO / Google Search Console / Open Graph

Pacote preparado a partir do repositório atual `mendeszk25/devarity-web`.

## URL usada

`https://devarity-web.devarity-web.workers.dev/`

Como ainda não foi informado um domínio próprio, este pacote usa o deploy atual do Cloudflare Workers.

Quando a Devarity ganhar domínio próprio, troque essa base URL no `apply_seo.py` e execute novamente.

## Novo título

**Devarity Web | Sites e Sistemas Sob Medida**

## Nova descrição

**A Devarity Web cria sites profissionais, sistemas sob medida e experiências digitais em Gravatá, PE, para marcas e empresas de todo o Brasil.**

## Compartilhamento

A imagem fornecida foi adaptada para o padrão Open Graph **1200×630** sem alterar o conteúdo principal da arte.

O arquivo final será instalado como:

`assets/devarity-og.png`

O site passa a ter:

- `og:image` absoluto
- `og:image:secure_url`
- `og:image:type`
- largura/altura 1200×630
- `og:image:alt`
- `twitter:card = summary_large_image`
- `twitter:image`

## SEO

Também adiciona:

- canonical
- `og:url`
- robots avançado
- JSON-LD com `Organization` + `WebSite`
- Instagram oficial
- e-mail comercial
- fundadores
- área atendida: Brasil
- canonical e Open Graph nos 3 cases

## Sitemap

Inclui:

- Home
- Cuidar Odontologia
- Atípicos Frios
- EntreTempos

## robots.txt

Libera o rastreamento e aponta explicitamente para:

`https://devarity-web.devarity-web.workers.dev/sitemap.xml`

## Aplicar

Extraia o ZIP e coloque estes dois arquivos juntos na raiz do repositório:

- `apply_seo.py`
- `devarity-og.png`

Depois execute:

```bash
python apply_seo.py
```

Faça deploy e então, no Google Search Console:

1. adicione/verifique a propriedade do site;
2. abra **Sitemaps**;
3. envie `sitemap.xml`;
4. em **Inspeção de URL**, inspecione a home;
5. solicite indexação.

### Cache de compartilhamento

WhatsApp, Facebook, LinkedIn e outros serviços podem manter a prévia antiga em cache por algum tempo. O HTML estará correto após o deploy, mas uma prévia já compartilhada pode demorar para ser atualizada.
