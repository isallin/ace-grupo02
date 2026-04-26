-- -----------------------------------------------------
-- Schema projetoace 1.1
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
    CONSTRAINT chk_funcao CHECK (
        funcao IN ('player', 'coach', 'outros')
    ),
    CONSTRAINT fk_usuario_organizacao FOREIGN KEY (organizacaofk) REFERENCES organizacao (idorganizacao)
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
    nome VARCHAR(45),
    classe VARCHAR(45),
    link_image VARCHAR(45),
    descricao VARCHAR(200), -- usado para o post
    postfk INT,
    CONSTRAINT fk_agente_post FOREIGN KEY (postfk) REFERENCES posts (id)
);

-- -----------------------------------------------------
-- Table mapa
-- -----------------------------------------------------
CREATE TABLE mapa (
    idmapa INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL,
    link_image VARCHAR(45) NULL,
    postfk INT NULL,
    CONSTRAINT fk_mapa_post FOREIGN KEY (postfk) REFERENCES posts (id)
);

-- -----------------------------------------------------
-- Table time
-- -----------------------------------------------------
CREATE TABLE time(
    idtime INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL
);

-- -----------------------------------------------------
-- Table partida
-- -----------------------------------------------------
CREATE TABLE partida (
    idpartida INT PRIMARY KEY AUTO_INCREMENT,
    nome_partida VARCHAR(45),
    campeonato VARCHAR(45),
    etapa VARCHAR(45),
    mapaFk INT,
    CONSTRAINT fk_partida_mapa FOREIGN KEY (mapaFk) REFERENCES mapa (idmapa)
);

-- -----------------------------------------------------
-- Table desempenho
-- -----------------------------------------------------
CREATE TABLE desempenho (
    id INT PRIMARY KEY AUTO_INCREMENT,
    kills INT,
    deaths INT,
    assists INT,
    partidafk INT,
    agentefk INT,
    timefk INT,
    CONSTRAINT fk_desempenho_partida FOREIGN KEY (partidafk) REFERENCES partida (idpartida),
    CONSTRAINT fk_desempenho_agente FOREIGN KEY (agentefk) REFERENCES agente (idagente),
    CONSTRAINT fk_desempenho_time FOREIGN KEY (timefk) REFERENCES time(idtime)
);

-- -----------------------------------------------------
-- Table composicao
-- -----------------------------------------------------
CREATE TABLE composicao (
    idcomposicao INT PRIMARY KEY AUTO_INCREMENT,
    timefk INT,
    partidafk INT,
    CONSTRAINT fk_composicao_time FOREIGN KEY (timefk) REFERENCES time(idtime),
    CONSTRAINT fk_composicao_partida FOREIGN KEY (partidafk) REFERENCES partida (idpartida)
);

-- -----------------------------------------------------
-- Table composicao_agente
-- -----------------------------------------------------
CREATE TABLE composicao_agente (
    composicaofk INT,
    agentefk INT,
    PRIMARY KEY (agentefk, composicaofk),
    CONSTRAINT fk_composicaoagente_composicao FOREIGN KEY (composicaofk) REFERENCES composicao (idcomposicao),
    CONSTRAINT fk_composicaoagente_agente FOREIGN KEY (agentefk) REFERENCES agente (idagente)
);

-- -----------------------------------------------------
-- Table estatistica_composicao
-- -----------------------------------------------------
CREATE TABLE estatistica_composicao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    win_rate DECIMAL,
    pick_rate DECIMAL,
    total_partidas INT,
    composicaofk INT,
    CONSTRAINT fk_estatisticacomposicao_composicao FOREIGN KEY (composicaofk) REFERENCES composicao (idcomposicao)
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
    usuarios (nickname, email, senha)
VALUES (
        'Administrador',
        'ace@teste',
        '123'
    );