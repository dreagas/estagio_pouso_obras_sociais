// admin.js - Controle do Painel Administrativo
document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const gridFuncionalidades = document.querySelector('.grid-funcionalidades');
    const btnLogout = document.querySelector('.btn-logout');
    const statusSistema = document.querySelector('.status-sistema');
    const gridAcoes = document.querySelector('.grid-acoes');

    // Estado do Sistema
    let sistemaOnline = true;
    
    // Dados Simulados
    const dadosAdmin = {
        familiasCadastradas: 152,
        proximoEvento: '30/07',
        ultimaDoacao: '25/06',
        aniversariantesHoje: 2
    };

    // Funções de Controle
    const atualizarStatusSistema = () => {
        statusSistema.innerHTML = `
            <span class="online-indicator"></span>
            ${sistemaOnline ? 'Sistema Online' : 'Sistema Offline'}
        `;
    };

    const mostrarFeedback = (mensagem, tipo = 'sucesso') => {
        const feedback = document.createElement('div');
        feedback.className = `feedback-${tipo}`;
        feedback.textContent = mensagem;
        document.body.appendChild(feedback);

        setTimeout(() => feedback.remove(), 3000);
    };

    // Handlers de Eventos
    const handleCardClick = (funcionalidade) => {
        console.log(`Acessando: ${funcionalidade}`);
        // Implementar lógica específica para cada card
        switch(funcionalidade) {
            case 'relatorios':
                mostrarFeedback('Gerando relatório...', 'info');
                break;
            case 'aniversariantes':
                window.location.href = '#lista-aniversariantes';
                break;
            case 'gestao-familias':
                mostrarFeedback(`Famílias cadastradas: ${dadosAdmin.familiasCadastradas}`, 'info');
                break;
            case 'eventos':
                mostrarFeedback(`Próximo evento: ${dadosAdmin.proximoEvento}`, 'info');
                break;
            case 'doacoes':
                mostrarFeedback(`Última doação: ${dadosAdmin.ultimaDoacao}`, 'info');
                break;
            case 'conteudo-site':
                window.open('/gerenciador-conteudo', '_blank');
                break;
        }
    };

    const handleAcaoRapida = (acao) => {
        const acoes = {
            'novo-cadastro': () => window.location.href = '#cadastro',
            'importar-dados': () => console.log('Importando dados...'),
            'estatisticas': () => mostrarFeedback('Carregando estatísticas...', 'info'),
            'notificacoes': () => mostrarFeedback('Nenhuma nova notificação', 'info')
        };
        acoes[acao]?.();
    };

    // Configurar Event Listeners
    gridFuncionalidades.addEventListener('click', (e) => {
        const card = e.target.closest('.card-admin');
        if(card) {
            const funcionalidade = card.dataset.funcionalidade;
            handleCardClick(funcionalidade);
        }
    });

    gridAcoes.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-rapido');
        if(btn) {
            const acao = btn.dataset.acao;
            handleAcaoRapida(acao);
        }
    });

    btnLogout.addEventListener('click', (e) => {
        e.preventDefault();
        if(confirm('Deseja realmente sair do sistema?')) {
            // Lógica de logout
            localStorage.removeItem('adminToken');
            window.location.href = 'index.html';
        }
    });

    // Monitorar Status de Conexão
    window.addEventListener('online', () => {
        sistemaOnline = true;
        atualizarStatusSistema();
    });

    window.addEventListener('offline', () => {
        sistemaOnline = false;
        atualizarStatusSistema();
    });

    // Inicialização
    const inicializarAdmin = () => {
        // Atualizar dados dinâmicos
        document.querySelector('[data-funcionalidade="gestao-familias"] p')
            .textContent = `${dadosAdmin.familiasCadastradas} famílias cadastradas`;
        
        document.querySelector('[data-funcionalidade="eventos"] p')
            .textContent = `Próximo evento: ${dadosAdmin.proximoEvento}`;

        document.querySelector('[data-funcionalidade="aniversariantes"] p')
            .textContent = `${dadosAdmin.aniversariantesHoje} aniversários hoje`;

        document.querySelector('[data-funcionalidade="doacoes"] p')
            .textContent = `Última doação: ${dadosAdmin.ultimaDoacao}`;

        atualizarStatusSistema();
    };

    inicializarAdmin();
});

// Estilos Dinâmicos para Feedback
const style = document.createElement('style');
style.textContent = `
.feedback-sucesso {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 2000;
    animation: slideIn 0.3s ease-out;
}

.feedback-info {
    background: #2196F3;
}

@keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
}
`;
document.head.appendChild(style);