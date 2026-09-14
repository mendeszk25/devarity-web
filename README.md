# Devarity — atualização do loader

Este pacote altera **somente `style.css` e `script.js`**, preservando o restante do projeto.

## O que muda

- O loader deixa de terminar em ~1,15 s e passa a ter uma sequência de marca com alguns segundos.
- O nome passa a usar **IBM Plex Mono**, fonte já presente no projeto.
- A palavra é exibida como `devarity`.
- A letra ativa sobe/pula, ganha o vermelho da marca e fica em caixa alta:
  - `Devarity`
  - `dEvarity`
  - `deVarity`
  - `devArity`
  - ...
- A sequência percorre a palavra duas vezes.
- Depois ela volta para `devarity` normal.
- Em seguida o nome diminui e se move até encaixar no `devarity` do hero.
- Só então o restante do hero/site entra.
- `prefers-reduced-motion` continua respeitado.
- Existe um safety timeout de 7 s apenas para evitar travamento em recurso quebrado.

## Como aplicar

1. Extraia este ZIP.
2. Copie `apply_devarity_loader.py` para a raiz do repositório `devarity-web`.
3. Abra o terminal nessa pasta.
4. Execute:

```bash
python apply_devarity_loader.py
```

O script cria automaticamente um backup dos dois arquivos antes de alterar qualquer coisa:

`.devarity-loader-backup-AAAAMMDD-HHMMSS/`

Depois teste o site e faça commit/push normalmente.

## Arquivos modificados

- `style.css`
- `script.js`

Nenhuma imagem, screenshot, case ou conteúdo do portfólio é alterado.
