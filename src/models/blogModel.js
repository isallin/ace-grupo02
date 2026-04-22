const db = require('../database/config');

const Post = {
    buscarTodos: () => {
        return db.executar("SELECT * FROM posts ORDER BY id DESC");
    },

    buscarPorId: (id) => {
        return db.executar(`SELECT * FROM posts WHERE id = ${id}`);
    },

    criar: (dados) => {
        const { titulo, autor_nome, agentes, banner, usuario_id } = dados;
        const agentesJson = JSON.stringify(agentes).replace(/'/g, "\\'");
        return db.executar(`
            INSERT INTO posts (titulo, autor_nome, agentes, banner, usuario_id)
            VALUES ('${titulo}', '${autor_nome}', '${agentesJson}', '${banner}', ${usuario_id})
        `);
    },

    atualizar: (id, dados) => {
        const { titulo, agentes, banner } = dados;
        const agentesJson = JSON.stringify(agentes).replace(/'/g, "\\'");
        return db.executar(`
            UPDATE posts SET
                titulo = '${titulo}',
                agentes = '${agentesJson}',
                banner = '${banner}'
            WHERE id = ${id}
        `);
    },

    deletar: (id) => {
        return db.executar(`DELETE FROM posts WHERE id = ${id}`);
    }
};

const Comment = {
    listarPorPost: (postId) => {
        return db.executar(`
            SELECT c.*, u.nickname AS autor
            FROM comentarios c
            JOIN usuarios u ON u.idusuario = c.usuario_id
            WHERE c.post_id = ${postId}
        `);
    },

    buscarPorId: (id) => {
        return db.executar(`SELECT * FROM comentarios WHERE id = ${id}`);
    },

    criar: (dados) => {
        const { post_id, usuario_id, texto } = dados;
        const textoSafe = texto.replace(/'/g, "\\'");
        return db.executar(`
            INSERT INTO comentarios (post_id, usuario_id, texto)
            VALUES (${post_id}, ${usuario_id}, '${textoSafe}')
        `);
    },

    deletar: (id) => {
        return db.executar(`DELETE FROM comentarios WHERE id = ${id}`);
    },

    atualizar: (id, texto) => {
    return db.executar(`UPDATE comentarios SET texto = '${texto}' WHERE id = ${id}`);
}
};

module.exports = { Post, Comment };
