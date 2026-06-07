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

INSERT INTO agente (nome) VALUES 
('Astra'),('Breach'),('Brimstone'),('Chamber'),('Clove'),('Cypher'),('Deadlock'),('Fade'),('Gekko'),
('Harbor'),('Iso'),('Jett'),('Killjoy'),('Miks'),('Neon'),('Omen'),('Phoenix'),('Raze'),('Reyna'),
('Sage'),('Skye'),('Sova'),('Tejo'),('Veto'),('Viper'),('Vyse'),('Waylay'),('Yoru');

SELECT 
    ROUND(SUM(kills) / SUM(deaths), 2) AS kdr,
    ROUND((SUM(kills) + SUM(assists)) / SUM(deaths), 2) AS kda,
    ROUND(AVG(acs), 0) AS media_acs,
    ROUND(SUM(CASE WHEN score > scoreAdv THEN 1 ELSE 0 END) / COUNT(idpartidausuario),2) AS winrate,
    COUNT(idpartidausuario) AS total_partidas
FROM partidas_usuario 
WHERE usuarioFk = 1;


select * from partidas_usuario;

drop database projetoace;