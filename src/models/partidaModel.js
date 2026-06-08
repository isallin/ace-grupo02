var database = require("../database/config")

function cadastrar(id, mapa, agente, data, score, scoreAdv, acs, abates, mortes, assists) {
    var instrucaoSql = `
    INSERT INTO partidas_usuario (score, scoreAdv, acs, kills, deaths, assists, data_partida, usuarioFk, mapaFk, agenteFk) 
        VALUES (
            ${score},
            ${scoreAdv},
            ${acs}, 
            ${abates}, 
            ${mortes}, 
            ${assists}, 
            '${data}', 
            ${id}, 
            (SELECT idmapa FROM mapa WHERE nome = '${mapa}'), 
            (SELECT idagente FROM agente WHERE nome = '${agente}')
        );
    `;

    console.log("Executando a instrução SQL (Concatenação direta)");
    return database.executar(instrucaoSql);
}

function obterKpis(idusuario) {
    var instrucaoSql = `
    SELECT 
        ROUND(SUM(kills) / NULLIF(SUM(deaths), 0), 2) AS kdr,
        ROUND((SUM(kills) + SUM(assists)) / NULLIF(SUM(deaths), 0), 2) AS kda,
        ROUND(AVG(acs), 0) AS media_acs,
        CONCAT(ROUND(AVG(CASE WHEN score > scoreAdv THEN 1 ELSE 0 END) * 100, 0), '%') AS winrate,
        COUNT(idpartidausuario) AS total_partidas
    FROM partidas_usuario 
    WHERE usuarioFk = ${idusuario};
    `;

    console.log("Executando a instrução SQL (Concatenação direta)");
    return database.executar(instrucaoSql);
}

function obterStatChart(idusuario) {
    var instrucaoSql = `
    SELECT 
        DATE_FORMAT(data_partida, '%d/%b') AS data_partida,
        kills AS abates,
        deaths AS mortes,
        assists AS assistencias
    FROM partidas_usuario
    WHERE usuarioFk = ${idusuario}
    ORDER BY partidas_usuario.data_partida ASC
    LIMIT 15;
    `;

    console.log("Executando a instrução SQL (Concatenação direta)");
    return database.executar(instrucaoSql);
}

function obterTopAgent(idusuario) {
    var instrucaoSql = `
    SELECT 
        a.nome AS agente,
        ROUND(SUM(CASE WHEN p.score > p.scoreAdv THEN 1 ELSE 0 END) / COUNT(p.idpartidausuario) * 100, 0) AS winrate
    FROM partidas_usuario p
    JOIN agente a ON p.agenteFk = a.idagente
    WHERE p.usuarioFk = ${idusuario}
    GROUP BY a.idagente, a.nome
    HAVING winrate > 0
    ORDER BY winrate DESC, COUNT(p.idpartidausuario) DESC
    LIMIT 3;
    `;

    console.log("Executando a instrução SQL (Concatenação direta)");
    return database.executar(instrucaoSql);
}

function obterTopMapa(idusuario) {
    var instrucaoSql = `
    SELECT 
        m.nome AS mapa,
        ROUND(SUM(CASE WHEN p.score > p.scoreAdv THEN 1 ELSE 0 END) / COUNT(p.idpartidausuario) * 100, 0) AS winrate
    FROM partidas_usuario p
    JOIN mapa m ON p.mapaFk = m.idmapa
    WHERE p.usuarioFk = ${idusuario}
    GROUP BY m.idmapa, m.nome
    HAVING winrate > 0
    ORDER BY winrate DESC, COUNT(p.idpartidausuario) DESC
    LIMIT 3;
    `;

    console.log("Executando a instrução SQL (Concatenação direta)");
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar,
    obterKpis,
    obterStatChart,
    obterTopAgent,
    obterTopMapa
};