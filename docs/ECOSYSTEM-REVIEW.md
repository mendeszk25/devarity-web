# Devarity Web + Tools — revisão implementada

Data: 17/10/2026. Implementação local, sem commit, push ou publicação.

## Direção e plugins

Taste Frontend Design, Impeccable UI e Emil Design Engineering disponíveis e lidos no cache local de plugins. O launcher de contexto do Impeccable retornou `Permission denied`; as instruções e o código foram lidos diretamente. Não foi necessário instalar plugins, bibliotecas ou dependências de execução no site.

Inventário preservado: logo oficial, preto #050505, vermelho #FF3B30, Archivo, detalhes mono, slogan original em três linhas, terminal, numeração editorial, cases estáticos e utilitários em JavaScript. O gerador do Taste ofereceu contact-sheet, pinned-poster e name-as-monument. A última direção foi escolhida pela afinidade com a marca já ampliada no hero. O brief prevalece sobre os padrões do skill: não substituímos o slogan, não removemos a numeração, nem trocamos a identidade existente.

Ideia: o código da Devarity se torna um instrumento de transformação, do trabalho sob medida ao primeiro produto próprio em destaque.

Argumento das seções: o hero apresenta as duas frentes; o portfólio demonstra os trabalhos com capturas reais; o produto permite explorar a proposta de transformação; serviços, processo e fundadores preservam o contexto do estúdio. No Tools, o catálogo vem imediatamente depois do hero, antes de planos.

Referências consultadas (princípios, sem copiar layouts ou código React):

- [Studio DAD / Awwwards](https://www.awwwards.com/sites/studio-dad): contraste editorial preto, vermelho e branco.
- [Sticky Grid Scroll / Codrops](https://tympanus.net/Tutorials/StickyGridScroll/): ritmo e continuidade de imagens; sem prender a rolagem.
- [Pixel Swap / React Bits](https://www.reactbits.dev/c/animations/pixel-swap): construção por células, adaptada em CSS e Web Animations nativos.
- [Animating in Public / Emil Kowalski](https://emilkowal.ski/ui/animating-in-public): transições coordenadas e feedback de interação.

## Autoria e seleção

A API pública do GitHub foi consultada para repositórios, homepages, README e contribuidores. Os sites e os dois portfólios foram abertos em Chromium. Repositório público e contribuições comprovam participação técnica, não contratação comercial pela Devarity. Por isso os rótulos dizem “site para negócio”, “projeto educacional”, “aplicação autoral” e “colaboração”; não afirmam contratos da empresa.

| Projeto | Autoria verificada | Natureza apresentada | Repositório |
| --- | --- | --- | --- |
| Cuidar Odontologia | Davi Gabriel | Site para negócio | [cuidar-odontologia](https://github.com/mendeszk25/cuidar-odontologia) |
| Taiane Almeida | Murilo Gabriel | Projeto editorial | [taianealmeida](https://github.com/DevMurilo0/taianealmeida) |
| Portal EREMPAF | Murilo Gabriel | Projeto educacional | [portal_erempaf](https://github.com/DevMurilo0/portal_erempaf) |
| FR Usinagens | Davi Gabriel | Site para negócio | [fr-usinagens](https://github.com/mendeszk25/fr-usinagens) |
| EntreTempos | Murilo Gabriel + Davi Gabriel | Colaboração, revista escolar | [EntreTempos](https://github.com/DevMurilo0/EntreTempos) |
| ENEM Planner | Murilo Gabriel | Aplicação autoral | [enemplanner](https://github.com/DevMurilo0/enemplanner) |
| Atípicos Frios (adicionado) | Davi Gabriel | Catálogo para negócio | [At-picos-Frios](https://github.com/mendeszk25/At-picos-Frios) |
| Fly Telecom (adicionado) | Murilo Gabriel | Site para negócio | [fly-telecom-fibra](https://github.com/DevMurilo0/fly-telecom-fibra) |

EntreTempos: API de contribuidores identificou ambos (`DevMurilo0`, `mendeszk25`). Os outros sete repositórios retornaram apenas o respectivo fundador como contribuidor. Isso não exclui colaborações não registradas no Git.

Portfólios consultados: [Murilo](https://murilogabriel.com.br/) e [Davi](https://portfolio-davi.mendeszk2025.workers.dev/), este último obtido da seção Fundadores. O texto do link de Davi passou a dizer “Portfólio”, coerente com o endereço real existente.

Candidatos não selecionados:

- Sr. Navalha: repositório confirmado; sem homepage no GitHub ou canonical no HTML consultado. A hipótese `srnavalha.vercel.app` retornou 404 e não foi publicada como link.
- Escola Peralta: repositório e README confirmados; sistema escolar com autenticação e identidade provisória documentada. Sem URL pública confirmada nas fontes consultadas.
- Ecosturas: não encontrado na listagem pública de repositórios de Murilo, no portfólio consultado ou na busca pelo nome com GitHub/Murilo. Não atribuído sem evidência.
- D2 Motos: README distingue demonstração local e persistência financeira ainda pendente. Sem publicação confirmada; não apresentado como produto lançado.
- Cantinho do Sabor: README registra pendências comerciais, de fotografias e de domínio. Sem versão pública confirmada.
- Atípicos: dois repositórios encontrados. O README e canonical do `At-picos-Frios` apontam a versão Firebase `atipico-frios.web.app`; esta foi usada. A URL Vercel foi consultada para comparação.

## Capturas e imagens

Oito capturas reais, Chromium 1440 × 1000, aguardando rede, fontes e animações. ENEM Planner foi recapturado após fechar a apresentação; Atípicos foi recapturado no topo com rolagem instantânea para evitar capturar a volta ao topo em andamento. Sem interfaces inventadas ou imagens de banco. WebP qualidade 85, com variantes 720 × 500 qualidade 82, srcset, lazy loading e dimensões explícitas.

| Arquivo principal em `assets/projects/` | Origem da nova captura |
| --- | --- |
| cuidar-odontologia.webp | https://cuidar-odontologia.vercel.app/ |
| taiane-almeida.webp | https://taianealmeida.com.br/ |
| portal-erempaf.webp | https://portalerempaf.vercel.app/ |
| fr-usinagens.webp | https://fr-usinagens.vercel.app/ |
| entretempos-a-revista.webp | https://www.entretempos.blog.br/ |
| enem-planner.webp | https://enemplanner.vercel.app/ |
| atipicos-frios.webp | https://atipico-frios.web.app/ |
| fly-telecom.webp | https://fly-telecom-fibra.vercel.app/ |

Todos têm a variante `-720.webp`. O arquivo `entretempos.webp`, usado pelo case publicado, também recebeu a nova captura da abertura (mesma origem, preservando sua URL). Inventário completo em `PROJECT-IMAGES.md`. O Portal EREMPAF exibe algumas imagens de notícias ausentes na própria origem; a captura registra a interface real. Atípicos mostra placeholders de produtos na origem; não foram substituídos por produtos fictícios. O nome histórico `entretempos-a-revista.webp` foi mantido para preservar referências, mas a captura agora mostra a abertura da revista e o alt foi atualizado.

## Três momentos de movimento

1. Hero institucional: seletor Estúdio / Produto com trilho de seleção, revelação horizontal por máscara e sequência de arquivos. Painéis com altura estável, botões nativos, estado aria-pressed e acesso permanente à seção do produto. A sequência de entrada existente da marca foi abreviada, sem remover o morph original.
2. Seção de produto: três arquivos convergem por linhas SVG para a marca oficial; a saída se recompõe em células. Dispara uma vez ao entrar na tela e pode ser repetida pelo botão. Nenhum processamento é sugerido como real.
3. Hero do Tools: instrumento com entradas selecionáveis de imagem, texto e link, resultado ilustrativo correspondente e link para a ferramenta correta. A marca reage discretamente ao ponteiro; seleção e simulação coordenam entrada, núcleo e saída. Mouse, teclado e toque usam os mesmos controles nativos.

Animações interrompíveis por Web Animations API, sem biblioteca nova, sem rolagem capturada e sem loop de desenho permanente. O rAF novo é limitado a eventos de ponteiro. `prefers-reduced-motion` desativa os movimentos inclusive se alterado durante a visita. Ativações pelo teclado atualizam os estados sem deslocamentos. O catálogo mantém View Transitions com fallback já existente.

## Arquivos

- `index.html`, `style.css`, `script.js`: integração do produto, portfólio, créditos, imagens responsivas e abertura abreviada.
- `assets/css/ecosystem.css`, `assets/js/ecosystem.js`: composição, instrumentação e interações compartilhadas.
- `tools/index.html`, `tools/assets/css/styles.css`: novo hero, catálogo antecipado, marca e correções responsivas.
- Os 12 outros `tools/**/index.html`: logo oficial em header/rodapé, link local para a Devarity e destino do skip link focalizável.
- `assets/projects/`: oito capturas da seleção, oito variantes responsivas e o arquivo do case EntreTempos atualizado com a mesma captura.
- `.assetsignore`: exclui documentação de QA do pacote de assets publicado.
- `docs/visual-review/`: capturas e resultados verificáveis; scripts opcionais de navegador.

Sem alterações no Worker, configuração Cloudflare, motores das ferramentas, URLs ou cases publicados. `project-previews.js` permanece no repositório; a homepage usa agora capturas estáveis em vez de iframes remotos automáticos.

## Como verificar

Site: `python3 -m http.server 8019` na raiz; abra `http://localhost:8019/` e `/tools/`. Não exige npm para visualizar.

Os 27 checks funcionais passaram, incluindo os dez utilitários no escopo declarado, seleção do produto, catálogo, navegação, movimento reduzido, toque emulado e leitura sem JavaScript. Os scripts de QA usam Playwright instalado fora do projeto. Neste ambiente:

```sh
NODE_PATH=/tmp/devarity-qa/node_modules node docs/visual-review/check-layout.cjs
NODE_PATH=/tmp/devarity-qa/node_modules node docs/visual-review/check-behavior.cjs
```

A confirmação final foi executada com `confirm-layout.cjs` (mesmos cinco tamanhos, aguardando decodificação de todas as imagens e com varredura da homepage em todas as larguras, aguardando as animações de entrada antes de medir). Aceitam `CHROME_PATH` para o executável do navegador. Não fazem parte do runtime do site. Resultados finais: `layout-results.json` e `functional-results.json`. Testes adicionais reais em emulação de toque e com JavaScript desativado: `check-fallbacks.cjs`. As capturas mostram 320, 390, 768, 1440 e 1920 px, além das seções, do modo Produto e de movimento reduzido.

Limites: Chromium automatizado, sem aparelhos físicos nem Safari/Firefox. Não houve deploy ou teste remoto do Worker; caminhos foram testados em servidor estático HTTP. Impressão final/salvar PDF e leitura física do QR com câmera não foram simuladas como validação completa. A união de PDF permanece explicitamente em desenvolvimento. Não acessamos painéis privados nem enviamos mensagens/contatos reais.

O lint e o inspector do Taste foram executados. Alertas de identidade (mono, numeração, divisórias, título original de três linhas) conflitam com o brief e foram preservados de propósito. O inspector também pede imagens e vídeo no hero do Tools; o brief pede uma demonstração de interface, portanto não foram inseridas fotografias ou filmes genéricos. Os defeitos reais de contraste, fonte, quebra mobile e overflow detectados foram corrigidos e checados no navegador; não se declara aprovação integral das regras genéricas do skill.

Resultado final: as dez combinações de página/largura passaram, sem rolagem horizontal, imagens locais ausentes, conteúdo excedendo a largura após as entradas ou erros de JavaScript. Capturas de todas as larguras foram abertas para inspeção visual. `git diff --check` e verificações de sintaxe dos scripts passaram; referências locais de links e assets nas páginas alteradas não apresentaram destinos inexistentes.
