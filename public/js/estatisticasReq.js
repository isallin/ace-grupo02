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
                scoreAdvServer: Number(dados.scoreAdv),
                acsServer: Number(dados.acs),
                abatesServer: Number(dados.abates),
                mortesServer: Number(dados.mortes),
                assistsServer: Number(dados.assists)
            }),
        });

        if (resposta.ok) {
            notificacao("Sucesso!", "Cadastrado com sucesso!", "7EC94C")
            modal.classList.add('oculto');
            obterKpis()
        } else {
            notificacao("Erro", "Erro ao cadastrar!", "c3423f");
            throw new Error("Erro ao realizar o cadastro");
        }
    } catch (erro) {
        notificacao("Erro", "Erro de conexão!", "c3423f");
        console.error(`ERRO: ${erro}`);
    }
}

async function obterKpis() {
    const idusuario = sessionStorage.ID_USUARIO;
    try {
        const resp = await fetch(`/partida/obterKpis/${idusuario}`);
        console.log(resp)
        if (!resp.ok) throw new Error("Erro ao calcular KPIs");
        return await resp.json();
    } catch (error) {
        console.error("ERRO:", error);
        return [];
    }
}

async function renderKpis() {
    const kpis = await obterKpis();
    console.log("KPIs recebidas do servidor:", kpis);
}

btnSalvar.addEventListener('click', async () => {
    const mapa = document.getElementById('mapa-ipt').value;
    const agente = document.getElementById('agente-ipt').value;
    const data = document.getElementById('data-ipt').value;
    const score = document.getElementById('score-ipt').value;
    const scoreAdv = document.getElementById('scoreAdv-ipt').value;
    const acs = document.getElementById('acs-ipt').value;
    const abates = document.getElementById('abates-ipt').value;
    const mortes = document.getElementById('mortes-ipt').value;
    const assists = document.getElementById('assists-ipt').value;

    if (!mapa || !agente || !data || !score || !scoreAdv || !acs || !abates || !mortes || !assists) {
        notificacao("Erro", "Preencha todos os campos!", "c3423f");
        return;
    }

    if (Number(score) < 0 || Number(scoreAdv) < 0 || Number(acs) < 0 || Number(abates) < 0 || Number(mortes) < 0 || Number(assists) < 0) {
        notificacao("Erro", "Insira valores válidos!", "c3423f");
        return;
    }

    try {
        await cadastrarPartida({ mapa, agente, data, score, scoreAdv, acs, abates, mortes, assists });

        mapa.selectedIndex = 0;
        agente.selectedIndex = 0;
        data.value = "";
        score.value = "";
        scoreAdv.value = "";
        acs.value = "";
        abates.value = "";
        mortes.value = "";
        assists.value = "";

        modal.classList.add('oculto');

    } catch (error) {
        console.error("Erro ao cadastrar:", error);
    }
});