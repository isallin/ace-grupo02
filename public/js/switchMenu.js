async function switchMenu() {
    const funcao = sessionStorage.FUNCAO_USUARIO;
    const botoes = document.getElementById('botoes');

    if (funcao == 'coach') {
        botoes.innerHTML += `<button id="botaoside" onclick="window.location.href='blog.html'">Enviar composição</button>`;
    } else if (funcao == 'player') {
        botoes.innerHTML += `<button id="botaoside" class="estmenu" onclick="window.location.href='estatisticas.html'">Estatisticas</button>`;
        botoes.innerHTML += `<button id="botaoside" onclick="window.location.href='blog.html'">Blog</button>`;
    } else {
        botoes.innerHTML += `<button id="botaoside" class="estmenu" onclick="window.location.href='estatisticas.html'">Estatisticas</button>`;
        botoes.innerHTML += `<button id="botaoside" onclick="window.location.href='blog.html'">Enviar composição</button>`;
    }
    if (document.title === "Estatísticas do Player") {
        const estatisticaMenu = document.querySelector('.estmenu');
        if (estatisticaMenu) {
            estatisticaMenu.style.filter = "drop-shadow(0px 1px 4px rgba(75, 255, 234, 0.741))";
            estatisticaMenu.style.borderColor = "#6AD6EE";
        }
    }
}

async function switchNav() {
    const funcao = sessionStorage.FUNCAO_USUARIO;
    const menu = document.getElementById('nav_menu');

    if (funcao == 'coach') {
        menu.innerHTML += `<a href="blog.html">Enviar composição</a>`;
    } else if (funcao == 'player') {
        menu.innerHTML += `<a href="estatisticas.html">Estatisticas</a>`;
        menu.innerHTML += `<a href="blog.html">Blog</a>`;
    } else {
        menu.innerHTML += `<a href="estatisticas.html">Estatisticas</a>`;
        menu.innerHTML += `<a href="blog.html">Blog</a>`;
    }
    if (document.title === "Estatísticas do Player") {
        const estatisticaMenu = document.querySelector('.estmenu');
        if (estatisticaMenu) {
            estatisticaMenu.style.filter = "drop-shadow(0px 1px 4px rgba(75, 255, 234, 0.741))";
            estatisticaMenu.style.borderColor = "#6AD6EE";
        }
    }
}