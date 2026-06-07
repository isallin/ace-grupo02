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
        ROUND(SUM(kills) / SUM(deaths), 2) AS kdr,
        ROUND((SUM(kills) + SUM(assists)) / SUM(deaths), 2) AS kda,
        ROUND(AVG(acs), 0) AS media_acs,
        ROUND(SUM(CASE WHEN score > scoreAdv THEN 1 ELSE 0 END) / COUNT(idpartidausuario),2) AS winrate,
        COUNT(idpartidausuario) AS total_partidas
    FROM partidas_usuario 
    WHERE usuarioFk = ${idusuario};
    `;

    console.log("Executando a instrução SQL (Concatenação direta)");
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar,
    obterKpis
};