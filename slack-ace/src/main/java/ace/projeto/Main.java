package ace.projeto;

public class Main {

    public static void main(String[] args) {

        try {

            System.out.println("[Main] Conectando ao banco...");

            Conexao conexao = new Conexao();
            var jdbc        = conexao.getJdbcTemplate();

            System.out.println("[Main] Conexão estabelecida!");

            SlackMonitor monitor = new SlackMonitor(jdbc);
            monitor.iniciar();
        } catch (Exception e) {
            System.err.println("[Main] Erro ao iniciar: " + e.getMessage());
            e.printStackTrace();
        }
    }
}