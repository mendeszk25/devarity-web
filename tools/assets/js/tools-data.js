export const tools = [
  {
    "id": "comprimir-imagem",
    "title": "Comprimir imagem",
    "category": "Imagens",
    "label": "IMG / 01",
    "summary": "Reduza o peso de JPG, PNG e WebP sem instalar programas.",
    "how": "Escolha uma imagem e defina a qualidade da compressão. A versão processada pode ser baixada no seu dispositivo.",
    "status": "Disponível em teste",
    "ready": true,
    "tags": [
      "JPG",
      "WEBP",
      "PNG"
    ],
    "modes": [
      "Compressão local",
      "Comparação de tamanho",
      "Download imediato"
    ]
  },
  {
    "id": "converter-imagem",
    "title": "Converter imagem",
    "category": "Imagens",
    "label": "IMG / 02",
    "summary": "Converta imagens entre JPG, PNG e WebP em segundos.",
    "how": "Escolha um arquivo JPG, PNG ou WebP e selecione o novo formato. A conversão ocorre no navegador.",
    "status": "Disponível em teste",
    "ready": true,
    "tags": [
      "JPG",
      "PNG",
      "WEBP"
    ],
    "modes": [
      "Conversão local",
      "Três formatos",
      "Download direto"
    ]
  },
  {
    "id": "converter-arquivos",
    "title": "Converter arquivos",
    "category": "Documentos",
    "label": "DOC / 01",
    "summary": "Um espaço para transformar arquivos; comece com imagens e texto.",
    "how": "A base já aceita conversões de imagem. A opção de texto para PDF usa a impressão do navegador. DOCX para PDF e outros formatos precisam de um motor de conversão no servidor, ainda não implementado.",
    "status": "Base disponível",
    "ready": true,
    "tags": [
      "IMAGENS",
      "TEXTO",
      "DOCX FUTURO"
    ],
    "modes": [
      "Imagens JPG/PNG/WebP",
      "Texto para PDF pelo navegador",
      "DOCX→PDF em desenvolvimento"
    ]
  },
  {
    "id": "juntar-pdf",
    "title": "Juntar PDF",
    "category": "Documentos",
    "label": "DOC / 02",
    "summary": "Organize seus PDFs antes de combiná-los em um arquivo.",
    "how": "Selecione diversos PDFs e organize a fila. A interface de preparação funciona, mas a união e o download dependem de um motor PDF ainda não integrado.",
    "status": "Em desenvolvimento",
    "ready": false,
    "tags": [
      "PDF",
      "ORGANIZAÇÃO"
    ],
    "modes": [
      "Adicionar documentos",
      "Reordenar fila",
      "Motor de união pendente"
    ]
  },
  {
    "id": "gerar-qr-code",
    "title": "Gerar QR Code",
    "category": "Links e QR",
    "label": "WEB / 01",
    "summary": "Crie um QR Code estático de texto ou link e baixe em PNG.",
    "how": "Digite um link ou texto para criar uma imagem de QR Code. Um código estático contém o próprio endereço e não permite alterar seu destino depois de impresso.",
    "status": "Disponível em teste",
    "ready": true,
    "tags": [
      "QR",
      "PNG",
      "OFFLINE"
    ],
    "modes": [
      "Código estático",
      "Prévia em tempo real",
      "PNG para baixar"
    ]
  },
  {
    "id": "link-whatsapp",
    "title": "Link para WhatsApp",
    "category": "Links e QR",
    "label": "WEB / 02",
    "summary": "Monte um link de conversa com mensagem preenchida.",
    "how": "Informe o número com DDD e uma mensagem opcional. O link wa.me é gerado localmente para copiar ou testar.",
    "status": "Disponível em teste",
    "ready": true,
    "tags": [
      "LINK",
      "MENSAGEM"
    ],
    "modes": [
      "Número + DDD",
      "Mensagem opcional",
      "Copiar link"
    ]
  },
  {
    "id": "bio-instagram",
    "title": "Bio para Instagram",
    "category": "Redes sociais",
    "label": "SOC / 01",
    "summary": "Monte uma bio profissional com modelos e prévia ao vivo.",
    "how": "Escolha um estilo, preencha seu nome, ocupação e convite para ação. A prévia respeita o limite aproximado de 150 caracteres da bio do Instagram.",
    "status": "Disponível em teste",
    "ready": true,
    "tags": [
      "BIO",
      "INSTAGRAM"
    ],
    "modes": [
      "Modelos editáveis",
      "Prévia ao vivo",
      "Contador de caracteres"
    ]
  },
  {
    "id": "imagens-para-pdf",
    "title": "Imagens para PDF",
    "category": "Documentos",
    "label": "DOC / 03",
    "summary": "Organize fotos e salve como PDF usando a impressão do navegador.",
    "how": "Adicione imagens, veja a ordem e clique para abrir uma página de impressão. Escolha “Salvar como PDF” na janela do seu navegador.",
    "status": "Disponível em teste",
    "ready": true,
    "tags": [
      "FOTOS",
      "PDF"
    ],
    "modes": [
      "Organizar imagens",
      "Prévia",
      "Salvar como PDF"
    ]
  },
  {
    "id": "contador-caracteres",
    "title": "Contador de caracteres",
    "category": "Texto",
    "label": "TXT / 01",
    "summary": "Conte palavras, caracteres e tempo estimado de leitura.",
    "how": "Escreva ou cole seu texto. A contagem de caracteres, palavras e linhas atualiza instantaneamente.",
    "status": "Disponível em teste",
    "ready": true,
    "tags": [
      "TEXTO",
      "PALAVRAS"
    ],
    "modes": [
      "Carácteres",
      "Palavras",
      "Linhas e leitura"
    ]
  },
  {
    "id": "gerar-senha",
    "title": "Gerador de senhas",
    "category": "Segurança",
    "label": "SEC / 01",
    "summary": "Crie senhas aleatórias no próprio navegador.",
    "how": "Escolha o tamanho e os tipos de caracteres. As senhas usam a API criptográfica do navegador e não são enviadas para o servidor.",
    "status": "Disponível em teste",
    "ready": true,
    "tags": [
      "SENHAS",
      "LOCAL"
    ],
    "modes": [
      "Crypto seguro",
      "Personalização",
      "Cópia rápida"
    ]
  }
];
export const categories = ["Todas", "Imagens", "Documentos", "Links e QR", "Redes sociais", "Texto", "Segurança"];
