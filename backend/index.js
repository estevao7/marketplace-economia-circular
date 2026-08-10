const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./database');
const PORTA = 3000;

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

    const sql = `INSERT INTO anuncios (titulo, descricao, categoria, preco, imagemUrl, idUsuario) VALUES (?, ?, ?, ?, ?, ?)`;

    db.run(sql, [titulo, descricao, categoria, preco, imagemUrl, idUsuario], function (erro) {
        if (erro) {
            return res.status(500).json({ erro: 'Erro ao criar anúncio.' });
        }
        res.status(201).json({ id: this.lastID, titulo, descricao, categoria, preco, imagemUrl, idUsuario });
    });
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

    db.all(sql, parametros, (erro, linhas) => {
        if (erro) {
            return res.status(500).json({ erro: 'Erro ao buscar anúncios.' });
        }
        res.json(linhas);
    });
});

app.delete('/anuncios/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM anuncios WHERE id = ?', [id], function (erro) {
        if (erro) {
            return res.status(500).json({ erro: 'Erro ao deletar anúncio.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ erro: 'Anúncio não encontrado.' });
        }
        res.json({ mensagem: 'Anúncio deletado com sucesso.' });
    });
});

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});