require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Configuração do Google Sheets
let sheets;
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

// ======= INICIALIZAR GOOGLE SHEETS =======
async function initGoogleSheets() {
    try {
        if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
            console.log('⚠️ Variáveis da Service Account não configuradas. GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY ou GOOGLE_SHEET_ID ausentes.');
            return null;
        }

        console.log('🔐 Inicializando Google Sheets com Service Account...');

        const privateKey = process.env.GOOGLE_PRIVATE_KEY.includes('\\n')
            ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
            : process.env.GOOGLE_PRIVATE_KEY;

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: privateKey,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        sheets = google.sheets({ version: 'v4', auth });

        await sheets.spreadsheets.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
        });

        console.log('✅ Google Sheets API inicializada com sucesso com Service Account!');
        return sheets;
    } catch (error) {
        console.error('❌ Erro ao inicializar Google Sheets:', error.response?.data || error.message);
        sheets = null;
        return null;
    }
}

// ======= CONFIG CAPITÃES =======
const CAPITAES = {
    'pedrobuente': 'pedro1234',
    'juanfalcao': 'juan1234',
    'netovegas': 'neto1234',
    'rodolforagner': 'rodolfo1234',
    'priscillalessa': 'priscilla1234'
};

// ======= MEMÓRIA LOCAL =======
let jogos = [];
let atletasCache = [];
let lastAtletasUpdate = null;

// ======= HELPERS PARA JOGOS + SHEETS =======

function calcularResultadoFinal(resultado) {
    if (!resultado) return '';

    let vitorias = 0;
    if (resultado.feminino?.resultado === 'vitoria') vitorias++;
    if (resultado.masculino?.resultado === 'vitoria') vitorias++;
    if (resultado.mista?.resultado === 'vitoria') vitorias++;

    return vitorias >= 2 ? 'vitoria' : 'derrota';
}

function montarTextoConfronto(jogo) {
    const base = jogo.confronto || `Bahia x ${jogo.estadoAdversario || ''}`;
    const partes = [base];

    if (jogo.categoria) {
        partes.push(`Categoria: ${jogo.categoria}`);
    }

    if (jogo.resultado) {
        const { feminino, masculino, mista } = jogo.resultado;

        if (feminino && feminino.atletas && feminino.atletas.length) {
            partes.push(
                `Fem: ${feminino.atletas.join('/')} ${feminino.placar || ''} ` +
                (feminino.resultado === 'vitoria' ? '(V)' : feminino.resultado === 'derrota' ? '(D)' : '')
            );
        }

        if (masculino && masculino.atletas && masculino.atletas.length) {
            partes.push(
                `Masc: ${masculino.atletas.join('/')} ${masculino.placar || ''} ` +
                (masculino.resultado === 'vitoria' ? '(V)' : masculino.resultado === 'derrota' ? '(D)' : '')
            );
        }

        if (mista && mista.atletas && mista.atletas.length) {
            partes.push(
                `Mista: ${mista.atletas.join('/')} ${mista.placar || ''} ` +
                (mista.resultado === 'vitoria' ? '(V)' : mista.resultado === 'derrota' ? '(D)' : '')
            );
        }
    }

    if (jogo.descricao) {
        partes.push(`Fase: ${jogo.descricao}`);
    }

    return partes.join(' | ');
}

async function salvarOuAtualizarJogoNaPlanilha(jogo) {
    try {
        if (!sheets || !SPREADSHEET_ID) {
            console.log('⚠️ Sheets não configurado, não foi possível salvar na aba Jogos.');
            return;
        }

        const confrontoBase = jogo.confronto || `Bahia x ${jogo.estadoAdversario || ''}`;
        const dataHorario = `${jogo.data} ${jogo.horario}`;
        const confrontoTexto = montarTextoConfronto(jogo);

        let resultadoFinal = jogo.resultadoFinal;
        if (!resultadoFinal && jogo.resultado) {
            resultadoFinal = calcularResultadoFinal(jogo.resultado);
        }

        const resultadoTexto =
            resultadoFinal === 'vitoria' ? 'Vitória' :
            resultadoFinal === 'derrota' ? 'Derrota' : '';

        const statusTexto = jogo.status || '';

        const novaLinha = [
            confrontoTexto,
            dataHorario,
            resultadoTexto,
            statusTexto
        ];

        const readRange = 'Jogos!A2:D';
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: readRange
        });

        const rows = response.data.values || [];
        let foundIndex = -1;

        rows.forEach((row, idx) => {
            const confrontoCell = row[0] || '';
            const dataCell = row[1] || '';
            if (confrontoCell.startsWith(confrontoBase) && dataCell === dataHorario) {
                foundIndex = idx;
            }
        });

        if (foundIndex === -1) {
            await sheets.spreadsheets.values.append({
                spreadsheetId: SPREADSHEET_ID,
                range: 'Jogos!A:D',
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values: [novaLinha]
                }
            });
            console.log('✅ Jogo registrado na aba Jogos (append).');
        } else {
            const linhaSheet = foundIndex + 2;
            const updateRange = `Jogos!A${linhaSheet}:D${linhaSheet}`;

            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: updateRange,
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values: [novaLinha]
                }
            });
            console.log(`✅ Jogo atualizado na aba Jogos (linha ${linhaSheet}).`);
        }
    } catch (error) {
        console.error('❌ Erro ao salvar/atualizar jogo na aba Jogos:', error.response?.data || error.message);
    }
}

// Carregar jogos da aba "Jogos" para a memória
async function carregarJogosDaPlanilhaParaMemoria() {
    try {
        if (!sheets || !SPREADSHEET_ID) {
            console.log('⚠️ Sheets não configurado, não foi possível carregar jogos da planilha.');
            return;
        }

        console.log('📥 Carregando jogos da aba "Jogos"...');

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Jogos!A2:D', // Confronto | Data_Horario | Resultado | Status
        });

        const rows = response.data.values || [];

        // helper para extrair sub-bloco (Fem/Masc/Mista)
        const parseSubBloco = (label, texto) => {
            const regexBloco = new RegExp(`${label}:([^|]+)`, 'i');
            const match = texto.match(regexBloco);
            if (!match) return null;

            const trecho = match[1].trim();
            // Ex: "Rafaela/Isabelli 4x0, 4x0 (V)"
            const regexDetalhe = /(.+?)\s+(\d+x\d+(?:,\s*\d+x\d+)*)\s*\((V|D)\)/i;
            const m2 = trecho.match(regexDetalhe);
            if (!m2) return null;

            const nomesStr = m2[1].trim();              // "Rafaela/Isabelli"
            const placar = m2[2].trim();                // "4x0, 4x0"
            const resultadoChar = m2[3].toUpperCase();  // "V" ou "D"

            const atletas = nomesStr.split('/').map(s => s.trim());
            const resultado = resultadoChar === 'V' ? 'vitoria' : 'derrota';

            return {
                atletas,
                placar,
                resultado,
                // não temos como reconstruir sets, então deixamos sem "sets"
            };
        };

        jogos = rows.map((row, index) => {
            const confrontoTexto = row[0] || '';   // coluna A
            const dataHorario = row[1] || '';      // coluna B
            const resultadoTexto = row[2] || '';   // coluna C (Vitória/Derrota)
            const status = row[3] || '';           // coluna D

            // "Bahia x Acre | Categoria: sub 14 | Fem: ... | Masc: ... | ..."
            const partes = confrontoTexto.split('|');
            const confrontoBase = partes[0]?.trim() || confrontoTexto.trim();

            let data = '';
            let horario = '';

            if (dataHorario) {
                const [d, h] = dataHorario.split(' ');
                data = d || '';
                horario = h || '';
            }

            let categoria = '';
            const catMatch = confrontoTexto.match(/Categoria:\s*([^|]+)/i);
            if (catMatch) categoria = catMatch[1].trim();

            // monta resultadoFinal baseado na coluna C
            const resultadoFinal =
                resultadoTexto.toLowerCase() === 'vitória' ? 'vitoria' :
                resultadoTexto.toLowerCase() === 'derrota' ? 'derrota' 
                : '';

            // tenta reconstruir o objeto "resultado" a partir do texto
            const feminino = parseSubBloco('Fem', confrontoTexto);
            const masculino = parseSubBloco('Masc', confrontoTexto);
            const mista = parseSubBloco('Mista', confrontoTexto);

            let resultado = undefined;
            if (feminino || masculino || mista) {
                resultado = {};
                if (feminino) resultado.feminino = feminino;
                if (masculino) resultado.masculino = masculino;
                if (mista) resultado.mista = mista;
            }

            return {
                id: Date.now() + index,
                confronto: confrontoBase,  // fica "Bahia x Acre", bonitinho
                data,
                horario,
                categoria,
                resultadoFinal,
                status,
                resultado, // agora os jogos da planilha entram na aba Resultados
            };
        });

        console.log(`✅ Carregados ${jogos.length} jogos da aba "Jogos" para memória.`);
    } catch (error) {
        console.error('❌ Erro ao carregar jogos da planilha:', error.response?.data || error.message);
    }
}

// ======= ENDPOINTS =======

// Login (capitães)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    if (CAPITAES[username] === password) {
        res.json({ success: true, user: username });
    } else {
        res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }
});

// Buscar atletas do Google Sheets
app.get('/api/atletas', async (req, res) => {
    try {
        if (atletasCache.length > 0 && lastAtletasUpdate && 
            (Date.now() - lastAtletasUpdate) < 5 * 60 * 1000) {
            return res.json(atletasCache);
        }

        if (!sheets || !SPREADSHEET_ID) {
            const mockAtletas = [
                { id: 1, nome: 'João Silva', genero: 'masculino', categorias: ['A', 'PRO'] },
                { id: 2, nome: 'Maria Santos', genero: 'feminino', categorias: ['A', 'PRO'] },
                { id: 3, nome: 'Pedro Costa', genero: 'masculino', categorias: ['B', 'C'] },
                { id: 4, nome: 'Ana Paula', genero: 'feminino', categorias: ['B', 'C'] },
            ];
            return res.json(mockAtletas);
        }

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Atletas!A2:C',
        });

        const rows = response.data.values || [];
        const atletas = rows.map((row, index) => ({
            id: index + 1,
            nome: row[0] || '',
            genero: (row[1] || '').toLowerCase(),
            categorias: row[2] ? row[2].split(',').map(c => c.trim()) : []
        })).filter(a => a.nome);

        atletasCache = atletas;
        lastAtletasUpdate = Date.now();

        res.json(atletas);
    } catch (error) {
        console.error('Erro ao buscar atletas:', error.response?.data || error.message);
        res.status(500).json({ error: 'Erro ao buscar atletas do Google Sheets' });
    }
});

// Forçar atualização do cache de atletas
app.post('/api/atletas/refresh', async (req, res) => {
    lastAtletasUpdate = null;
    atletasCache = [];
    res.json({ success: true, message: 'Cache de atletas limpo' });
});

// ==== CRUD de Jogos ====
app.get('/api/jogos', (req, res) => {
    res.json(jogos);
});

app.post('/api/jogos', async (req, res) => {
    try {
        const novoJogo = {
            id: Date.now(),
            ...req.body,
            criadoEm: new Date().toISOString()
        };

        jogos.push(novoJogo);
        await salvarOuAtualizarJogoNaPlanilha(novoJogo);

        res.json(novoJogo);
    } catch (error) {
        console.error('Erro ao criar jogo:', error.response?.data || error.message);
        res.status(500).json({ error: 'Erro ao criar jogo' });
    }
});

app.put('/api/jogos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const index = jogos.findIndex(j => j.id === id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Jogo não encontrado' });
        }

        jogos[index] = { ...jogos[index], ...req.body };

        if (!jogos[index].resultadoFinal && req.body.resultadoFinal) {
            jogos[index].resultadoFinal = req.body.resultadoFinal;
        }

        await salvarOuAtualizarJogoNaPlanilha(jogos[index]);
        res.json(jogos[index]);
    } catch (error) {
        console.error('Erro ao atualizar jogo:', error.response?.data || error.message);
        res.status(500).json({ error: 'Erro ao atualizar jogo' });
    }
});

app.delete('/api/jogos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = jogos.findIndex(j => j.id === id);
    
    if (index !== -1) {
        jogos.splice(index, 1);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Jogo não encontrado' });
    }
});

// Health e teste
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        googleSheets: sheets ? 'connected' : 'not configured',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/test-sheets', async (req, res) => {
    try {
        if (!sheets || !SPREADSHEET_ID) {
            return res.status(500).json({ ok: false, message: 'Sheets não inicializado.' });
        }

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Jogos!A1:D1',
        });

        res.json({
            ok: true,
            message: 'Conseguiu ler a aba Jogos!',
            values: response.data.values,
        });
    } catch (error) {
        console.error('Erro no /api/test-sheets:', error.response?.data || error.message);
        res.status(500).json({
            ok: false,
            error: error.response?.data || error.message,
        });
    }
});

// Frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicializar servidor
initGoogleSheets().then(async () => {
    if (sheets) {
        await carregarJogosDaPlanilhaParaMemoria();
    }

    app.listen(PORT, () => {
        console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   🏖️  Beach Tennis - Copa das Federações                ║
║                                                          ║
║   🚀 Servidor rodando em: http://localhost:${PORT}      ║
║                                                          ║
║   📊 Google Sheets: ${sheets ? '✅ Conectado' : '⚠️  Não configurado'}              ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
        `);
    });
});
