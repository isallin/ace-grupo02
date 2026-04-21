package ace.projeto;

import org.springframework.jdbc.core.JdbcTemplate;

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

    public void inserirDados(List<PartidaValorant> lista) {

        System.out.println("Inserindo tabelas base...");
        inserirBase(lista);

        System.out.println("Carregando IDs...");
        carregarIds();

        System.out.println("Inserindo desempenho...");
        inserirDesempenhoBatch(lista);

        System.out.println("Montando Composições");
        montarComposicoes();

        System.out.println("Carga finalizada.");
    }

    private void inserirBase(List<PartidaValorant> lista) {

        jdbcTemplate.batchUpdate(
                "insert ignore into mapa(nome) values(?)",
                lista,
                700,
                (ps, p) -> ps.setString(
                        1,
                        p.getMapa().trim()
                )
        );

        jdbcTemplate.batchUpdate(
                "insert ignore into time(nome) values(?)",
                lista,
                700,
                (ps, p) -> ps.setString(
                        1,
                        p.getTime().trim()
                )
        );

        jdbcTemplate.batchUpdate(
                "insert ignore into agente(nome) values(?)",
                lista,
                700,
                (ps, p) -> ps.setString(
                        1,
                        p.getAgente().trim()
                )
        );

        jdbcTemplate.batchUpdate("""
        insert ignore into partida
        (nome_partida, campeonato, etapa, mapaFk)
        values(
        ?, ?, ?,
        (select idmapa from mapa where nome=?)
        )
    """,
                lista,
                500,
                (ps, p) -> {

                    ps.setString(
                            1,
                            p.getNomePartida().trim()
                    );

                    ps.setString(
                            2,
                            p.getCampeonato().trim()
                    );

                    ps.setString(
                            3,
                            p.getEtapa().trim()
                    );

                    ps.setString(
                            4,
                            p.getMapa().trim()
                    );
                });
    }

    private void carregarIds() {

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

    private void inserirDesempenhoBatch(
            List<PartidaValorant> lista) {

        jdbcTemplate.batchUpdate("""
            insert into desempenho
            (
            partidaFk,
            timeFk,
            agenteFk,
            kills,
            deaths,
            assists
            )
            values (?, ?, ?, ?, ?, ?)
        """,
                lista,
                700,
                (ps, p) -> {

                    ps.setInt(
                            1,
                            buscarIdLista(
                                    nomesPartida,
                                    idsPartida,
                                    p.getNomePartida().trim()
                            )
                    );

                    ps.setInt(
                            2,
                            buscarIdLista(
                                    nomesTime,
                                    idsTime,
                                    p.getTime().trim()
                            )
                    );

                    ps.setInt(
                            3,
                            buscarIdLista(
                                    nomesAgente,
                                    idsAgente,
                                    p.getAgente().trim()
                            )
                    );

                    ps.setInt(4, p.getKills());
                    ps.setInt(5, p.getDeaths());
                    ps.setInt(6, p.getAssists());
                });
    }

    private void montarComposicoes() {

        System.out.println("Montando composições...");

        jdbcTemplate.update("""
        insert into composicao
        (partidaFk, timeFk)

        select distinct
            partidaFk,
            timeFk
        from desempenho
    """);

        jdbcTemplate.update("""
        insert into composicao_agente
        (composicaoFk, agenteFk)

        select distinct
            c.idcomposicao,
            d.agenteFk

        from desempenho d

        join composicao c
        on c.partidaFk = d.partidaFk
        and c.timeFk = d.timeFk
    """);

        System.out.println("Composições prontas.");
    }

    private Integer buscarIdLista(List<String> nomes, List<Integer> ids, String valor) {

        for (int i = 0; i < nomes.size(); i++) {
            if (nomes.get(i).equals(valor)) {
                return ids.get(i);
            }
        }

        return 0;
    }
}