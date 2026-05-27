const db = require('../database/config');

const Post = {
    buscarTodos: () => {
        return db.executar("SELECT * FROM posts ORDER BY id DESC");
    },

    buscarPorId: (id) => {
        return db.executar(`SELECT * FROM posts WHERE id = ${id}`);
    },

    criar: async (dados) => {
        const { titulo, autor_nome, agentes, banner, usuario_id } = dados;
        const agentesJson = JSON.stringify(agentes).replace(/'/g, "\\'");

        const result = await db.executar(`
            INSERT INTO posts (titulo, autor_nome, agentes, banner, usuario_id)
            VALUES ('${titulo}', '${autor_nome}', '${agentesJson}', '${banner}', ${usuario_id})
        `);

        const mensagem = `Novo post criado por *${autor_nome}*: "${titulo}"`.replace(/'/g, "\\'");
        // ----------------------------------------------
        // --------------------SLACK---------------------
        // ----------------------------------------------
        await db.executar(`
            INSERT INTO slack_integracao
                (canal, webhook_url, tipo_evento, mensagem, status_envio, usuariosfk, postfk)
            VALUES (
                '#publicações',
                '',
                'NOVO_POST',
                '${mensagem}',
                'PENDENTE',
                ${usuario_id},
                ${result.insertId}
            )
        `);

        return result;
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

    criar: async (dados) => {
        const { post_id, usuario_id, texto } = dados;
        const textoSafe = texto.replace(/'/g, "\\'");

        const usuarios = await db.executar(
            `SELECT nickname FROM usuarios WHERE idusuario = ${usuario_id}`
        );
        const nickname = usuarios.length > 0 ? usuarios[0].nickname : 'Usuário';

        const result = await db.executar(`
            INSERT INTO comentarios (post_id, usuario_id, texto)
            VALUES (${post_id}, ${usuario_id}, '${textoSafe}')
        `);

        const textoPreview = texto.substring(0, 60).replace(/'/g, "\\'");
        const mensagem = `Novo comentário de *${nickname}* no post #${post_id}: "${textoPreview}"`.replace(/'/g, "\\'");
        // ----------------------------------------------
        // --------------------SLACK---------------------
        // ----------------------------------------------
        await db.executar(`
            INSERT INTO slack_integracao
                (canal, webhook_url, tipo_evento, mensagem, status_envio, usuariosfk, postfk)
            VALUES (
                '#comentários',
                '',
                'NOVO_COMENTARIO',
                '${mensagem}',
                'PENDENTE',
                ${usuario_id},
                ${post_id}
            )
        `);

        return result;
    },

    deletar: (id) => {
        return db.executar(`DELETE FROM comentarios WHERE id = ${id}`);
    },

    atualizar: (id, texto) => {
        return db.executar(`UPDATE comentarios SET texto = '${texto}' WHERE id = ${id}`);
    }
};

module.exports = { Post, Comment };