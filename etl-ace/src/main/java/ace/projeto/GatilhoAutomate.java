package ace.projeto;

import io.github.cdimascio.dotenv.Dotenv;

import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.*;


public class GatilhoAutomate {

    private static final Dotenv dotenv = Dotenv.load();

    public GatilhoAutomate() {
    }

    public static void enviarSinal(String detalheProcessamento) {

        Properties prop = new Properties();
        prop.put("mail.smtp.host", "smtp.gmail.com");
        prop.put("mail.smtp.port", "587");
        prop.put("mail.smtp.auth", "true");
        prop.put("mail.smtp.starttls.enable", "true");

        String user     = dotenv.get("MAIL_USER");
        String password = dotenv.get("MAIL_PASSWORD");
        String mailTo   = dotenv.get("MAIL_TO");

        Session session = Session.getInstance(prop, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(user, password);
            }
        });

        try {
            Message mensagem = new MimeMessage(session);
            mensagem.setFrom(new InternetAddress(user));
            mensagem.setRecipients(Message.RecipientType.TO,
                    InternetAddress.parse(mailTo));
            mensagem.setSubject("Gatilho_ACE");
            mensagem.setText("Agent Composition Engine | Status: Sucesso | "
                    + detalheProcessamento);

            Transport.send(mensagem);
            System.out.println("Simbiose via Power Automate");
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}