package ace.projeto;

import io.github.cdimascio.dotenv.Dotenv;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.util.IOUtils;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;

import java.util.ArrayList;
import java.util.List;

public class LeitorExcel {

    private static final Dotenv dotenv = Dotenv.load();

    public List<PartidaValorant> extrair(String arquivo) {

        IOUtils.setByteArrayMaxOverride(-1);

        List<PartidaValorant> lista =
                new ArrayList<>();

        try {

            S3Client client = S3Provider.getS3Client();

            GetObjectRequest request =
                    GetObjectRequest.builder()
                            .bucket(dotenv.get("S3_BUCKET"))
                            .key(arquivo)
                            .build();

            XSSFWorkbook workbook =
                    new XSSFWorkbook(
                            client.getObject(request)
                    );

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

                                getTexto(row, 0),
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