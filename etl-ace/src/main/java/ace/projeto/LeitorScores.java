package ace.projeto;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.List;

public class LeitorScores {

    public List<ResultadoPartida> extrair(String arquivo) {

        List<ResultadoPartida> lista =
                new ArrayList<>();

        try {

            XSSFWorkbook workbook =
                    new XSSFWorkbook(
                            new FileInputStream(arquivo));

            Sheet sheet =
                    workbook.getSheetAt(0);

            for (Row row : sheet) {

                if (row.getRowNum() == 0)
                    continue;

                String nomePartida =
                        getTexto(row, 3);

                String vencedor =
                        getTexto(row, 8)
                                .replace(" won", "")
                                .trim();

                Integer placarA =
                        getNumero(row, 6);

                Integer placarB =
                        getNumero(row, 7);

                ResultadoPartida r =
                        new ResultadoPartida(
                                nomePartida,
                                vencedor,
                                placarA,
                                placarB
                        );

                lista.add(r);
            }

            workbook.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return lista;
    }

    private String getTexto(Row row, int coluna) {

        if (row.getCell(coluna) == null)
            return "";

        return row.getCell(coluna)
                .getStringCellValue()
                .trim();
    }

    private Integer getNumero(Row row, int coluna) {

        if (row.getCell(coluna) == null)
            return 0;

        return (int)
                row.getCell(coluna)
                        .getNumericCellValue();
    }
}