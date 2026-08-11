const botoesFiltro = document.querySelectorAll('.filtro-btn');
const itensCard = document.querySelectorAll('.item-card');
const API_URL = 'https://marketplace-economia-circular.onrender.com';

async function buscarAnuncios(categoria = 'todos') {
    let url = `${API_URL}/anuncios`;

    if (categoria !== 'todos') {
        url += `?categoria=${categoria}`;
    }

    try {
        const resposta = await fetch(url);
        const anuncios = await resposta.json();
        renderizarAnuncios(anuncios);
    } catch (erro) {
        console.error('Erro ao buscar anúncios:', erro);
    }
}

botoesFiltro.forEach(botao => {
    botao.addEventListener('click', () => {
        const categoriaEscolhida = botao.dataset.categoria;

        botoesFiltro.forEach(b => b.classList.remove('ativo'));
        botao.classList.add('ativo');

        buscarAnuncios(categoriaEscolhida);
    });
});

function renderizarAnuncios(anuncios) {
    const container = document.getElementById('itens-grid');
    container.innerHTML = '';

    if (anuncios.length === 0) {
        container.innerHTML = '<p>Nenhum anúncio encontrado.</p>';
        return;
    }

    anuncios.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('item-card');
        card.dataset.categoria = item.categoria;

        card.innerHTML = `
            <img src="${item.imagemUrl}" alt="${item.titulo}">
            <h3>${item.titulo}</h3>
            <p class="item-categoria">${item.categoria}</p>
            <p class="item-preco">${item.preco === 'Doação' ? 'Doação' : `R$ ${item.preco}`}</p>
        `;

        container.appendChild(card);
    });
}

buscarAnuncios();

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(() => console.log('Service Worker registrado com sucesso!'))
        .catch((erro) => console.error('Erro ao registrar Service Worker:', erro));
}