var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
})

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

router.get("/listarUsuarios", function (req, res) {
    usuarioController.listarUsuarios(req, res);
});

router.get("/listarEmail", function (req, res) {
    usuarioController.listarEmail(req, res);
});

router.get("/listarCodigos", function (req, res) {
    usuarioController.listarCodigos(req, res);
});

module.exports = router;