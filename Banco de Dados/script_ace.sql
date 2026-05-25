-- -----------------------------------------------------
-- Schema projetoace
-- -----------------------------------------------------
CREATE DATABASE projetoace;
USE projetoace;

-- -----------------------------------------------------
-- Table organizacao
-- -----------------------------------------------------
CREATE TABLE organizacao (
    idorganizacao INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    contato VARCHAR(45),
    codAtivacao VARCHAR(45)
);

-- -----------------------------------------------------
-- Table usuarios
-- -----------------------------------------------------
CREATE TABLE usuarios (
    idusuario INT PRIMARY KEY AUTO_INCREMENT,
    nome_completo VARCHAR(45),
    nickname VARCHAR(45),
    email VARCHAR(100),
    senha VARCHAR(50),
    funcao VARCHAR(20),
    organizacaofk INT,

    CONSTRAINT chk_funcao
        CHECK (funcao IN ('player','coach','admin')),

    CONSTRAINT fk_usuario_organizacao
        FOREIGN KEY (organizacaofk)
        REFERENCES organizacao(idorganizacao)
);

-- -----------------------------------------------------
-- Table post
-- -----------------------------------------------------
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    autor_nome VARCHAR(100) NOT NULL,
    banner VARCHAR(255) NOT NULL,
    agentes VARCHAR(255) NOT NULL,
    usuario_id INT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_posts_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (idusuario)
);

-- -----------------------------------------------------
-- Table agente
-- -----------------------------------------------------
CREATE TABLE agente (
    idagente INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) UNIQUE,
    classe VARCHAR(45),
    link_image VARCHAR(100),
    descricao VARCHAR(200),
    postfk INT,

    CONSTRAINT fk_agente_post
        FOREIGN KEY (postfk)
        REFERENCES posts(id)
);

-- -----------------------------------------------------
-- Table mapa
-- -----------------------------------------------------
CREATE TABLE mapa (
    idmapa INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) UNIQUE,
    link_image VARCHAR(100),
    postfk INT,

    CONSTRAINT fk_mapa_post
        FOREIGN KEY (postfk)
        REFERENCES posts(id)
);

-- -----------------------------------------------------
-- Table time
-- -----------------------------------------------------
CREATE TABLE time (
    idtime INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) UNIQUE
);


-- -----------------------------------------------------
-- Table partida
-- -----------------------------------------------------
CREATE TABLE partida (
    idpartida INT PRIMARY KEY AUTO_INCREMENT,
    nome_partida VARCHAR(100) UNIQUE,
    campeonato VARCHAR(60),
    etapa VARCHAR(60),

    mapaFk INT,
    vencedorFk INT,

    placarA INT,
    placarB INT,

    CONSTRAINT fk_partida_mapa
        FOREIGN KEY (mapaFk)
        REFERENCES mapa(idmapa),

    CONSTRAINT fk_partida_vencedor
        FOREIGN KEY (vencedorFk)
        REFERENCES time(idtime)
);


-- -----------------------------------------------------
-- Table desempenho
-- -----------------------------------------------------
CREATE TABLE desempenho (
    id INT PRIMARY KEY AUTO_INCREMENT,

    kills INT,
    deaths INT,
    assists INT,

    partidaFk INT,
    agenteFk INT,
    timeFk INT,

    CONSTRAINT fk_desempenho_partida
        FOREIGN KEY (partidaFk)
        REFERENCES partida(idpartida),

    CONSTRAINT fk_desempenho_agente
        FOREIGN KEY (agenteFk)
        REFERENCES agente(idagente),

    CONSTRAINT fk_desempenho_time
        FOREIGN KEY (timeFk)
        REFERENCES time(idtime)
);

-- -----------------------------------------------------
-- Table composicao
-- -----------------------------------------------------
CREATE TABLE composicao (
    idcomposicao INT PRIMARY KEY AUTO_INCREMENT,

    timeFk INT,
    partidaFk INT,

    CONSTRAINT uk_composicao
        UNIQUE (timeFk, partidaFk),

    CONSTRAINT fk_composicao_time
        FOREIGN KEY (timeFk)
        REFERENCES time(idtime),

    CONSTRAINT fk_composicao_partida
        FOREIGN KEY (partidaFk)
        REFERENCES partida(idpartida)
);

-- -----------------------------------------------------
-- Table composicao_agente
-- -----------------------------------------------------
CREATE TABLE composicao_agente (

    composicaoFk INT,
    agenteFk INT,

    PRIMARY KEY (composicaoFk, agenteFk),

    CONSTRAINT fk_composicaoagente_composicao
        FOREIGN KEY (composicaoFk)
        REFERENCES composicao(idcomposicao),

    CONSTRAINT fk_composicaoagente_agente
        FOREIGN KEY (agenteFk)
        REFERENCES agente(idagente)
);

-- -----------------------------------------------------
-- Table estatistica_composicao
-- -----------------------------------------------------
CREATE TABLE estatistica_composicao (

    id INT PRIMARY KEY AUTO_INCREMENT,

    win_rate DECIMAL(5,2),
    pick_rate DECIMAL(5,2),
    total_partidas INT,

    composicaoFk INT UNIQUE,

    CONSTRAINT fk_estatistica_composicao
        FOREIGN KEY (composicaoFk)
        REFERENCES composicao(idcomposicao)
);

-- -----------------------------------------------------
-- Table comentarios
-- -----------------------------------------------------
CREATE TABLE comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    usuario_id INT NOT NULL,
    texto TEXT NOT NULL,
    data_comentario TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_coments_post FOREIGN KEY (post_id) REFERENCES posts (id),
    CONSTRAINT fk_coments_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (idusuario)
);

INSERT INTO
    usuarios (nickname, email, senha, funcao)
VALUES (
        'Administrador',
        'ace@teste',
        '123',
        'admin'
    );

-- Inserindo dados na tabela 'organizacao'
INSERT INTO organizacao (nome, contato, codAtivacao) VALUES
('LOUD', 'contato@loud.gg', 'LOUD2026VAL'),
('Sentinels', 'info@sentinels.gg', 'SEN2026WIN'),
('Fnatic', 'support@fnatic.com', 'FNC2026VLR');

-- Inserindo dados na tabela 'usuarios'
INSERT INTO usuarios (nome_completo, nickname, email, senha, funcao, organizacaofk) VALUES
('Erick Santos', 'aspas', 'aspas@loud.gg', 'loud123', 'player', 1),
('Matias Delipetro', 'Saadhak', 'saadhak@loud.gg', 'coach99', 'coach', 1),
('Tyson Ngo', 'TenZ', 'tenz@sentinels.gg', 'sen2026', 'player', 2),
('Jake Howlett', 'Boaster', 'boaster@fnatic.com', 'fnc789', 'player', 3);

-- -----------------------------------------------------
-- Table log
-- -----------------------------------------------------
CREATE TABLE log_etl (
    id INT PRIMARY KEY AUTO_INCREMENT,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    mensagem VARCHAR(255)
);

-- -----------------------------------------------------
-- Testes ETL
-- -----------------------------------------------------
SELECT COUNT(*) AS total FROM mapa;
SELECT COUNT(*) AS total FROM agente;
SELECT COUNT(*) AS total FROM time;
SELECT COUNT(*) AS total FROM partida;
SELECT COUNT(*) AS total FROM desempenho;
SELECT COUNT(*) AS total FROM composicao;
SELECT COUNT(*) AS total FROM composicao_agente;
SELECT COUNT(*) AS total FROM estatistica_composicao;

-- -----------------------------------------------------
-- Consulta desempenho
-- -----------------------------------------------------
SELECT
d.id,
p.nome_partida,
t.nome AS time,
a.nome AS agente,
d.kills,
d.deaths,
d.assists
FROM desempenho d
JOIN partida p ON d.partidaFk = p.idpartida
JOIN time t ON d.timeFk = t.idtime
JOIN agente a ON d.agenteFk = a.idagente
LIMIT 100;

-- -----------------------------------------------------
-- Consulta composição
-- -----------------------------------------------------
SELECT
c.idcomposicao,
t.nome AS time,
p.nome_partida,
a.nome AS agente
FROM composicao c
JOIN time t ON c.timeFk = t.idtime
JOIN partida p ON c.partidaFk = p.idpartida
JOIN composicao_agente ca ON ca.composicaoFk = c.idcomposicao
JOIN agente a ON a.idagente = ca.agenteFk
ORDER BY c.idcomposicao;

-- -----------------------------------------------------
-- Consulta estatística
-- -----------------------------------------------------
SELECT
e.id,
t.nome,
p.nome_partida,
e.win_rate,
e.pick_rate,
e.total_partidas
FROM estatistica_composicao e
JOIN composicao c ON e.composicaoFk = c.idcomposicao
JOIN time t ON c.timeFk = t.idtime
JOIN partida p ON c.partidaFk = p.idpartida;

-- -----------------------------------------------------
-- Estatísticas das composições
-- -----------------------------------------------------
SELECT
    ec.id,
    c.idcomposicao,

    t.nome AS time,
    p.nome_partida,
    m.nome AS mapa,

    ec.win_rate,
    ec.pick_rate,
    ec.total_partidas

FROM estatistica_composicao ec

JOIN composicao c
    ON ec.composicaoFk = c.idcomposicao

JOIN time t
    ON c.timeFk = t.idtime

JOIN partida p
    ON c.partidaFk = p.idpartida

JOIN mapa m
    ON p.mapaFk = m.idmapa

ORDER BY ec.win_rate DESC,
         ec.pick_rate DESC;
