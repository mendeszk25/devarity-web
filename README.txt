DEVARITY — LIVE PREVIEW FIX

Substitua estes arquivos na raiz do projeto:

project-previews.js
assets/projects/entretempos-a-revista.webp

O index.html atual do repositório já está preparado com:
- data-live-preview="taiane"
- data-live-preview="fr"
- assets/projects/entretempos-a-revista.webp

O novo project-previews.js:
- carrega o site real de Taiane Almeida e FR Usinagens em iframe;
- só inicia quando o card se aproxima da viewport;
- mantém o card clicável;
- usa a screenshot como fallback;
- em mobile / economia de dados mantém somente a imagem estática;
- não depende mais de /api/project-preview, que era o ponto que impedia o preview de funcionar.

Depois:
git add project-previews.js assets/projects/entretempos-a-revista.webp
git commit -m "fix: enable live project previews"
git push
