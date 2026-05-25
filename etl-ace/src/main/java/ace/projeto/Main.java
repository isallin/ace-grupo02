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

            dao.log("Iniciando ETL do ano: " + ano);

            dao.log("Lendo " + ano + "/overview.xlsx");
            LeitorExcel leitor = new LeitorExcel();
            List<PartidaValorant> partidaList = leitor.extrair(ano + "/overview.xlsx");

            dao.log("Inserindo tabelas base " + ano + "...");
            dao.inserirBase(partidaList);

            dao.log("Lendo " + ano + "/scores.xlsx");
            LeitorScores leitorScores = new LeitorScores();
            List<ResultadoPartida> resultados = leitorScores.extrair(ano + "/scores.xlsx");

            dao.atualizarResultados(resultados);

            dao.log("ETL base do ano " + ano + " finalizado.");
        }

        for (String ano : anos) {
            ano = ano.trim();

            dao.log("Carregando IDs para " + ano + "...");
            dao.carregarIds();

            dao.log("Lendo " + ano + "/overview.xlsx");
            LeitorExcel leitor = new LeitorExcel();
            List<PartidaValorant> partidaList = leitor.extrair(ano + "/overview.xlsx");

            dao.log("Inserindo desempenho " + ano + "...");
            dao.inserirDesempenho(partidaList);

            dao.log("Desempenho do ano " + ano + " finalizado.");
        }

        dao.log("Montando composições...");
        dao.montarComposicoes();

        dao.log("Montando estatísticas...");
        dao.montarEstatisticas();

        dao.log("ETL completo para todos os anos.");

        GatilhoAutomate.enviarSinal(
                "ETL finalizado com sucesso para os anos: " + dotenv.get("ANOS")
        );
    }
}