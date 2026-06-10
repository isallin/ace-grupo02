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
    nome_partida VARCHAR(100),
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

-- -----------------------------------------------------
-- Table log
-- -----------------------------------------------------
CREATE TABLE log_etl (
    id INT PRIMARY KEY AUTO_INCREMENT,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    mensagem VARCHAR(255)
);

-- -----------------------------------------------------
-- Table partidas_usuario
-- -----------------------------------------------------
CREATE TABLE partidas_usuario (
    idpartidausuario INT PRIMARY KEY AUTO_INCREMENT,
    score INT NOT NULL,
    scoreAdv INT NOT NULL,
    acs DECIMAL NOT NULL,
    kills INT NOT NULL,
    deaths INT NOT NULL,
    assists INT NOT NULL,
    data_partida DATE NOT NULL,
    usuarioFk INT NOT NULL,
    mapaFk INT NOT NULL,
    agenteFk INT NOT NULL,
    CONSTRAINT fk_usuario_partida FOREIGN KEY (usuarioFk) REFERENCES usuarios (idusuario),
    CONSTRAINT fk_mapa_partida FOREIGN KEY (mapaFk) REFERENCES mapa(idmapa),
    CONSTRAINT fk_agente_partida FOREIGN KEY (agenteFk) REFERENCES agente(idagente)
);

-- -----------------------------------------------------
-- INSERINDO DADOS
-- -----------------------------------------------------
INSERT INTO
    usuarios (nickname, email, senha, funcao)
VALUES (
        'Administrador',
        'ace@teste',
        '123',
        'admin'
    );

-- -----------------------------------------------------
-- INSERINDO DADOS
-- -----------------------------------------------------
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
('Erick Santos', 'aspas', 'aspas@loud', 'loud123', 'player', 1),
('Tyson Ngo', 'TenZ', 'tenz@sentinels.gg', 'sen2026', 'player', 2),
('Jake Howlett', 'Boaster', 'boaster@fnatic.com', 'fnc789', 'player', 3),
('Matias Delipetro', 'Saadhak', 'saadhak@loud.gg', 'coach99', 'coach', 1),
('Coach da Silva', 'coach', 'coach@teste', 'coach123', 'coach', 1),
('Player da Silva', 'player', 'player@teste', 'player123', 'player', 1);

INSERT INTO partidas_usuario 
(score, scoreAdv, acs, kills, deaths, assists, data_partida, usuarioFk, mapaFk, agenteFk) 
VALUES
(13,8,  298.4, 24,19,6,'2026-06-08',7,1,12),
(13,10, 287.1, 22,18,5,'2026-06-09',7,5,12),
(13,11, 301.5, 25,20,4,'2026-06-10',7,7,12),
(13,7,  315.2, 28,21,6,'2026-06-11',7,1,12),
(13,9,  276.8, 21,17,7,'2026-06-12',7,9,12),
(13,6,  322.0, 29,22,5,'2026-06-13',7,10,12),
(13,12, 264.5, 20,16,8,'2026-06-14',7,1,12),
(13,8,  309.3, 26,21,4,'2026-06-15',7,5,12),
(13,10, 284.7, 23,18,6,'2026-06-16',7,7,12),
(11,13, 235.9, 19,25,5,'2026-06-17',7,1,12),
(13,8,  281.2, 23,24,7,'2026-06-18',7,2,18),
(13,10, 295.4, 25,20,4,'2026-06-19',7,6,18),
(13,11, 274.8, 22,17,8,'2026-06-20',7,2,18),
(13,7,  312.7, 27,21,5,'2026-06-21',7,8,18),
(13,10, 283.3, 23,18,5,'2026-06-24',7,2,18),
(10,13, 227.5, 18,16,4,'2026-06-25',7,8,18),
(8,13,  218.9, 17,15,6,'2026-06-26',7,6,18),
(11,13, 233.7, 19,17,5,'2026-06-27',7,2,18),
(13,10, 268.5, 21,17,7,'2026-06-28',7,8,27),
(13,8,  282.1, 23,18,5,'2026-06-29',7,3,27),
(13,11, 259.4, 20,16,8,'2026-06-30',7,8,27),
(13,9,  274.6, 22,18,6,'2026-07-01',7,4,27),
(13,12, 251.8, 19,15,9,'2026-07-02',7,8,27),
(10,13, 216.4, 17,15,4,'2026-07-03',7,3,27),
(9,13,  209.8, 16,14,5,'2026-07-04',7,8,27);
