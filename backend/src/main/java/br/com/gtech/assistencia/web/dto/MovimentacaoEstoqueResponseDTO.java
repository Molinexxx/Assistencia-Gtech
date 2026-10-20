package br.com.gtech.assistencia.web.dto;

import br.com.gtech.assistencia.domain.estoque.TipoMovimentoEstoque;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record MovimentacaoEstoqueResponseDTO(
        Long id,
        TipoMovimentoEstoque tipoMovimento,
        BigDecimal quantidade,
        BigDecimal saldoAnterior,
        BigDecimal saldoPosterior,
        String observacao,
        LocalDateTime dataMovimento,
        String usuarioNome
) {}
