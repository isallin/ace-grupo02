package ace.projeto;

import io.github.cdimascio.dotenv.Dotenv;
import org.json.JSONObject;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class Slack {

    private static final HttpClient client = HttpClient.newHttpClient();
    private static final Dotenv dotenv     = Dotenv.load();
    private static final String WEBHOOK_PUBLICACOES = dotenv.get("WEBHOOK_PUBLICACOES");
    private static final String WEBHOOK_COMENTARIOS = dotenv.get("WEBHOOK_COMENTARIOS");
    private static final String WEBHOOK_MONITOR     = dotenv.get("WEBHOOK_MONITOR");

    public static void enviarMensagem(JSONObject content, String webhookUrl) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder(URI.create(webhookUrl))
                .header("Content-Type", "application/json")
                .header("accept", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(content.toString()))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        System.out.println("[Slack] Status: " + response.statusCode());
        if (response.statusCode() != 200) {
            System.err.println("[Slack] Resposta inesperada → " + response.body());
        }
    }

    static void notificar(String texto, String canal) {
        try {
            String webhook;
            switch (canal) {
                case "#comentários":
                    webhook = WEBHOOK_COMENTARIOS;
                    break;
                case "#publicações":
                    webhook = WEBHOOK_PUBLICACOES;
                    break;
                default:
                    webhook = WEBHOOK_MONITOR;
                    break;
            }

            JSONObject json = new JSONObject();
            json.put("text", texto);
            enviarMensagem(json, webhook);

        } catch (Exception e) {
            System.err.println("[Slack] Falha ao notificar: " + e.getMessage());
        }
    }

    static void notificar(String texto) {
        notificar(texto, "#publicações");
    }
}