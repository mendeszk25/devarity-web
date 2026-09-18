# Devarity — GEO para Google e respostas de IA

Este pacote **não usa Google Search Console**.

Ele melhora o próprio site para que buscadores e sistemas de IA encontrem uma definição mais clara e consistente da entidade **Devarity Web**.

## O que muda

- cria `/sobre/`, uma página oficial explicando o que é a Devarity, fundadores, localização, serviços, projetos e contato;
- adiciona `AboutPage + Organization` em JSON-LD;
- deixa a definição da Devarity visível também na home;
- cria link interno da home para `/sobre/`;
- atualiza `llms.txt`;
- adiciona `/sobre/` ao `sitemap.xml`.

## Aplicar

Coloque `apply_geo_google_ai.py` na raiz do repositório e rode:

```bash
python apply_geo_google_ai.py
```

Depois:

```bash
git add .
git commit -m "geo: strengthen Devarity entity for AI search"
git push
```

Não instala biblioteca, não usa GSC e não altera animações.
