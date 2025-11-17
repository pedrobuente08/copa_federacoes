# 🚀 GUIA RÁPIDO - COMECE AQUI!

## ⚡ Início Rápido (5 minutos)

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar (escolha uma opção)

#### Opção A: Testar SEM Google Sheets (mais rápido)
```bash
npm start
```
O sistema vai rodar com dados de exemplo!

#### Opção B: Configurar Google Sheets
1. Copie o arquivo de exemplo:
   ```bash
   cp .env.example .env
   ```

2. Siga o guia: `GOOGLE_SHEETS_SETUP.md`

### 3. Acessar
Abra o navegador em: `http://localhost:3000`

**Login:**
- Usuário: `pedrobuente`
- Senha: `pedro1234`

---

## 📚 Próximos Passos

1. ✅ Sistema rodando localmente
2. 📊 Configure o Google Sheets (veja `GOOGLE_SHEETS_SETUP.md`)
3. 🌐 Faça deploy (veja `README.md` seção Deploy)

---

## 🆘 Problemas?

### "npm: command not found"
Instale o Node.js: https://nodejs.org/

### "Port 3000 already in use"
Mude a porta no arquivo `.env`:
```env
PORT=8080
```

### Outros problemas
Consulte o `README.md` completo

---

## 📋 Arquivos Importantes

- `README.md` - Documentação completa
- `GOOGLE_SHEETS_SETUP.md` - Guia do Google Sheets
- `server.js` - Backend da aplicação
- `public/index.html` - Frontend da aplicação
- `.env.example` - Exemplo de configuração

---

## 🎯 Testando o Sistema

1. **Login** com qualquer capitão
2. **Cadastre um jogo:**
   - Aba "Próximos Jogos"
   - Clique em "➕ Cadastrar Novo Jogo"
   - Preencha os dados
   
3. **Registre resultado:**
   - Clique em "✏️ Registrar Resultado"
   - Selecione os atletas
   - Preencha placares
   
4. **Veja resultados:**
   - Aba "Resultados"

---

Pronto! Você está com tudo funcionando! 🎉
