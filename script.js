const botoesFiltro = document.querySelectorAll('.filtro-btn');
const itensCard = document.querySelectorAll('.item-card');

botoesFiltro.forEach(botao => {
    botao.addEventListener('click', () => {
        const categoriaEscolhida = botao.dataset.categoria;

        botoesFiltro.forEach(b => b.classList.remove('ativo'));
        botao.classList.add('ativo');

        itensCard.forEach(item => {
             if (categoriaEscolhida === 'todos' || item.dataset.categoria === categoriaEscolhida) {
                item.style.display = 'block';
             } else {
                item.style.display = 'none';
             }
        });
    });
});