var database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
        SELECT idusuarios, nickname, email FROM usuarios WHERE email = '${email}' AND senha = '${senha}';`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(usuario, email, senha, funcao, codigo) {
    var instrucaoSql = `
        INSERT INTO usuarios (nickname, email, senha, funcao, idorganizacao) 
        SELECT '${usuario}', '${email}', '${senha}', '${funcao}', idorganizacao 
        FROM organizacao 
        WHERE codAtivacao = '${codigo}';
    `;

    console.log("Executando a instrução SQL (Concatenação direta)");
    return database.executar(instrucaoSql);
}

function listarUsuarios() {
    var instrucaoSql = `SELECT nickname FROM usuarios;`;
    return database.executar(instrucaoSql);
}

function listarEmail() {
    var instrucaoSql = `SELECT email FROM usuarios;`;
    return database.executar(instrucaoSql);
}

function listarCodigos() {
    var instrucaoSql = `SELECT codAtivacao FROM organizacao;`;
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrar,
    listarUsuarios,
    listarCodigos,
    listarEmail
};