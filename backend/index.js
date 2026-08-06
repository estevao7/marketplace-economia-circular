const express = require('express');
const app = express();
const db = require('./database');
const PORTA = 3000;

app.get('/', (req, res) => {
    res.json({ mensagem: 'API do Marketplace Economia Circular funcionando!' });
});

app.use(express.json());

app.post('/anuncios', (req, res) => {
    const { titulo, descricao, categoria, preco, imagemUrl } = req.body;

    if (!titulo || !categoria) {
        return res.status(400).json({ erro: 'Título e categoria são obrigatórios.' });
    }

    const sql = `INSERT INTO anuncios (titulo, descricao, categoria, preco, imagemUrl) VALUES (?, ?, ?, ?, ?)`;

    db.run(sql, [titulo, descricao, categoria, preco, imagemUrl], function (erro) {
        if (erro) {
            return res.status(500).json({ erro: 'Erro ao criar anúncio.' });
        }
        res.status(201).json({ id: this.lastID, titulo, descricao, categoria, preco, imagemUrl });
    });
});

app.get('/anuncios', (req, res) => {
    db.all('SELECT * FROM anuncios ORDER BY criadoEm DESC', [], (erro, linhas) => {
        if (erro) {
            return res.status(500).json({ erro: 'Erro ao buscar anúncios.' });
        }
        res.json(linhas);
    });
});

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});