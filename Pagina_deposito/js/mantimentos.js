btnTema.addEventListener('click', () => {
    const temaAtual = html.getAttribute('data-tema');
    const novoTema = temaAtual === 'escuro' ? 'claro' : 'escuro';
    html.setAttribute('data-tema', novoTema);

    // Atualiza ícone e texto
    const icon = btnTema.querySelector('i');
    const texto = btnTema.querySelector('.texto-tema');
    if (novoTema === 'escuro') {
        icon.className = 'fas fa-sun';
        texto.textContent = 'Modo Claro';
    } else {
        icon.className = 'fas fa-moon';
        texto.textContent = 'Modo Escuro';
    }
});