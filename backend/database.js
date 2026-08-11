const Database = require('better-sqlite3');

const db = new Database('./marketplace.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS anuncios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descricao TEXT,
        categoria TEXT NOT NULL,
        preco TEXT,
        imagemUrl TEXT,
        idUsuario TEXT,
        criadoEm DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

console.log('Conectado ao banco SQLite com sucesso!');

module.exports = db;