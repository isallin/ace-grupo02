package ace.projeto;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

public class Conexao {

    public JdbcTemplate getJdbcTemplate() {

        DriverManagerDataSource dataSource =
                new DriverManagerDataSource();

        dataSource.setDriverClassName(
                "com.mysql.cj.jdbc.Driver");

        dataSource.setUrl(
                "jdbc:mysql://localhost:3306/projetoAce");

        dataSource.setUsername("root");
        dataSource.setPassword("Lucas@3012");

        return new JdbcTemplate(dataSource);
    }
}