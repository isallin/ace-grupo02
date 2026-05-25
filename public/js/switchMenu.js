async function switchMenu() {
    const funcao = sessionStorage.FUNCAO_USUARIO;
    const botoes = document.getElementById('botoes');

    if (funcao == 'coach') {
        botoes.innerHTML += `<button id="botaoside" onclick="window.location.href='blog.html'">Enviar composição</button>`;
    } else if (funcao == 'player') {
        botoes.innerHTML += `<button id="botaoside" class="estmenu" onclick="window.location.href='estatisticas.html'">Estatisticas</button>`;
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