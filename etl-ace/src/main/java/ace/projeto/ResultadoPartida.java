package ace.projeto;

public class ResultadoPartida {

    private String nomePartida;
    private String vencedor;
    private Integer placarA;
    private Integer placarB;

    public ResultadoPartida(String nomePartida,
                            String vencedor,
                            Integer placarA,
                            Integer placarB) {

        this.nomePartida = nomePartida;
        this.vencedor = vencedor;
        this.placarA = placarA;
        this.placarB = placarB;
    }

    public String getNomePartida() {
        return nomePartida;
    }

    public String getVencedor() {
        return vencedor;
    }

    public Integer getPlacarA() {
        return placarA;
    }

    public Integer getPlacarB() {
        return placarB;
    }
}