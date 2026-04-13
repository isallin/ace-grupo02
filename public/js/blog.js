const detalhesAgentes = {
    "jett": { classe: "Duelista", desc: "Agilidade extrema e evasão" },
    "raze": { classe: "Duelista", desc: "Dano explosivo em área" },
    "breach": { classe: "Iniciador", desc: "Remove facilmente os inimigos da posição" },
    "sova": { classe: "Iniciador", desc: "Informação constante e rastreio" },
    "cypher": { classe: "Sentinela", desc: "Monitoramento e armadilhas de contenção" },
    "omen": { classe: "Controlador", desc: "Teleporte e fumaças paranoicas" },
    "phoenix": { classe: "Duelista", desc: "Controle com fogo e autocura" },
    "sage": { classe: "Sentinela", desc: "Suporte com cura e barreiras de gelo" },
    "brimstone": { classe: "Controlador", desc: "Suporte orbital e fumaças precisas" },
    "viper": { classe: "Controlador", desc: "Veneno e controle de território" },
    "reyna": { classe: "Duelista", desc: "Sustento e invulnerabilidade após abates" },
    "killjoy": { classe: "Sentinela", desc: "Defesa tecnológica com torres e robôs" },
    "skye": { classe: "Iniciador", desc: "Cura em grupo e batedores animais" },
    "yoru": { classe: "Duelista", desc: "Enganação e infiltração dimensional" },
    "astra": { classe: "Controlador", desc: "Controle estratégico em escala global" },
    "kay/o": { classe: "Iniciador", desc: "Supressão de habilidades inimigas" },
    "chamber": { classe: "Sentinela", desc: "Precisão letal e armamento customizado" },
    "neon": { classe: "Duelista", desc: "Velocidade elétrica e investidas rápidas" },
    "fade": { classe: "Iniciador", desc: "Revelação de medos e rastreio de pesadelos" },
    "harbor": { classe: "Controlador", desc: "Paredes de água e proteção móvel" },
    "gekko": { classe: "Iniciador", desc: "Criaturas utilitárias reutilizáveis" },
    "deadlock": { classe: "Sentinela", desc: "Sensores sonoros e fios de nanofio" },
    "iso": { classe: "Duelista", desc: "Escudos de energia e duelos isolados" },
    "clove": { classe: "Controlador", desc: "Imortalidade estratégica e fumaças pós-morte" },
    "vyse": { classe: "Sentinela", desc: "Controle de metal e isolamento de área" },
    "waylay": { classe: "Duelista", desc: "Entrada rápida e flancos agressivos" }
};

const defaultPosts = [
    { id: 1, titulo: "Composição Icebox", data: "06/04/2026", autor: "Batatinha do Bronze", agentes: ["breach", "sova", "cypher", "omen", "waylay"], banner: "Loading_Screen_Icebox.webp" },
    { id: 2, titulo: "Composição Bind", data: "05/04/2026", autor: "Anonimo", agentes: ["raze", "omen", "cypher", "breach", "reyna"], banner: "Loading_Screen_Bind.webp" }
];

const defaultComentarios = {
    1: [{ nome: "João", texto: "Essa composição é muito forte no bomb B!" }],
    2: [{ nome: "Jose", texto: "Essa composição é muito forte" }]
};

if (!localStorage.getItem("posts")) {
    localStorage.setItem("posts", JSON.stringify(defaultPosts));
    localStorage.setItem("comentarios", JSON.stringify(defaultComentarios));
}

let posts = JSON.parse(localStorage.getItem("posts"));
let comentarios = JSON.parse(localStorage.getItem("comentarios"));

const urlParams = new URLSearchParams(window.location.search);
const currentId = urlParams.get("id") ? Number(urlParams.get("id")) : null;

const containerBlog = document.getElementById("lista-posts");
if (containerBlog) {
    containerBlog.innerHTML = "";
    if (!posts || posts.length === 0) {
        containerBlog.innerHTML = "<h2 style='color:white'>Nenhuma recomendação encontrada.</h2>";
    } else {
        posts.forEach(p => {
            containerBlog.innerHTML += `
                <div class="post">
                    <div class="post-content">
                        <h2>${p.titulo}</h2>
                        <p class="data">${p.data}</p>
                        <div class="post-imgs">
                            ${p.agentes.map(a => `<img src="../assets/${a.toLowerCase()}_icon.png">`).join('')}
                        </div>
                        <p>Recomendado por: ${p.autor}</p>
                        <a href="post.html?id=${p.id}" class="ver-mais-link">Ver mais...</a>
                    </div>
                    <div class="post-banner"><img src="../assets/${p.banner}"></div>
                </div>`;
        });
    }
}

const tituloPost = document.querySelector(".titulo");
if (tituloPost && currentId) {
    const postEncontrado = posts.find(p => p.id === currentId);
    if (!postEncontrado) {
        tituloPost.innerText = "Post não encontrado";
    } else {
        tituloPost.innerText = postEncontrado.titulo;
        if (document.querySelector(".data")) document.querySelector(".data").innerText = postEncontrado.data;
        if (document.querySelector(".autor")) document.querySelector(".autor").innerText = "Recomendado por: " + postEncontrado.autor;
        if (document.querySelector(".banner")) document.querySelector(".banner").innerHTML = `<img src="../assets/${postEncontrado.banner}">`;
        
        const agentsDiv = document.querySelector(".agent-list");
        if (agentsDiv) {
            agentsDiv.innerHTML = "";
            postEncontrado.agentes.forEach(a => {
                const info = detalhesAgentes[a.toLowerCase()] || { classe: "Agente", desc: "Especialista" };
                agentsDiv.innerHTML += `
                    <div class="agent-item">
                        <img src="../assets/${a.toLowerCase()}_icon.png">
                        <div class="agent-info">
                            <h4>${a.charAt(0).toUpperCase() + a.slice(1)}</h4>
                            <p><strong>${info.classe}</strong> - ${info.desc}</p>
                        </div>
                    </div>`;
            });
        }
        carregarComentarios(currentId);
    }
}

function carregarComentarios(postId) {
    const list = document.querySelector(".comment-list");
    if (!list) return;
    list.innerHTML = "";
    (comentarios[postId] || []).forEach((c, index) => {
        list.innerHTML += `
            <div class="comment-item">
                <div class="comment-text">
                    <strong>${c.nome}:</strong> <span>${c.texto}</span>
                </div>
                <div class="comment-actions">
                    <button onclick="editarComentario(${index})" class="btn-comment-edit" title="Editar">✎</button>
                    <button onclick="excluirComentario(${index})" class="btn-comment-delete" title="Excluir">🗑</button>
                </div>
            </div>`;
    });
}

function excluirComentario(index) {
    if (confirm("Deseja excluir este comentário?")) {
        comentarios[currentId].splice(index, 1);
        localStorage.setItem("comentarios", JSON.stringify(comentarios));
        carregarComentarios(currentId);
    }
}

function editarComentario(index) {
    const novoTexto = prompt("Edite seu comentário:", comentarios[currentId][index].texto);
    if (novoTexto !== null && novoTexto.trim() !== "") {
        comentarios[currentId][index].texto = novoTexto;
        localStorage.setItem("comentarios", JSON.stringify(comentarios));
        carregarComentarios(currentId);
    }
}

const commentForm = document.querySelector(".comment-form");
if (commentForm && currentId) {
    commentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const inputs = commentForm.querySelectorAll('input');
        const nome = inputs[0].value;
        const texto = inputs[1].value;
        if (!comentarios[currentId]) comentarios[currentId] = [];
        comentarios[currentId].push({ nome, texto });
        localStorage.setItem("comentarios", JSON.stringify(comentarios));
        carregarComentarios(currentId);
        commentForm.reset();
    });
}

function editarPost() {
    if (currentId) {
        window.location.href = `add-post.html?id=${currentId}`;
    }
}

function deletarPost() {
    if (!confirm("Tem certeza que deseja deletar este post?")) return;
    const index = posts.findIndex(p => p.id === currentId);
    if (index !== -1) {
        posts.splice(index, 1);
        delete comentarios[currentId];
        localStorage.setItem("posts", JSON.stringify(posts));
        localStorage.setItem("comentarios", JSON.stringify(comentarios));
        window.location.href = "blog.html";
    }
}

const formAddPost = document.getElementById('form-add-post');
if (formAddPost) {
    if (currentId) {
        const postParaEditar = posts.find(p => p.id === currentId);
        if (postParaEditar) {
            document.getElementById('titulo').value = postParaEditar.titulo;
            document.getElementById('autor').value = postParaEditar.autor;
            const mapaSalvo = postParaEditar.banner.replace('Loading_Screen_', '').replace('.webp', '');
            const selectMapa = document.getElementById('mapa');
            if (selectMapa) selectMapa.value = mapaSalvo;

            const selectsAgentes = document.querySelectorAll('.agente-select');
            postParaEditar.agentes.forEach((agente, index) => {
                if (selectsAgentes[index]) {
                    const select = selectsAgentes[index];
                    Array.from(select.options).forEach(option => {
                        if (option.value.toLowerCase() === agente.toLowerCase()) {
                            select.value = option.value;
                        }
                    });
                }
            });
        }
    }

    formAddPost.addEventListener('submit', function(e) {
        e.preventDefault();
        const titulo = document.getElementById('titulo').value;
        const autor = document.getElementById('autor').value;
        const mapa = document.getElementById('mapa').value;
        const selectsAgentes = document.querySelectorAll('.agente-select');
        const agentesSelecionados = Array.from(selectsAgentes).map(s => s.value);

        const agentesUnicos = new Set(agentesSelecionados);
        if (agentesUnicos.size !== agentesSelecionados.length) {
            alert("Erro: Você selecionou agentes repetidos!");
            return;
        }

        if (currentId) {
            const index = posts.findIndex(p => p.id === currentId);
            if (index !== -1) {
                posts[index] = {
                    ...posts[index],
                    titulo: titulo,
                    autor: autor,
                    agentes: agentesSelecionados,
                    banner: `Loading_Screen_${mapa}.webp`
                };
                localStorage.setItem("posts", JSON.stringify(posts));
                alert("Alterações salvas!");
                window.location.href = `post.html?id=${currentId}`;
            }
        } else {
            const novoPost = {
                id: Date.now(),
                titulo: titulo,
                data: new Date().toLocaleDateString('pt-br'),
                autor: autor,
                agentes: agentesSelecionados,
                banner: `Loading_Screen_${mapa}.webp`
            };
            posts.unshift(novoPost);
            localStorage.setItem("posts", JSON.stringify(posts));
            alert("Recomendação publicada!");
            window.location.href = "blog.html";
        }
    });
}