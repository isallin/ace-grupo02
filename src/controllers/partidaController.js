var partidaModel = require("../models/partidaModel");

function cadastrar(req, res) {
    // Captura as variáveis enviadas pelo corpo da requisição (body)
    var id = req.body.userServer;
    var mapa = req.body.mapaServer;
    var agente = req.body.agenteServer;
    var data = req.body.dataServer;
    var score = req.body.scoreServer;
    var acs = req.body.acsServer;
    var abates = req.body.abatesServer;
    var mortes = req.body.mortesServer;
    var assists = req.body.assistsServer;

    if (id == undefined) {
        res.status(400).send("O id está undefined!");
    } else if (mapa == undefined) {
        res.status(400).send("O mapa está undefined!");
    } else if (agente == undefined) {
        res.status(400).send("O agente está undefined!");
    } else if (data == undefined) {
        res.status(400).send("A data está undefined!");
    } else if (score == undefined) {
        res.status(400).send("O score está undefined!");
    } else if (acs == undefined) {
        res.status(400).send("O ACS está undefined!");
    } else if (abates == undefined) {
        res.status(400).send("Os abates estão undefined!");
    } else if (mortes == undefined) {
        res.status(400).send("As mortes estão undefined!");
    } else if (assists == undefined) {
        res.status(400).send("As assistências estão undefined!");
    } else {
        // Passa todas as variáveis para a model executar o INSERT
        partidaModel.cadastrar(id, mapa, agente, data, score, acs, abates, mortes, assists)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro da partida! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

module.exports = {
    cadastrar
}