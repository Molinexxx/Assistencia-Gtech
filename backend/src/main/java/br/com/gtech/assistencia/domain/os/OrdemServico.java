package br.com.gtech.assistencia.domain.os;

import br.com.gtech.assistencia.domain.aparelho.Aparelho;
import br.com.gtech.assistencia.domain.cliente.Cliente;
import br.com.gtech.assistencia.domain.shared.AuditableEntity;
import br.com.gtech.assistencia.domain.usuario.Usuario;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ordens_servico")
public class OrdemServico extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 40)
    private String codigo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "aparelho_id", nullable = false)
    private Aparelho aparelho;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "atendente_id", nullable = false)
    private Usuario atendente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tecnico_id")
    private Usuario tecnico;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private StatusOrdemServico status;

    @Column(name = "problema_relatado", nullable = false, length = 1000)
    private String problemaRelatado;

    @Column(name = "checklist_tela", nullable = false, length = 300)
    private String checklistTela;

    @Column(name = "checklist_carcaca", nullable = false, length = 300)
    private String checklistCarcaca;

    @Column(name = "checklist_botoes", nullable = false, length = 300)
    private String checklistBotoes;

    @Column(name = "checklist_conectores", nullable = false, length = 300)
    private String checklistConectores;

    @Column(name = "checklist_cameras", length = 300)
    private String checklistCameras;

    @Column(name = "checklist_biometria", length = 300)
    private String checklistBiometria;

    @Column(name = "checklist_oxidacao", nullable = false)
    private boolean checklistOxidacao;

    @Column(name = "acessorios_recebidos", length = 300)
    private String acessoriosRecebidos;

    @Column(name = "imei_confirmado", nullable = false, length = 20)
    private String imeiConfirmado;

    @Column(name = "valor_pecas", nullable = false, precision = 15, scale = 2)
    private BigDecimal valorPecas = BigDecimal.ZERO;

    @Column(name = "valor_mao_obra", nullable = false, precision = 15, scale = 2)
    private BigDecimal valorMaoObra = BigDecimal.ZERO;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal desconto = BigDecimal.ZERO;

    @Column(name = "valor_total", nullable = false, precision = 15, scale = 2)
    private BigDecimal valorTotal = BigDecimal.ZERO;

    @Column(name = "data_entrada", nullable = false)
    private LocalDateTime dataEntrada;

    @Column(name = "data_previsao")
    private LocalDateTime dataPrevisao;

    @Column(name = "data_fechamento")
    private LocalDateTime dataFechamento;

    @Column(name = "data_entrega")
    private LocalDateTime dataEntrega;

    @Version
    @Column(nullable = false)
    private Long version;

    @OneToMany(mappedBy = "ordemServico", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemOrdemServicoPeca> itensPecas = new ArrayList<>();

    public void adicionarItem(ItemOrdemServicoPeca item) {
        item.setOrdemServico(this);
        this.itensPecas.add(item);
    }

    public Long getId() {
        return id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Aparelho getAparelho() {
        return aparelho;
    }

    public void setAparelho(Aparelho aparelho) {
        this.aparelho = aparelho;
    }

    public Usuario getAtendente() {
        return atendente;
    }

    public void setAtendente(Usuario atendente) {
        this.atendente = atendente;
    }

    public Usuario getTecnico() {
        return tecnico;
    }

    public void setTecnico(Usuario tecnico) {
        this.tecnico = tecnico;
    }

    public StatusOrdemServico getStatus() {
        return status;
    }

    public void setStatus(StatusOrdemServico status) {
        this.status = status;
    }

    public String getProblemaRelatado() {
        return problemaRelatado;
    }

    public void setProblemaRelatado(String problemaRelatado) {
        this.problemaRelatado = problemaRelatado;
    }

    public String getChecklistTela() {
        return checklistTela;
    }

    public void setChecklistTela(String checklistTela) {
        this.checklistTela = checklistTela;
    }

    public String getChecklistCarcaca() {
        return checklistCarcaca;
    }

    public void setChecklistCarcaca(String checklistCarcaca) {
        this.checklistCarcaca = checklistCarcaca;
    }

    public String getChecklistBotoes() {
        return checklistBotoes;
    }

    public void setChecklistBotoes(String checklistBotoes) {
        this.checklistBotoes = checklistBotoes;
    }

    public String getChecklistConectores() {
        return checklistConectores;
    }

    public void setChecklistConectores(String checklistConectores) {
        this.checklistConectores = checklistConectores;
    }

    public String getChecklistCameras() {
        return checklistCameras;
    }

    public void setChecklistCameras(String checklistCameras) {
        this.checklistCameras = checklistCameras;
    }

    public String getChecklistBiometria() {
        return checklistBiometria;
    }

    public void setChecklistBiometria(String checklistBiometria) {
        this.checklistBiometria = checklistBiometria;
    }

    public boolean isChecklistOxidacao() {
        return checklistOxidacao;
    }

    public void setChecklistOxidacao(boolean checklistOxidacao) {
        this.checklistOxidacao = checklistOxidacao;
    }

    public String getAcessoriosRecebidos() {
        return acessoriosRecebidos;
    }

    public void setAcessoriosRecebidos(String acessoriosRecebidos) {
        this.acessoriosRecebidos = acessoriosRecebidos;
    }

    public String getImeiConfirmado() {
        return imeiConfirmado;
    }

    public void setImeiConfirmado(String imeiConfirmado) {
        this.imeiConfirmado = imeiConfirmado;
    }

    public BigDecimal getValorPecas() {
        return valorPecas;
    }

    public void setValorPecas(BigDecimal valorPecas) {
        this.valorPecas = valorPecas;
    }

    public BigDecimal getValorMaoObra() {
        return valorMaoObra;
    }

    public void setValorMaoObra(BigDecimal valorMaoObra) {
        this.valorMaoObra = valorMaoObra;
    }

    public BigDecimal getDesconto() {
        return desconto;
    }

    public void setDesconto(BigDecimal desconto) {
        this.desconto = desconto;
    }

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }

    public LocalDateTime getDataEntrada() {
        return dataEntrada;
    }

    public void setDataEntrada(LocalDateTime dataEntrada) {
        this.dataEntrada = dataEntrada;
    }

    public LocalDateTime getDataPrevisao() {
        return dataPrevisao;
    }

    public void setDataPrevisao(LocalDateTime dataPrevisao) {
        this.dataPrevisao = dataPrevisao;
    }

    public LocalDateTime getDataFechamento() {
        return dataFechamento;
    }

    public void setDataFechamento(LocalDateTime dataFechamento) {
        this.dataFechamento = dataFechamento;
    }

    public LocalDateTime getDataEntrega() {
        return dataEntrega;
    }

    public void setDataEntrega(LocalDateTime dataEntrega) {
        this.dataEntrega = dataEntrega;
    }

    public Long getVersion() {
        return version;
    }

    public List<ItemOrdemServicoPeca> getItensPecas() {
        return itensPecas;
    }
}
