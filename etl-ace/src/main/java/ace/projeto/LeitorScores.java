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

public class LeitorScores {

    private static final Dotenv dotenv = Dotenv.load();

    public List<ResultadoPartida> extrair(String arquivo) {

        IOUtils.setByteArrayMaxOverride(-1);

        List<ResultadoPartida> lista =
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