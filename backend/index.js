const express = require('express');
const app = express();
const db = require('./database');
const PORTA = 3000;

app.get('/', (req, res) => {
    res.json({ mensagem: 'API do Marketplace Economia Circular funcionando!' });
});

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});