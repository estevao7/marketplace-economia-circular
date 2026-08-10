const CACHE_NOME = 'ecocircular-v1';

const ARQUIVOS_PARA_CACHE = [
    'index.html',
    'anunciar.html',
    'style.css',
    'script.js',
    'anunciar.js',
    'manifest.json',
    'icone-192.png',
    'icone-512.png'
];

self.addEventListener('install', (evento) => {
    evento.waitUntil(
        caches.open(CACHE_NOME).then((cache) => {
            return cache.addAll(ARQUIVOS_PARA_CACHE);
        })
    );
});