# Devarity — logo do hero no tamanho da letra

Esse patch mexe **somente no tamanho final da logo no hero**.

Quando a animação do loader termina e a logo vai para o hero, ela passa a ficar com o **tamanho visual aproximado da primeira letra `d` de `devarity`**.

Como a PNG em alta qualidade possui margens transparentes internas, o elemento da imagem precisa ter uma caixa um pouco maior que a fonte para o símbolo visível realmente ficar do mesmo tamanho da letra.

A transição já existente do loader usa a posição/tamanho final do elemento no hero, então ela passa automaticamente a terminar nesse novo tamanho.

## Aplicar

Na raiz do projeto:

```bash
python apply_hero_logo_letter_size.py
```

Depois:

```bash
git add .
git commit -m "refine hero logo scale"
git push
```

Arquivo alterado:

- `style.css`
