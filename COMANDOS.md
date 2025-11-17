# ⚡ COMANDOS ÚTEIS - CHEAT SHEET

## 🚀 Setup Inicial

```bash
# Extrair arquivo
tar -xzf beach-tennis-system.tar.gz
cd beach-tennis-system

# Instalar dependências
npm install

# Criar arquivo .env
cp .env.example .env

# Editar .env (use seu editor favorito)
nano .env
# ou
code .env
```

---

## 🏃 Executar Projeto

```bash
# Modo produção
npm start

# Modo desenvolvimento (com auto-reload)
npm run dev

# Especificar porta customizada
PORT=8080 npm start
```

---

## 🌐 Acessar Sistema

```bash
# Abrir navegador automaticamente (Linux/Mac)
open http://localhost:3000

# Windows
start http://localhost:3000

# Ou simplesmente digite no navegador:
http://localhost:3000
```

---

## 🔐 Login

```bash
# Usuários disponíveis:
pedrobuente      / pedro1234
juanfalcao       / juan1234
netovegas        / neto1234
rodolforagner    / rodolfo1234
priscillalessa   / priscilla1234
```

---

## 📊 Google Sheets - Comandos

```bash
# Verificar status da API
curl http://localhost:3000/api/health

# Forçar atualização do cache de atletas
curl -X POST http://localhost:3000/api/atletas/refresh

# Buscar atletas
curl http://localhost:3000/api/atletas

# Buscar jogos
curl http://localhost:3000/api/jogos
```

---

## 🐛 Debug

```bash
# Ver logs do servidor
# (logs aparecem no terminal onde você executou npm start)

# Verificar se porta está em uso (Linux/Mac)
lsof -i :3000

# Matar processo na porta (Linux/Mac)
lsof -ti :3000 | xargs kill -9

# Windows - verificar porta
netstat -ano | findstr :3000

# Windows - matar processo
taskkill /PID [PID_NUMBER] /F
```

---

## 🔧 Gerenciamento de Dependências

```bash
# Instalar nova dependência
npm install nome-do-pacote

# Instalar dependência de desenvolvimento
npm install --save-dev nome-do-pacote

# Atualizar dependências
npm update

# Verificar dependências desatualizadas
npm outdated

# Limpar cache do npm
npm cache clean --force

# Reinstalar tudo do zero
rm -rf node_modules package-lock.json
npm install
```

---

## 📦 Deploy - Vercel

```bash
# Instalar CLI da Vercel
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy em produção
vercel --prod

# Ver logs
vercel logs

# Listar deployments
vercel ls

# Remover deployment
vercel rm [deployment-url]

# Configurar variáveis de ambiente
vercel env add GOOGLE_SHEET_ID
vercel env add GOOGLE_API_KEY
```

---

## 📦 Deploy - Render

```bash
# 1. Criar conta em render.com
# 2. Conectar repositório GitHub
# 3. Configurar:
#    - Build Command: npm install
#    - Start Command: npm start
# 4. Adicionar variáveis de ambiente no painel
```

---

## 📦 Deploy - Railway

```bash
# Instalar CLI
npm i -g @railway/cli

# Login
railway login

# Inicializar projeto
railway init

# Deploy
railway up

# Ver logs
railway logs

# Configurar variáveis
railway variables set GOOGLE_SHEET_ID=...
```

---

## 📦 Deploy - Heroku

```bash
# Instalar CLI do Heroku
# Download: https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Criar app
heroku create nome-do-app

# Configurar variáveis
heroku config:set GOOGLE_SHEET_ID=...
heroku config:set GOOGLE_API_KEY=...

# Deploy
git push heroku main

# Ver logs
heroku logs --tail

# Abrir app
heroku open

# Escalar
heroku ps:scale web=1
```

---

## 🔄 Git

```bash
# Inicializar repositório
git init

# Adicionar arquivos
git add .

# Commit
git commit -m "Initial commit"

# Adicionar remote
git remote add origin https://github.com/seu-usuario/seu-repo.git

# Push
git push -u origin main

# Status
git status

# Ver mudanças
git diff

# Log
git log --oneline
```

---

## 🧪 Testes Manuais

```bash
# Testar login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"pedrobuente","password":"pedro1234"}'

# Criar jogo
curl -X POST http://localhost:3000/api/jogos \
  -H "Content-Type: application/json" \
  -d '{
    "categoria":"sub 18",
    "data":"18/11/25",
    "confronto":"Bahia x São Paulo",
    "horario":"11:00"
  }'

# Buscar jogos
curl http://localhost:3000/api/jogos

# Atualizar jogo
curl -X PUT http://localhost:3000/api/jogos/[ID] \
  -H "Content-Type: application/json" \
  -d '{
    "resultado": {
      "feminino": {
        "atletas": ["Maria", "Ana"],
        "placar": "2x0",
        "resultado": "vitoria"
      }
    }
  }'
```

---

## 📊 Monitoramento

```bash
# Ver uso de CPU/Memória (Linux/Mac)
top

# Ver processos Node.js
ps aux | grep node

# Monitorar logs em tempo real
tail -f logs/app.log

# Verificar conectividade
ping google.com

# Testar Google Sheets API
curl "https://sheets.googleapis.com/v4/spreadsheets/[SHEET_ID]?key=[API_KEY]"
```

---

## 🔒 Segurança

```bash
# Gerar senha aleatória
openssl rand -base64 32

# Verificar permissões de arquivo
ls -la .env

# Deixar .env apenas leitura
chmod 400 .env

# Verificar vulnerabilidades
npm audit

# Corrigir vulnerabilidades
npm audit fix

# Verificar dependências desatualizadas
npm outdated
```

---

## 🗄️ Backup

```bash
# Backup de dados (se usar arquivo JSON local)
cp data/jogos.json data/jogos.backup.json

# Backup com timestamp
cp data/jogos.json data/jogos.$(date +%Y%m%d_%H%M%S).json

# Backup completo do projeto
tar -czf backup-$(date +%Y%m%d).tar.gz beach-tennis-system/

# Restaurar backup
tar -xzf backup-20251116.tar.gz
```

---

## 📱 Desenvolvimento Mobile

```bash
# Obter IP local (Linux/Mac)
ifconfig | grep "inet " | grep -v 127.0.0.1

# Obter IP local (Windows)
ipconfig | findstr IPv4

# Acessar de dispositivo móvel
# Use: http://SEU_IP:3000
# Exemplo: http://192.168.1.100:3000
```

---

## 🎨 Customização

```bash
# Editar cores (public/index.html)
# Procure por:
--primary: #667eea
--secondary: #764ba2

# Editar porta padrão (server.js)
# Procure por:
const PORT = process.env.PORT || 3000;

# Adicionar novo capitão (server.js)
# Procure por:
const CAPITAES = {
  'novocapitao': 'senha123'
}
```

---

## 📚 Documentação

```bash
# Ver versão do Node.js
node --version

# Ver versão do npm
npm --version

# Ver informações do projeto
npm info

# Gerar documentação (se instalar JSDoc)
npm install -g jsdoc
jsdoc server.js -d docs
```

---

## ⚡ Atalhos Úteis

```bash
# Alias úteis (adicione ao ~/.bashrc ou ~/.zshrc)
alias bt-start="cd ~/beach-tennis-system && npm start"
alias bt-dev="cd ~/beach-tennis-system && npm run dev"
alias bt-logs="cd ~/beach-tennis-system && tail -f logs/app.log"
alias bt-deploy="cd ~/beach-tennis-system && vercel --prod"

# Depois de adicionar, recarregue:
source ~/.bashrc
# ou
source ~/.zshrc
```

---

## 🆘 Problemas Comuns

```bash
# Erro: "EADDRINUSE: address already in use"
# Solução: Matar processo na porta
lsof -ti :3000 | xargs kill -9

# Erro: "Cannot find module"
# Solução: Reinstalar dependências
rm -rf node_modules package-lock.json && npm install

# Erro: "Permission denied"
# Solução: Corrigir permissões
sudo chown -R $USER:$USER .

# Erro: "npm: command not found"
# Solução: Instalar Node.js
# https://nodejs.org/

# Google Sheets não funciona
# Solução: Verificar configuração
cat .env
curl http://localhost:3000/api/health
```

---

## 💡 Dicas de Produtividade

```bash
# Rodar em background (Linux/Mac)
nohup npm start > output.log 2>&1 &

# Ver processo rodando
ps aux | grep node

# Matar processo
kill [PID]

# Usar PM2 para gerenciar processo
npm install -g pm2
pm2 start server.js --name beach-tennis
pm2 status
pm2 logs beach-tennis
pm2 restart beach-tennis
pm2 stop beach-tennis

# Reiniciar automaticamente em mudanças
npm install -g nodemon
nodemon server.js
```

---

## 📊 Scripts Customizados (package.json)

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo 'Adicionar testes aqui'",
    "backup": "tar -czf backup-$(date +%Y%m%d).tar.gz .",
    "deploy:vercel": "vercel --prod",
    "deploy:heroku": "git push heroku main",
    "logs": "tail -f logs/app.log"
  }
}
```

---

## 🎯 Workflow Recomendado

```bash
# 1. Desenvolvimento Local
npm install
npm run dev
# Testar em http://localhost:3000

# 2. Commit
git add .
git commit -m "Descrição das mudanças"

# 3. Push
git push origin main

# 4. Deploy
vercel --prod
# ou
git push heroku main

# 5. Verificar
curl https://seu-app.vercel.app/api/health

# 6. Monitorar
vercel logs --follow
```

---

## 📞 Links Úteis

```bash
# Documentação
cat README.md
cat GOOGLE_SHEETS_SETUP.md

# Abrir documentação no navegador
open README.md  # Mac
xdg-open README.md  # Linux
start README.md  # Windows

# Google Cloud Console
open https://console.cloud.google.com

# Vercel Dashboard
open https://vercel.com/dashboard

# Render Dashboard  
open https://dashboard.render.com
```

---

**Dica:** Salve este arquivo como referência rápida!

Use Ctrl+F para buscar comandos específicos.
