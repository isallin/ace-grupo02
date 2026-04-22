const { Post, Comment } = require('../models/blogModel');

exports.listarPosts = async (req, res) => {
    try {
        const results = await Post.buscarTodos();
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: "Erro ao listar posts.", erro: err });
    }
};

exports.criarPost = async (req, res) => {
    try {
        const novoPost = {
            titulo: req.body.titulo,
            autor_nome: req.body.autor,          // nickname vindo do sessionStorage
            agentes: req.body.agentes,
            banner: `Loading_Screen_${req.body.mapa}.webp`,
            usuario_id: req.body.usuario_id      // idusuario vindo do sessionStorage
        };
        const result = await Post.criar(novoPost);
        res.json({ message: "Post criado!", id: result.insertId });
    } catch (err) {
        res.status(500).json({ message: "Erro ao criar post.", erro: err });
    }
};

exports.atualizarPost = async (req, res) => {
    try {
        const idPost = req.params.id;
        const posts = await Post.buscarPorId(idPost);

        if (!posts || posts.length === 0)
            return res.status(404).json({ message: "Post não encontrado" });

        await Post.atualizar(idPost, {
            titulo: req.body.titulo,
            agentes: req.body.agentes,
            banner: `Loading_Screen_${req.body.mapa}.webp`
        });
        res.json({ message: "Post atualizado!" });
    } catch (err) {
        res.status(500).json({ message: "Erro ao atualizar post.", erro: err });
    }
};

exports.deletarPost = async (req, res) => {
    try {
        const idPost = req.params.id;
        const posts = await Post.buscarPorId(idPost);

        if (!posts || posts.length === 0)
            return res.status(404).json({ message: "Post não encontrado" });

        await Post.deletar(idPost);
        res.json({ message: "Post excluído com sucesso!" });
    } catch (err) {
        res.status(500).json({ message: "Erro ao deletar post.", erro: err });
    }
};

exports.listarComentarios = async (req, res) => {
    try {
        const results = await Comment.listarPorPost(req.params.postId);
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: "Erro ao listar comentários.", erro: err });
    }
};

exports.adicionarComentario = async (req, res) => {
    try {
        const novoComentario = {
            post_id: req.body.post_id,
            usuario_id: req.body.usuario_id,  // idusuario vindo do sessionStorage
            texto: req.body.texto
        };
        const result = await Comment.criar(novoComentario);
        res.json({ message: "Comentário enviado!", id: result.insertId });
    } catch (err) {
        res.status(500).json({ message: "Erro ao adicionar comentário.", erro: err });
    }
};

exports.excluirComentario = async (req, res) => {
    try {
        const idComentario = req.params.id;
        const comentarios = await Comment.buscarPorId(idComentario);

        if (!comentarios || comentarios.length === 0)
            return res.status(404).json({ message: "Comentário não encontrado" });

        await Comment.deletar(idComentario);
        res.json({ message: "Comentário removido." });
    } catch (err) {
        res.status(500).json({ message: "Erro ao excluir comentário.", erro: err });
    }
};

exports.editarComentario = async (req, res) => {
    try {
        const idComentario = req.params.id;
        const textoSafe = req.body.texto.replace(/'/g, "\\'");
        await Comment.atualizar(idComentario, textoSafe);
        res.json({ message: "Comentário atualizado." });
    } catch (err) {
        res.status(500).json({ message: "Erro ao editar comentário.", erro: err });
    }
};