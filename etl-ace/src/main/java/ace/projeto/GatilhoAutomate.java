package ace.projeto;

import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.*;


public class GatilhoAutomate {

    public GatilhoAutomate() {
    }

    public static void enviarSinal (String detalheProcessamento) {
        Properties prop = new Properties();
        prop.put("mail.smtp.host", "smtp.gmail.com");
        prop.put("mail.smtp.port", "587");
        prop.put("mail.smtp.auth", "true");
        prop.put("mail.smtp.starttls.enable", "true");

        String user = "gatilhoaceautomate@gmail.com";
        String password = "rlrh tmcm uoor rkdy";

        Session session = Session.getInstance(prop, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(user, password);
            }
        });

        try {
            Message mensagem = new MimeMessage(session);
            mensagem.setFrom(new InternetAddress("gatilhoaceautomate@gmail.com"));
            mensagem.setRecipients(Message.RecipientType.TO, InternetAddress.parse
                    ("gatilhoaceautomate@gmail.com"));
            mensagem.setSubject("Gatilho_ACE");
            mensagem.setText("Agent Composition Engine | Status: Sucesso | " + detalheProcessamento);

            Transport.send(mensagem);
            System.out.println("Simbiose via Power Automate");
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

}
