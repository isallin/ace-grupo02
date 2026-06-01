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
SELECT d.id, p.nome_partida, t.nome AS time, a.nome AS agente, d.kills, d.deaths, d.assists
FROM
    desempenho d
    JOIN partida p ON d.partidaFk = p.idpartida
    JOIN time t ON d.timeFk = t.idtime
    JOIN agente a ON d.agenteFk = a.idagente
LIMIT 100;

-- -----------------------------------------------------
-- Consulta composição
-- -----------------------------------------------------
SELECT c.idcomposicao, t.nome AS time, p.nome_partida, a.nome AS agente
FROM
    composicao c
    JOIN time t ON c.timeFk = t.idtime
    JOIN partida p ON c.partidaFk = p.idpartida
    JOIN composicao_agente ca ON ca.composicaoFk = c.idcomposicao
    JOIN agente a ON a.idagente = ca.agenteFk
ORDER BY c.idcomposicao;

-- -----------------------------------------------------
-- Consulta estatística
-- -----------------------------------------------------
SELECT e.id, t.nome, p.nome_partida, e.win_rate, e.pick_rate, e.total_partidas
FROM
    estatistica_composicao e
    JOIN composicao c ON e.composicaoFk = c.idcomposicao
    JOIN time t ON c.timeFk = t.idtime
    JOIN partida p ON c.partidaFk = p.idpartida;

-- -----------------------------------------------------
-- Estatísticas das composições
-- -----------------------------------------------------
SELECT ec.id, c.idcomposicao, t.nome AS time, p.nome_partida, m.nome AS mapa, ec.win_rate, ec.pick_rate, ec.total_partidas
FROM
    estatistica_composicao ec
    JOIN composicao c ON ec.composicaoFk = c.idcomposicao
    JOIN time t ON c.timeFk = t.idtime
    JOIN partida p ON c.partidaFk = p.idpartida
    JOIN mapa m ON p.mapaFk = m.idmapa
ORDER BY ec.win_rate DESC, ec.pick_rate DESC;