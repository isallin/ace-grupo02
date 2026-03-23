CREATE DATABASE projetoAce;
USE projetoAce;

CREATE TABLE organizacao (
    idorganizacao INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    contato VARCHAR(45),
    codAtivacao VARCHAR(45)
);
CREATE TABLE usuarios (
    idusuario INT PRIMARY KEY AUTO_INCREMENT,
    nickname VARCHAR(12),
    email VARCHAR(45),
    senha CHAR(8),
    organizacao_idorganizacao INT,
    funcao VARCHAR(45),
    FOREIGN KEY (organizacao_idorganizacao) REFERENCES organizacao(idorganizacao)
);
CREATE TABLE agente (
    idpersonagem INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    funcao VARCHAR(45)
);
CREATE TABLE mapa (
    idmapa INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    ativo TINYINT
);
CREATE TABLE composicao (
    idcomp INT PRIMARY KEY AUTO_INCREMENT,
    agente_idpersonagem INT,
    mapa_idmapa INT,
    turno_mapa VARCHAR(45),
    FOREIGN KEY (agente_idpersonagem) REFERENCES agente(idpersonagem),
    FOREIGN KEY (mapa_idmapa) REFERENCES mapa(idmapa)
);
CREATE TABLE estatistica (
    idestatistica INT PRIMARY KEY AUTO_INCREMENT,
    pick_rate DECIMAL(5,2),
    win_rate DECIMAL(5,2),
    total_partidas INT
);
CREATE TABLE partida (
    idpartida INT PRIMARY KEY AUTO_INCREMENT,
    campeonato VARCHAR(45),
    data VARCHAR(45),
    vencedor VARCHAR(45),

    composicao_agente_idpersonagem INT,
    composicao_mapa_idmapa INT,
    composicao_idcomp INT,

    mapa_idmapa INT,
    estatistica_idestatistica INT,
    versao_patch VARCHAR(45),

    FOREIGN KEY (composicao_idcomp) REFERENCES composicao(idcomp),
    FOREIGN KEY (composicao_agente_idpersonagem) REFERENCES agente(idpersonagem),
    FOREIGN KEY (composicao_mapa_idmapa) REFERENCES mapa(idmapa),
    FOREIGN KEY (mapa_idmapa) REFERENCES mapa(idmapa),
    FOREIGN KEY (estatistica_idestatistica) REFERENCES estatistica(idestatistica)
);