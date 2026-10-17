# Favicon global Devarity

Fonte preservada: `assets/1000126143.png` (4096 × 4096). Versão de cache: `4d43406159ad`, derivada do SHA-256 da fonte.

O processamento usa apenas recorte quadrado e rasterização convencional: região de 3360 × 3360 em x=354, y=320; proporção preservada; Lanczos3 com nitidez leve. O fundo claro e a textura originais foram mantidos, sem transparência, redesenho ou geração por IA. Os PNG maiores usam paleta otimizada de 256 cores. O símbolo ocupa a largura disponível com uma margem curta e não se confunde com o fundo escuro do navegador.

## Arquivos gerados

Em `assets/icons/`:

| Arquivo | Resolução |
| --- | --- |
| `favicon-16.png` | 16 × 16 |
| `favicon-32.png` | 32 × 32 |
| `favicon-48.png` | 48 × 48 |
| `apple-touch-icon.png` | 180 × 180 |
| `favicon-192.png` | 192 × 192 |
| `favicon-512.png` | 512 × 512 |
| `favicon.ico` | 16, 32 e 48 px no mesmo arquivo |

`/favicon.ico` contém uma cópia idêntica para a busca automática dos navegadores e clientes que não leem o `<head>`.

Todas as páginas abaixo possuem os sete links diretamente no `<head>`, com `type`, `sizes`, caminho absoluto `/assets/icons/…` e `?v=4d43406159ad`. Não há dependência de JavaScript. Nenhum manifesto de aplicativo existia; nenhum foi adicionado.

## HTMLs atualizados — 19

- `index.html`
- `sobre/index.html`
- `projetos/atipicos-frios/index.html`
- `projetos/cuidar-odontologia/index.html`
- `projetos/entretempos/index.html`
- `tools/index.html`
- `tools/404.html`
- `tools/planos/index.html`
- `tools/sobre/index.html`
- `tools/bio-instagram/index.html`
- `tools/comprimir-imagem/index.html`
- `tools/contador-caracteres/index.html`
- `tools/converter-arquivos/index.html`
- `tools/converter-imagem/index.html`
- `tools/gerar-qr-code/index.html`
- `tools/gerar-senha/index.html`
- `tools/imagens-para-pdf/index.html`
- `tools/juntar-pdf/index.html`
- `tools/link-whatsapp/index.html`

`googleb11487c9fc63dc8e.html` também foi inspecionado. É um token de verificação em texto puro, sem documento HTML ou `<head>`, e foi preservado byte a byte para não afetar o Google Search Console. O fallback `/favicon.ico` usa a nova identidade.

## Referências substituídas

- `assets/devarity-favicon.png`, `../assets/devarity-favicon.png` e `../../assets/devarity-favicon.png` nas páginas institucionais/cases.
- `./assets/img/favicon.svg` e `../assets/img/favicon.svg` no Tools.
- O SVG antigo, sem referências restantes, foi removido. A remoção do PNG antigo já existia no workspace antes desta tarefa e foi preservada.

Logotipos de header/hero/rodapé, imagens OG, estilos, animações, navegação, ferramentas e Worker não foram alterados por esta tarefa.

## Testes

- Inspeção dos 20 arquivos `.html`; 19 documentos padronizados, nenhum caminho legado de favicon restante.
- Validação de todas as dimensões PNG e das três entradas do ICO; confirmação de que o ICO da raiz é idêntico.
- Todas as 19 páginas abertas em Chromium por HTTP local; 133 links de ícones retornaram HTTP 200 com MIME de imagem e foram decodificados pelo navegador.
- Requisições de favicon efetuadas pelo próprio Chromium verificadas; fallback `/favicon.ico` retornou HTTP 200.
- Capturas de uma janela real e isolada do Chromium com a aba do Tools e o novo ícone, em preferências de tema claro/escuro: `browser-tab-light.png` e `browser-tab-dark.png`.
- `git diff --check` sem problemas.

Evidência detalhada: `results.json`. Não foram executados Safari, Edge, Firefox nem dispositivos físicos; a compatibilidade usa PNG/ICO e Apple Touch Icon padrão, sem formato ou API proprietária. A verificação foi local; nenhuma publicação, commit ou push foi feito.

Para Live Server, abra este repositório como raiz do servidor: a URL inicial deve servir `index.html` e `/assets/icons/favicon-32.png` deve responder diretamente. Não sirva apenas a subpasta `tools/`. A configuração atual da Cloudflare já publica a raiz do repositório; não exigiu alterações.
