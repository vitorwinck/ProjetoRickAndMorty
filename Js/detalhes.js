const detalhesPersonagem = document.getElementById('detalhesPersonagem');

async function buscarEExibirDetalhesPersonagem() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const personagemId = urlParams.get('id');

        const resposta = await fetch(`https://rickandmortyapi.com/api/character/${personagemId}`);
        const personagem = await resposta.json();

        detalhesPersonagem.innerHTML = 
            `<h2>${personagem.name}</h2>
            <img src="${personagem.image}" alt="${personagem.name}">
            <p>Status: ${personagem.status}</p>
            <p>Espécie: ${personagem.species}</p>
            <p>Gênero: ${personagem.gender}</p>
            <p>Origem: ${personagem.origin.name}</p>
            <p>Localização: ${personagem.location.name}</p>`;
    } catch (erro) {
        console.error('Erro ao buscar dados da API:', erro);
    }
}

window.onload = buscarEExibirDetalhesPersonagem;