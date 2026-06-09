var express = require("express");
var router = express.Router();

var medidasController = require("../controllers/medidasController");

router.get("/geral/:ano", function (req, res) {
    medidasController.buscarDadosGerais(req, res);
});

router.get("/agente/:agente/:ano", function (req, res) {
    medidasController.buscarDadosAgente(req, res);
});

router.get("/mapa/:mapa/:ano", function (req, res) {
    medidasController.buscarDadosMapa(req, res);
});

module.exports = router;
