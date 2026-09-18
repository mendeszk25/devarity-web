# Devarity — AI discoverability

Coloque `apply_ai_discovery.py` na raiz do repositório e execute:

```bash
python apply_ai_discovery.py
```

Ele:

- reforça a entidade `Devarity Web` com JSON-LD `Organization`, `WebSite` e `WebPage`;
- passa a usar a logo oficial no schema;
- declara fundadores, localidade, serviços e áreas de atuação;
- cria `llms.txt` na raiz;
- adiciona `rel="describedby"` apontando para `llms.txt`.

Depois faça commit/push e deploy.
