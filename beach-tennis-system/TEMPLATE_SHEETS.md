# 📋 TEMPLATE GOOGLE SHEETS - ATLETAS

## Cole estes dados na sua planilha para começar rapidamente!

### ABA: Atletas

Copie e cole na sua planilha do Google Sheets (começando da célula A1):

```
Nome	Gênero	Categorias
Pedro Silva	masculino	PRO, A
Ana Costa	feminino	PRO, A
João Santos	masculino	40+, A, B
Maria Oliveira	feminino	sub 18, B
Carlos Ferreira	masculino	50+, C
Julia Almeida	feminino	sub 16, C, D
Roberto Lima	masculino	60+, B
Fernanda Rocha	feminino	PRO, A, B
Lucas Martins	masculino	sub 18, A
Camila Souza	feminino	sub 14, B, C
Rafael Gomes	masculino	A, B
Patricia Dias	feminino	40+, A
Marcelo Pereira	masculino	sub 16, C
Beatriz Lima	feminino	50+, B
Diego Alves	masculino	PRO, A, B
Juliana Cardoso	feminino	sub 12, D
```

---

## 📝 INSTRUÇÕES

### 1. Criar Planilha
1. Acesse https://sheets.google.com
2. Crie nova planilha
3. Renomeie aba para "Atletas"

### 2. Adicionar Cabeçalhos (Linha 1)
```
A1: Nome
B1: Gênero  
C1: Categorias
```

### 3. Adicionar Atletas (Linha 2 em diante)
Copie os dados acima ou adicione seus próprios atletas

### 4. Regras Importantes

**Gênero (Coluna B):**
- Use EXATAMENTE: `masculino` ou `feminino`
- Tudo em minúsculo
- Sem acentos

**Categorias (Coluna C):**
- Separe por vírgula: `A, PRO, B`
- Pode ter quantas quiser
- Categorias válidas:
  - `sub 12`, `sub 14`, `sub 16`, `sub 18`
  - `40+`, `50+`, `60+`
  - `PRO`, `A`, `B`, `C`, `D`

---

## 🎯 EXEMPLOS DE ATLETAS

### Atleta PRO
```
Nome: João da Silva
Gênero: masculino
Categorias: PRO, A
```

### Atleta Múltiplas Categorias
```
Nome: Maria Santos
Gênero: feminino
Categorias: PRO, A, B, 40+
```

### Atleta Sub-18
```
Nome: Pedro Junior
Gênero: masculino
Categorias: sub 18, B, C
```

### Atleta Master
```
Nome: Carlos Souza
Gênero: masculino
Categorias: 50+, A, B
```

---

## 🔧 VALIDAÇÃO

Antes de usar no sistema, verifique:

✅ Aba se chama "Atletas" (com A maiúsculo)
✅ Cabeçalhos na linha 1
✅ Gênero está em minúsculo
✅ Categorias separadas por vírgula
✅ Sem linhas vazias entre atletas
✅ Sem caracteres especiais nos nomes

---

## 📊 ESTRUTURA VISUAL

```
┌──────────────────┬───────────┬──────────────────┐
│ Nome             │ Gênero    │ Categorias       │
├──────────────────┼───────────┼──────────────────┤
│ Pedro Silva      │ masculino │ PRO, A           │
│ Ana Costa        │ feminino  │ PRO, A           │
│ João Santos      │ masculino │ 40+, A, B        │
│ Maria Oliveira   │ feminino  │ sub 18, B        │
└──────────────────┴───────────┴──────────────────┘
```

---

## 💡 DICAS

1. **Ordem Alfabética:** Facilita encontrar atletas
2. **Categorias Principais Primeiro:** Ex: `PRO, A, B`
3. **Atualize Regularmente:** Capitães podem clicar em "🔄 Atualizar"
4. **Backup:** Faça cópias da planilha
5. **Compartilhamento:** 
   - API Key: Planilha pública
   - Service Account: Compartilhe com email da service account

---

## 🎨 CATEGORIAS POR FAIXA

### Infantil/Juvenil
- sub 12
- sub 14
- sub 16
- sub 18

### Master
- 40+
- 50+
- 60+

### Adulto/Profissional
- PRO
- A
- B
- C
- D

---

## 🔄 EXEMPLO COMPLETO DE PLANILHA

Link para copiar planilha exemplo:
[Disponível após configurar no Google Sheets]

---

## ⚠️ ERROS COMUNS

### "Atletas não aparecem"
- Verifique nome da aba: deve ser "Atletas"
- Confirme que linha 1 tem cabeçalhos
- Verifique configuração do .env

### "Atleta aparece sem categoria"
- Verifique se há vírgula separando categorias
- Confirme que categorias estão corretas

### "Erro ao carregar atletas"
- Verifique permissões da planilha
- Confirme Google Sheets API está ativa
- Verifique credenciais no .env

---

## 📱 USANDO NO SISTEMA

Depois de configurar:

1. Faça login como capitão
2. Vá na aba "Atletas"
3. Clique "🔄 Atualizar Lista"
4. Atletas da planilha aparecerão
5. Use filtros por categoria/gênero

**Ao registrar resultado:**
- Sistema filtra automaticamente
- Só mostra atletas da categoria do jogo
- Separa por gênero (masculino/feminino)

---

## 🚀 PRONTO!

Cole esses dados na sua planilha e comece a usar o sistema!

Qualquer dúvida, consulte `GOOGLE_SHEETS_SETUP.md`
