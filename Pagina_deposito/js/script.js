// Elementos do DOM
const formCadastro = document.getElementById("form-produto");
const tbody = document.querySelector("#estoqueTable tbody");
const selectProduto = document.getElementById("selecao-produto");
const editPopup = document.getElementById("editPopup");
const editForm = document.getElementById("editForm");

// Variáveis globais
let editandoId = null;
let produtoSelecionado = null;

// Funções de controle do popup
const mostrarPopup = () => editPopup.style.display = "flex";
const esconderPopup = () => editPopup.style.display = "none";

// Carregar produtos
async function carregarProdutos() {
    try {
        const res = await fetch("http://localhost:3000/produtos");
        const produtos = await res.json();

        // Atualizar tabela
        tbody.innerHTML = produtos.map(produto => `
    <tr>
        <td>${produto.nome}</td>
        <td>${produto.quantidade}</td>
        <td>R$ ${Number(produto.preco || produto.valorunitario).toFixed(2)}</td>
        <td>
            <button class="btn-editar" data-id="${produto.id}">
                <i class="fas fa-pencil-alt"></i>
            </button>
            <button class="btn-excluir" data-id="${produto.id}">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    </tr>
`).join("");

        // Atualizar select mantendo a seleção atual
        const selectedId = selectProduto.value;
        selectProduto.innerHTML = produtos.map(p =>
            `<option value="${p.id}" ${p.id == selectedId ? 'selected' : ''}>${p.nome}</option>`
        ).join("");

    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
    }
}

// Cadastrar produto
formCadastro.addEventListener("submit", async (e) => {
    e.preventDefault();

    const novoProduto = {
        nome: document.getElementById("nome-produto").value,
        descricao: document.getElementById("descricao-produto").value,
        categoria: document.getElementById("categoria-produto").value,
        quantidade: Number(document.getElementById("quantidade-produto").value),
        preco: Number(document.getElementById("preco-produto").value)
    };

    await fetch("http://localhost:3000/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoProduto)
    });

    formCadastro.reset();
    await carregarProdutos();
});

// Editar produto (Event Delegation)
tbody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = btn.dataset.id;

    if (btn.classList.contains("btn-editar")) {
        editandoId = id;
        const res = await fetch(`http://localhost:3000/produtos/${id}`);
        const produto = await res.json();

        document.getElementById("editNome").value = produto.nome;
        document.getElementById("editDescricao").value = produto.descricao || '';
        document.getElementById("editCategoria").value = produto.categoria || 'alimentos';
        document.getElementById("editQuantidade").value = produto.quantidade;
        document.getElementById("editPreco").value = produto.preco || produto.valorunitario;

        mostrarPopup();
    }

    if (btn.classList.contains("btn-excluir")) {
        if (confirm("Deseja realmente excluir este produto?")) {
            await fetch(`http://localhost:3000/produtos/${id}`, { method: "DELETE" });
            await carregarProdutos();
        }
    }
});

// Salvar edição
editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const produtoAtualizado = {
        nome: document.getElementById("editNome").value,
        descricao: document.getElementById("editDescricao").value,
        categoria: document.getElementById("editCategoria").value,
        quantidade: Number(document.getElementById("editQuantidade").value),
        preco: Number(document.getElementById("editPreco").value)
    };

    await fetch(`http://localhost:3000/produtos/${editandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produtoAtualizado)
    });

    esconderPopup();
    await carregarProdutos();
});

// Movimentação de estoque
async function registrarMovimento(tipo) {
    const produtoId = selectProduto.value;
    const quantidade = Number(document.getElementById("quantidade-movimento").value);

    if (!produtoId || quantidade <= 0) {
        alert("Selecione um produto e insira uma quantidade válida!");
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
document.getElementById("fecharPopup").addEventListener("click", esconderPopup);
document.getElementById("cancelEdit").addEventListener("click", esconderPopup);
window.limparFormulario = () => formCadastro.reset();
window.registrarEntrada = () => registrarMovimento('entrada');
window.registrarSaida = () => registrarMovimento('saida');

// Inicialização
esconderPopup();
carregarProdutos();