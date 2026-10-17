# Hero e interação — revisão incremental

Refinamento restrito à homepage Tools. A base já possuía os textos por categoria, QR SVG válido, simulação finita e logo original como marca d’água; esses recursos foram preservados e verificados novamente.

## Alterações

- Inclinação local conforme o ponto de contato, com resposta própria do símbolo central.
- Conectores ancorados nas bordas voltadas aos objetos vizinhos; curvas adaptadas à composição vertical; portas discretas e caminho ativo vermelho.
- Arraste conserva a posição ao agarrar um cartão durante o retorno. Margem extra protege os cartões inclinados nos extremos. Apenas o ponteiro capturado pode encerrar o gesto.
- Integração da mola em subpassos de até 1/120 s para resposta estável em taxas de atualização diferentes. Referências dos conectores em cache; sem consultas de layout nos frames de movimento. Animações finalizadas deixam a lista de controle.
- Entrada e saída com contraste de superfície distinto; formatos PNG/WEBP identificados nas imagens; indicadores de arraste desenhados em SVG.
- Marca original preservada em baixa opacidade, com máscara de integração ao fundo.
- Rótulos acessíveis acompanham a categoria. Espaço ativa cartões na liberação; Escape encerra o arraste. Ativar movimento reduzido também limpa o parallax da marca.
- Conteúdo estático de fallback para as prévias sem JavaScript.

## Validação

Chromium via Playwright e servidor HTTP estático. Testes mobile emulados, sem aparelho físico ou publicação no Cloudflare.

- 27 combinações: IMAGEM/TEXTO/LINK em 320, 390, 580, 768, 1024, 1101, 1280, 1440 e 1920 px. Sem overflow horizontal, objetos fora da área ou erros de JavaScript.
- Hover local, arraste dos dois cartões, retorno, retomada durante a mola, limite extremo, cancelamento e perda de captura.
- Animação finita e troca de categoria durante a sequência. Teclado e foco visível. Movimento reduzido na carga e ativado durante a interação.
- Gesto de toque horizontal moveu o cartão; retorno a zero. Gesto vertical rolou a página de 225 para 340 px.
- QR decodificado com jsQR tanto no SVG rasterizado quanto no cartão inclinado: https://devarity.com.br/tools/. Mantida a matriz existente, gerada com o codificador da própria ferramenta, e a zona de silêncio de quatro módulos.
- Busca, todos os filtros, estado vazio e limpeza recuperando as dez ferramentas. Carregamento dos dez espaços de trabalho, conversão real PNG → WEBP, contagem real e geração de QR com download habilitado.
- `node --check` e `git diff --check` passaram.

Evidências: `final-results.json`, `results.json`, `touch-qr-results.json`, `regression-results.json` e capturas nesta pasta. `check-regression.cjs` registra os casos adicionais desta revisão; requer Playwright instalado no ambiente de QA, servidor na porta 8027 (ou BASE_URL) e Chromium (CHROME_PATH pode indicar o executável). Não há dependências novas em produção.

O lint Taste aponta sombras, bordas e a máscara com gradiente. São escolhas explícitas do briefing: preservar a estrutura experimental, dar profundidade aos cartões e integrar a marca. Não se aplicou sua direção de redesign nem suas metas de imagens/animação automática à homepage aprovada.

## Referências de movimento

- [Awwwards — 3D Parallax with Mouse Movement](https://www.awwwards.com/inspiration/3d-parallax-with-mouse-movement-soul-aether)
- [Codrops — Smooth, Draggable Product Grid](https://tympanus.net/Tutorials/PalmerDraggableGrid/)
- [React Bits — Tilted Card](https://reactbits.dev/components/tilted-card)

Orientações utilizadas: Taste Frontend Design, Impeccable UI e Emil Design Engineering. Nenhuma biblioteca de animação adicionada. Sem commit ou push.
