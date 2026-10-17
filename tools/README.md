# Devarity Tools — atualização de interface e páginas de ferramentas

**Instalação:** extraia a pasta `tools/` na raiz do repositório `devarity-web/`, substituindo a pasta `tools/` já existente. Não altere `index.html`, `script.js`, `worker.js` nem CSS da homepage institucional.

- Endereço de publicação: `/tools/` e `/tools/<slug>/` para cada ferramenta.
- Execute com Live Server a partir da **raiz do repositório**. URLs relativas funcionam no navegador.
- HTML + CSS + JavaScript ES modules, sem build nem npm.
- Free / Plus R$ 9,90 / Pro R$ 14,90 são **propostas**. Não há checkout, autenticação, desbloqueio de planos, nem AdSense instalado.
- Ferramentas em teste: compressão e conversão de imagens, QR estático, link WhatsApp, bio para Instagram, imagens para PDF via impressão, contagem de texto, senhas. Conversor de arquivos tem processamento parcial. Juntar PDF tem fila mas **não une ainda**.
- DOCX → PDF exige motor externo para fidelidade tipográfica. Não apresentar como funcional até a API estar implementada.
- Processamento de imagem via canvas pode eliminar metadados EXIF. SVG não é aceito.
- QR usa um encoder local de código aberto sob licença mantida em `assets/js/vendor-qrcode/LICENSE`.
- Páginas com `noindex` enquanto o projeto não estiver pronto e não tiver textos jurídicos e ferramentas finalizadas. Remova individualmente ao lançar oficialmente, com sitemap atualizado.
- Nenhum arquivo é enviado a servidores pelos utilitários locais. Em **Imagens para PDF**, o fluxo usa a impressão do navegador; selecione «Salvar como PDF».
- Não publique publicidade que pareça botão de baixar arquivo. AdSense precisa de aprovação, consentimento e política de privacidade.
