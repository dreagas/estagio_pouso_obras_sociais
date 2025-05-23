// Elementos do DOM
const formCadastro = document.getElementById("form-produto");
const produtosContainer = document.getElementById("produtos-container");
const selectProduto = document.getElementById("selecao-produto");
const editPopup = document.getElementById("editPopup");
const editForm = document.getElementById("editForm");
const inputPesquisa = document.getElementById("pesquisa");
const filtroOrdem = document.getElementById("filtro-ordem");

// Variáveis globais
let editandoId = null;
let todosProdutos = [];

// Funções de controle do popup
const mostrarPopup = () => {
    editPopup.style.display = 'flex';
};

const esconderPopup = () => {
    editPopup.style.display = 'none';
};

// Carregar e exibir produtos
async function carregarProdutos() {
    try {
        const res = await fetch("http://localhost:3000/produtos");
        todosProdutos = await res.json();
        filtrarOrdenarProdutos();
        atualizarSelectMovimentacao(todosProdutos);
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
    }
}

function atualizarExibicaoProdutos(produtos) {
    produtosContainer.innerHTML = produtos.map(produto => `
<div class="card-medicamento">
    <div class="card-codigo-barras">${produto.codigoBarras}</div>
    <div class="card-header">
        <h3>${produto.nome}</h3>
    </div>
    
    <div class="info-grid">
        <div class="info-item">
            <span class="info-label">Concentração:</span>
            <span class="info-value">${produto.concentracao}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Tipo:</span>
            <span class="info-value">${produto.tipo}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Estoque:</span>
            <span class="info-value">${produto.quantidade} unidades</span>
        </div>
        <div class="info-item">
            <span class="info-label">Classe:</span>
            <span class="info-value">${produto.classe}</span>
        </div>
        <div class="info-item full-width">
            <span class="info-label">Descrição:</span>
            <span class="info-value">${produto.descricao.replace(/\n/g, '<br>')}</span>
        </div>
    </div>

    ${produto.controleEspecial
            ? '<div class="controle-especial">CONTROLE ESPECIAL</div>'
            : ''}

    <div class="card-acoes">
        <button class="btn-editar" data-id="${produto.id}">
            <i class="fas fa-pencil-alt"></i> Editar
        </button>
        <button class="btn-excluir" data-id="${produto.id}">
            <i class="fas fa-trash"></i> Excluir
        </button>
    </div>
</div>
`).join("");

    produtosContainer.style.height = 'auto';
    produtosContainer.style.overflowY = 'visible';
}

// Novo filtro de ordenação
function filtrarOrdenarProdutos() {
    const termo = inputPesquisa.value.toLowerCase();
    const ordem = filtroOrdem.value;

    let produtosFiltrados = todosProdutos.filter(produto =>
        produto.nome.toLowerCase().includes(termo) ||
        produto.id.toString().includes(termo) ||
        produto.codigoBarras.includes(termo)
    );

    // Ordenação padrão A-Z
    produtosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));

    // Aplicar ordenação adicional se selecionada
    switch (ordem) {
        case 'za':
            produtosFiltrados.sort((a, b) => b.nome.localeCompare(a.nome));
            break;
        case 'estoque':
            produtosFiltrados.sort((a, b) => b.quantidade - a.quantidade);
            break;
    }

    atualizarExibicaoProdutos(produtosFiltrados);
}

// Cadastrar novo medicamento
formCadastro.addEventListener("submit", async (e) => {
    e.preventDefault();

    function gerarID() {
        return Date.now().toString(); // Retorna o timestamp atual em string
    }

    const novoMedicamento = {
        id: gerarID(), // ID gerado automaticamente
        nome: document.getElementById("nome-produto").value,
        quantidade: parseInt(document.getElementById("quantidade").value),
        concentracao: document.getElementById("concentracao").value,
        tipo: document.getElementById("tipo").value,
        descricao: document.getElementById("descricao").value,
        classe: document.getElementById("classe").value,
        codigoBarras: document.getElementById("codigoBarras").value, // ID corrigido
        controleEspecial: document.getElementById("cadastroControleEspecial").checked
    };

    await fetch("http://localhost:3000/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoMedicamento)
    });

    formCadastro.reset();
    await carregarProdutos();
});

// Editar medicamento
document.addEventListener('click', async (e) => {
    const btn = e.target.closest("button");

    if (btn?.classList.contains("btn-editar")) {
        editandoId = btn.dataset.id;
        const res = await fetch(`http://localhost:3000/produtos/${editandoId}`);
        const produto = await res.json();

        // Preencher formulário de edição
        document.getElementById("editNome").value = produto.nome;
        document.getElementById("editQuantidade").value = produto.quantidade;
        document.getElementById("editConcentracao").value = produto.concentracao;
        document.getElementById("editTipo").value = produto.tipo;
        document.getElementById("editDescricao").value = produto.descricao;
        document.getElementById("editClasse").value = produto.classe;
        document.getElementById("editCodigoBarras").value = produto.codigoBarras; // Corrigido de codigoDCB
        document.getElementById("editControleEspecial").checked = produto.controleEspecial;

        mostrarPopup();
    }

    if (btn?.classList.contains("btn-excluir")) {
        if (confirm("Deseja realmente excluir este medicamento?")) {
            await fetch(`http://localhost:3000/produtos/${btn.dataset.id}`, {
                method: "DELETE"
            });
            await carregarProdutos();
        }
    }
});

// Salvar edição
editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const medicamentoAtualizado = {
        id: editandoId, // Mantém o mesmo ID
        nome: document.getElementById("editNome").value,
        quantidade: parseInt(document.getElementById("editQuantidade").value),
        concentracao: document.getElementById("editConcentracao").value,
        tipo: document.getElementById("editTipo").value,
        descricao: document.getElementById("editDescricao").value,
        classe: document.getElementById("editClasse").value,
        codigoBarras: document.getElementById("editCodigoBarras").value, // Nome correto
        controleEspecial: document.getElementById("editControleEspecial").checked
    };

    await fetch(`http://localhost:3000/produtos/${editandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(medicamentoAtualizado)
    });

    esconderPopup();
    await carregarProdutos();
});

// Movimentação de estoque
function atualizarSelectMovimentacao(produtos) {
    selectProduto.innerHTML = produtos.map(p =>
        `<option value="${p.id}">${p.nome} (${p.id}) - Estoque: ${p.quantidade}</option>`
    ).join("");

    // Forçar atualização imediata do select
    selectProduto.dispatchEvent(new Event('change'));
}

async function carregarProdutos() {
    try {
        const res = await fetch("http://localhost:3000/produtos");
        todosProdutos = await res.json();

        // Garantir ordenação A-Z antes de atualizar
        todosProdutos.sort((a, b) => a.nome.localeCompare(b.nome));

        atualizarExibicaoProdutos(todosProdutos);
        atualizarSelectMovimentacao(todosProdutos); // Chamada reforçada
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
    }
}

async function registrarMovimento(tipo) {
    const produtoId = selectProduto.value;
    const quantidade = Number(document.getElementById("quantidade-movimento").value);

    if (!produtoId || quantidade <= 0) {
        alert("Selecione um medicamento e insira uma quantidade válida!");
        return;
    }

    const res = await fetch(`http://localhost:3000/produtos/${produtoId}`);
    const produto = await res.json();

    const novaQuantidade = tipo === 'entrada' ?
        produto.quantidade + quantidade :
        Math.max(produto.quantidade - quantidade, 0);

    await fetch(`http://localhost:3000/produtos/${produtoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantidade: novaQuantidade })
    });

    await carregarProdutos();
}

// Event Listeners
inputPesquisa.addEventListener("input", filtrarOrdenarProdutos);
filtroOrdem.addEventListener("change", filtrarOrdenarProdutos);
document.getElementById("fecharPopup").addEventListener("click", esconderPopup);
document.getElementById("cancelEdit").addEventListener("click", esconderPopup);
window.limparFormulario = () => formCadastro.reset();
window.registrarEntrada = () => registrarMovimento('entrada');
window.registrarSaida = () => registrarMovimento('saida');

// Inicialização
esconderPopup();
carregarProdutos();