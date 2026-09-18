# Migração do domínio da Devarity

Revisei o estado atual do repositório `mendeszk25/devarity-web`.

As referências antigas ao `workers.dev` estão em:

- `index.html`
- `llms.txt`
- `projetos/atipicos-frios/index.html`
- `projetos/cuidar-odontologia/index.html`
- `projetos/entretempos/index.html`
- `robots.txt`
- `sitemap.xml`
- `sobre/index.html`

O script troca:

`devarity-web.devarity-web.workers.dev`

por:

`devarity.com.br`

Ele também:
- verifica com `git grep` que o domínio antigo não ficou em nenhum arquivo rastreado;
- roda `git diff --check`;
- cria o commit;
- faz `git push origin main`.

## Uso

Na raiz do projeto:

```bash
python migrate_domain.py
```

Commit usado:

```text
seo: migrate canonical URLs to devarity.com.br
```
