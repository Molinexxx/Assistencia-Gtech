package br.com.gtech.assistencia.web.controller;

import br.com.gtech.assistencia.application.service.UsuarioService;
import br.com.gtech.assistencia.web.dto.UsuarioSummaryDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/tecnicos")
    @PreAuthorize("hasAnyRole('ADMIN','ATENDENTE','TECNICO')")
    public ResponseEntity<List<UsuarioSummaryDTO>> listarTecnicos() {
        return ResponseEntity.ok(usuarioService.listarTecnicos());
    }
}