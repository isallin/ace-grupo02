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
            await renderKpis();
            await renderStatChart();
            await renderAgentChart();
            await renderMapChart();
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

async function obterStatChart() {
    const idusuario = sessionStorage.ID_USUARIO;
    try {
        const resp = await fetch(`/partida/obterStatChart/${idusuario}`);
        console.log(resp)
        if (!resp.ok) throw new Error("Erro ao obter gráfico de Stats");
        return await resp.json();
    } catch (error) {
        console.error("ERRO:", error);
        return [];
    }
}

async function obterTopAgent() {
    const idusuario = sessionStorage.ID_USUARIO;
    try {
        const resp = await fetch(`/partida/obterTopAgent/${idusuario}`);
        console.log(resp)
        if (!resp.ok) throw new Error("Erro ao obter top agentes");
        return await resp.json();
    } catch (error) {
        console.error("ERRO:", error);
        return [];
    }
}

async function obterTopMapa() {
    const idusuario = sessionStorage.ID_USUARIO;
    try {
        const resp = await fetch(`/partida/obterTopMapa/${idusuario}`);
        console.log(resp)
        if (!resp.ok) throw new Error("Erro ao obter top agentes");
        return await resp.json();
    } catch (error) {
        console.error("ERRO:", error);
        return [];
    }
}

async function obterPartidasSelect() {
    const idusuario = sessionStorage.ID_USUARIO;
    try {
        const resp = await fetch(`/partida/obterPartidasSelect/${idusuario}`);
        console.log(resp)
        if (!resp.ok) throw new Error("Erro ao obter top agentes");
        return await resp.json();
    } catch (error) {
        console.error("ERRO:", error);
        return [];
    }
}

async function renderKpis() {
    const kpis = await obterKpis();

    if (kpis && kpis.length > 0) {
        const dados = kpis[0];

        document.getElementById("kpi-kdr").innerHTML = dados.kdr;
        document.getElementById("kpi-kda").innerHTML = dados.kda;
        document.getElementById("kpi-media-acs").innerHTML = dados.media_acs;
        document.getElementById("kpi-winrate").innerHTML = dados.winrate;
    }
}

async function renderStatChart() {
    const statChart = await obterStatChart();

    const datas = statChart.map(p => p.data_partida);
    const abates = statChart.map(p => p.abates);
    const mortes = statChart.map(p => p.mortes);
    const assistencias = statChart.map(p => p.assistencias);

    const ctx = document.getElementById('statsChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: datas,
            datasets: [
                {
                    label: 'Abates',
                    data: abates,
                    borderColor: '#7EC94C',
                    tension: 0.2
                },
                {
                    label: 'Mortes',
                    data: mortes,
                    borderColor: '#c3423f',
                    tension: 0.2
                },
                {
                    label: 'Assistências',
                    data: assistencias,
                    borderColor: '#ffa500',
                    tension: 0.2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

async function renderAgentChart() {
    let meuGraficoAgentes = null;
    const topAgent = await obterTopAgent();

    if (!topAgent || topAgent.length === 0) {
        console.warn("Nenhum dado encontrado para o gráfico de agentes.");
        return;
    }

    const nomesAgentes = topAgent.map(item => item.agente);
    const winrates = topAgent.map(item => item.winrate);

    const ctx = document.getElementById('functionGraph').getContext('2d');

    if (meuGraficoAgentes) {
        meuGraficoAgentes.destroy();
    }

    meuGraficoAgentes = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: nomesAgentes,
            datasets: [{
                label: 'Win Rate (%)',
                data: winrates,
                backgroundColor: [
                    'rgba(106, 214, 238, 0.8)',
                    'rgba(106, 214, 238, 0.6)',
                    'rgba(106, 214, 238, 0.4)'
                ],
                borderColor: '#6AD6EE',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function (value) { return value + '%'; }
                    }
                }
            }
        }
    });
}

async function renderMapChart() {
    let mapChart = null;
    const dadosMapa = await obterTopMapa();

    if (!dadosMapa || dadosMapa.length === 0) {
        console.warn("Nenhum dado encontrado para o gráfico de mapas.");
        return;
    }

    const nomesMapas = dadosMapa.map(item => item.mapa);
    const winrates = dadosMapa.map(item => item.winrate);

    const ctx = document.getElementById('mapGraph').getContext('2d');

    if (mapChart) {
        mapChart.destroy();
    }

    mapChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: nomesMapas,
            datasets: [{
                label: 'Win Rate (%)',
                data: winrates,
                backgroundColor: [
                    'rgba(106, 214, 238, 0.8)',
                    'rgba(106, 214, 238, 0.6)',
                    'rgba(106, 214, 238, 0.4)'
                ],
                borderColor: '#6AD6EE',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function (value) { return value + '%'; }
                    }
                }
            }
        }
    });
}

async function renderPartidas() {
    const dadosPartidas = await obterPartidasSelect();
    const partidaSelect = document.getElementById('partida-select');
    const mapaPreview = document.getElementById('mapaPreview');
    const agentePreview = document.getElementById('agentePreview');
    partidaSelect.innerHTML = '<option value="">-- Escolha uma partida --</option>';

    dadosPartidas.forEach(partida => {
        const option = document.createElement('option');
        option.value = partida.idpartidausuario;
        option.textContent = `${partida.data_partida} - ${partida.score_aliado} x ${partida.score_adversario} (${partida.mapa})`;
        option.dataset.info = JSON.stringify(partida);
        partidaSelect.appendChild(option);
    });
    partidaSelect.onchange = async (e) => {
        const idPartida = e.target.value;

        if (idPartida === "") {
            camposFormulario.classList.add('oculto');
            mapaPreview.src = "";
            agentePreview.src = "";
            return;
        }

        try {
            const resp = await fetch(`/partida/obterInfosPartida/${idPartida}`);
            if (!resp.ok) throw new Error("Erro ao buscar dados da partida");

            const [partida] = await resp.json();

            document.getElementById('data-ipt').value = partida.data_partida.split('T')[0];
            document.getElementById('score-ipt').value = partida.score;
            document.getElementById('scoreAdv-ipt').value = partida.scoreAdv;
            document.getElementById('acs-ipt').value = partida.acs;
            document.getElementById('abates-ipt').value = partida.kills;
            document.getElementById('mortes-ipt').value = partida.deaths;
            document.getElementById('assists-ipt').value = partida.assists;
            document.getElementById('mapa-ipt').value = partida.nome_mapa;
            document.getElementById('agente-ipt').value = partida.nome_agente;

            mapaPreview.src = `../assets/Loading_Screen_${partida.nome_mapa}.webp`;
            agentePreview.src = `../assets/${partida.nome_agente}_icon.png`;

            camposFormulario.classList.remove('oculto');

        } catch (error) {
            console.error("Erro ao renderizar dados do banco no modal:", error);
        }
    };
}
