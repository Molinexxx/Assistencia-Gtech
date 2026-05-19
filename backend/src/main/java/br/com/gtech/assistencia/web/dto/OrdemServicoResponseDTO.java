package br.com.gtech.assistencia.web.dto;

import br.com.gtech.assistencia.domain.os.StatusOrdemServico;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class OrdemServicoResponseDTO {

    private Long id;
    private String codigo;
    private StatusOrdemServico status;
    private Long clienteId;
    private Long aparelhoId;
    private Long atendenteId;
    private Long tecnicoId;
    private String tecnicoNome;
    private String clienteNome;
    private String clienteCpfCnpj;
    private String clienteTelefone;
    private String aparelhoDescricao;
    private BigDecimal valorPecas;
    private BigDecimal valorMaoObra;
    private BigDecimal desconto;
    private BigDecimal valorTotal;
    private String acessoriosRecebidos;
    private String problemaRelatado;
    private String imeiConfirmado;
    private String senhaDispositivo;
    private LocalDateTime dataEntrada;
    private LocalDateTime dataPrevisao;
    private Long version;
    private ClienteDetalheDTO cliente;
    private AparelhoDetalheDTO aparelho;
    private ChecklistDTO checklist;
    private List<ItemResumoDTO> itens = new ArrayList<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    public StatusOrdemServico getStatus() { return status; }
    public void setStatus(StatusOrdemServico status) { this.status = status; }
    public Long getClienteId() { return clienteId; }
    public void setClienteId(Long clienteId) { this.clienteId = clienteId; }
    public Long getAparelhoId() { return aparelhoId; }
    public void setAparelhoId(Long aparelhoId) { this.aparelhoId = aparelhoId; }
    public Long getAtendenteId() { return atendenteId; }
    public void setAtendenteId(Long atendenteId) { this.atendenteId = atendenteId; }
    public Long getTecnicoId() { return tecnicoId; }
    public void setTecnicoId(Long tecnicoId) { this.tecnicoId = tecnicoId; }
    public String getTecnicoNome() { return tecnicoNome; }
    public void setTecnicoNome(String tecnicoNome) { this.tecnicoNome = tecnicoNome; }
    public String getClienteNome() { return clienteNome; }
    public void setClienteNome(String clienteNome) { this.clienteNome = clienteNome; }
    public String getClienteCpfCnpj() { return clienteCpfCnpj; }
    public void setClienteCpfCnpj(String clienteCpfCnpj) { this.clienteCpfCnpj = clienteCpfCnpj; }
    public String getClienteTelefone() { return clienteTelefone; }
    public void setClienteTelefone(String clienteTelefone) { this.clienteTelefone = clienteTelefone; }
    public String getAparelhoDescricao() { return aparelhoDescricao; }
    public void setAparelhoDescricao(String aparelhoDescricao) { this.aparelhoDescricao = aparelhoDescricao; }
    public BigDecimal getValorPecas() { return valorPecas; }
    public void setValorPecas(BigDecimal valorPecas) { this.valorPecas = valorPecas; }
    public BigDecimal getValorMaoObra() { return valorMaoObra; }
    public void setValorMaoObra(BigDecimal valorMaoObra) { this.valorMaoObra = valorMaoObra; }
    public BigDecimal getDesconto() { return desconto; }
    public void setDesconto(BigDecimal desconto) { this.desconto = desconto; }
    public BigDecimal getValorTotal() { return valorTotal; }
    public void setValorTotal(BigDecimal valorTotal) { this.valorTotal = valorTotal; }
    public String getAcessoriosRecebidos() { return acessoriosRecebidos; }
    public void setAcessoriosRecebidos(String acessoriosRecebidos) { this.acessoriosRecebidos = acessoriosRecebidos; }
    public String getProblemaRelatado() { return problemaRelatado; }
    public void setProblemaRelatado(String problemaRelatado) { this.problemaRelatado = problemaRelatado; }
    public String getImeiConfirmado() { return imeiConfirmado; }
    public void setImeiConfirmado(String imeiConfirmado) { this.imeiConfirmado = imeiConfirmado; }
    public String getSenhaDispositivo() { return senhaDispositivo; }
    public void setSenhaDispositivo(String senhaDispositivo) { this.senhaDispositivo = senhaDispositivo; }
    public LocalDateTime getDataEntrada() { return dataEntrada; }
    public void setDataEntrada(LocalDateTime dataEntrada) { this.dataEntrada = dataEntrada; }
    public LocalDateTime getDataPrevisao() { return dataPrevisao; }
    public void setDataPrevisao(LocalDateTime dataPrevisao) { this.dataPrevisao = dataPrevisao; }
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
    public ClienteDetalheDTO getCliente() { return cliente; }
    public void setCliente(ClienteDetalheDTO cliente) { this.cliente = cliente; }
    public AparelhoDetalheDTO getAparelho() { return aparelho; }
    public void setAparelho(AparelhoDetalheDTO aparelho) { this.aparelho = aparelho; }
    public ChecklistDTO getChecklist() { return checklist; }
    public void setChecklist(ChecklistDTO checklist) { this.checklist = checklist; }
    public List<ItemResumoDTO> getItens() { return itens; }
    public void setItens(List<ItemResumoDTO> itens) { this.itens = itens; }

    public static class ClienteDetalheDTO {
        private Long id;
        private String nome;
        private String cpfCnpj;
        private String email;
        private String telefone;
        private String logradouro;
        private String numero;
        private String bairro;
        private String cidade;
        private String uf;
        private String cep;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome; }
        public String getCpfCnpj() { return cpfCnpj; }
        public void setCpfCnpj(String cpfCnpj) { this.cpfCnpj = cpfCnpj; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getTelefone() { return telefone; }
        public void setTelefone(String telefone) { this.telefone = telefone; }
        public String getLogradouro() { return logradouro; }
        public void setLogradouro(String logradouro) { this.logradouro = logradouro; }
        public String getNumero() { return numero; }
        public void setNumero(String numero) { this.numero = numero; }
        public String getBairro() { return bairro; }
        public void setBairro(String bairro) { this.bairro = bairro; }
        public String getCidade() { return cidade; }
        public void setCidade(String cidade) { this.cidade = cidade; }
        public String getUf() { return uf; }
        public void setUf(String uf) { this.uf = uf; }
        public String getCep() { return cep; }
        public void setCep(String cep) { this.cep = cep; }
    }
    public static class AparelhoDetalheDTO {
        private String marca;
        private String modelo;
        private String cor;
        private String imei;
        private String numeroSerie;
        private boolean bloqueioConta;
        private boolean bloqueioFrp;
        private String observacoes;

        public String getMarca() { return marca; }
        public void setMarca(String marca) { this.marca = marca; }
        public String getModelo() { return modelo; }
        public void setModelo(String modelo) { this.modelo = modelo; }
        public String getCor() { return cor; }
        public void setCor(String cor) { this.cor = cor; }
        public String getImei() { return imei; }
        public void setImei(String imei) { this.imei = imei; }
        public String getNumeroSerie() { return numeroSerie; }
        public void setNumeroSerie(String numeroSerie) { this.numeroSerie = numeroSerie; }
        public boolean isBloqueioConta() { return bloqueioConta; }
        public void setBloqueioConta(boolean bloqueioConta) { this.bloqueioConta = bloqueioConta; }
        public boolean isBloqueioFrp() { return bloqueioFrp; }
        public void setBloqueioFrp(boolean bloqueioFrp) { this.bloqueioFrp = bloqueioFrp; }
        public String getObservacoes() { return observacoes; }
        public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
    }

    public static class ChecklistDTO {
        private String tela;
        private String carcaca;
        private String botoes;
        private String conectores;
        private String cameras;
        private String biometria;
        private Boolean oxidacao;

        public String getTela() { return tela; }
        public void setTela(String tela) { this.tela = tela; }
        public String getCarcaca() { return carcaca; }
        public void setCarcaca(String carcaca) { this.carcaca = carcaca; }
        public String getBotoes() { return botoes; }
        public void setBotoes(String botoes) { this.botoes = botoes; }
        public String getConectores() { return conectores; }
        public void setConectores(String conectores) { this.conectores = conectores; }
        public String getCameras() { return cameras; }
        public void setCameras(String cameras) { this.cameras = cameras; }
        public String getBiometria() { return biometria; }
        public void setBiometria(String biometria) { this.biometria = biometria; }
        public Boolean getOxidacao() { return oxidacao; }
        public void setOxidacao(Boolean oxidacao) { this.oxidacao = oxidacao; }
    }

    public static class ItemResumoDTO {
        private Long id;
        private Long estoquePecaId;
        private String descricao;
        private BigDecimal quantidade;
        private BigDecimal valorUnitario;
        private BigDecimal subtotal;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getEstoquePecaId() { return estoquePecaId; }
        public void setEstoquePecaId(Long estoquePecaId) { this.estoquePecaId = estoquePecaId; }
        public String getDescricao() { return descricao; }
        public void setDescricao(String descricao) { this.descricao = descricao; }
        public BigDecimal getQuantidade() { return quantidade; }
        public void setQuantidade(BigDecimal quantidade) { this.quantidade = quantidade; }
        public BigDecimal getValorUnitario() { return valorUnitario; }
        public void setValorUnitario(BigDecimal valorUnitario) { this.valorUnitario = valorUnitario; }
        public BigDecimal getSubtotal() { return subtotal; }
        public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    }
}
