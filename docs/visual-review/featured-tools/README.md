# Três ferramentas em destaque — Devarity Tools

Nova seção estática em `tools/index.html`, com CSS e JS próprios. O HTML da seção é entregue pelo servidor, não injetado por JavaScript. Seus três artigos, prévias iniciais e links permanecem visíveis sem JavaScript.

## Posição comprovada

```js
const hero = document.querySelector('.hero');
const featured = document.querySelector('#destaques-tools');
const catalog = document.querySelector('#catalogo');
console.assert(hero, 'Hero não encontrado');
console.assert(featured, 'Seção de destaques não foi criada');
console.assert(catalog, 'Catálogo não encontrado');
console.assert(hero.nextElementSibling === featured, 'Destaques não estão imediatamente após o hero');
console.assert(featured.nextElementSibling === catalog, 'Destaques não estão imediatamente antes do catálogo');
```

Executado no Chromium em 1440, 768, 390 e 320 px. As cinco asserções passaram em todas as larguras. `layout-results.json` registra as coordenadas de cada seção, a visibilidade, a altura real, os três artigos e seus links. O catálogo “ENCONTRE. FAÇA. PRONTO.” aparece depois de todos os destaques.

## Implementação

- **Bio:** editor tipográfico com três modelos reais de texto (Criativo, Minimalista, Profissional), seleção acessível e transição por máscaras de linhas. Não há geração por IA.
- **QR:** composição gráfica vermelha com matriz preta sobre branco, sem inclinação. O endereço pode ser alterado e realmente codificado em SVG usando `vendor-qrcode/index.js`, o mesmo codificador local da ferramenta existente. Zona de silêncio de quatro módulos; nenhum serviço externo ou biblioteca nova. URLs inválidas preservam o último QR válido com aviso explícito. O rótulo abaixo da matriz sempre identifica seu destino atual.
- **WhatsApp:** mensagem editável e três sugestões, com prévia de conversa e codificação da mensagem atualizada. `wa.me/SEU-NUMERO` é texto sem link, nunca um destino de telefone fictício. Não há envio ou abertura de conversas.
- **Movimento:** entrada única por máscara coordenada; bios revelam linhas, QR revela sua matriz sem distorção e mensagens desenham o conector até a representação do link. Controles dão feedback imediato e CTAs têm preenchimento direcional e movimento da seta. Animações são finitas e canceláveis; conteúdo não fica escondido aguardando scroll. `prefers-reduced-motion` cancela movimentos ativos e mantém as demonstrações funcionais. Ações de teclado não aguardam animações.
- **Responsividade:** composições assimétricas em desktop; fluxo vertical em mobile. Textos longos têm espaço delimitado nas prévias para evitar saltos. Alvos de toque de pelo menos 44 px e foco visível.

Arquivos de produção alterados/criados:

1. `tools/index.html`: seção e referências aos dois arquivos novos.
2. `tools/assets/css/featured-tools.css`: estilos restritos à nova seção.
3. `tools/assets/js/featured-tools.js`: interações independentes do hero e catálogo.

O HTML do hero, catálogo, planos e manifesto foi comparado com o HEAD inicial e preservado byte a byte. Scripts e estilos anteriores não foram alterados. Todas as dez ferramentas continuam na listagem e na busca.

## Testes e capturas

Servidor HTTP estático em `http://localhost:8027/tools/`; Chromium headless via Playwright. Mobile emulado, sem teste em aparelho físico e sem publicação no Cloudflare.

- `home-1440.png`: página completa, mostrando hero/simulação → três destaques → catálogo → seções anteriores preservadas.
- `home-390.png` e `home-320.png`: página completa em mobile.
- `featured-*.png`: recortes da seção, obtidos das mesmas capturas completas, sem esconder ou modificar conteúdo para a captura.
- `bio-*`, `qr-*`, `whatsapp-*`: detalhes das três composições.
- `layout-results.json`: quatro larguras, ordem, conteúdo, visibilidade, links, altura, nenhum overflow e nenhuma animação pendente. Todos os estilos de bio também foram exercitados nas quatro larguras; mensagem longa não alterou a altura da conversa.
- `behavior-results.json`: onze grupos de verificações, sem erros JavaScript: bios; leitura real de QR inicial e gerado com outro URL via jsQR; endereços inválidos; mensagens e codificação; texto seguro e estado vazio; teclado/foco; filtros/busca/estado vazio; movimento reduzido; destinos das ferramentas; toque; versão sem JavaScript.
- `node --check` e `git diff --check` passaram.

Os scripts `check-layout.cjs` e `check-interactions.cjs` podem ser executados a partir da raiz. Requerem `playwright`, `sharp` e `jsqr` no ambiente de QA (nenhuma dependência em produção). Aceitam `BASE_URL` e `CHROME_PATH`; se as dependências estiverem em um prefixo separado, informe seu diretório `node_modules` em `NODE_PATH`.

## Direção e referências

Taste Frontend Design, Impeccable UI e Emil Design Engineering foram usados respeitando a identidade existente e o escopo estrito. O inspector Taste também foi executado; suas regras gerais acusam elementos do design aprovado (IBM Plex Mono, regras finas, sombras do hero, quatro linhas do manifesto), textos técnicos pequenos e ausência de fotografias/vídeo. Esses resultados não motivaram mudanças em áreas fora do pedido. As interfaces reais das demonstrações são o conteúdo visual desta seção.

Referências consultadas, sem copiar layouts ou adicionar frameworks:

- [Awwwards — Typography / Longfellow](https://www.awwwards.com/inspiration/typography-longfellow)
- [Codrops — Kinetic Typography Page Transition](https://tympanus.net/codrops/2021/09/29/kinetic-typography-page-transition/)
- [React Bits — Split Text](https://reactbits.dev/text-animations/split-text)

Sem commit ou push automático.
