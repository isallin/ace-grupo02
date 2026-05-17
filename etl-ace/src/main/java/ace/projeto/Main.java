package ace.projeto;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

public class Main {

    public static void main(String[] args) {

        Dotenv dotenv = Dotenv.load();

        String[] obrigatorias = {
                "DB_URL", "DB_USER", "DB_PASSWORD",
                "MAIL_USER", "MAIL_PASSWORD", "MAIL_TO",
                "S3_BUCKET", "ANOS"
        };

        for (String var : obrigatorias) {
            if (dotenv.get(var) == null || dotenv.get(var).isBlank()) {
                throw new RuntimeException(
                        "Variável de ambiente obrigatória não definida: " + var
                );
            }
        }

        Conexao conexao = new Conexao();
        JdbcTemplate jdbcTemplate = conexao.getJdbcTemplate();
        ValorantDAO dao = new ValorantDAO(jdbcTemplate);


        String[] anos = dotenv.get("ANOS").split(",");

        for (String ano : anos) {

            ano = ano.trim();

            String arquivoOverview = ano + "/overview.xlsx";
            String arquivoScores   = ano + "/scores.xlsx"  ;

            dao.log("Iniciando ETL do ano: " + ano);


            dao.log("Lendo " + arquivoOverview);
            LeitorExcel leitor = new LeitorExcel();
            List<PartidaValorant> partidaList = leitor.extrair(arquivoOverview);
            dao.inserirDados(partidaList);


            dao.log("Lendo " + arquivoScores);
            LeitorScores leitorScores = new LeitorScores();
            List<ResultadoPartida> resultados = leitorScores.extrair(arquivoScores);
            dao.atualizarResultados(resultados);

            dao.montarEstatisticas();

            dao.log("ETL do ano " + ano + " finalizado.");
        }

        dao.log("ETL completo para todos os anos.");

        GatilhoAutomate.enviarSinal(
                "ETL finalizado com sucesso para os anos: "
                        + dotenv.get("ANOS")
        );
    }
}