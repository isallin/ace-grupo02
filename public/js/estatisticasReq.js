const btnSalvar = document.getElementById('btnSalvar');

async function cadastrarPartida(dados) {
    const idusuario = sessionStorage.ID_USUARIO;
    try {
        const resposta = await fetch("/partida/cadastrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userServer: Number(idusuario),
                mapaServer: dados.mapa,
                agenteServer: dados.agente,
                dataServer: dados.data,
                scoreServer: Number(dados.score),
                acsServer: Number(dados.acs),
                abatesServer: Number(dados.abates),
                mortesServer: Number(dados.mortes),
                assistsServer: Number(dados.assists)
            }),
        });

        if (resposta.ok) {
            notificacao("Sucesso!", "Cadastrado com sucesso!", "7EC94C")
            modal.classList.add('oculto');
        } else {
            notificacao("Erro", "Erro ao cadastrar!", "c3423f");
            throw new Error("Erro ao realizar o cadastro");
        }
    } catch (erro) {
        notificacao("Erro", "Erro de conexão!", "c3423f");
        console.error(`ERRO: ${erro}`);
    }
}

btnSalvar.addEventListener('click', async () => {
    const mapa = document.getElementById('mapa-ipt').value;
    const agente = document.getElementById('agente-ipt').value;
    const data = document.getElementById('data-ipt').value;
    const score = document.getElementById('score-ipt').value;
    const acs = document.getElementById('acs-ipt').value;
    const abates = document.getElementById('abates-ipt').value;
    const mortes = document.getElementById('mortes-ipt').value;
    const assists = document.getElementById('assists-ipt').value;

    if (!mapa || !agente || !data || !score || !acs || !abates || !mortes || !assists) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    if (Number(score) < 0 || Number(acs) < 0 || Number(abates) < 0 || Number(mortes) < 0 || Number(assists) < 0) {
        alert('Os valores numéricos de score, ACS, abates, mortes e assistências não podem ser negativos.');
        return;
    }

    await cadastrarPartida({ mapa, agente, data, score, acs, abates, mortes, assists });
    modal.classList.add('oculto');
});