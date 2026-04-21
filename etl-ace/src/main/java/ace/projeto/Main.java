package ace.projeto;

import java.util.List;

public class Main {

    public static void main(String[] args) {

        LeitorExcel leitor =
                new LeitorExcel();

        List<PartidaValorant> lista =
                leitor.extrair("overview.xlsx");

        Conexao conexao =
                new Conexao();

        ValorantDAO dao =
                new ValorantDAO(
                        conexao.getJdbcTemplate()
                );

        dao.inserirDados(lista);
    }
}