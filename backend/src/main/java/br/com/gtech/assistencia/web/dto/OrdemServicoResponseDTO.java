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
    private String clienteNome;
    private String aparelhoDescricao;
    private BigDecimal valorPecas;
    private BigDecimal valorMaoObra;
    private BigDecimal desconto;
    private BigDecimal valorTotal;
    private LocalDateTime dataEntrada;
    private Long version;
    private List<ItemResumoDTO> itens = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public StatusOrdemServico getStatus() {
        return status;
    }

    public void setStatus(StatusOrdemServico status) {
        this.status = status;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public Long getAparelhoId() {
        return aparelhoId;
    }

    public void setAparelhoId(Long aparelhoId) {
        this.aparelhoId = aparelhoId;
    }

    public Long getAtendenteId() {
        return atendenteId;
    }

    public void setAtendenteId(Long atendenteId) {
        this.atendenteId = atendenteId;
    }

    public Long getTecnicoId() {
        return tecnicoId;
    }

    public void setTecnicoId(Long tecnicoId) {
        this.tecnicoId = tecnicoId;
    }

    public String getClienteNome() {
        return clienteNome;
    }

    public void setClienteNome(String clienteNome) {
        this.clienteNome = clienteNome;
    }

    public String getAparelhoDescricao() {
        return aparelhoDescricao;
    }

    public void setAparelhoDescricao(String aparelhoDescricao) {
        this.aparelhoDescricao = aparelhoDescricao;
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

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    public List<ItemResumoDTO> getItens() {
        return itens;
    }

    public void setItens(List<ItemResumoDTO> itens) {
        this.itens = itens;
    }

    public static class ItemResumoDTO {
        private Long id;
        private Long estoquePecaId;
        private String descricao;
        private BigDecimal quantidade;
        private BigDecimal valorUnitario;
        private BigDecimal subtotal;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

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

        public BigDecimal getSubtotal() {
            return subtotal;
        }

        public void setSubtotal(BigDecimal subtotal) {
            this.subtotal = subtotal;
        }
    }
}
