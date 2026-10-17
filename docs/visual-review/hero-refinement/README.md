# Hero Devarity Tools — refinamento

Implementação limitada a `tools/index.html`, `tools/assets/css/hero-interaction.css`, `tools/assets/js/hero-interaction.js` e `tools/assets/img/hero-qr.svg`. A homepage institucional, os estilos e scripts compartilhados, as ferramentas, o catálogo e os planos não foram editados.

## Comportamento

- Cabeçalho com utilidade específica por categoria, sem “PRÉVIA INTERATIVA”.
- Imagem: mesma ilustração em PNG e WEBP. Texto: exemplo “Olá, mundo.” com 11 caracteres e 2 palavras. Link: destino real e QR Code.
- Cartões com Pointer Events, captura do ponteiro, limites espaciais e retorno por mola amortecida. Os conectores acompanham as posições calculadas. Nenhuma leitura de layout dentro dos frames da mola.
- No toque, o arraste é horizontal (`touch-action: pan-y`) para preservar a rolagem vertical. Ativar um cartão, o símbolo ou o botão oferece a mesma simulação, inclusive por Enter/Espaço.
- A animação de simulação é finita, pode ser interrompida e nunca informa processamento real. O aviso inferior permanece explícito.
- Movimento reduzido mantém composição estática e controles funcionais, inclusive ao alterar a preferência com a página aberta. Sem loops de animação em repouso ou novas dependências de produção.
- Marca d'água usa a imagem original, proporção 720:572, opacidade 5,5% no desktop e 5% no celular, com deslocamento discreto por ponteiro.

## QR Code

SVG estático gerado com `QRCode` e `ErrorLevel.M` de `tools/assets/js/vendor-qrcode/index.js`, o mesmo codificador usado pela ferramenta. Matriz real de 29 × 29 módulos; zona de silêncio de quatro módulos em todos os lados; preto sobre branco sem alteração dos localizadores. Destino: https://devarity.com.br/tools/.

A leitura foi validada com jsQR tanto no SVG rasterizado quanto na captura do cartão inclinado em escala 3×. O gerador existente também foi executado e disponibilizou o download normalmente.

## Validação realizada

Chromium headless via Playwright, servidor HTTP estático local, sem alterações no projeto para instalar dependências de teste.

- As três categorias em 320, 390, 580, 768, 1024, 1101, 1280, 1440 e 1920 px: objetos dentro da área, aba ativa vermelha e ausência de overflow horizontal/erros de JavaScript.
- Hover, arraste dos dois cartões, retorno às coordenadas zero e cancelamento/perda de captura.
- Troca de categoria durante a sequência; sequência encerrada sem estado pendente.
- Toque via protocolo de entrada do Chromium: arraste horizontal e retorno; gesto vertical rolou a página de 225 para 340 px. Abas ativadas por toque.
- Enter/Espaço, foco visível e movimento reduzido: nenhuma animação ativa na composição estática. A preferência também foi alterada durante a sessão.
- Busca, todos os filtros, estado vazio, limpeza da busca e recuperação das dez ferramentas.
- Ferramentas vinculadas: carregamento, geração de QR, conversão real de PNG para WEBP com download e contagem real do texto de exemplo.
- `node --check` e `git diff --check`.

Arquivos de evidência: `results.json`, `touch-qr-results.json` e `final-results.json`. As capturas selecionadas incluem desktop, mobile e as três categorias. Os testes mobile foram emulados; não houve teste em aparelho físico nem publicação no Cloudflare.

O lint e o inspector do Taste também foram executados. Suas regras estilísticas gerais apontam monospace, bordas, textos pequenos, sombras, quantidade de imagens e movimento automático. Essas regras conflitam com o briefing de preservar o design aprovado e criar profundidade com sombras; não foram usadas para redesenhar outras seções. As medidas funcionais de responsividade e interação foram verificadas separadamente.

## Referências consultadas

- [Awwwards — 3D Parallax with Mouse Movement](https://www.awwwards.com/inspiration/3d-parallax-with-mouse-movement-soul-aether): referência de profundidade contida por ponteiro.
- [Codrops — Smooth, Draggable Product Grid](https://tympanus.net/Tutorials/PalmerDraggableGrid/): referência de arraste com peso e continuidade.
- [React Bits — Tilted Card](https://reactbits.dev/components/tilted-card): referência de inclinação limitada conforme a posição do cursor.

As técnicas foram implementadas em JavaScript/CSS nativos, sem incorporar React, GSAP ou Motion. Orientação de refinamento: Taste Frontend Design, Impeccable UI e Emil Design Engineering, preservando as escolhas explícitas do briefing.
