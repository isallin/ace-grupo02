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

        // Se o banco de dados retornou vazio para o ano selecionado, carregamos dados mockados de fallback
        if (resKpi1.length === 0) {
            var fallbacksKpi1 = {
                2021: [{ nome: "Jett", img: "../assets/Jett_icon.png", acs: 235 }],
                2022: [{ nome: "Chamber", img: "../assets/Chamber_icon.png", acs: 258 }],
                2023: [{ nome: "Raze", img: "../assets/Raze_icon.png", acs: 241 }],
                2024: [{ nome: "Jett", img: "../assets/Jett_icon.png", acs: 245 }],
                2025: [{ nome: "Neon", img: "../assets/Neon_icon.png", acs: 252 }]
            };
            resKpi1 = fallbacksKpi1[ano] || [{ nome: "Jett", img: "../assets/Jett_icon.png", acs: 230 }];
        }

        if (resMapas.length === 0) {
            var fallbacksMapas = {
                2021: [
                    { nome: "Haven", atk: 48, def: 52 },
                    { nome: "Split", atk: 46, def: 54 },
                    { nome: "Bind", atk: 52, def: 48 },
                    { nome: "Breeze", atk: 54, def: 46 },
                    { nome: "Ascent", atk: 49, def: 51 }
                ],
                2022: [
                    { nome: "Haven", atk: 47, def: 53 },
                    { nome: "Pearl", atk: 51, def: 49 },
                    { nome: "Split", atk: 45, def: 55 },
                    { nome: "Bind", atk: 53, def: 47 },
                    { nome: "Fracture", atk: 52, def: 48 }
                ],
                2023: [
                    { nome: "Lotus", atk: 53, def: 47 },
                    { nome: "Pearl", atk: 50, def: 50 },
                    { nome: "Split", atk: 46, def: 54 },
                    { nome: "Bind", atk: 51, def: 49 },
                    { nome: "Haven", atk: 48, def: 52 }
                ],
                2024: [
                    { nome: "Sunset", atk: 51, def: 49 },
                    { nome: "Lotus", atk: 52, def: 48 },
                    { nome: "Split", atk: 47, def: 53 },
                    { nome: "Bind", atk: 50, def: 50 },
                    { nome: "Icebox", atk: 48, def: 52 }
                ],
                2025: [
                    { nome: "Abyss", atk: 52, def: 48 },
                    { nome: "Sunset", atk: 50, def: 50 },
                    { nome: "Lotus", atk: 53, def: 47 },
                    { nome: "Bind", atk: 49, def: 51 },
                    { nome: "Haven", atk: 47, def: 53 }
                ]
            };
            resMapas = fallbacksMapas[ano] || [
                { nome: "Haven", atk: 49, def: 51 },
                { nome: "Split", atk: 47, def: 53 },
                { nome: "Bind", atk: 51, def: 49 }
            ];
        }

        if (resClasses.length === 0) {
            var fallbacksClasses = {
                2021: [
                    { agente: "Jett", classe: "Duelista", wr: 58 },
                    { agente: "Viper", classe: "Controlador", wr: 56 },
                    { agente: "Sova", classe: "Iniciador", wr: 54 },
                    { agente: "Cypher", classe: "Sentinela", wr: 53 },
                    { agente: "Sage", classe: "Sentinela", wr: 51 }
                ],
                2022: [
                    { agente: "Chamber", classe: "Sentinela", wr: 62 },
                    { agente: "Fade", classe: "Iniciador", wr: 58 },
                    { agente: "Viper", classe: "Controlador", wr: 57 },
                    { agente: "Jett", classe: "Duelista", wr: 55 },
                    { agente: "Raze", classe: "Duelista", wr: 53 }
                ],
                2023: [
                    { agente: "Raze", classe: "Duelista", wr: 59 },
                    { agente: "Viper", classe: "Controlador", wr: 57 },
                    { agente: "Skye", classe: "Iniciador", wr: 56 },
                    { agente: "Killjoy", classe: "Sentinela", wr: 55 },
                    { agente: "Jett", classe: "Duelista", wr: 54 }
                ],
                2024: [
                    { agente: "Jett", classe: "Duelista", wr: 58 },
                    { agente: "Omen", classe: "Controlador", wr: 56 },
                    { agente: "Gekko", classe: "Iniciador", wr: 55 },
                    { agente: "Cypher", classe: "Sentinela", wr: 54 },
                    { agente: "Viper", classe: "Controlador", wr: 53 }
                ],
                2025: [
                    { agente: "Neon", classe: "Duelista", wr: 61 },
                    { agente: "Gekko", classe: "Iniciador", wr: 58 },
                    { agente: "Omen", classe: "Controlador", wr: 56 },
                    { agente: "Cypher", classe: "Sentinela", wr: 55 },
                    { agente: "Sova", classe: "Iniciador", wr: 53 }
                ]
            };
            resClasses = fallbacksClasses[ano] || [
                { agente: "Jett", classe: "Duelista", wr: 57 },
                { agente: "Omen", classe: "Controlador", wr: 55 },
                { agente: "Sova", classe: "Iniciador", wr: 53 }
            ];
        }

        // Montando o objeto no formato que o dashboard espera
        var dadosDestaque = {
            kpi1: {
                nome: resKpi1.length > 0 ? resKpi1[0].nome : "N/D",
                acs: resKpi1.length > 0 ? resKpi1[0].acs : 0,
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
                mapa: mapaMaisDefensivo.nome.toUpperCase(),
                atk: mapaMaisDefensivo.atk + '%',
                def: mapaMaisDefensivo.def + '%'
            });

            dadosDestaque.kpi2.push({
                label: 'Mapa mais ofensivo',
                mapa: mapaMaisOfensivo.nome.toUpperCase(),
                atk: mapaMaisOfensivo.atk + '%',
                def: mapaMaisOfensivo.def + '%'
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

        // Gerar hash determinístico para fallbacks consistentes por agente
        var hash = 0;
        for (var i = 0; i < agente.length; i++) {
            hash += agente.charCodeAt(i);
        }

        // --- KPIS ---
        var winRateVal = (resDados && resDados.win_rate !== null) ? resDados.win_rate : (48 + (hash % 12));
        var pickRateVal = (resDados && resDados.pick_rate !== null) ? resDados.pick_rate : (1.2 + (hash % 18) / 10);
        var mapaVal = (resDados && resDados.mapa_mais_jogado) ? resDados.mapa_mais_jogado : ["Haven", "Pearl", "Abyss", "Split", "Ascent", "Breeze", "Bind"][hash % 7];
        var acsVal = (resDados && resDados.acs !== null) ? resDados.acs : (190 + (hash % 65));

        // --- HISTORICO ---
        var histYears = ['2021', '2022', '2023', '2024', '2025', '2026'];
        var histWR = [];
        var histPR = [];

        for (var y = 0; y < histYears.length; y++) {
            var yearStr = histYears[y];
            var wrKey = "wr_" + yearStr;
            var prKey = "pr_" + yearStr;

            // Se for 2026, tenta usar do banco de dados se tiver dados reais
            if (yearStr === "2026" && resHist && resHist[wrKey] !== null && resHist[wrKey] !== undefined) {
                histWR.push(resHist[wrKey]);
                histPR.push(resHist[prKey]);
            } else {
                // Fallback determinístico
                var baseWR = 46 + (hash % 10);
                var basePR = 1.0 + (hash % 45) / 10;
                
                // Adiciona um ruído suave ao longo dos anos
                var yearOffset = y - 3; // de -3 a 2
                var simulatedWR = Math.min(65, Math.max(35, baseWR + (yearOffset * 0.5) + (Math.sin(hash + y) * 1.5)));
                var simulatedPR = Math.min(15, Math.max(0.5, basePR - (yearOffset * 0.2) + (Math.cos(hash * y) * 0.4)));

                histWR.push(Number(simulatedWR.toFixed(1)));
                histPR.push(Number(simulatedPR.toFixed(1)));
            }
        }

        var responseData = {
            kpis: {
                win_rate: winRateVal + "%",
                pick_rate: pickRateVal + "%",
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

module.exports = {
    buscarDadosGerais,
    buscarDadosAgente
};
