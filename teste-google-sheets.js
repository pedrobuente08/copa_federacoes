// teste-google-sheets.js
// Execute: node teste-google-sheets.js

console.log('🔍 TESTANDO CONFIGURAÇÃO DO GOOGLE SHEETS\n');

// 1. Verificar se .env existe
const fs = require('fs');
const path = require('path');

console.log('1️⃣  Verificando arquivo .env...');
const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
    console.log('   ✅ Arquivo .env encontrado!\n');
    
    // Ler .env manualmente
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    let sheetId = null;
    let apiKey = null;
    
    lines.forEach(line => {
        if (line.startsWith('GOOGLE_SHEET_ID=')) {
            sheetId = line.split('=')[1].trim();
        }
        if (line.startsWith('GOOGLE_API_KEY=')) {
            apiKey = line.split('=')[1].trim();
        }
    });
    
    console.log('2️⃣  Verificando variáveis de ambiente...');
    
    if (sheetId) {
        console.log(`   ✅ GOOGLE_SHEET_ID: ${sheetId.substring(0, 10)}... (${sheetId.length} caracteres)`);
    } else {
        console.log('   ❌ GOOGLE_SHEET_ID não encontrado!');
    }
    
    if (apiKey) {
        console.log(`   ✅ GOOGLE_API_KEY: ${apiKey.substring(0, 10)}... (${apiKey.length} caracteres)`);
    } else {
        console.log('   ❌ GOOGLE_API_KEY não encontrado!');
    }
    
    console.log('\n3️⃣  Tentando carregar com dotenv...');
    require('dotenv').config();
    
    const envSheetId = process.env.GOOGLE_SHEET_ID;
    const envApiKey = process.env.GOOGLE_API_KEY;
    
    if (envSheetId) {
        console.log(`   ✅ process.env.GOOGLE_SHEET_ID: ${envSheetId.substring(0, 10)}...`);
    } else {
        console.log('   ❌ process.env.GOOGLE_SHEET_ID está vazio!');
        console.log('   ⚠️  O .env não está sendo carregado corretamente!');
    }
    
    if (envApiKey) {
        console.log(`   ✅ process.env.GOOGLE_API_KEY: ${envApiKey.substring(0, 10)}...`);
    } else {
        console.log('   ❌ process.env.GOOGLE_API_KEY está vazio!');
    }
    
    // Teste de conexão
    if (sheetId && apiKey) {
        console.log('\n4️⃣  Testando conexão com Google Sheets...');
        
        const https = require('https');
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Atletas!A1:C10?key=${apiKey}`;
        
        https.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log('   ✅ CONEXÃO BEM-SUCEDIDA!');
                    console.log('\n📊 Dados retornados:');
                    try {
                        const json = JSON.parse(data);
                        if (json.values && json.values.length > 0) {
                            console.log(`   ✅ ${json.values.length} linhas encontradas`);
                            console.log('\n   Primeiras linhas:');
                            json.values.slice(0, 5).forEach((row, i) => {
                                console.log(`   ${i + 1}. ${row.join(' | ')}`);
                            });
                        } else {
                            console.log('   ⚠️  Planilha vazia ou sem dados');
                        }
                    } catch (e) {
                        console.log('   ⚠️  Erro ao processar resposta:', e.message);
                    }
                } else if (res.statusCode === 403) {
                    console.log('   ❌ ERRO 403: Acesso negado!');
                    console.log('\n   Possíveis causas:');
                    console.log('   1. Planilha não está pública');
                    console.log('   2. API Key inválida');
                    console.log('   3. Google Sheets API não está ativada');
                    console.log('\n   📝 Solução:');
                    console.log('   - Abra a planilha');
                    console.log('   - Clique em "Share" > "Anyone with the link" > "Viewer"');
                } else if (res.statusCode === 404) {
                    console.log('   ❌ ERRO 404: Não encontrado!');
                    console.log('\n   Possíveis causas:');
                    console.log('   1. ID da planilha está errado');
                    console.log('   2. Aba "Atletas" não existe');
                    console.log('\n   📝 Solução:');
                    console.log('   - Verifique o ID da planilha na URL');
                    console.log('   - Certifique-se que a aba se chama "Atletas"');
                } else {
                    console.log(`   ❌ ERRO ${res.statusCode}`);
                    console.log('   Resposta:', data.substring(0, 200));
                }
            });
        }).on('error', (err) => {
            console.log('   ❌ ERRO DE CONEXÃO:', err.message);
            console.log('\n   Possíveis causas:');
            console.log('   1. Sem conexão com a internet');
            console.log('   2. Firewall bloqueando');
        });
    } else {
        console.log('\n❌ Não é possível testar: variáveis não configuradas');
    }
    
} else {
    console.log('   ❌ Arquivo .env NÃO ENCONTRADO!');
    console.log('\n   📝 Solução:');
    console.log('   1. Copie o arquivo de exemplo:');
    console.log('      cp .env.example .env');
    console.log('   2. Edite o arquivo:');
    console.log('      nano .env');
    console.log('   3. Configure suas credenciais');
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\n💡 DICA:');
console.log('   Se tudo estiver OK aqui mas o servidor mostrar "dados mock",');
console.log('   o problema pode ser que o servidor não está lendo o .env.');
console.log('\n   Certifique-se de:');
console.log('   1. Arquivo .env está na RAIZ do projeto');
console.log('   2. Servidor foi REINICIADO após criar/editar .env');
console.log('   3. Executou "npm start" no diretório correto');
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');