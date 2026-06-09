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

INSERT INTO mapa (nome) VALUES
("Ascent"),("Bind"),("Breeze"),("Fracture"),("Haven"),("Icebox"),
("Lotus"),("Pearl"),("Sunset"),("Abyss");

INSERT INTO agente (nome, classe) VALUES 
('Astra', 'Controlador'),('Breach', 'Iniciador'),('Brimstone', 'Controlador'),('Chamber', 'Sentinela'),('Clove', 'Controlador'),('Cypher', 'Sentinela'),('Deadlock', 'Sentinela'),('Fade', 'Iniciador'),
('Gekko', 'Iniciador'),('Harbor', 'Controlador'),('Iso', 'Duelista'),('Jett', 'Duelista'),('Killjoy', 'Sentinela'),('Miks', 'Controlador'),('Neon', 'Duelista'),
('Omen', 'Controlador'),('Phoenix', 'Duelista'),('Raze', 'Duelista'),('Reyna', 'Duelista'),('Sage', 'Sentinela'),('Skye', 'Iniciador'),
('Sova', 'Iniciador'),('Tejo', 'Iniciador'),('Veto', 'Sentinela'),('Viper', 'Controlador'),('Vyse', 'Sentinela'),('Waylay', 'Duelista'),('Yoru', 'Duelista');

INSERT INTO partidas_usuario 
(score, scoreAdv, acs, kills, deaths, assists, data_partida, usuarioFk, mapaFk, agenteFk) 
VALUES
(13, 9,  245.5, 22, 15, 5,  '2026-06-01', 1, 1, 12), -- Ascent, Jett
(10, 13, 198.0, 14, 18, 4,  '2026-06-02', 1, 2, 16), -- Bind, Omen
(13, 5,  312.0, 26, 8,  8,  '2026-06-03', 1, 5, 22), -- Haven, Sova
(11, 13, 215.3, 18, 19, 3,  '2026-06-04', 1, 9, 19), -- Sunset, Reyna
(13, 11, 260.1, 21, 14, 12, '2026-06-05', 1, 10, 5), -- Abyss, Clove
(6,  13, 150.5, 10, 16, 2,  '2026-06-06', 1, 6, 13), -- Icebox, Killjoy
(13, 7,  285.0, 24, 11, 7,  '2026-06-07', 1, 7, 18); -- Lotus, Raze

SELECT 
    ROUND(SUM(kills) / NULLIF(SUM(deaths), 0), 2) AS kdr,
    ROUND((SUM(kills) + SUM(assists)) / NULLIF(SUM(deaths), 0), 2) AS kda,
    ROUND(AVG(acs), 0) AS media_acs,
    CONCAT(ROUND(AVG(CASE WHEN score > scoreAdv THEN 1 ELSE 0 END) * 100, 0), '%') AS winrate,
    COUNT(idpartidausuario) AS total_partidas
FROM partidas_usuario 
WHERE usuarioFk = 1;

SELECT 
    a.nome AS agente,
    ROUND(SUM(CASE WHEN p.score > p.scoreAdv THEN 1 ELSE 0 END) / COUNT(p.idpartidausuario) * 100, 0) AS winrate
FROM partidas_usuario p
JOIN agente a ON p.agenteFk = a.idagente
WHERE p.usuarioFk = 1
GROUP BY a.idagente, a.nome
HAVING winrate > 0
ORDER BY winrate DESC, COUNT(p.idpartidausuario) DESC
LIMIT 3;

SELECT 
    m.nome AS mapa,
    ROUND(SUM(CASE WHEN p.score > p.scoreAdv THEN 1 ELSE 0 END) / COUNT(p.idpartidausuario) * 100, 0) AS winrate
FROM partidas_usuario p
JOIN mapa m ON p.mapaFk = m.idmapa
WHERE p.usuarioFk = 1
GROUP BY m.idmapa, m.nome
HAVING winrate > 0
ORDER BY winrate DESC, COUNT(p.idpartidausuario) DESC
LIMIT 3;

SELECT 
    data_partida,
    kills AS abates,
    deaths AS mortes,
    assists AS assistencias
FROM partidas_usuario
WHERE usuarioFk = 1
ORDER BY data_partida ASC;

use projetoace;
select * from partidas_usuario;

SELECT 
    p.idpartidausuario,
    p.score AS score_aliado,
    p.scoreAdv AS score_adversario,
    DATE_FORMAT(p.data_partida, '%d/%b') AS data_partida,
    a.nome AS agente,
    m.nome AS mapa
FROM partidas_usuario p
INNER JOIN agente a ON p.agenteFk = a.idagente
INNER JOIN mapa m ON p.mapaFk = m.idmapa
WHERE p.usuarioFk = 1;