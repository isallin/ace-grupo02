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
        console.log("Erro ao buscar os dados do dashboard: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
    buscarDadosGerais
};
