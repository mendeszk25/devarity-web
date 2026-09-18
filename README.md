# Devarity — remover Live Preview

Este patch volta a seção de projetos para **cards com imagens estáticas**, sem `iframe` e sem carregar os sites externos dentro da página.

Ele remove apenas o sistema de Live Preview.

Mantém:
- FR Usinagens no lugar de Atípicos Frios;
- ícones de Instagram / GitHub / WhatsApp / portfólio;
- alterações de logo;
- animação do loader;
- GEO / `llms.txt`;
- restante do design atual.

O case do EntreTempos também volta para a screenshot estática.

## Aplicar

```bash
python remove_live_preview.py
```

Depois:

```bash
git add .
git commit -m "revert: remove live project previews"
git push
```
