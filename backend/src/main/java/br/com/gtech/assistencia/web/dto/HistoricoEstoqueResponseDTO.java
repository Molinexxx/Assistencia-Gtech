package br.com.gtech.assistencia.web.dto;

import java.util.List;

public record HistoricoEstoqueResponseDTO(
        List<MovimentacaoEstoqueResponseDTO> movimentacoes,
        int pagina,
        int totalPaginas,
        long totalElementos
) {}
