package ace.projeto;

import org.springframework.jdbc.core.JdbcTemplate;
import java.util.List;
import java.util.Map;

public class SlackMonitor {

    private final JdbcTemplate jdbc;

    public SlackMonitor(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public void iniciar() {
        System.out.println("[SlackMonitor] Verificando pendentes...");
        Slack.notificar("🔍 *SlackMonitor A.C.E. ativo*\n> Verificando notificações pendentes.", "#ace-bot");
        verificarPendentes();
        System.out.println("[SlackMonitor] Verificação concluída.");
    }

    private void verificarPendentes() {
        List<Map<String, Object>> pendentes = jdbc.queryForList(
                "SELECT * FROM slack_integracao WHERE status_envio = 'PENDENTE' ORDER BY data_envio ASC"
        );

        if (pendentes.isEmpty()) {
            System.out.println("[SlackMonitor] Nenhum evento pendente.");
            return;
        }

        System.out.println("[SlackMonitor] " + pendentes.size() + " evento(s) pendente(s).");

        for (Map<String, Object> evento : pendentes) {
            processarEvento(evento);
        }
    }

    private void processarEvento(Map<String, Object> evento) {
        int id            = (int) evento.get("id");
        String tipoEvento = (String) evento.get("tipo_evento");
        String mensagem   = (String) evento.get("mensagem");
        String canal      = (String) evento.get("canal");

        try {
            String msgFinal = montarMensagem(tipoEvento, mensagem, canal, evento);
            Slack.notificar(msgFinal, canal);

            jdbc.update(
                    "UPDATE slack_integracao SET status_envio = 'ENVIADO' WHERE id = ?",
                    id
            );

            System.out.println("[SlackMonitor] Evento #" + id + " (" + tipoEvento + ") enviado → " + canal);

        } catch (Exception e) {
            jdbc.update(
                    "UPDATE slack_integracao SET status_envio = 'ERRO' WHERE id = ?",
                    id
            );
            System.err.println("[SlackMonitor] Falha no evento #" + id + ": " + e.getMessage());
        }
    }

    private String montarMensagem(String tipoEvento, String mensagem, String canal, Map<String, Object> evento) {
        String dataEnvio = evento.get("data_envio") != null
                ? evento.get("data_envio").toString()
                : "agora";

        switch (tipoEvento) {
            case "NOVO_POST":
                return "📝 *Novo post no A.C.E. Blog!*\n"
                        + "> " + mensagem + "\n"
                        + "> 🕐 " + dataEnvio;
            case "NOVO_COMENTARIO":
                return "💬 *Novo comentário no A.C.E. Blog!*\n"
                        + "> " + mensagem + "\n"
                        + "> 🕐 " + dataEnvio;
            default:
                return "🔔 *Evento A.C.E.:* " + tipoEvento + "\n> " + mensagem;
        }
    }
}