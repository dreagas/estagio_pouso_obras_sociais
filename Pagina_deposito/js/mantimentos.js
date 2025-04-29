// ==========================================
// CONTROLE DO TEMA ESCURO E TROCA DE LOGO
// ==========================================

// Espera o carregamento completo da página antes de executar
document.addEventListener('DOMContentLoaded', function () {

    // --------------------------------------
    // 1. ELEMENTOS DA PÁGINA QUE VAMOS USAR
    // --------------------------------------
    const themeButton = document.getElementById('btn-tema'); // Botão de tema
    const htmlElement = document.documentElement; // Elemento <html>
    const logo = document.querySelector('.nav-logo'); // Imagem da logo

    // --------------------------------------
    // 2. CONFIGURAÇÃO INICIAL (SE PRECISAR)
    // --------------------------------------
    // Pode adicionar configurações iniciais aqui se necessário

    // --------------------------------------
    // 3. FUNÇÃO PRINCIPAL - TROCAR TEMA
    // --------------------------------------
    function changeTheme() {
        // Verifica se o tema atual é escuro
        const isDarkMode = htmlElement.getAttribute('data-tema') === 'escuro';

        // Define o novo tema
        const newTheme = isDarkMode ? 'claro' : 'escuro';
        htmlElement.setAttribute('data-tema', newTheme);

        // Atualiza o ícone do botão
        const themeIcon = themeButton.querySelector('i');
        themeIcon.className = isDarkMode ? 'fas fa-moon' : 'fas fa-sun';

        // Atualiza a logo
        if (logo) {
            logo.src = isDarkMode
                ? logo.getAttribute('data-logo-claro')
                : logo.getAttribute('data-logo-escuro');
        }
    }

    // --------------------------------------
    // 4. EVENTO DE CLIQUE NO BOTÃO DE TEMA
    // --------------------------------------
    if (themeButton) {
        themeButton.addEventListener('click', changeTheme);
    } else {
        console.error('Botão de tema não encontrado! Verifique o ID btn-tema');
    }

    // --------------------------------------
    // 5. VERIFICAÇÃO DE ELEMENTOS (OPCIONAL)
    // --------------------------------------
    if (!logo) {
        console.warn('Logo não encontrada! Verifique a classe .nav-logo');
    }

});