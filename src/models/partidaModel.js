var database = require("../database/config")

function cadastrar(id, mapa, agente, data, score, acs, abates, mortes, assists) {
    var instrucaoSql = `
        INSERT INTO usuarios (nickname, email, senha, funcao, idorganizacao) 
        SELECT '${usuario}', '${email}', '${senha}', '${funcao}', idorganizacao 
        FROM organizacao 
        WHERE codAtivacao = '${codigo}';
    `;

    console.log("Executando a instrução SQL (Concatenação direta)");
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar
};