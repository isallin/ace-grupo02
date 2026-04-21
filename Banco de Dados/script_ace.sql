-- -----------------------------------------------------
-- Schema projetoace 1.1
-- -----------------------------------------------------
CREATE DATABASE projetoace;
USE projetoace ;
-- -----------------------------------------------------
-- Table organizacao
-- -----------------------------------------------------
CREATE TABLE organizacao (
  idorganizacao INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(45),
  contato VARCHAR(45),
  codAtivacao VARCHAR(45));

-- -----------------------------------------------------
-- Table usuarios
-- -----------------------------------------------------
CREATE TABLE usuarios (
  idusuarios INT PRIMARY KEY AUTO_INCREMENT,
  nome_completo VARCHAR(45),
  nickname VARCHAR(45),
  email VARCHAR(100),
  senha VARCHAR(50),
  funcao VARCHAR(20),
  organizacaofk INT,
  CONSTRAINT chk_funcao CHECK (funcao IN ('player', 'coach', 'outros')),
  CONSTRAINT fk_usuario_organizacao
    FOREIGN KEY (organizacaofk)
    REFERENCES organizacao (idorganizacao));

-- -----------------------------------------------------
-- Table post
-- -----------------------------------------------------
CREATE TABLE post (
  idpost INT PRIMARY KEY AUTO_INCREMENT,
  texto VARCHAR(200),
  data DATE,
  usuariosfk INT,
  CONSTRAINT fk_post_usuarios
    FOREIGN KEY (usuariosfk)
    REFERENCES usuarios (idusuarios));

-- -----------------------------------------------------
-- Table agente
-- -----------------------------------------------------
CREATE TABLE agente (
  idagente INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(45) UNIQUE,
  classe VARCHAR(45),
  link_image VARCHAR(45),
  descricao VARCHAR(200), -- usado para o post
  postfk INT,
  CONSTRAINT fk_agente_post
    FOREIGN KEY (postfk)
    REFERENCES post (idpost));

-- -----------------------------------------------------
-- Table mapa
-- -----------------------------------------------------
CREATE TABLE mapa (
  idmapa INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(45) NOT NULL UNIQUE,
  link_image VARCHAR(45) NULL,
  postfk INT NULL,
  CONSTRAINT fk_mapa_post
    FOREIGN KEY (postfk)
    REFERENCES post (idpost));

-- -----------------------------------------------------
-- Table time
-- -----------------------------------------------------
CREATE TABLE time (
  idtime INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(45) NOT NULL UNIQUE);

-- -----------------------------------------------------
-- Table partida
-- -----------------------------------------------------
CREATE TABLE partida (
  idpartida INT PRIMARY KEY AUTO_INCREMENT,
  nome_partida VARCHAR(45) UNIQUE,
  campeonato VARCHAR(45),
  etapa VARCHAR(45),
  mapaFk INT,
  CONSTRAINT fk_partida_mapa
    FOREIGN KEY (mapaFk)
    REFERENCES mapa (idmapa));

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
  CONSTRAINT fk_desempenho_partida
    FOREIGN KEY (partidafk)
    REFERENCES partida (idpartida),
  CONSTRAINT fk_desempenho_agente
    FOREIGN KEY (agentefk)
    REFERENCES agente (idagente),
  CONSTRAINT fk_desempenho_time
    FOREIGN KEY (timefk)
    REFERENCES time (idtime));

-- -----------------------------------------------------
-- Table composicao
-- -----------------------------------------------------
CREATE TABLE composicao (
  idcomposicao INT PRIMARY KEY AUTO_INCREMENT,
  timefk INT,
  partidafk INT,
  CONSTRAINT fk_composicao_time
    FOREIGN KEY (timefk)
    REFERENCES time (idtime),
  CONSTRAINT fk_composicao_partida
    FOREIGN KEY (partidafk)
    REFERENCES partida (idpartida));

-- -----------------------------------------------------
-- Table composicao_agente
-- -----------------------------------------------------
CREATE TABLE composicao_agente (
  composicaofk INT,
  agentefk INT,
  PRIMARY KEY (agentefk, composicaofk),
  CONSTRAINT fk_composicaoagente_composicao
    FOREIGN KEY (composicaofk)
    REFERENCES composicao (idcomposicao),
  CONSTRAINT fk_composicaoagente_agente
    FOREIGN KEY (agentefk)
    REFERENCES agente (idagente));

-- -----------------------------------------------------
-- Table estatistica_composicao
-- -----------------------------------------------------
CREATE TABLE estatistica_composicao (
  id INT PRIMARY KEY AUTO_INCREMENT,
  win_rate DECIMAL,
  pick_rate DECIMAL,
  total_partidas INT,
  composicaofk INT,
  CONSTRAINT fk_estatisticacomposicao_composicao
    FOREIGN KEY (composicaofk)
    REFERENCES composicao (idcomposicao));
    
-- -----------------------------------------------------
-- Table comentarios
-- -----------------------------------------------------
CREATE TABLE comentarios (
  idpost INT,
  idusuarios INT,
  data DATE,
  texto VARCHAR(200),
  PRIMARY KEY (idpost, idusuarios),
  CONSTRAINT fk_comentarios_post
    FOREIGN KEY (idpost)
    REFERENCES post (idpost),
  CONSTRAINT fk_comentarios_usuarios
    FOREIGN KEY (idusuarios)
    REFERENCES usuarios (idusuarios));
    
    

-- -----------------------------------------------------
-- Testes do ETL
-- -----------------------------------------------------
SELECT COUNT(*) AS total FROM mapa;
SELECT COUNT(*) AS total FROM agente;
SELECT COUNT(*) AS total FROM time;
SELECT COUNT(*) AS total FROM partida;
SELECT COUNT(*) AS total FROM desempenho;

SELECT
p.idpartida,
p.nome_partida,
p.campeonato,
p.etapa,
m.nome AS mapa
FROM partida p
JOIN mapa m
ON p.mapaFk = m.idmapa;

SELECT
d.id,
p.nome_partida,
t.nome AS time,
a.nome AS agente,
d.kills,
d.deaths,
d.assists
FROM desempenho d
JOIN partida p
ON d.partidaFk = p.idpartida
JOIN time t
ON d.timeFk = t.idtime
JOIN agente a
ON d.agenteFk = a.idagente
LIMIT 500;

SELECT
c.idcomposicao,
t.nome,
p.nome_partida,
a.nome agente
FROM composicao c
JOIN time t ON c.timeFk = t.idtime
JOIN partida p ON c.partidaFk = p.idpartida
JOIN composicao_agente ca ON ca.composicaoFk = c.idcomposicao
JOIN agente a ON a.idagente = ca.agenteFk
ORDER BY c.idcomposicao;
