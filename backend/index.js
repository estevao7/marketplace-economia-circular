const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./database');
const PORTA = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.json({ mensagem: 'API do Marketplace Economia Circular funcionando!' });
});

app.use(express.json());

app.post('/anuncios', (req, res) => {
    const { titulo, descricao, categoria, preco, imagemUrl, idUsuario } = req.body;

    if (!titulo || !categoria) {
        return res.status(400).json({ erro: 'Título e categoria são obrigatórios.' });
    }

    try {
        const sql = `INSERT INTO anuncios (titulo, descricao, categoria, preco, imagemUrl, idUsuario) VALUES (?, ?, ?, ?, ?, ?)`;
        const resultado = db.prepare(sql).run(titulo, descricao, categoria, preco, imagemUrl, idUsuario);

        res.status(201).json({ id: resultado.lastInsertRowid, titulo, descricao, categoria, preco, imagemUrl, idUsuario });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao criar anúncio.' });
    }
});

app.get('/anuncios', (req, res) => {
    const { categoria, idUsuario } = req.query;

    let sql = 'SELECT * FROM anuncios';
    const condicoes = [];
    const parametros = [];

    if (categoria) {
        condicoes.push('categoria = ?');
        parametros.push(categoria);
    }

    if (idUsuario) {
        condicoes.push('idUsuario = ?');
        parametros.push(idUsuario);
    }

    if (condicoes.length > 0) {
        sql += ' WHERE ' + condicoes.join(' AND ');
    }

    sql += ' ORDER BY criadoEm DESC';

    try {
        const linhas = db.prepare(sql).all(...parametros);
        res.json(linhas);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao buscar anúncios.' });
    }
});

app.delete('/anuncios/:id', (req, res) => {
    const { id } = req.params;

    try {
        const resultado = db.prepare('DELETE FROM anuncios WHERE id = ?').run(id);

        if (resultado.changes === 0) {
            return res.status(404).json({ erro: 'Anúncio não encontrado.' });
        }

        res.json({ mensagem: 'Anúncio deletado com sucesso.' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao deletar anúncio.' });
    }
});

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});