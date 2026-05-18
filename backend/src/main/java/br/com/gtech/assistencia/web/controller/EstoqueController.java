package br.com.gtech.assistencia.web.controller;

import br.com.gtech.assistencia.application.service.EstoqueService;
import br.com.gtech.assistencia.web.dto.AjusteEstoqueRequestDTO;
import br.com.gtech.assistencia.web.dto.EstoquePecaRequestDTO;
import br.com.gtech.assistencia.web.dto.EstoquePecaResponseDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/estoque")
public class EstoqueController {

    private final EstoqueService estoqueService;

    public EstoqueController(EstoqueService estoqueService) {
        this.estoqueService = estoqueService;
    }

    @PostMapping("/pecas")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EstoquePecaResponseDTO> criar(@Valid @RequestBody EstoquePecaRequestDTO request) {
        EstoquePecaResponseDTO response = estoqueService.criar(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.getId())
                .toUri();
        return ResponseEntity.created(location).body(response);
    }

    @GetMapping("/pecas/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','ATENDENTE','TECNICO')")
    public ResponseEntity<EstoquePecaResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(estoqueService.buscarPorId(id));
    }

    @GetMapping("/pecas")
    @PreAuthorize("hasAnyRole('ADMIN','ATENDENTE','TECNICO')")
    public ResponseEntity<List<EstoquePecaResponseDTO>> listar(
            @RequestParam(required = false) String sku,
            @RequestParam(required = false) String nome
    ) {
        return ResponseEntity.ok(estoqueService.listar(sku, nome));
    }

    @PutMapping("/pecas/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EstoquePecaResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody EstoquePecaRequestDTO request
    ) {
        return ResponseEntity.ok(estoqueService.atualizar(id, request));
    }

    @PostMapping("/pecas/{id}/ajustes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EstoquePecaResponseDTO> ajustar(
            @PathVariable Long id,
            @Valid @RequestBody AjusteEstoqueRequestDTO request
    ) {
        return ResponseEntity.ok(estoqueService.ajustar(id, request));
    }

    @GetMapping("/alertas/minimo")
    @PreAuthorize("hasAnyRole('ADMIN','ATENDENTE')")
    public ResponseEntity<List<EstoquePecaResponseDTO>> listarAbaixoDoMinimo() {
        return ResponseEntity.ok(estoqueService.listarAbaixoDoMinimo());
    }
}
