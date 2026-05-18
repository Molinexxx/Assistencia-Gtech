package br.com.gtech.assistencia.web.dto;

import br.com.gtech.assistencia.domain.os.StatusOrdemServico;
import jakarta.validation.constraints.NotNull;

public class AtualizarStatusOrdemServicoRequestDTO {

    @NotNull
    private StatusOrdemServico status;

    @NotNull
    private Long version;

    public StatusOrdemServico getStatus() {
        return status;
    }

    public void setStatus(StatusOrdemServico status) {
        this.status = status;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }
}
