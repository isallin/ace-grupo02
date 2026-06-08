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