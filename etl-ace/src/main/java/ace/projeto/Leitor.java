package ace.projeto;

import io.github.cdimascio.dotenv.Dotenv;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.util.IOUtils;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;

import java.nio.file.Files;
import java.nio.file.Path;

public abstract class Leitor {

    private static final Dotenv dotenv = Dotenv.load();

    protected XSSFWorkbook abrirArquivo(String arquivo) throws Exception {

        IOUtils.setByteArrayMaxOverride(-1);

        S3Client client = S3Provider.getS3Client();

        GetObjectRequest request =
                GetObjectRequest.builder()
                        .bucket(dotenv.get("S3_BUCKET"))
                        .key(arquivo)
                        .build();

        Path tempFile = Files.createTempFile("etl", ".xlsx");
        client.getObject(request, tempFile);

        return new XSSFWorkbook(tempFile.toFile());
    }

    protected String getTexto(Row row, int coluna) {

        if (row.getCell(coluna) == null)
            return "";

        return row.getCell(coluna)
                .getStringCellValue()
                .trim();
    }

    protected Integer getNumero(Row row, int coluna) {

        if (row.getCell(coluna) == null)
            return 0;

        return (int)
                row.getCell(coluna)
                        .getNumericCellValue();
    }
}