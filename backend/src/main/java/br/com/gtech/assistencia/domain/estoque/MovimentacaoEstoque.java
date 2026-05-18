package br.com.gtech.assistencia.domain.estoque;

import br.com.gtech.assistencia.domain.os.OrdemServico;
import br.com.gtech.assistencia.domain.usuario.Usuario;
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
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimentacao_estoque")
public class MovimentacaoEstoque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "estoque_peca_id", nullable = false)
    private EstoquePeca estoquePeca;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ordem_servico_id")
    private OrdemServico ordemServico;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_movimento", nullable = false, length = 30)
    private TipoMovimentoEstoque tipoMovimento;

    @Column(nullable = false, precision = 15, scale = 3)
    private BigDecimal quantidade;

    @Column(name = "saldo_anterior", nullable = false, precision = 15, scale = 3)
    private BigDecimal saldoAnterior;

    @Column(name = "saldo_posterior", nullable = false, precision = 15, scale = 3)
    private BigDecimal saldoPosterior;

    @Column(length = 500)
    private String observacao;

    @Column(name = "data_movimento", nullable = false, updatable = false)
    private LocalDateTime dataMovimento;

    @PrePersist
    public void prePersist() {
        this.dataMovimento = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public EstoquePeca getEstoquePeca() {
        return estoquePeca;
    }

    public void setEstoquePeca(EstoquePeca estoquePeca) {
        this.estoquePeca = estoquePeca;
    }

    public OrdemServico getOrdemServico() {
        return ordemServico;
    }

    public void setOrdemServico(OrdemServico ordemServico) {
        this.ordemServico = ordemServico;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public TipoMovimentoEstoque getTipoMovimento() {
        return tipoMovimento;
    }

    public void setTipoMovimento(TipoMovimentoEstoque tipoMovimento) {
        this.tipoMovimento = tipoMovimento;
    }

    public BigDecimal getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(BigDecimal quantidade) {
        this.quantidade = quantidade;
    }

    public BigDecimal getSaldoAnterior() {
        return saldoAnterior;
    }

    public void setSaldoAnterior(BigDecimal saldoAnterior) {
        this.saldoAnterior = saldoAnterior;
    }

    public BigDecimal getSaldoPosterior() {
        return saldoPosterior;
    }

    public void setSaldoPosterior(BigDecimal saldoPosterior) {
        this.saldoPosterior = saldoPosterior;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }
}
