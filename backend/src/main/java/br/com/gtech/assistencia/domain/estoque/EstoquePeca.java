package br.com.gtech.assistencia.domain.estoque;

import br.com.gtech.assistencia.domain.shared.AuditableEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

import java.math.BigDecimal;

@Entity
@Table(name = "estoque_pecas")
public class EstoquePeca extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 80)
    private String sku;

    @Column(nullable = false, length = 160)
    private String nome;

    @Column(length = 500)
    private String descricao;

    @Column(name = "unidade_medida", nullable = false, length = 20)
    private String unidadeMedida;

    @Column(name = "custo_medio", nullable = false, precision = 15, scale = 2)
    private BigDecimal custoMedio = BigDecimal.ZERO;

    @Column(name = "preco_venda", nullable = false, precision = 15, scale = 2)
    private BigDecimal precoVenda = BigDecimal.ZERO;

    @Column(name = "quantidade_atual", nullable = false, precision = 15, scale = 3)
    private BigDecimal quantidadeAtual = BigDecimal.ZERO;

    @Column(name = "estoque_minimo", nullable = false, precision = 15, scale = 3)
    private BigDecimal estoqueMinimo = BigDecimal.ZERO;

    @Column(nullable = false)
    private boolean ativo = true;

    @Version
    @Column(nullable = false)
    private Long version;

    public Long getId() {
        return id;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getUnidadeMedida() {
        return unidadeMedida;
    }

    public void setUnidadeMedida(String unidadeMedida) {
        this.unidadeMedida = unidadeMedida;
    }

    public BigDecimal getCustoMedio() {
        return custoMedio;
    }

    public void setCustoMedio(BigDecimal custoMedio) {
        this.custoMedio = custoMedio;
    }

    public BigDecimal getPrecoVenda() {
        return precoVenda;
    }

    public void setPrecoVenda(BigDecimal precoVenda) {
        this.precoVenda = precoVenda;
    }

    public BigDecimal getQuantidadeAtual() {
        return quantidadeAtual;
    }

    public void setQuantidadeAtual(BigDecimal quantidadeAtual) {
        this.quantidadeAtual = quantidadeAtual;
    }

    public BigDecimal getEstoqueMinimo() {
        return estoqueMinimo;
    }

    public void setEstoqueMinimo(BigDecimal estoqueMinimo) {
        this.estoqueMinimo = estoqueMinimo;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public Long getVersion() {
        return version;
    }
}
