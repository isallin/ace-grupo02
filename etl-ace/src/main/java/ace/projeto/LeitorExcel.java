package ace.projeto;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.util.ArrayList;
import java.util.List;

public class LeitorExcel extends Leitor {

    public List<PartidaValorant> extrair(String arquivo) {


        String ano = arquivo.split("/")[0];
        String filtro = "Valorant Champions " + ano;

        List<PartidaValorant> lista = new ArrayList<>();

        try {

            XSSFWorkbook workbook = abrirArquivo(arquivo);
            Sheet sheet = workbook.getSheetAt(0);

            for (Row row : sheet) {

                if (row.getRowNum() == 0)
                    continue;

                String mapa = getTexto(row, 4);

                if (mapa.equalsIgnoreCase("All Maps"))
                    continue;

                String nomePartida = getTexto(row, 0);
                if (!nomePartida.equalsIgnoreCase(filtro)){
                    continue;
                }

                PartidaValorant p =
                        new PartidaValorant(
                                nomePartida,
                                getTexto(row, 1),
                                getTexto(row, 3),
                                mapa,
                                getTexto(row, 6),
                                getTexto(row, 7),
                                getNumero(row, 10),
                                getNumero(row, 11),
                                getNumero(row, 12)
                        );

                lista.add(p);
            }

            workbook.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return lista;
    }
}