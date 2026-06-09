var medidasModel = require("../models/medidasModel");

function buscarDadosGerais(req, res) {
    var ano = req.params.ano;

    if (!ano) {
        res.status(400).send("Ano não especificado!");
        return;
    }

    // Usando Promise.all para executar as 3 queries ao mesmo tempo
    Promise.all([
        medidasModel.buscarKpi1(ano),
        medidasModel.buscarMapas(ano),
        medidasModel.buscarClasses(ano)
    ]).then(function (resultados) {
        var resKpi1 = resultados[0];
        var resMapas = resultados[1];
        var resClasses = resultados[2];

        // Montando o objeto no formato que o dashboard espera
        var dadosDestaque = {
            kpi1: {
                nome: resKpi1.length > 0 ? resKpi1[0].nome : "--",
                acs: resKpi1.length > 0 ? resKpi1[0].acs : "--",
                img: resKpi1.length > 0 ? resKpi1[0].img : ""
            },
            kpi2: [],
            mapas: {
                labels: [],
                atk: [],
                def: []
            },
            classes: {
                agentes: [],
                classes: [],
                wrs: []
            }
        };

        // Formatação dos Mapas e KPI 2
        if (resMapas.length > 0) {
            var mapaMaisDefensivo = resMapas[0];
            var mapaMaisOfensivo = resMapas[0];

            for (var i = 0; i < resMapas.length; i++) {
                var m = resMapas[i];
                dadosDestaque.mapas.labels.push(m.nome);
                dadosDestaque.mapas.atk.push(m.atk);
                dadosDestaque.mapas.def.push(m.def);

                // Lógica simples para encontrar os extremos
                if (m.def > mapaMaisDefensivo.def) mapaMaisDefensivo = m;
                if (m.atk > mapaMaisOfensivo.atk) mapaMaisOfensivo = m;
            }

            dadosDestaque.kpi2.push({
                label: 'Mapa mais defensivo',
                mapa: mapaMaisDefensivo.nome ? mapaMaisDefensivo.nome.toUpperCase() : "--",
                atk: mapaMaisDefensivo.atk ? mapaMaisDefensivo.atk + '%' : "--",
                def: mapaMaisDefensivo.def ? mapaMaisDefensivo.def + '%' : "--"
            });

            dadosDestaque.kpi2.push({
                label: 'Mapa mais ofensivo',
                mapa: mapaMaisOfensivo.nome ? mapaMaisOfensivo.nome.toUpperCase() : "--",
                atk: mapaMaisOfensivo.atk ? mapaMaisOfensivo.atk + '%' : "--",
                def: mapaMaisOfensivo.def ? mapaMaisOfensivo.def + '%' : "--"
            });
        }

        // Formatação das Classes/Agentes
        for (var j = 0; j < resClasses.length; j++) {
            var c = resClasses[j];
            dadosDestaque.classes.agentes.push(c.agente);
            dadosDestaque.classes.classes.push(c.classe);
            dadosDestaque.classes.wrs.push(c.wr);
        }

        res.status(200).json(dadosDestaque);

    }).catch(function (erro) {
        console.error("Erro ao buscar os dados do dashboard: ", erro);
        res.status(500).json({ mensagem: "Erro interno ao buscar os dados", detalhes: erro.sqlMessage || erro.message || erro });
    });
}

function buscarDadosAgente(req, res) {
    var agente = req.params.agente;
    var ano = req.params.ano;

    if (!agente || !ano) {
        res.status(400).send("Agente ou Ano não especificado!");
        return;
    }

    Promise.all([
        medidasModel.buscarDadosAgente(agente, ano),
        medidasModel.buscarHistoricoAgente(agente)
    ]).then(function (resultados) {
        var resDados = resultados[0] && resultados[0][0]; // Objeto único
        var resHist = resultados[1] && resultados[1][0]; // Objeto único

        // Mapeamento dos anos de lançamento dos agentes para evitar exibir dados de antes de existirem
        var anoLancamentoAgente = {
            "Sage": 2021, "Phoenix": 2021, "Jett": 2021, "Omen": 2021, "Brimstone": 2021, 
            "Sova": 2021, "Breach": 2021, "Cypher": 2021, "Raze": 2021, "Viper": 2021, 
            "Reyna": 2021, "Killjoy": 2021, "Skye": 2021, "Yoru": 2021, "Astra": 2021, 
            "Chamber": 2021, "Neon": 2022, "Fade": 2022, "Harbor": 2022, "Gekko": 2023, 
            "Deadlock": 2023, "Iso": 2023, "Clove": 2024, "Vyse": 2024, "Miks": 2025, 
            "Tejo": 2025, "Veto": 2025, "Waylay": 2025
        };

        var lancamento = anoLancamentoAgente[agente] || 2021;
        var anoInt = parseInt(ano);

        // --- KPIS ---
        var winRateVal, pickRateVal, mapaVal, acsVal;

        if (anoInt < lancamento || !resDados || resDados.win_rate === null || resDados.win_rate === undefined) {
            winRateVal = "--";
            pickRateVal = "--";
            mapaVal = "--";
            acsVal = "--";
        } else {
            winRateVal = resDados.win_rate + "%";
            pickRateVal = resDados.pick_rate + "%";
            mapaVal = resDados.mapa_mais_jogado || "--";
            acsVal = resDados.acs !== null ? resDados.acs : "--";
        }

        // --- HISTORICO ---
        var histYears = ['2021', '2022', '2023', '2024', '2025', '2026'];
        var histWR = [];
        var histPR = [];

        for (var y = 0; y < histYears.length; y++) {
            var yearStr = histYears[y];
            var yearInt = parseInt(yearStr);
            var wrKey = "wr_" + yearStr;
            var prKey = "pr_" + yearStr;

            if (yearInt < lancamento) {
                histWR.push(null);
                histPR.push(null);
            } else {
                // Tenta buscar o valor real correspondente a este ano
                if (resHist && resHist[wrKey] !== null && resHist[wrKey] !== undefined) {
                    histWR.push(resHist[wrKey]);
                    histPR.push(resHist[prKey]);
                } else {
                    histWR.push(null);
                    histPR.push(null);
                }
            }
        }

        var responseData = {
            kpis: {
                win_rate: winRateVal,
                pick_rate: pickRateVal,
                mapa_mais_jogado: mapaVal,
                acs: acsVal
            },
            historico: {
                labels: histYears,
                win_rate: histWR,
                pick_rate: histPR
            }
        };

        res.status(200).json(responseData);

    }).catch(function (erro) {
        console.error("Erro ao buscar dados do agente: ", erro);
        res.status(500).json({ mensagem: "Erro interno ao buscar dados do agente", detalhes: erro.sqlMessage || erro.message || erro });
    });
}

function buscarDadosMapa(req, res) {
    var mapa = req.params.mapa;
    var ano = req.params.ano;

    if (!mapa || !ano) {
        res.status(400).send("Mapa ou Ano não especificado!");
        return;
    }

    Promise.all([
        medidasModel.buscarDadosMapa(mapa, ano),
        medidasModel.buscarComposicaoMapa(mapa, ano)
    ]).then(function (resultados) {
        var resDados = resultados[0] && resultados[0][0];
        var resComp = resultados[1];

        var funcoes = ['Duelista', 'Iniciador', 'Controlador', 'Sentinela', 'Flex'];
        var funcoesData = [];

        for (var i = 0; i < funcoes.length; i++) {
            var f = funcoes[i].toLowerCase();
            var funcaoLower = f;
            funcoesData.push({
                funcao: funcoes[i],
                wr: {
                    agente: resDados['agente_wr_' + funcaoLower] || '--',
                    valor: resDados['wr_' + funcaoLower] || 0
                },
                pr: {
                    agente: resDados['agente_pr_' + funcaoLower] || '--',
                    valor: resDados['pr_' + funcaoLower] || 0
                }
            });
        }

        var composicao = [];
        var clasesUsadas = {};
        for (var j = 0; j < resComp.length; j++) {
            var comp = resComp[j];
            if (!clasesUsadas[comp.classe]) {
                clasesUsadas[comp.classe] = true;
                composicao.push({
                    funcao: comp.classe,
                    agente: comp.nome || comp.agente,
                    img: comp.img || ''
                });
            }
        }

        var responseData = {
            ban_rate: resDados ? resDados.ban_rate : 0,
            funcoes: funcoesData,
            composicao: composicao
        };

        res.status(200).json(responseData);

    }).catch(function (erro) {
        console.error("Erro ao buscar dados do mapa: ", erro);
        res.status(500).json({ mensagem: "Erro interno ao buscar dados do mapa", detalhes: erro.sqlMessage || erro.message || erro });
    });
}

module.exports = {
    buscarDadosGerais,
    buscarDadosAgente,
    buscarDadosMapa
};
