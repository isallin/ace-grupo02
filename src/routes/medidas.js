var express = require("express");
var router = express.Router();

var medidasController = require("../controllers/medidasController");

router.get("/geral/:ano", function (req, res) {
    medidasController.buscarDadosGerais(req, res);
});

router.get("/agente/:agente/:ano", function (req, res) {
    medidasController.buscarDadosAgente(req, res);
});

module.exports = router;
