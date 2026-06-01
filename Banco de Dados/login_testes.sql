use projetoace;
-- LOGIN DE ADMINISTRADOR
INSERT INTO
    usuarios (nickname, email, senha, funcao)
VALUES (
        'Administrador',
        'ace@teste',
        '123',
        'admin'
    );

-- ORGANIZAÇÕES
INSERT INTO organizacao (nome, contato, codAtivacao) VALUES
('LOUD', 'contato@loud.gg', 'LOUD2026VAL'),
('Sentinels', 'info@sentinels.gg', 'SEN2026WIN'),
('Fnatic', 'support@fnatic.com', 'FNC2026VLR');

-- USUÁRIOS
INSERT INTO usuarios (nome_completo, nickname, email, senha, funcao, organizacaofk) VALUES
-- PLAYERS
('Erick Santos', 'aspas', 'aspas@loud.gg', 'loud123', 'player', 1),
('Tyson Ngo', 'TenZ', 'tenz@sentinels.gg', 'sen2026', 'player', 2),
('Jake Howlett', 'Boaster', 'boaster@fnatic.com', 'fnc789', 'player', 3),
-- COACH
('Matias Delipetro', 'Saadhak', 'saadhak@loud.gg', 'coach99', 'coach', 1);

INSERT INTO mapa (nome, link_image, postfk) VALUES
('Abyss', NULL, NULL),
('Ascent', NULL, NULL),
('Bind', NULL, NULL),
('Breeze', NULL, NULL),
('Fracture', NULL, NULL),
('Icebox', NULL, NULL),
('Lotus', NULL, NULL),
('Pearl', NULL, NULL),
('Split', NULL, NULL),
('Sunset', NULL, NULL);