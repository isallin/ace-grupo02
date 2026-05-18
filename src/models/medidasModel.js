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

function buscarDadosAgente(agente, ano) {
    var instrucao = `
        SELECT 
            (SELECT ROUND(AVG(ec.win_rate), 1) FROM estatistica_composicao ec
             JOIN composicao_agente ca ON ec.composicaoFk = ca.composicaoFk
             JOIN agente a ON ca.agenteFk = a.idagente
             JOIN composicao c ON ec.composicaoFk = c.idcomposicao
             JOIN partida p ON c.partidaFk = p.idpartida
             WHERE a.nome = '${agente}' AND p.campeonato LIKE '%${ano}%') AS win_rate,

            (SELECT ROUND(AVG(ec.pick_rate), 1) FROM estatistica_composicao ec
             JOIN composicao_agente ca ON ec.composicaoFk = ca.composicaoFk
             JOIN agente a ON ca.agenteFk = a.idagente
             JOIN composicao c ON ec.composicaoFk = c.idcomposicao
             JOIN partida p ON c.partidaFk = p.idpartida
             WHERE a.nome = '${agente}' AND p.campeonato LIKE '%${ano}%') AS pick_rate,

            (SELECT m.nome FROM desempenho d
             JOIN agente a ON d.agenteFk = a.idagente
             JOIN partida p ON d.partidaFk = p.idpartida
             JOIN mapa m ON p.mapaFk = m.idmapa
             WHERE a.nome = '${agente}' AND p.campeonato LIKE '%${ano}%'
             GROUP BY m.idmapa
             ORDER BY COUNT(d.id) DESC
             LIMIT 1) AS mapa_mais_jogado,

            (SELECT ROUND(AVG(d.kills)*10 + AVG(d.assists)*5, 0) FROM desempenho d
             JOIN agente a ON d.agenteFk = a.idagente
             JOIN partida p ON d.partidaFk = p.idpartida
             WHERE a.nome = '${agente}' AND p.campeonato LIKE '%${ano}%') AS acs;
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function buscarHistoricoAgente(agente) {
    var instrucao = `
        SELECT 
            ROUND(AVG(CASE WHEN p.campeonato LIKE '%2021%' THEN ec.win_rate END), 1) AS wr_2021,
            ROUND(AVG(CASE WHEN p.campeonato LIKE '%2021%' THEN ec.pick_rate END), 1) AS pr_2021,
            ROUND(AVG(CASE WHEN p.campeonato LIKE '%2022%' THEN ec.win_rate END), 1) AS wr_2022,
            ROUND(AVG(CASE WHEN p.campeonato LIKE '%2022%' THEN ec.pick_rate END), 1) AS pr_2022,
            ROUND(AVG(CASE WHEN p.campeonato LIKE '%2023%' THEN ec.win_rate END), 1) AS wr_2023,
            ROUND(AVG(CASE WHEN p.campeonato LIKE '%2023%' THEN ec.pick_rate END), 1) AS pr_2023,
            ROUND(AVG(CASE WHEN p.campeonato LIKE '%2024%' THEN ec.win_rate END), 1) AS wr_2024,
            ROUND(AVG(CASE WHEN p.campeonato LIKE '%2024%' THEN ec.pick_rate END), 1) AS pr_2024,
            ROUND(AVG(CASE WHEN p.campeonato LIKE '%2025%' THEN ec.win_rate END), 1) AS wr_2025,
            ROUND(AVG(CASE WHEN p.campeonato LIKE '%2025%' THEN ec.pick_rate END), 1) AS pr_2025,
            ROUND(AVG(CASE WHEN p.campeonato LIKE '%2026%' THEN ec.win_rate END), 1) AS wr_2026,
            ROUND(AVG(CASE WHEN p.campeonato LIKE '%2026%' THEN ec.pick_rate END), 1) AS pr_2026
        FROM estatistica_composicao ec
        JOIN composicao_agente ca ON ec.composicaoFk = ca.composicaoFk
        JOIN agente a ON ca.agenteFk = a.idagente
        JOIN composicao c ON ec.composicaoFk = c.idcomposicao
        JOIN partida p ON c.partidaFk = p.idpartida
        WHERE a.nome = '${agente}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    buscarKpi1,
    buscarMapas,
    buscarClasses,
    buscarDadosAgente,
    buscarHistoricoAgente
};
