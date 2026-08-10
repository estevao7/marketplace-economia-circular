function obterIdUsuario() {
    let idUsuario = localStorage.getItem('idUsuario');

    if (!idUsuario) {
        idUsuario = 'user_' + Date.now();
        localStorage.setItem('idUsuario', idUsuario);
    }

    return idUsuario;
}

const idUsuario = obterIdUsuario();


const formulario = document.getElementById('formulario-anuncio');

formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const novoAnuncio = {
        titulo: document.getElementById('titulo').value,
        descricao: document.getElementById('descricao').value,
        categoria: document.getElementById('categoria').value,
        preco: document.getElementById('preco').value,
        imagemUrl: document.getElementById('imagemUrl').value,
        idUsuario: idUsuario
    };

    try {
        const resposta = await fetch('http://localhost:3000/anuncios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoAnuncio)
        });

        if (!resposta.ok) {
            throw new Error('Erro ao criar anúncio');
        }

        alert('Anúncio publicado com sucesso!');
        formulario.reset();
        carregarMeusAnuncios();

    } catch (erro) {
        console.error(erro);
        alert('Não foi possível publicar o anúncio. Tente novamente.');
    }
});

async function carregarMeusAnuncios() {
    const container = document.getElementById('meus-itens-grid');

    try {
        const resposta = await fetch(`http://localhost:3000/anuncios?idUsuario=${idUsuario}`);
        const anuncios = await resposta.json();

        container.innerHTML = '';

        if (anuncios.length === 0) {
            container.innerHTML = '<p>Você ainda não anunciou nenhum item.</p>';
            return;
        }

        anuncios.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('item-card');

            card.innerHTML = `
                <img src="${item.imagemUrl}" alt="${item.titulo}">
                <h3>${item.titulo}</h3>
                <p class="item-categoria">${item.categoria}</p>
                <p class="item-preco">${item.preco === 'Doação' ? 'Doação' : `R$ ${item.preco}`}</p>
            `;

            container.appendChild(card);
        });

    } catch (erro) {
        console.error('Erro ao carregar meus anúncios:', erro);
    }
}

carregarMeusAnuncios();