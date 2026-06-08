const modal = document.getElementById('modalCadastro');
const btnAbrir = document.getElementById('btnAbrir');
const btnFechar = document.getElementById('btnFechar');

const selectMapa = document.getElementById('mapa-ipt');
const mapaPreview = document.getElementById('mapaPreview');

const selectAgente = document.getElementById('agente-ipt');
const agentePreview = document.getElementById('agentePreview');

const mapas = [
    { id: "Ascent", nome: "Ascent" },
    { id: "Bind", nome: "Bind" },
    { id: "Breeze", nome: "Breeze" },
    { id: "Fracture", nome: "Fracture" },
    { id: "Haven", nome: "Haven" },
    { id: "Icebox", nome: "Icebox" },
    { id: "Lotus", nome: "Lotus" },
    { id: "Pearl", nome: "Pearl" },
    { id: "Sunset", nome: "Sunset" },
    { id: "Abyss", nome: "Abyss" }
];

const agentes = [
    { id: "Astra", nome: "Astra" },
    { id: "Breach", nome: "Breach" },
    { id: "Brimstone", nome: "Brimstone" },
    { id: "Chamber", nome: "Chamber" },
    { id: "Clove", nome: "Clove" },
    { id: "Cypher", nome: "Cypher" },
    { id: "Deadlock", nome: "Deadlock" },
    { id: "Fade", nome: "Fade" },
    { id: "Gekko", nome: "Gekko" },
    { id: "Harbor", nome: "Harbor" },
    { id: "Iso", nome: "Iso" },
    { id: "Jett", nome: "Jett" },
    { id: "Killjoy", nome: "Killjoy" },
    { id: "Miks", nome: "Miks" },
    { id: "Neon", nome: "Neon" },
    { id: "Omen", nome: "Omen" },
    { id: "Phoenix", nome: "Phoenix" },
    { id: "Raze", nome: "Raze" },
    { id: "Reyna", nome: "Reyna" },
    { id: "Sage", nome: "Sage" },
    { id: "Skye", nome: "Skye" },
    { id: "Sova", nome: "Sova" },
    { id: "Tejo", nome: "Tejo" },
    { id: "Veto", nome: "Veto" },
    { id: "Viper", nome: "Viper" },
    { id: "Vyse", nome: "Vyse" },
    { id: "Waylay", nome: "Waylay" },
    { id: "Yoru", nome: "Yoru" }
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