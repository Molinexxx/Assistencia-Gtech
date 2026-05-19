package br.com.gtech.assistencia.application.service;

import br.com.gtech.assistencia.domain.usuario.PerfilUsuario;
import br.com.gtech.assistencia.infrastructure.persistence.UsuarioRepository;
import br.com.gtech.assistencia.web.dto.UsuarioSummaryDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<UsuarioSummaryDTO> listarTecnicos() {
        return usuarioRepository.findByPerfilAndAtivoTrueOrderByNomeAsc(PerfilUsuario.TECNICO)
                .stream()
                .map(usuario -> {
                    UsuarioSummaryDTO dto = new UsuarioSummaryDTO();
                    dto.setId(usuario.getId());
                    dto.setNome(usuario.getNome());
                    dto.setUsername(usuario.getUsername());
                    dto.setPerfil(usuario.getPerfil().name());
                    return dto;
                })
                .toList();
    }
}