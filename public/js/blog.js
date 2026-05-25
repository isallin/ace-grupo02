const BASE_URL = '';

function getUsuario() {
    return {
        id:     sessionStorage.getItem('ID_USUARIO'),
        nome:   sessionStorage.getItem('NOME_USUARIO'),
        funcao: sessionStorage.getItem('FUNCAO_USUARIO') 
    };
}

const detalhesAgentes = {
    "jett":     { classe: "Duelista",    desc: "Agilidade extrema e evasão" },
    "raze":     { classe: "Duelista",    desc: "Dano explosivo em área" },
    "breach":   { classe: "Iniciador",   desc: "Remove facilmente os inimigos da posição" },
    "sova":     { classe: "Iniciador",   desc: "Informação constante e rastreio" },
    "cypher":   { classe: "Sentinela",   desc: "Monitoramento e armadilhas de contenção" },
    "omen":     { classe: "Controlador", desc: "Teleporte e fumaças paranoicas" },
    "phoenix":  { classe: "Duelista",    desc: "Controle com fogo e autocura" },
    "sage":     { classe: "Sentinela",   desc: "Suporte com cura e barreiras de gelo" },
    "brimstone":{ classe: "Controlador", desc: "Suporte orbital e fumaças precisas" },
    "viper":    { classe: "Controlador", desc: "Veneno e controle de território" },
    "reyna":    { classe: "Duelista",    desc: "Sustento e invulnerabilidade após abates" },
    "killjoy":  { classe: "Sentinela",   desc: "Defesa tecnológica com torres e robôs" },
    "skye":     { classe: "Iniciador",   desc: "Cura em grupo e batedores animais" },
    "yoru":     { classe: "Duelista",    desc: "Enganação e infiltração dimensional" },
    "astra":    { classe: "Controlador", desc: "Controle estratégico em escala global" },
    "kay/o":    { classe: "Iniciador",   desc: "Supressão de habilidades inimigas" },
    "chamber":  { classe: "Sentinela",   desc: "Precisão letal e armamento customizado" },
    "neon":     { classe: "Duelista",    desc: "Velocidade elétrica e investidas rápidas" },
    "fade":     { classe: "Iniciador",   desc: "Revelação de medos e rastreio de pesadelos" },
    "harbor":   { classe: "Controlador", desc: "Paredes de água e proteção móvel" },
    "gekko":    { classe: "Iniciador",   desc: "Criaturas utilitárias reutilizáveis" },
    "deadlock": { classe: "Sentinela",   desc: "Sensores sonoros e fios de nanofio" },
    "iso":      { classe: "Duelista",    desc: "Escudos de energia e duelos isolados" },
    "clove":    { classe: "Controlador", desc: "Imortalidade estratégica e fumaças pós-morte" },
    "vyse":     { classe: "Sentinela",   desc: "Controle de metal e isolamento de área" },
    "waylay":   { classe: "Duelista",    desc: "Entrada rápida e flancos agressivos" }
};

const urlParams = new URLSearchParams(window.location.search);
const currentId = urlParams.get("id") ? Number(urlParams.get("id")) : null;

function formatarData(dataStr) {
    const d = new Date(dataStr);
    return d.toLocaleDateString('pt-BR');
}

// =====================================================
// PÁGINA: blog.html
// =====================================================
const containerBlog = document.getElementById("lista-posts");
if (containerBlog) {
    const btnNovoPost = document.getElementById("btn-novo-post"); 
    if (btnNovoPost && getUsuario().funcao == 'player') {
        btnNovoPost.style.display = 'none';
    }

    fetch(`${BASE_URL}/blog/posts`)
        .then(r => r.json())
        .then(posts => {
            containerBlog.innerHTML = "";
            if (!posts || posts.length === 0) {
                containerBlog.innerHTML = "<h2 style='color:white'>Nenhuma recomendação encontrada.</h2>";
                return;
            }
            posts.forEach(p => {
                const agentes = typeof p.agentes === 'string' ? JSON.parse(p.agentes) : p.agentes;
                containerBlog.innerHTML += `
                    <div class="post">
                        <div class="post-content">
                            <h2>${p.titulo}</h2>
                            <p class="data">${formatarData(p.data_criacao)}</p>
                            <div class="post-imgs">
                                ${agentes.map(a => `<img src="../assets/${a.toLowerCase()}_icon.png">`).join('')}
                            </div>
                            <p>Recomendado por: ${p.autor_nome}</p>
                            <a href="post.html?id=${p.id}" class="ver-mais-link">Ver mais...</a>
                        </div>
                        <div class="post-banner"><img src="../assets/${p.banner}"></div>
                    </div>`;
            });
        })
        .catch(() => {
            containerBlog.innerHTML = "<h2 style='color:white'>Erro ao carregar posts.</h2>";
        });
}

// =====================================================
// PÁGINA: post.html
// =====================================================
const tituloPost = document.querySelector(".titulo");
if (tituloPost && currentId) {
    fetch(`${BASE_URL}/blog/posts`)
        .then(r => r.json())
        .then(posts => {
            const post = posts.find(p => p.id === currentId);
            if (!post) { tituloPost.innerText = "Post não encontrado"; return; }

            const usuario = getUsuario();
            const agentes = typeof post.agentes === 'string' ? JSON.parse(post.agentes) : post.agentes;

            tituloPost.innerText = post.titulo;
            if (document.querySelector(".data"))  document.querySelector(".data").innerText = formatarData(post.data_criacao);
            if (document.querySelector(".autor")) document.querySelector(".autor").innerText = "Recomendado por: " + post.autor_nome;
            if (document.querySelector(".banner")) document.querySelector(".banner").innerHTML = `<img src="../assets/${post.banner}">`;

            const actionsDiv = document.querySelector(".actions");
            if (actionsDiv) {
                if (String(post.usuario_id) === String(usuario.id)) {
                    actionsDiv.style.display = "";
                } else {
                    actionsDiv.style.display = "none";
                }
            }

            const agentsDiv = document.querySelector(".agent-list");
            if (agentsDiv) {
                agentsDiv.innerHTML = "";
                agentes.forEach(a => {
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
        });
}

function carregarComentarios(postId) {
    const list = document.querySelector(".comment-list");
    if (!list) return;
    const usuario = getUsuario();

    fetch(`${BASE_URL}/blog/comments/${postId}`)
        .then(r => r.json())
        .then(comentarios => {
            list.innerHTML = "";
            (comentarios || []).forEach(c => {
                const isDono = String(c.usuario_id) === String(usuario.id);
                const acoes = isDono ? `
                    <button onclick="editarComentario(${c.id}, \`${c.texto.replace(/`/g, "'")}\`)" class="btn-comment-edit" title="Editar">✎</button>
                    <button onclick="excluirComentario(${c.id})" class="btn-comment-delete" title="Excluir">🗑</button>
                ` : '';

                list.innerHTML += `
                    <div class="comment-item" id="comment-${c.id}">
                        <div class="comment-text">
                            <strong>${c.autor}:</strong> <span id="comment-texto-${c.id}">${c.texto}</span>
                        </div>
                        <div class="comment-actions">${acoes}</div>
                    </div>`;
            });
        });
}

function editarComentario(idComentario, textoAtual) {
    if (getUsuario().funcao !== 'player') return; 

    const novoTexto = prompt("Edite seu comentário:", textoAtual);
    if (novoTexto === null || novoTexto.trim() === "") return;

    fetch(`${BASE_URL}/blog/comments/${idComentario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto: novoTexto })
    })
    .then(r => {
        if (!r.ok) throw new Error();
        carregarComentarios(currentId);
    })
    .catch(() => alert("Erro ao editar comentário."));
}

function excluirComentario(idComentario) {
    if (getUsuario().funcao !== 'player') return; 
    
    if (!confirm("Deseja excluir este comentário?")) return;
    fetch(`${BASE_URL}/blog/comments/${idComentario}`, { method: 'DELETE' })
        .then(() => carregarComentarios(currentId))
        .catch(() => alert("Erro ao excluir comentário."));
}

const commentForm = document.querySelector(".comment-form");
if (commentForm && currentId) {
    const usuario = getUsuario();
    
    if (usuario.funcao !== 'player') {
        commentForm.innerHTML = "<p style='color: #aaa; font-style: italic;'>Apenas jogadores podem comentar.</p>";
    } else {
        commentForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const texto = commentForm.querySelector('input[placeholder="Comentário..."]').value;
            fetch(`${BASE_URL}/blog/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    post_id: currentId,
                    usuario_id: usuario.id,
                    texto
                })
            })
            .then(() => { carregarComentarios(currentId); commentForm.reset(); })
            .catch(() => alert("Erro ao enviar comentário."));
        });
    }
}

function editarPost() {
    if (getUsuario().funcao === 'coach' && currentId) {
        window.location.href = `add-post.html?id=${currentId}`;
    } else {
        alert("Ação permitida apenas para coaches.");
    }
}

function deletarPost() {
    if (getUsuario().funcao !== 'coach') return;
    if (!confirm("Tem certeza que deseja deletar este post?")) return;
    
    fetch(`${BASE_URL}/blog/posts/${currentId}`, { method: 'DELETE' })
        .then(() => window.location.href = "blog.html")
        .catch(() => alert("Erro ao deletar post."));
}

// =====================================================
// PÁGINA: add-post.html
// =====================================================
const formAddPost = document.getElementById('form-add-post');
if (formAddPost) {
    const usuario = getUsuario();

    // BLOQUEIO DE ACESSO: Se não for coach, nem carrega a página
    if (usuario.funcao == 'player') {
        alert("Acesso restrito a coaches.");
        window.location.href = "blog.html";
    }

    if (currentId) {
        fetch(`${BASE_URL}/blog/posts`)
            .then(r => r.json())
            .then(posts => {
                const post = posts.find(p => p.id === currentId);
                if (!post) return;
                document.getElementById('titulo').value = post.titulo;
                const agentes = typeof post.agentes === 'string' ? JSON.parse(post.agentes) : post.agentes;
                const mapaSalvo = post.banner.replace('Loading_Screen_', '').replace('.webp', '');
                const selectMapa = document.getElementById('mapa');
                if (selectMapa) selectMapa.value = mapaSalvo;
                const selectsAgentes = document.querySelectorAll('.agente-select');
                agentes.forEach((agente, i) => {
                    if (selectsAgentes[i]) {
                        Array.from(selectsAgentes[i].options).forEach(opt => {
                            if (opt.value.toLowerCase() === agente.toLowerCase())
                                selectsAgentes[i].value = opt.value;
                        });
                    }
                });
            });
    }

    formAddPost.addEventListener('submit', function (e) {
        e.preventDefault();
        
        // Re-validação no submit
        if (usuario.funcao !== 'coach') {
            alert("Erro: Você não tem permissão para postar.");
            return;
        }

        const titulo = document.getElementById('titulo').value;
        const mapa = document.getElementById('mapa').value;
        const agentesSelecionados = Array.from(document.querySelectorAll('.agente-select')).map(s => s.value);

        if (new Set(agentesSelecionados).size !== agentesSelecionados.length) {
            alert("Erro: Você selecionou agentes repetidos!");
            return;
        }

        const body = JSON.stringify({
            titulo,
            mapa,
            agentes: agentesSelecionados,
            autor: usuario.nome,
            usuario_id: usuario.id
        });

        if (currentId) {
            fetch(`${BASE_URL}/blog/posts/${currentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body
            })
            .then(r => {
                if (!r.ok) throw new Error("Erro ao atualizar");
                window.location.href = `post.html?id=${currentId}`;
            })
            .catch(() => alert("Erro ao atualizar post."));
        } else {
            fetch(`${BASE_URL}/blog/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body
            })
            .then(r => {
                if (!r.ok) throw new Error("Erro ao publicar");
                window.location.href = "blog.html";
            })
            .catch(() => alert("Erro ao publicar post."));
        }
    });
}