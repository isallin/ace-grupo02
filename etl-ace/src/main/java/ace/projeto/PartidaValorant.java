package ace.projeto;

public class PartidaValorant {

    private String campeonato;
    private String etapa;
    private String nomePartida;
    private String mapa;
    private String time;
    private String agente;

    private Integer kills;
    private Integer deaths;
    private Integer assists;

    public PartidaValorant(String campeonato,
                           String etapa,
                           String nomePartida,
                           String mapa,
                           String time,
                           String agente,
                           Integer kills,
                           Integer deaths,
                           Integer assists) {

        this.campeonato = campeonato;
        this.etapa = etapa;
        this.nomePartida = nomePartida;
        this.mapa = mapa;
        this.time = time;
        this.agente = agente;
        this.kills = kills;
        this.deaths = deaths;
        this.assists = assists;
    }

    public String getCampeonato() { return campeonato; }
    public String getEtapa() { return etapa; }
    public String getNomePartida() { return nomePartida; }
    public String getMapa() { return mapa; }
    public String getTime() { return time; }
    public String getAgente() { return agente; }

    public Integer getKills() { return kills; }
    public Integer getDeaths() { return deaths; }
    public Integer getAssists() { return assists; }
}