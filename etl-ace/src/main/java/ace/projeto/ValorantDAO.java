package ace.projeto;

import org.springframework.jdbc.core.JdbcTemplate;

import java.sql.Connection;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class ValorantDAO {

    private JdbcTemplate jdbcTemplate;

    private List<String> nomesTime = new ArrayList<>();
    private List<Integer> idsTime = new ArrayList<>();

    private List<String> nomesAgente = new ArrayList<>();
    private List<Integer> idsAgente = new ArrayList<>();

    private List<String> nomesPartida = new ArrayList<>();
    private List<Integer> idsPartida = new ArrayList<>();

    public ValorantDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void log(String mensagem) {

        String hora =
                LocalDateTime.now()
                        .format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));

        System.out.println(hora + " - " + mensagem + " - INFO");

        jdbcTemplate.update(
                "insert into log_etl (mensagem) values (?)",
                mensagem
        );
    }


    public void inserirBase(List<PartidaValorant> lista) {

        jdbcTemplate.execute((Connection conn) -> {
            conn.setAutoCommit(false);

            try {
                jdbcTemplate.batchUpdate(
                        "insert ignore into mapa(nome) values(?)",
                        lista, 15000,
                        (ps, p) -> ps.setString(1, p.getMapa().trim())
                );

                jdbcTemplate.batchUpdate(
                        "insert ignore into time(nome) values(?)",
                        lista, 15000,
                        (ps, p) -> ps.setString(1, p.getTime().trim())
                );

                jdbcTemplate.batchUpdate(
                        "insert ignore into agente(nome) values(?)",
                        lista, 15000,
                        (ps, p) -> ps.setString(1, p.getAgente().trim())
                );

                jdbcTemplate.batchUpdate("""
                                insert ignore into partida
                                (nome_partida, campeonato, etapa, mapaFk)
                                values(?, ?, ?,
                                (select idmapa from mapa where nome=?))
                                """,
                        lista, 15000,
                        (ps, p) -> {
                            ps.setString(1, p.getNomePartida().trim());
                            ps.setString(2, p.getCampeonato().trim());
                            ps.setString(3, p.getEtapa().trim());
                            ps.setString(4, p.getMapa().trim());
                        });

                conn.commit();

            } catch (Exception e) {
                conn.rollback();
                throw e;
            }

            return null;
        });
    }


    public void carregarIds() {

        jdbcTemplate.query(
                "select idtime, nome from time",
                rs -> {
                    idsTime.add(rs.getInt("idtime"));
                    nomesTime.add(rs.getString("nome"));
                }
        );

        jdbcTemplate.query(
                "select idagente, nome from agente",
                rs -> {
                    idsAgente.add(rs.getInt("idagente"));
                    nomesAgente.add(rs.getString("nome"));
                }
        );

        jdbcTemplate.query(
                "select idpartida, nome_partida from partida",
                rs -> {
                    idsPartida.add(rs.getInt("idpartida"));
                    nomesPartida.add(rs.getString("nome_partida"));
                }
        );
    }


    public void inserirDesempenho(List<PartidaValorant> lista) {

        jdbcTemplate.execute((Connection conn) -> {
            conn.setAutoCommit(false);

            try {
                jdbcTemplate.batchUpdate("""
                                insert into desempenho
                                (partidaFk, timeFk, agenteFk, kills, deaths, assists)
                                values (?, ?, ?, ?, ?, ?)
                                """,
                        lista, 15000,
                        (ps, p) -> {
                            ps.setInt(1, buscarIdLista(nomesPartida, idsPartida, p.getNomePartida().trim()));
                            ps.setInt(2, buscarIdLista(nomesTime, idsTime, p.getTime().trim()));
                            ps.setInt(3, buscarIdLista(nomesAgente, idsAgente, p.getAgente().trim()));
                            ps.setInt(4, p.getKills());
                            ps.setInt(5, p.getDeaths());
                            ps.setInt(6, p.getAssists());
                        });

                conn.commit();

            } catch (Exception e) {
                conn.rollback();
                throw e;
            }

            return null;
        });
    }

    public void montarComposicoes() {

        jdbcTemplate.execute((Connection conn) -> {
            conn.setAutoCommit(false);

            try {
                jdbcTemplate.update("""
                        insert ignore into composicao
                        (partidaFk, timeFk)
                        select distinct partidaFk, timeFk
                        from desempenho
                        """);

                jdbcTemplate.update("""
                        insert ignore into composicao_agente
                        (composicaoFk, agenteFk)
                        select distinct c.idcomposicao, d.agenteFk
                        from desempenho d
                        join composicao c
                        on c.partidaFk = d.partidaFk
                        and c.timeFk = d.timeFk
                        """);

                conn.commit();
                log("Composições prontas.");

            } catch (Exception e) {
                conn.rollback();
                throw e;
            }

            return null;
        });
    }

    public void atualizarResultados(List<ResultadoPartida> lista) {

        jdbcTemplate.execute((Connection conn) -> {
            conn.setAutoCommit(false);

            try {
                jdbcTemplate.batchUpdate("""
                                update partida
                                set vencedorFk = (select idtime from time where nome = ?),
                                placarA = ?,
                                placarB = ?
                                where nome_partida = ?
                                """,
                        lista, 15000,
                        (ps, p) -> {
                            ps.setString(1, p.getVencedor());
                            ps.setInt(2, p.getPlacarA());
                            ps.setInt(3, p.getPlacarB());
                            ps.setString(4, p.getNomePartida());
                        });

                conn.commit();

            } catch (Exception e) {
                conn.rollback();
                throw e;
            }

            return null;
        });
    }

    public void montarEstatisticas() {

        jdbcTemplate.execute((Connection conn) -> {
            conn.setAutoCommit(false);

            try {
                jdbcTemplate.update("""
                        insert ignore into estatistica_composicao
                        (win_rate, pick_rate, total_partidas, composicaoFk)
                        select
                            round(case when p.vencedorFk = c.timeFk then 100 else 0 end, 2),
                            round(100.0 / (select count(*) from composicao), 2),
                            1,
                            c.idcomposicao
                        from composicao c
                        join partida p on p.idpartida = c.partidaFk
                        """);

                conn.commit();

            } catch (Exception e) {
                conn.rollback();
                throw e;
            }

            return null;
        });
    }

    private Integer buscarIdLista(List<String> nomes, List<Integer> ids, String valor) {

        for (int i = 0; i < nomes.size(); i++) {
            if (nomes.get(i).trim().equalsIgnoreCase(valor.trim())) {
                return ids.get(i);
            }
        }

        System.out.println("AVISO: ID não encontrado para: '" + valor + "'");
        return 0;
    }
}