var express = require("express");
var router = express.Router();

var partidaController = require("../controllers/partidaController");

router.post("/cadastrar", function (req, res) {
    partidaController.cadastrar(req, res);
})

router.get("/obterKpis/:idusuario", function (req, res) {
    partidaController.obterKpis(req, res);
});

router.get("/obterStatChart/:idusuario", function (req, res) {
    partidaController.obterStatChart(req, res);
});

router.get("/obterTopAgent/:idusuario", function (req, res) {
    partidaController.obterTopAgent(req, res);
});

router.get("/obterTopMapa/:idusuario", function (req, res) {
    partidaController.obterTopMapa(req, res);
});

router.get("/obterPartidasSelect/:idusuario", function (req, res) {
    partidaController.obterPartidasSelect(req, res);
});

router.get("/obterInfosPartida/:idPartida", function (req, res) {
    partidaController.obterInfosPartida(req, res);
});

module.exports = router;