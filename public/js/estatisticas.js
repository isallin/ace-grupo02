const modal = document.getElementById('modalCadastro');
const btnAbrir = document.getElementById('btnAbrir');
const btnFechar = document.getElementById('btnFechar');

const selectMapa = document.getElementById('mapa-ipt');
const mapaPreview = document.getElementById('mapaPreview');

const selectAgente = document.getElementById('agente-ipt');
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
    { id: "astra", nome: "Astra" },
    { id: "breach", nome: "Breach" },
    { id: "brimstone", nome: "Brimstone" },
    { id: "chamber", nome: "Chamber" },
    { id: "clove", nome: "Clove" },
    { id: "cypher", nome: "Cypher" },
    { id: "deadlock", nome: "Deadlock" },
    { id: "fade", nome: "Fade" },
    { id: "gekko", nome: "Gekko" },
    { id: "harbor", nome: "Harbor" },
    { id: "iso", nome: "Iso" },
    { id: "jett", nome: "Jett" },
    { id: "killjoy", nome: "Killjoy" },
    { id: "miks", nome: "Miks" },
    { id: "neon", nome: "Neon" },
    { id: "omen", nome: "Omen" },
    { id: "phoenix", nome: "Phoenix" },
    { id: "raze", nome: "Raze" },
    { id: "reyna", nome: "Reyna" },
    { id: "sage", nome: "Sage" },
    { id: "skye", nome: "Skye" },
    { id: "sova", nome: "Sova" },
    { id: "tejo", nome: "Tejo" },
    { id: "veto", nome: "Veto" },
    { id: "viper", nome: "Viper" },
    { id: "vyse", nome: "Vyse" },
    { id: "waylay", nome: "Waylay" },
    { id: "yoru", nome: "Yoru" }
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