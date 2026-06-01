const modal = document.getElementById('modalCadastro');
const btnAbrir = document.getElementById('btnAbrir');
const btnFechar = document.getElementById('btnFechar');
const btnSalvar = document.getElementById('btnSalvar');

const selectMapa = document.getElementById('mapa');
const mapaPreview = document.getElementById('mapaPreview');

const selectAgente = document.getElementById('agente');
const agentePreview = document.getElementById('agentePreview');

const mapas = [
    { id: "ascent", nome: "Ascent" },
    { id: "bind", nome: "Bind" },
    { id: "breeze", nome: "Breeze" },
    { id: "fracture", nome: "Fracture" },
    { id: "haven", nome: "Haven" },
    { id: "icebox", nome: "Icebox" },
    { id: "lotus", nome: "Lotus" },
    { id: "pearl", nome: "Pearl" },
    { id: "sunset", nome: "Sunset" },
    { id: "abyss", nome: "Abyss" }
];

const agentes = [
    { id: "jett", nome: "Jett" },
    { id: "reyna", nome: "Reyna" },
    { id: "raze", nome: "Raze" },
    { id: "omen", nome: "Omen" },
    { id: "sage", nome: "Sage" },
    { id: "sova", nome: "Sova" },
    { id: "cypher", nome: "Cypher" },
    { id: "killjoy", nome: "Killjoy" },
    { id: "viper", nome: "Viper" },
    { id: "phoenix", nome: "Phoenix" }
];

function renderizarMapas() {
    mapas.forEach((mapa, index) => {
        const option = document.createElement('option');
        option.value = mapa.id;
        option.textContent = mapa.nome;

        option.dataset.src = `../assets/Loading_Screen_${mapa.nome}.webp`;
        selectMapa.appendChild(option);
    });

    atualizarImagem();
}

function atualizarImagem() {
    const opcaoSelecionada = selectMapa.options[selectMapa.selectedIndex];
    if (opcaoSelecionada) {
        mapaPreview.src = opcaoSelecionada.dataset.src;
    }
}

function renderizarAgentes() {
    agentes.forEach((agente) => {
        const option = document.createElement('option');
        option.value = agente.id;
        option.textContent = agente.nome;
        
        option.dataset.src = `../assets/${agente.nome}_icon.png`;

        selectAgente.appendChild(option);
    });

    atualizarImagemAgente();
}

function atualizarImagemAgente() {
    const opcaoSelecionada = selectAgente.options[selectAgente.selectedIndex];
    if (opcaoSelecionada) {
        agentePreview.src = opcaoSelecionada.dataset.src;
    }
}

// Ouvinte de evento para quando o usuário mudar o select
selectMapa.addEventListener('change', atualizarImagem);
selectAgente.addEventListener('change', atualizarImagemAgente);
renderizarMapas();
renderizarAgentes();

// controles modal
btnAbrir.addEventListener('click', () => {
    modal.classList.remove('oculto');
});

btnFechar.addEventListener('click', () => {
    modal.classList.add('oculto');
});

btnSalvar.addEventListener('click', () => {
    alert('Partida salva com sucesso! (Simulação)');
    modal.classList.add('oculto');
});