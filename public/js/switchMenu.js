async function switchMenu() {
    const funcao = sessionStorage.FUNCAO_USUARIO;
    const botoes = document.getElementById('botoes');
    if (funcao == 'coach') {
        botoes.innerHTML += `<button id="botaoside" onclick="window.location.href='blog.html'">Enviar composição</button>`
    } else {
        botoes.innerHTML += `<button id="botaoside" onclick="window.location.href='estatisticas.html'">Estatisticas</button>`
    }
}