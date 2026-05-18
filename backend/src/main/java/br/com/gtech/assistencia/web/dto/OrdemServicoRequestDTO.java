package br.com.gtech.assistencia.web.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class OrdemServicoRequestDTO {

    @Valid
    @NotNull
    private ClienteDTO cliente;

    @Valid
    @NotNull
    private AparelhoDTO aparelho;

    @Valid
    @NotNull
    private ChecklistDTO checklist;

    @Size(max = 300)
    private String acessoriosRecebidos;

    @NotBlank
    @Size(max = 1000)
    private String problemaRelatado;

    @NotBlank
    @Pattern(regexp = "^[0-9A-Za-z]{8,20}$", message = "IMEI confirmado deve conter entre 8 e 20 caracteres alfanumericos.")
    private String imeiConfirmado;

    @Size(max = 120)
    private String senhaDispositivo;

    @Future
    private LocalDateTime dataPrevisao;

    private Long tecnicoId;

    @Valid
    @NotNull
    private List<ItemPecaDTO> itensPecas = new ArrayList<>();

    public ClienteDTO getCliente() {
        return cliente;
    }

    public void setCliente(ClienteDTO cliente) {
        this.cliente = cliente;
    }

    public AparelhoDTO getAparelho() {
        return aparelho;
    }

    public void setAparelho(AparelhoDTO aparelho) {
        this.aparelho = aparelho;
    }

    public ChecklistDTO getChecklist() {
        return checklist;
    }

    public void setChecklist(ChecklistDTO checklist) {
        this.checklist = checklist;
    }

    public String getAcessoriosRecebidos() {
        return acessoriosRecebidos;
    }

    public void setAcessoriosRecebidos(String acessoriosRecebidos) {
        this.acessoriosRecebidos = acessoriosRecebidos;
    }

    public String getProblemaRelatado() {
        return problemaRelatado;
    }

    public void setProblemaRelatado(String problemaRelatado) {
        this.problemaRelatado = problemaRelatado;
    }

    public String getImeiConfirmado() {
        return imeiConfirmado;
    }

    public void setImeiConfirmado(String imeiConfirmado) {
        this.imeiConfirmado = imeiConfirmado;
    }

    public String getSenhaDispositivo() {
        return senhaDispositivo;
    }

    public void setSenhaDispositivo(String senhaDispositivo) {
        this.senhaDispositivo = senhaDispositivo;
    }

    public LocalDateTime getDataPrevisao() {
        return dataPrevisao;
    }

    public void setDataPrevisao(LocalDateTime dataPrevisao) {
        this.dataPrevisao = dataPrevisao;
    }

    public Long getTecnicoId() {
        return tecnicoId;
    }

    public void setTecnicoId(Long tecnicoId) {
        this.tecnicoId = tecnicoId;
    }

    public List<ItemPecaDTO> getItensPecas() {
        return itensPecas;
    }

    public void setItensPecas(List<ItemPecaDTO> itensPecas) {
        this.itensPecas = itensPecas != null ? itensPecas : new ArrayList<>();
    }

    public static class ClienteDTO {

        private Long id;

        @NotBlank
        @Size(max = 150)
        private String nome;

        @NotBlank
        @Size(max = 18)
        private String cpfCnpj;

        @Email
        @Size(max = 180)
        private String email;

        @NotBlank
        @Size(max = 20)
        private String telefone;

        @Size(max = 180)
        private String logradouro;

        @Size(max = 20)
        private String numero;

        @Size(max = 120)
        private String bairro;

        @Size(max = 120)
        private String cidade;

        @Size(max = 2)
        private String uf;

        @Size(max = 10)
        private String cep;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getNome() {
            return nome;
        }

        public void setNome(String nome) {
            this.nome = nome;
        }

        public String getCpfCnpj() {
            return cpfCnpj;
        }

        public void setCpfCnpj(String cpfCnpj) {
            this.cpfCnpj = cpfCnpj;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getTelefone() {
            return telefone;
        }

        public void setTelefone(String telefone) {
            this.telefone = telefone;
        }

        public String getLogradouro() {
            return logradouro;
        }

        public void setLogradouro(String logradouro) {
            this.logradouro = logradouro;
        }

        public String getNumero() {
            return numero;
        }

        public void setNumero(String numero) {
            this.numero = numero;
        }

        public String getBairro() {
            return bairro;
        }

        public void setBairro(String bairro) {
            this.bairro = bairro;
        }

        public String getCidade() {
            return cidade;
        }

        public void setCidade(String cidade) {
            this.cidade = cidade;
        }

        public String getUf() {
            return uf;
        }

        public void setUf(String uf) {
            this.uf = uf;
        }

        public String getCep() {
            return cep;
        }

        public void setCep(String cep) {
            this.cep = cep;
        }
    }

    public static class AparelhoDTO {

        @NotBlank
        @Size(max = 80)
        private String marca;

        @NotBlank
        @Size(max = 120)
        private String modelo;

        @Size(max = 40)
        private String cor;

        @NotBlank
        @Pattern(regexp = "^[0-9A-Za-z]{8,20}$", message = "IMEI deve conter entre 8 e 20 caracteres alfanumericos.")
        private String imei;

        @Size(max = 80)
        private String numeroSerie;

        private boolean bloqueioConta;

        private boolean bloqueioFrp;

        @Size(max = 1000)
        private String observacoes;

        public String getMarca() {
            return marca;
        }

        public void setMarca(String marca) {
            this.marca = marca;
        }

        public String getModelo() {
            return modelo;
        }

        public void setModelo(String modelo) {
            this.modelo = modelo;
        }

        public String getCor() {
            return cor;
        }

        public void setCor(String cor) {
            this.cor = cor;
        }

        public String getImei() {
            return imei;
        }

        public void setImei(String imei) {
            this.imei = imei;
        }

        public String getNumeroSerie() {
            return numeroSerie;
        }

        public void setNumeroSerie(String numeroSerie) {
            this.numeroSerie = numeroSerie;
        }

        public boolean isBloqueioConta() {
            return bloqueioConta;
        }

        public void setBloqueioConta(boolean bloqueioConta) {
            this.bloqueioConta = bloqueioConta;
        }

        public boolean isBloqueioFrp() {
            return bloqueioFrp;
        }

        public void setBloqueioFrp(boolean bloqueioFrp) {
            this.bloqueioFrp = bloqueioFrp;
        }

        public String getObservacoes() {
            return observacoes;
        }

        public void setObservacoes(String observacoes) {
            this.observacoes = observacoes;
        }
    }

    public static class ChecklistDTO {

        @NotBlank
        @Size(max = 300)
        private String tela;

        @NotBlank
        @Size(max = 300)
        private String carcaca;

        @NotBlank
        @Size(max = 300)
        private String botoes;

        @NotBlank
        @Size(max = 300)
        private String conectores;

        @Size(max = 300)
        private String cameras;

        @Size(max = 300)
        private String biometria;

        @NotNull
        private Boolean oxidacao;

        public String getTela() {
            return tela;
        }

        public void setTela(String tela) {
            this.tela = tela;
        }

        public String getCarcaca() {
            return carcaca;
        }

        public void setCarcaca(String carcaca) {
            this.carcaca = carcaca;
        }

        public String getBotoes() {
            return botoes;
        }

        public void setBotoes(String botoes) {
            this.botoes = botoes;
        }

        public String getConectores() {
            return conectores;
        }

        public void setConectores(String conectores) {
            this.conectores = conectores;
        }

        public String getCameras() {
            return cameras;
        }

        public void setCameras(String cameras) {
            this.cameras = cameras;
        }

        public String getBiometria() {
            return biometria;
        }

        public void setBiometria(String biometria) {
            this.biometria = biometria;
        }

        public Boolean getOxidacao() {
            return oxidacao;
        }

        public void setOxidacao(Boolean oxidacao) {
            this.oxidacao = oxidacao;
        }
    }

    public static class ItemPecaDTO {

        private Long estoquePecaId;

        @NotBlank
        @Size(max = 200)
        private String descricao;

        @NotNull
        @DecimalMin(value = "0.001")
        private BigDecimal quantidade;

        @NotNull
        @DecimalMin(value = "0.00")
        private BigDecimal valorUnitario;

        public Long getEstoquePecaId() {
            return estoquePecaId;
        }

        public void setEstoquePecaId(Long estoquePecaId) {
            this.estoquePecaId = estoquePecaId;
        }

        public String getDescricao() {
            return descricao;
        }

        public void setDescricao(String descricao) {
            this.descricao = descricao;
        }

        public BigDecimal getQuantidade() {
            return quantidade;
        }

        public void setQuantidade(BigDecimal quantidade) {
            this.quantidade = quantidade;
        }

        public BigDecimal getValorUnitario() {
            return valorUnitario;
        }

        public void setValorUnitario(BigDecimal valorUnitario) {
            this.valorUnitario = valorUnitario;
        }
    }
}
