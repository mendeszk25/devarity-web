# Devarity — correções finais de loader, hero, projetos e WebGL

Este pacote foi preparado sobre o estado atual do repositório `mendeszk25/devarity-web` analisado no GitHub.

## Corrige

- `DEVARITY` não quebra mais em `DEVARI / TY` no loader.
- A transição do loader para o hero usa a mesma origem geométrica (`left top`) e troca diretamente o elemento ao terminar o FLIP.
- `DEVARITY` deixa de ser uma marca escondida/outline no fundo e passa a ser um elemento principal do hero.
- O restante do hero desce naturalmente porque a marca ganha uma linha própria no grid.
- Remove tilt, glare, zoom e mudança de cor no hover das screenshots dos projetos.
- Centraliza Wi‑Fi e ESC na composição WebGL.
- Corrige a principal fonte de travamento: o scroll não faz mais `getBoundingClientRect()`/`updateBounds()` e cancel/restart de rAF a cada evento.
- Damping mais suave.
- Rotação muito mais forte em X e bem menor em Y.
- A tecla ESC inicia mais inclinada para a câmera, deixando a face superior e `esc` mais visíveis.
- O fallback 2D segue a mesma direção de movimento.

## Como aplicar

1. Extraia o ZIP.
2. Copie `apply_final_polish.py` para a raiz do projeto `devarity-web`.
3. Execute:

```bash
python apply_final_polish.py
```

O script cria um backup automático antes de alterar qualquer arquivo:

`.devarity-final-polish-backup-AAAAMMDD-HHMMSS/`

Arquivos alterados:

- `style.css`
- `script.js`
- `webgl.js`

## Depois

Rode o site localmente e confira especialmente:

- loader em 390px, 768px, 1024px e 1440px;
- encaixe de `DEVARITY` no hero;
- hero em desktop e mobile;
- `TRABALHO QUE EXISTE.` sem hover nas screenshots;
- Wi‑Fi entre Serviços e Processo;
- ESC entre Processo e Fundadores;
- scroll rápido para cima/baixo.

Se quiser reverter, copie os três arquivos da pasta de backup criada pelo script.
