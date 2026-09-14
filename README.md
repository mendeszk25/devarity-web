# Devarity — Typography Mobile + ESC Exit Left

Este patch corrige os três pontos mostrados nas capturas mais recentes.

## 1. DEVARITY cortado

Corrige tanto o loader quanto o hero.

No mobile a marca usa uma escala menor baseada na largura da viewport, mantém `white-space: nowrap` e tracking mais compacto.

## 2. Títulos quebrando letra por letra

No celular, títulos animados passam a ser divididos por **palavras inteiras**, não por caracteres.

Isso preserva as animações, mas evita espaçamento artificial e quebras como:

`T E C N O L`
`O G I A`

Também normaliza `word-break`, `overflow-wrap`, `line-height` e `letter-spacing`.

## 3. ESC sai pela esquerda

Novo percurso:

`BORDA DIREITA → CENTRO → BORDA ESQUERDA`

Funciona em desktop, tablet, mobile e fallback 2D.

O Wi‑Fi continua:

`BORDA DIREITA → CENTRO → BORDA DIREITA`

## Como aplicar

Copie `apply_type_and_esc_fix.py` para a raiz do projeto e rode:

```bash
python apply_type_and_esc_fix.py
```

Um backup automático será criado em:

```text
.devarity-type-mobile-backup-AAAAMMDD-HHMMSS/
```

Arquivos modificados:

- `style.css`
- `motion.js`
- `webgl.js`
