# 🏗️ ARQUITETURA DO SISTEMA

## 📐 Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│                       NAVEGADOR                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Frontend (React)                        │   │
│  │  • Login de Capitães                                │   │
│  │  • Cadastro de Jogos                                │   │
│  │  • Registro de Resultados                           │   │
│  │  • Visualização de Atletas                          │   │
│  └───────────────────┬─────────────────────────────────┘   │
│                      │ HTTP/HTTPS                           │
└──────────────────────┼──────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│                  Backend (Node.js + Express)                 │
│  ┌────────────────────────────────────────────────────┐     │
│  │              API REST Endpoints                     │     │
│  │  • POST /api/login                                 │     │
│  │  • GET  /api/atletas                               │     │
│  │  • GET  /api/jogos                                 │     │
│  │  • POST /api/jogos                                 │     │
│  │  • PUT  /api/jogos/:id                             │     │
│  │  • DELETE /api/jogos/:id                           │     │
│  └────────────┬───────────────────┬────────────────────┘     │
│               │                   │                          │
│               ▼                   ▼                          │
│  ┌─────────────────────┐  ┌──────────────────────┐         │
│  │   Memória RAM       │  │  Google Sheets API   │         │
│  │   (Jogos)           │  │  (Atletas)           │         │
│  └─────────────────────┘  └──────────────────────┘         │
└──────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
                    ┌───────────────────────────┐
                    │   Google Sheets          │
                    │   Planilha "Atletas"     │
                    │                          │
                    │  Nome | Gênero | Cat.   │
                    │  João | masc.  | A,PRO  │
                    │  Maria| fem.   | B,C    │
                    └───────────────────────────┘
```

---

## 🔄 Fluxo de Dados

### 1. Login
```
[Capitão] → [Digite usuário/senha] → [Frontend valida] 
    → [POST /api/login] → [Backend verifica] 
    → [✅ Sucesso / ❌ Erro] → [Frontend atualiza]
```

### 2. Carregar Atletas
```
[Sistema inicia] → [GET /api/atletas] → [Backend]
    ↓
[Tem Google Sheets configurado?]
    ├─ SIM → [Google Sheets API] → [Busca planilha]
    │         → [Parse dados] → [Cache 5min] → [Retorna atletas]
    │
    └─ NÃO → [Retorna dados mock] → [Frontend exibe]
```

### 3. Cadastrar Jogo
```
[Capitão] → [Preenche formulário] → [Clica Salvar]
    → [POST /api/jogos + dados] → [Backend]
    → [Adiciona ID e timestamp] → [Salva em memória]
    → [Retorna jogo criado] → [Frontend atualiza lista]
```

### 4. Registrar Resultado
```
[Capitão] → [Clica "Registrar Resultado"] → [Modal abre]
    → [GET /api/atletas (se necessário)]
    → [Filtra atletas por categoria + gênero]
    → [Capitão seleciona atletas e preenche]
    → [PUT /api/jogos/:id] → [Backend atualiza]
    → [Retorna jogo atualizado] → [Frontend move para "Resultados"]
```

---

## 🗂️ Estrutura de Dados

### Jogo (objeto)
```javascript
{
  id: 1700000000000,           // timestamp
  categoria: "sub 18",         // categoria do jogo
  data: "18/11/25",           // data do jogo
  confronto: "Bahia x SP",    // adversários
  horario: "11:00",           // hora do jogo
  criadoEm: "2025-11-16...",  // ISO timestamp
  resultado: {                 // opcional, só após registrar
    feminino: {
      atletas: ["Maria", "Ana"],
      placar: "2x0",
      resultado: "vitoria"
    },
    masculino: {
      atletas: ["João", "Pedro"],
      placar: "2x1",
      resultado: "vitoria"
    },
    mista: {                   // opcional
      atletas: ["Maria", "João"],
      placar: "1x0",
      resultado: "vitoria"
    }
  }
}
```

### Atleta (objeto)
```javascript
{
  id: 1,                       // número sequencial
  nome: "João Silva",         // nome completo
  genero: "masculino",        // masculino | feminino
  categorias: ["A", "PRO"]    // array de categorias
}
```

---

## 🔐 Autenticação

```
┌──────────────────────────────────────────┐
│  Capitães Autorizados (Hardcoded)       │
├──────────────────────────────────────────┤
│  pedrobuente     → pedro1234            │
│  juanfalcao      → juan1234             │
│  netovegas       → neto1234             │
│  rodolforagner   → rodolfo1234          │
│  priscillalessa  → priscilla1234        │
└──────────────────────────────────────────┘
        │
        ▼
[Login bem-sucedido] → [Frontend guarda estado]
        │
        ▼
[Todas as rotas autenticadas ficam disponíveis]
```

**Nota:** Atualmente não usa tokens/sessions. 
Em produção, considere adicionar JWT ou sessions.

---

## 💾 Persistência

### Jogos (Memória RAM)
```
✅ Vantagens:
   - Rápido
   - Sem configuração
   - Zero latência

⚠️ Limitações:
   - Dados perdidos ao reiniciar servidor
   - Não compartilha entre instâncias
   
🔄 Evolução Futura:
   - MongoDB
   - PostgreSQL
   - Firebase
```

### Atletas (Google Sheets)
```
✅ Vantagens:
   - Fácil de editar
   - Familiar para usuários
   - Sem banco de dados
   - Cache de 5 minutos

⚠️ Limitações:
   - Depende de API externa
   - Quota de requests
   
💡 Alternativas:
   - Arquivo JSON local
   - Banco de dados
   - API própria
```

---

## 🌐 Deploy

### Desenvolvimento (Local)
```
┌─────────────────┐
│  localhost:3000 │
│                 │
│  • Node.js      │
│  • Express      │
│  • RAM Storage  │
└─────────────────┘
```

### Produção (Vercel/Render/Railway)
```
┌──────────────────────────┐
│  https://seu-app.vercel  │
│                          │
│  • Serverless/Container  │
│  • Auto-scaling          │
│  • HTTPS automático      │
│  • CDN global            │
└──────────────────────────┘
        │
        ├─→ [Google Sheets API]
        └─→ [Variáveis de ambiente seguras]
```

---

## 📊 Endpoints da API

### Autenticação
```
POST /api/login
Body: { username, password }
Response: { success: true, user: "pedrobuente" }
```

### Atletas
```
GET /api/atletas
Response: [{ id, nome, genero, categorias }]

POST /api/atletas/refresh
Response: { success: true, message: "Cache limpo" }
```

### Jogos
```
GET /api/jogos
Response: [{ id, categoria, data, confronto, ... }]

POST /api/jogos
Body: { categoria, data, confronto, horario }
Response: { id, categoria, data, ... }

PUT /api/jogos/:id
Body: { resultado: { ... } }
Response: { id, resultado, ... }

DELETE /api/jogos/:id
Response: { success: true }
```

### Saúde
```
GET /api/health
Response: { 
  status: "ok",
  googleSheets: "connected",
  timestamp: "2025-11-16..."
}
```

---

## 🔧 Componentes Frontend

### Hierarquia de Componentes
```
App
├── LoginForm
│   └── (form elements)
│
└── [Autenticado]
    ├── UserInfo
    ├── Tabs
    │
    ├── ProximosJogos
    │   ├── FilterSection
    │   ├── GameCard (múltiplos)
    │   └── Modal (se ativo)
    │
    ├── Resultados
    │   ├── FilterSection
    │   ├── GameCard (múltiplos)
    │   │   └── ResultSection
    │   └── Modal (se ativo)
    │
    └── Atletas
        ├── FilterSection
        └── AtletaCard (múltiplos)
```

### Estados Principais
```javascript
// App.js
const [isLoggedIn, setIsLoggedIn]     // boolean
const [currentUser, setCurrentUser]   // string
const [activeTab, setActiveTab]       // 'proximos'|'resultados'|'atletas'
const [jogos, setJogos]               // array de objetos
const [atletas, setAtletas]           // array de objetos
const [showModal, setShowModal]       // boolean
const [modalType, setModalType]       // 'novoJogo'|'resultado'
const [selectedGame, setSelectedGame] // objeto|null
const [loading, setLoading]           // boolean
const [message, setMessage]           // objeto|null
```

---

## 🎯 Filtros

### Por Categoria
```
[Todos os jogos/atletas]
    ↓
[Usuário seleciona categoria]
    ↓
[Frontend filtra array]
    ↓
[Exibe apenas items da categoria]
```

### Por Gênero (Atletas)
```
[Todos os atletas]
    ↓
[Usuário seleciona gênero]
    ↓
[Frontend filtra array]
    ↓
[Exibe apenas atletas do gênero]
```

### Automático (Registro de Resultado)
```
[Modal abre para jogo]
    ↓
[Pega categoria do jogo: "sub 18"]
    ↓
[Filtra atletas]
    ├─→ Feminino: atletas.filter(genero='feminino' && cat='sub 18')
    └─→ Masculino: atletas.filter(genero='masculino' && cat='sub 18')
    ↓
[Mostra apenas atletas elegíveis]
```

---

## 🚀 Performance

### Otimizações Implementadas
- ✅ Cache de atletas (5 minutos)
- ✅ Filtros client-side (sem requests)
- ✅ React production build
- ✅ CSS inline (sem requests extras)
- ✅ CDN para libs (React, Axios)

### Melhorias Futuras
- [ ] Service Worker (PWA)
- [ ] Lazy loading de componentes
- [ ] Debounce em filtros
- [ ] Paginação de resultados
- [ ] Compressão gzip

---

## 🔒 Segurança

### Implementado
- ✅ Validação de login
- ✅ .env para credenciais
- ✅ .gitignore configurado
- ✅ CORS habilitado
- ✅ Sanitização básica de inputs

### Recomendações Produção
- [ ] JWT tokens
- [ ] Rate limiting
- [ ] HTTPS obrigatório
- [ ] Helmet.js
- [ ] Validação robusta de inputs
- [ ] SQL injection prevention
- [ ] XSS protection

---

## 📈 Escalabilidade

### Atual (v1.0)
```
✅ Suporta: ~100 jogos, ~100 atletas
✅ Múltiplos capitães simultâneos
⚠️ Dados em memória (não persistente)
```

### Evolução Recomendada
```
v2.0: 
  • Banco de dados (MongoDB/PostgreSQL)
  • Redis para cache
  • WebSockets para tempo real

v3.0:
  • Microserviços
  • Kubernetes
  • Event sourcing
```

---

## 🎨 Design System

### Cores Principais
```css
--primary: #667eea (roxo)
--secondary: #764ba2 (roxo escuro)
--success: #11998e (verde)
--danger: #eb3349 (vermelho)
--info: #2a5298 (azul)
```

### Breakpoints
```css
Mobile: 0-768px
Tablet: 768px-1024px
Desktop: 1024px+
```

---

## 🧪 Testes (Futuro)

### Unit Tests
```
• Validação de login
• Filtros de categoria
• Parse de atletas
```

### Integration Tests
```
• Fluxo completo de cadastro
• API endpoints
• Google Sheets integration
```

### E2E Tests
```
• Login → Cadastrar → Resultado
• Cypress/Playwright
```

---

Essa arquitetura foi desenhada para:
✅ Desenvolvimento rápido
✅ Fácil manutenção
✅ Deploy simples
✅ Escalabilidade futura
