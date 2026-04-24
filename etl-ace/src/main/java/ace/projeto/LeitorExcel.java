package ace.projeto;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.List;

public class LeitorExcel {

    public List<PartidaValorant> extrair(String arquivo) {

        List<PartidaValorant> lista =
                new ArrayList<>();

        try {

            XSSFWorkbook workbook =
                    new XSSFWorkbook(
                            new FileInputStream(arquivo));

            Sheet sheet = workbook.getSheetAt(0);

            for (Row row : sheet) {

                if (row.getRowNum() == 0)
                    continue;

                String mapa =
                        getTexto(row, 4);

                if (mapa.equalsIgnoreCase("All Maps"))
                    continue;

                PartidaValorant p =
                        new PartidaValorant(

                                getTexto(row,0),
                                getTexto(row,1),
                                getTexto(row,3),
                                mapa,
                                getTexto(row,6),
                                getTexto(row,7),
                                getNumero(row,10),
                                getNumero(row,11),
                                getNumero(row,12)
                        );

                lista.add(p);
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
                .getStringCellValue();
    }

    private Integer getNumero(Row row, int coluna) {

        if (row.getCell(coluna) == null)
            return 0;

        return (int)
                row.getCell(coluna)
                        .getNumericCellValue();
    }
}