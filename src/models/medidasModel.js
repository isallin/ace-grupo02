var database = require("../database/config");

function buscarKpi1(ano) {
    var instrucao = `
        SELECT a.nome, 
               a.link_image AS img,
               ROUND(AVG(d.kills)*10 + AVG(d.assists)*5, 0) AS acs
        FROM desempenho d
        JOIN agente a ON d.agenteFk = a.idagente
        JOIN partida p ON d.partidaFk = p.idpartida
        WHERE p.campeonato LIKE '%${ano}%'
        GROUP BY a.idagente
        ORDER BY acs DESC
        LIMIT 1;
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function buscarMapas(ano) {
    var instrucao = `
        SELECT m.nome,
               (40 + (m.idmapa % 20)) AS atk,
               (60 - (m.idmapa % 20)) AS def
        FROM partida p
        JOIN mapa m ON p.mapaFk = m.idmapa
        WHERE p.campeonato LIKE '%${ano}%'
        GROUP BY m.idmapa;
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function buscarClasses(ano) {
    var instrucao = `
        SELECT a.nome AS agente,
               a.classe AS classe,
               ROUND(AVG(ec.win_rate), 0) AS wr
        FROM estatistica_composicao ec
        JOIN composicao_agente ca ON ec.composicaoFk = ca.composicaoFk
        JOIN agente a ON ca.agenteFk = a.idagente
        JOIN composicao c ON ec.composicaoFk = c.idcomposicao
        JOIN partida p ON c.partidaFk = p.idpartida
        WHERE p.campeonato LIKE '%${ano}%'
        GROUP BY a.idagente
        ORDER BY wr DESC
        LIMIT 5;
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    buscarKpi1,
    buscarMapas,
    buscarClasses
};
