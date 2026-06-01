var express = require("express");
var router = express.Router();

var partidaController = require("../controllers/partidaController");

router.post("/cadastrar", function (req, res) {
    partidaController.cadastrar(req, res);
})

module.exports = router;