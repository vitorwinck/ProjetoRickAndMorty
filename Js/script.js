const containerPersonagens = document.getElementById('containerPersonagens');

const personagensPorPagina = 20;

let paginaAtual = 1;

const inputNomePersonagem = document.getElementById('nomePersonagem');
const selectStatusPersonagem = document.getElementById('statusPersonagem');
const botaoFiltrar = document.getElementById('filtrar');

botaoFiltrar.addEventListener('click', () => {
    paginaAtual = 1;
    buscarEExibirPersonagens();
});

async function buscarEExibirPersonagens() {
    try {
        const todosPersonagens = await buscarTodosPersonagens();
        const nomeFiltrado = inputNomePersonagem.value.trim().toLowerCase();

        const statusFiltrado = selectStatusPersonagem.value.toLowerCase();

        const personagensFiltrados = todosPersonagens.filter(personagem => {
            const nomeMinusculo = personagem.name.toLowerCase();
            const statusMinusculo = personagem.status.toLowerCase();
            const nomeCorresponde = nomeFiltrado === '' || nomeMinusculo.includes(nomeFiltrado);
            const statusCorresponde = statusFiltrado === '' || statusMinusculo === statusFiltrado;
            
            return nomeCorresponde && statusCorresponde;
        });

        const inicio = (paginaAtual - 1) * personagensPorPagina;
        const fim = inicio + personagensPorPagina;
        const personagensDaPagina = personagensFiltrados.slice(inicio, fim);

        containerPersonagens.innerHTML = '';

        personagensDaPagina.forEach(personagem => {
            const divPersonagem = document.createElement('div');
            divPersonagem.classList.add('personagem');
            divPersonagem.setAttribute('data-id', personagem.id);

            const imagemPersonagem = document.createElement('img');
            imagemPersonagem.src = personagem.image;
            imagemPersonagem.alt = personagem.name;

            const nomePersonagem = document.createElement('h2');
            nomePersonagem.textContent = personagem.name;

            const statusPersonagem = document.createElement('p');
            statusPersonagem.textContent = `Status: ${personagem.status}`;

            divPersonagem.appendChild(imagemPersonagem);
            divPersonagem.appendChild(nomePersonagem);
            divPersonagem.appendChild(statusPersonagem);

            containerPersonagens.appendChild(divPersonagem);
        });

        atualizarPaginacao(personagensFiltrados.length);
        adicionarEventoDeDetalhes(personagensDaPagina);
    } catch (erro) {
        console.error('Erro ao buscar dados da API:', erro);
    }
}

async function buscarTodosPersonagens() {
    let todosPersonagens = [];
    let pagina = 1;
    let totalPaginas = 1;

    while (pagina <= totalPaginas) {
        try {
            const resposta = await fetch(`https://rickandmortyapi.com/api/character?page=${pagina}`);
            const dados = await resposta.json();
            const personagensDaPagina = dados.results;
            todosPersonagens = todosPersonagens.concat(personagensDaPagina);
            totalPaginas = dados.info.pages;
            pagina++;
        } catch (erro) {
            console.error('Erro ao buscar dados da API:', erro);
            break;
        }
    }

    return todosPersonagens;
}

function atualizarPaginacao(totalPersonagens) {
    const totalPaginas = Math.ceil(totalPersonagens / personagensPorPagina);

    const paginaAtualElement = document.getElementById('paginaAtual');
    paginaAtualElement.textContent = paginaAtual;

    const paginaAnteriorButton = document.getElementById('paginaAnterior');
    const proximaPaginaButton = document.getElementById('proximaPagina');

    paginaAnteriorButton.disabled = paginaAtual === 1;
    proximaPaginaButton.disabled = paginaAtual === totalPaginas;
}

function adicionarEventoDeDetalhes(personagens) {
    personagens.forEach(personagem => {
        const divPersonagem = document.querySelector(`[data-id="${personagem.id}"]`);
        divPersonagem.addEventListener('click', () => {
            window.location.href = `/html/detalhes.html?id=${personagem.id}`;
        });
    });
}

document.getElementById('paginaAnterior').addEventListener('click', () => {
    if (paginaAtual > 1) {
        paginaAtual--;
        buscarEExibirPersonagens();
    }
});

document.getElementById('proximaPagina').addEventListener('click', () => {
    paginaAtual++;
    buscarEExibirPersonagens();
});

window.onload = buscarEExibirPersonagens;