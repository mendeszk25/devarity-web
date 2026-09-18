# Devarity — HQ logo swap

Este pacote substitui a logo usada no site pela versão PNG em alta qualidade enviada agora.

## O que o patch faz

- adiciona a versão **branca/transparente** em `assets/devarity-logo-white.png`;
- adiciona a versão **preta/transparente** em `assets/devarity-logo-black.png`;
- também copia a branca para `assets/devarity-logo-white.png` como asset canônico para UI escura;
- tenta atualizar automaticamente referências comuns (`devarity-logo.webp`, `devarity-logo.png`) para a versão branca;
- melhora a nitidez da logo no **loader** e no **hero** com um ajuste leve de CSS.

## Como aplicar

Descompacte este zip e rode na raiz do repositório:

```bash
python apply_hq_logo_swap.py
```

Depois:

```bash
git add .
git commit -m "chore: replace devarity logo with HQ png assets"
git push
```

## Observação

Como o site principal da Devarity é predominantemente escuro, o patch liga a **logo branca** nos pontos principais.
A **logo preta** também fica disponível em `assets/devarity-logo-black.png` para qualquer trecho com fundo claro.
