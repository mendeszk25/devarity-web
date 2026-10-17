# Devarity Tools — Fundação de produto, monetização e arquitetura

Versão de protótipo — Outubro de 2026. **Preços e benefícios ainda não são ofertas ativas**.

## Planos propostos

| Função | Free | Plus R$ 9,90/mês | Pro R$ 14,90/mês |
|---|---|---|---|
| Ferramentas locais básicas | Sim | Sim | Sim |
| Publicidade | Pode ter, após aprovação | Não | Não |
| Histórico de trabalhos sincronizado | Não | Proposta | Proposta |
| Favoritos/presets pessoais | Não | Proposta | Proposta |
| Processamento em lote | Básico | Moderado, proposta | Avançado, proposta |
| Operações remotas caras (DOCX→PDF etc.) | Não incluídas | Limites a estudar | Cotas a estudar |

Não prometer «ilimitado» em tarefas com custo por CPU, memória, armazenamento, rede ou API. Cobrança de planos somente após login, políticas e checkout seguro.

## Tecnologias sugeridas na sequência

- A primeira camada é HTML/CSS/JavaScript estático servido em `/tools/` pelo Cloudflare Worker existente. Cada ferramenta possui um arquivo `index.html` e URL real.
- Operações locais: Canvas, TextEncoder, Web Crypto e encode de QR hospedado no próprio projeto. Evitar upload de dados pessoais desnecessário.
- Conversões pesadas: microserviço isolado com LibreOffice headless para DOCX/ODT→PDF, quotas por usuário, fila, antivírus, limite de tamanho, timeouts e expurgo automático. Não colocar no Worker como se fosse um processo do LibreOffice.
- PDF para PDF: biblioteca apropriada para juntar/dividir/reorganizar. Até sua integração, manter ação desabilitada com aviso honesto.
- Auth e preferências: Supabase Auth + tabelas com Row Level Security. Pagamentos: um provedor confiável com webhooks e idempotência.
- Estado de assinatura: sempre verificado no backend; não confiar em `localStorage` para liberar recursos pagos.
- AdSense: só após aprovação do domínio; páginas de produto úteis, consentimento onde aplicável, política de privacidade, anúncios afastados dos controles e download.

## SEO e publicação

- Esta entrega está com `noindex,follow`, deliberadamente, para não indexar funcionalidades ainda incompletas como se estivessem prontas.
- Quando cada ferramenta estiver pronta: publicar descrição original e instruções, verificar canonical individual, sitemap, Search Console, política de dados, resultados reais e acessibilidade. Indexação não garante posições.
- Não criar páginas programáticas vazias para palavras-chave. Cada URL deve ter uma ferramenta útil e conteúdo independente.

## Motion e acessibilidade

- Manifestação visual baseada no universo gráfico da Devarity: preto quase puro, vermelho vivo, tipografia editorial e elementos de processamento.
- Movimento principal é a prévia de processamento com scanner e três etapas. Revelação tipográfica única no hero, transições de estado do filtro via View Transitions com fallback, `:active`, hover direcional do catálogo e progresso discreto de rolagem.
- Sem dependências de motion desnecessárias. `prefers-reduced-motion: reduce` remove transições e scanner. Animações não bloqueiam leitura, cliques ou teclado.
- A experiência deve continuar funcional sem JavaScript na homepage do catálogo: links para ferramentas e planos existem no HTML estático.

## Situação atual por ferramenta

- QR Code: PNG estático, encoder local, em teste.
- Converter imagem, comprimir imagem: processamento local; qualidade da compressão varia com arquivo/codec e PNG sem perdas pode ter arquivo maior.
- Converter arquivos: imagem→imagem e TXT→PDF via janela de impressão. **DOCX→PDF pendente**.
- Juntar PDF: fila e reordenação pronta, **união/download pendentes**.
- Link WhatsApp, bio Instagram, contador de caracteres, senhas: utilitários locais em teste.
- Imagens para PDF: abre fluxo de impressão e usuário escolhe Salvar como PDF; não gera PDF binário com motor dedicado.

## Testes executados

- HTML de 13 páginas analisado; estrutura e links revisados.
- Scripts JavaScript checados com `node --check`.
- Testes DOM com Chromium injetando recursos locais, incluindo filtros de busca, QR PNG, WhatsApp, imagem, senhas, bio e estados pendentes.
- Capturas visuais via HTML/CSS inline em 1440 e 390 pixels, com correção de transbordamento na página de planos.
- Navegação HTTP/Live Server não foi testada integralmente porque o Chromium do ambiente bloqueou navegação por localhost e file://; validar no computador local antes do push.
