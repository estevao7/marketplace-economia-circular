const express = require('express');
const cors = require('cors');
const app = express();
const { anuncios, proximoId } = require('./database');
const PORTA = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ mensagem: 'API do Marketplace Economia Circular funcionando!' });
});

app.post('/anuncios', (req, res) => {
    const { titulo, descricao, categoria, preco, imagemUrl, idUsuario } = req.body;

    if (!titulo || !categoria) {
        return res.status(400).json({ erro: 'Título e categoria são obrigatórios.' });
    }

    const novoAnuncio = {
        id: proximoId(),
        titulo, descricao, categoria, preco, imagemUrl, idUsuario,
        criadoEm: new Date().toISOString()
    };

    anuncios.unshift(novoAnuncio);
    res.status(201).json(novoAnuncio);
});

app.get('/anuncios', (req, res) => {
    const { categoria, idUsuario } = req.query;
    let resultado = anuncios;

    if (categoria) {
        resultado = resultado.filter(a => a.categoria === categoria);
    }
    if (idUsuario) {
        resultado = resultado.filter(a => a.idUsuario === idUsuario);
    }

    res.json(resultado);
});

app.delete('/anuncios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = anuncios.findIndex(a => a.id === id);

    if (index === -1) {
        return res.status(404).json({ erro: 'Anúncio não encontrado.' });
    }

    anuncios.splice(index, 1);
    res.json({ mensagem: 'Anúncio deletado com sucesso.' });
});

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});