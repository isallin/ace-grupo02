package ace.projeto;

import org.springframework.jdbc.core.JdbcTemplate;
import java.util.List;

public class Main {

    public static void main(String[] args) {

        Conexao conexao =
                new Conexao();

        JdbcTemplate jdbcTemplate =
                conexao.getJdbcTemplate();

        ValorantDAO dao =
                new ValorantDAO(jdbcTemplate);

        dao.log("Lendo overview.xlsx");

        LeitorExcel leitor =
                new LeitorExcel();

        List<PartidaValorant> partidaList =
                leitor.extrair("overview.xlsx");

        dao.inserirDados(partidaList);

        dao.log("Lendo scores.xlsx");

        LeitorScores leitorScores =
                new LeitorScores();

        List<ResultadoPartida> resultados =
                leitorScores.extrair("scores.xlsx");

        dao.atualizarResultados(resultados);

        dao.montarEstatisticas();

        dao.log("ETL Finalizado.");

        GatilhoAutomate.enviarSinal("Arquivo overview.xlsx e scores.xlsx " +
                "lidos com sucesso!");
    }
}