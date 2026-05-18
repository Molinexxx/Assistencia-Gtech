package br.com.gtech.assistencia.web.controller;

import br.com.gtech.assistencia.application.service.OrdemServicoService;
import br.com.gtech.assistencia.domain.os.StatusOrdemServico;
import br.com.gtech.assistencia.web.dto.AtualizarStatusOrdemServicoRequestDTO;
import br.com.gtech.assistencia.web.dto.OrdemServicoRequestDTO;
import br.com.gtech.assistencia.web.dto.OrdemServicoResponseDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/ordens-servico")
public class OrdemServicoController {

    private final OrdemServicoService ordemServicoService;

    public OrdemServicoController(OrdemServicoService ordemServicoService) {
        this.ordemServicoService = ordemServicoService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','ATENDENTE')")
    public ResponseEntity<OrdemServicoResponseDTO> abrirOrdemServico(
            @Valid @RequestBody OrdemServicoRequestDTO request
    ) {
        OrdemServicoResponseDTO response = ordemServicoService.abrirNovaOrdemServico(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.getId())
                .toUri();

        return ResponseEntity.created(location).body(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','ATENDENTE','TECNICO')")
    public ResponseEntity<List<OrdemServicoResponseDTO>> listar(
            @RequestParam(required = false) StatusOrdemServico status,
            @RequestParam(required = false) Long clienteId,
            @RequestParam(required = false) String imei,
            @RequestParam(required = false) String codigo
    ) {
        return ResponseEntity.ok(ordemServicoService.listar(status, clienteId, imei, codigo));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ATENDENTE','TECNICO')")
    public ResponseEntity<OrdemServicoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ordemServicoService.buscarPorId(id));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','ATENDENTE','TECNICO')")
    public ResponseEntity<OrdemServicoResponseDTO> atualizarStatus(
            @PathVariable Long id,
            @Valid @RequestBody AtualizarStatusOrdemServicoRequestDTO request
    ) {
        return ResponseEntity.ok(ordemServicoService.atualizarStatus(id, request));
    }
}
