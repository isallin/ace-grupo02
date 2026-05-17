package ace.projeto;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

public class Conexao {

    private static final Dotenv dotenv = Dotenv.load();

    public JdbcTemplate getJdbcTemplate() {

        DriverManagerDataSource dataSource =
                new DriverManagerDataSource();

        dataSource.setDriverClassName(
                "com.mysql.cj.jdbc.Driver");

        dataSource.setUrl(
                dotenv.get("DB_URL"));

        dataSource.setUsername(dotenv.get("DB_USER"));
        dataSource.setPassword(dotenv.get("DB_PASSWORD"));

        return new JdbcTemplate(dataSource);
    }
}