package br.com.gtech.assistencia.web.dto;

import br.com.gtech.assistencia.domain.estoque.CategoriaEstoque;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class EstoquePecaRequestDTO {

    @NotBlank
    @Size(max = 80)
    private String sku;

    @NotBlank
    @Size(max = 160)
    private String nome;

    @NotNull
    private CategoriaEstoque categoria;

    @Size(max = 500)
    private String descricao;

    @NotBlank
    @Size(max = 20)
    private String unidadeMedida;

    @NotNull
    @DecimalMin("0.00")
    private BigDecimal custoMedio;

    @NotNull
    @DecimalMin("0.00")
    private BigDecimal precoVenda;

    @NotNull
    @DecimalMin("0.000")
    private BigDecimal quantidadeAtual;

    @NotNull
    @DecimalMin("0.000")
    private BigDecimal estoqueMinimo;

    @NotNull
    private Boolean ativo;

    private Long version;

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

    public CategoriaEstoque getCategoria() {
        return categoria;
    }

    public void setCategoria(CategoriaEstoque categoria) {
        this.categoria = categoria;
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

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }
}
