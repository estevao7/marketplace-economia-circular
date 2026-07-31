const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./marketplace.db', (erro) => {
    if (erro) {
        console.error('Erro ao conectar com o banco:', erro.message);
    } else {
        console.log('Conectado ao banco SQLite com sucesso!');
    }
});

db.run(`
    CREATE TABLE IF NOT EXISTS anuncios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descricao TEXT,
        categoria TEXT NOT NULL,
        preco TEXT,
        imagemUrl TEXT,
        criadoEm DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

module.exports = db;