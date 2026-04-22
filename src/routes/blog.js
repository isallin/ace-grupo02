const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

router.get('/posts', blogController.listarPosts);
router.post('/posts', blogController.criarPost);
router.put('/posts/:id', blogController.atualizarPost);
router.delete('/posts/:id', blogController.deletarPost);

router.get('/comments/:postId', blogController.listarComentarios);
router.post('/comments', blogController.adicionarComentario);
router.delete('/comments/:id', blogController.excluirComentario);
router.put('/comments/:id', blogController.editarComentario);

module.exports = router;
