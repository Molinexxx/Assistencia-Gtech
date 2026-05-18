package br.com.gtech.assistencia.web.dto;

import br.com.gtech.assistencia.domain.estoque.TipoMovimentoEstoque;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class AjusteEstoqueRequestDTO {

    @NotNull
    private TipoMovimentoEstoque tipoMovimento;

    @NotNull
    @DecimalMin("0.001")
    private BigDecimal quantidade;

    @Size(max = 500)
    private String observacao;

    @NotNull
    private Long version;

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

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }
}
