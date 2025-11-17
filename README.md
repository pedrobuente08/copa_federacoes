# 🏖️ Sistema Beach Tennis - Copa das Federações Bahia

Sistema para acompanhamento dos resultados da equipe baiana de beach tennis na Copa das Federações em Fortaleza.

## 📋 Funcionalidades

- ✅ Login exclusivo para capitães
- ✅ Cadastro de jogos e confrontos
- ✅ Registro de resultados (duplas feminina, masculina e mista)
- ✅ Integração com Google Sheets para lista de atletas
- ✅ Filtros por categoria
- ✅ Visualização de próximos jogos e resultados
- ✅ Interface responsiva e moderna

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn

### Instalação

1. **Clone ou baixe o projeto**
```bash
cd beach-tennis-system
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações do Google Sheets (veja seção abaixo).

4. **Inicie o servidor**
```bash
npm start
```

5. **Acesse o sistema**
Abra o navegador em: `http://localhost:3000`

## 🔑 Usuários e Senhas

Os capitães autorizados são:
- `pedrobuente` / `pedro1234`
- `juanfalcao` / `juan1234`
- `netovegas` / `neto1234`
- `rodolforagner` / `rodolfo1234`
- `priscillalessa` / `priscilla1234`

## 📊 Configuração do Google Sheets

### Estrutura da Planilha

Crie uma planilha no Google Sheets com uma aba chamada **"Atletas"** com as seguintes colunas:

| Nome | Gênero | Categorias |
|------|--------|------------|
| João Silva | masculino | A, PRO |
| Maria Santos | feminino | A, PRO |
| Pedro Costa | masculino | B, C |

**Observações:**
- Coluna A: Nome do atleta
- Coluna B: Gênero (masculino ou feminino)
- Coluna C: Categorias separadas por vírgula

### Método 1: API Key (Mais Simples - Apenas Leitura)

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a **Google Sheets API**
4. Vá em "Credenciais" > "Criar Credenciais" > "Chave de API"
5. Copie a API Key gerada
6. **IMPORTANTE**: Torne sua planilha pública (compartilhar > qualquer pessoa com o link pode visualizar)
7. No arquivo `.env`:
```env
GOOGLE_SHEET_ID=seu_id_da_planilha_aqui
GOOGLE_API_KEY=sua_api_key_aqui
```

**Como pegar o ID da planilha:**
Da URL: `https://docs.google.com/spreadsheets/d/ESTE_É_O_ID/edit`

### Método 2: Service Account (Recomendado para Produção)

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto
3. Ative a **Google Sheets API**
4. Vá em "Credenciais" > "Criar Credenciais" > "Conta de Serviço"
5. Crie a conta de serviço
6. Clique na conta criada > "Chaves" > "Adicionar Chave" > "JSON"
7. Baixe o arquivo JSON
8. Abra o arquivo e copie:
   - `client_email`
   - `private_key`
9. **IMPORTANTE**: Compartilhe sua planilha com o email da service account (client_email)
10. No arquivo `.env`:
```env
GOOGLE_SHEET_ID=seu_id_da_planilha_aqui
GOOGLE_SERVICE_ACCOUNT_EMAIL=seu-service-account@projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## 🌐 Deploy

### Opção 1: Vercel (Recomendado)

1. Instale a CLI da Vercel:
```bash
npm i -g vercel
```

2. Faça login:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Configure as variáveis de ambiente no painel da Vercel:
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_API_KEY` ou `GOOGLE_SERVICE_ACCOUNT_EMAIL` e `GOOGLE_PRIVATE_KEY`

### Opção 2: Render

1. Crie uma conta em [render.com](https://render.com)
2. Crie um novo "Web Service"
3. Conecte ao seu repositório GitHub
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Adicione as variáveis de ambiente nas configurações

### Opção 3: Railway

1. Crie uma conta em [railway.app](https://railway.app)
2. Crie um novo projeto
3. Deploy do GitHub ou upload do código
4. Adicione as variáveis de ambiente

### Opção 4: Heroku

1. Instale a CLI do Heroku
2. Login: `heroku login`
3. Crie app: `heroku create nome-do-app`
4. Configure variáveis: `heroku config:set GOOGLE_SHEET_ID=...`
5. Deploy: `git push heroku main`

## 📁 Estrutura do Projeto

```
beach-tennis-system/
├── server.js              # Servidor Node.js com Express
├── public/
│   └── index.html        # Frontend React
├── package.json          # Dependências
├── .env.example          # Exemplo de variáveis de ambiente
└── README.md            # Este arquivo
```

## 🔧 Desenvolvimento

Para desenvolvimento com auto-reload:
```bash
npm run dev
```

## 📝 Categorias Disponíveis

- sub 12
- sub 14
- sub 16
- sub 18
- 40+
- 50+
- 60+
- PRO
- A, B, C, D

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

MIT License

## 🆘 Suporte

Em caso de dúvidas ou problemas:
1. Verifique se todas as dependências estão instaladas
2. Confirme que o Google Sheets está configurado corretamente
3. Verifique os logs do servidor para erros

## 🎯 Roadmap

- [ ] Adicionar banco de dados (MongoDB/PostgreSQL)
- [ ] Sistema de notificações
- [ ] Estatísticas e gráficos
- [ ] Exportação de relatórios
- [ ] App mobile
