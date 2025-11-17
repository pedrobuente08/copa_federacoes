# 📊 Guia Completo: Configuração do Google Sheets

## Passo 1: Criar a Planilha

1. Acesse [Google Sheets](https://sheets.google.com)
2. Crie uma nova planilha
3. Nomeie a primeira aba como **"Atletas"**
4. Configure as colunas conforme abaixo:

### Estrutura da Planilha "Atletas"

**Linha 1 (Cabeçalhos):**
| A | B | C |
|---|---|---|
| Nome | Gênero | Categorias |

**Linhas 2+ (Dados dos Atletas):**
| Nome | Gênero | Categorias |
|------|--------|------------|
| João Silva | masculino | A, PRO |
| Maria Santos | feminino | A, PRO, B |
| Pedro Costa | masculino | sub 18, B |
| Ana Paula | feminino | sub 16, C |

**IMPORTANTE:**
- Gênero deve ser exatamente: `masculino` ou `feminino`
- Categorias separadas por vírgula
- Categorias válidas: sub 12, sub 14, sub 16, sub 18, 40+, 50+, 60+, PRO, A, B, C, D

---

## Passo 2: Pegar o ID da Planilha

1. Abra sua planilha no Google Sheets
2. Olhe a URL no navegador:
   ```
   https://docs.google.com/spreadsheets/d/1ABC...XYZ/edit
                                           ^^^^^^^^^^
                                           Este é o ID
   ```
3. Copie tudo entre `/d/` e `/edit`
4. Guarde este ID para usar no arquivo `.env`

---

## Passo 3A: Configuração com API Key (Método Simples)

### Vantagens:
- ✅ Configuração rápida e simples
- ✅ Ideal para desenvolvimento e testes

### Desvantagens:
- ⚠️ Planilha precisa ser pública
- ⚠️ Apenas leitura

### Passos:

1. **Acessar Google Cloud Console**
   - Vá para: https://console.cloud.google.com/

2. **Criar/Selecionar Projeto**
   - Clique em "Select a project" no topo
   - Clique em "NEW PROJECT"
   - Nome: "Beach Tennis Sistema"
   - Clique em "CREATE"

3. **Ativar Google Sheets API**
   - No menu lateral, vá em "APIs & Services" > "Library"
   - Busque por "Google Sheets API"
   - Clique nela e depois em "ENABLE"

4. **Criar API Key**
   - Vá em "APIs & Services" > "Credentials"
   - Clique em "+ CREATE CREDENTIALS"
   - Selecione "API key"
   - Copie a chave gerada
   - (Opcional) Clique em "RESTRICT KEY" e limite apenas ao Google Sheets API

5. **Tornar Planilha Pública**
   - Volte para sua planilha
   - Clique em "Share" (Compartilhar)
   - Em "General access", selecione "Anyone with the link"
   - Permission: "Viewer"
   - Clique em "Done"

6. **Configurar .env**
   ```env
   GOOGLE_SHEET_ID=seu_id_da_planilha_aqui
   GOOGLE_API_KEY=AIzaSy...sua_api_key_aqui
   ```

---

## Passo 3B: Configuração com Service Account (Método Recomendado)

### Vantagens:
- ✅ Planilha pode ser privada
- ✅ Mais seguro
- ✅ Ideal para produção

### Desvantagens:
- ⚠️ Configuração um pouco mais complexa

### Passos:

1. **Acessar Google Cloud Console**
   - Vá para: https://console.cloud.google.com/

2. **Criar/Selecionar Projeto**
   - Mesmo processo do método anterior

3. **Ativar Google Sheets API**
   - Mesmo processo do método anterior

4. **Criar Service Account**
   - Vá em "APIs & Services" > "Credentials"
   - Clique em "+ CREATE CREDENTIALS"
   - Selecione "Service account"
   - Service account name: "beach-tennis-bot"
   - Clique em "CREATE AND CONTINUE"
   - Role: selecione "Editor" (ou deixe sem role)
   - Clique em "CONTINUE" e depois "DONE"

5. **Criar Chave JSON**
   - Clique na service account criada
   - Vá na aba "KEYS"
   - Clique em "ADD KEY" > "Create new key"
   - Selecione "JSON"
   - Clique em "CREATE"
   - Um arquivo JSON será baixado - **GUARDE BEM ESTE ARQUIVO!**

6. **Pegar Informações do JSON**
   Abra o arquivo JSON baixado e encontre:
   ```json
   {
     "client_email": "beach-tennis-bot@projeto.iam.gserviceaccount.com",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   }
   ```

7. **Compartilhar Planilha com Service Account**
   - Volte para sua planilha
   - Clique em "Share" (Compartilhar)
   - Cole o `client_email` do JSON
   - Permission: "Editor"
   - **DESMARQUE** "Notify people"
   - Clique em "Share"

8. **Configurar .env**
   ```env
   GOOGLE_SHEET_ID=seu_id_da_planilha_aqui
   GOOGLE_SERVICE_ACCOUNT_EMAIL=beach-tennis-bot@projeto.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

   **ATENÇÃO:** Mantenha as aspas duplas na GOOGLE_PRIVATE_KEY!

---

## Passo 4: Testar a Configuração

1. Certifique-se que o arquivo `.env` está configurado
2. Inicie o servidor: `npm start`
3. Acesse: http://localhost:3000
4. Faça login com um dos usuários
5. Vá na aba "Atletas"
6. Clique em "🔄 Atualizar Lista"
7. Verifique se os atletas da planilha aparecem

---

## 🆘 Problemas Comuns

### "Erro ao buscar atletas do Google Sheets"

**Possíveis causas:**
1. **GOOGLE_SHEET_ID incorreto**
   - Verifique se copiou o ID correto da URL
   
2. **API Key inválida**
   - Confirme que copiou a chave completa
   - Verifique se a Google Sheets API está ativada
   
3. **Planilha não está pública (método API Key)**
   - Verifique se a planilha está com acesso "Anyone with the link"
   
4. **Service Account não tem acesso (método Service Account)**
   - Confirme que compartilhou a planilha com o client_email
   - Verifique se deu permissão de "Editor"

5. **Nome da aba está errado**
   - A aba DEVE se chamar exatamente "Atletas" (com A maiúsculo)

6. **GOOGLE_PRIVATE_KEY com formatação errada**
   - Certifique-se de manter as aspas duplas
   - Não remova os `\n` do meio da chave

### "Sistema mostra atletas mock em vez dos reais"

- Isso significa que a configuração do Google Sheets não foi detectada
- Verifique se o arquivo `.env` existe e está no diretório raiz
- Verifique se as variáveis estão preenchidas corretamente
- Reinicie o servidor após alterar o `.env`

---

## ✅ Checklist Final

Antes de colocar em produção:

- [ ] Planilha criada com aba "Atletas"
- [ ] Estrutura de colunas correta (Nome, Gênero, Categorias)
- [ ] ID da planilha copiado
- [ ] Google Cloud Console configurado
- [ ] Google Sheets API ativada
- [ ] Credenciais criadas (API Key OU Service Account)
- [ ] Planilha compartilhada corretamente
- [ ] Arquivo `.env` configurado
- [ ] Teste local funcionando
- [ ] Atletas aparecendo no sistema

---

## 📱 Exemplo de Planilha Completa

Aqui está um exemplo de como sua planilha deve ficar:

| Nome | Gênero | Categorias |
|------|--------|------------|
| Pedro Silva | masculino | PRO, A |
| Ana Costa | feminino | PRO, A |
| João Santos | masculino | 40+, A, B |
| Maria Oliveira | feminino | sub 18, B |
| Carlos Ferreira | masculino | 50+, C |
| Julia Almeida | feminino | sub 16, C, D |
| Roberto Lima | masculino | 60+, B |
| Fernanda Rocha | feminino | PRO, A, B |

**Link para template:**
[Criar cópia desta planilha](https://docs.google.com/spreadsheets/d/TEMPLATE_ID/copy)

---

## 🎓 Tutoriais em Vídeo

- [Como criar API Key no Google Cloud](https://www.youtube.com/results?search_query=google+sheets+api+key)
- [Como criar Service Account](https://www.youtube.com/results?search_query=google+service+account)

---

## 💡 Dicas

1. **Desenvolvimento:** Use API Key (mais rápido)
2. **Produção:** Use Service Account (mais seguro)
3. **Backup:** Faça cópias regulares da planilha
4. **Organização:** Mantenha os atletas em ordem alfabética
5. **Atualização:** Os capitães podem clicar em "Atualizar Lista" para recarregar dados do Sheets

---

## 🔐 Segurança

- ⚠️ **NUNCA** commite o arquivo `.env` no Git
- ⚠️ **NUNCA** exponha sua API Key ou Private Key publicamente
- ⚠️ Mantenha o arquivo JSON da Service Account em local seguro
- ✅ Use variáveis de ambiente na plataforma de deploy
- ✅ Rotacione as chaves periodicamente
