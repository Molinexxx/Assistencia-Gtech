package br.com.gtech.assistencia.infrastructure.security;

import br.com.gtech.assistencia.application.security.AuthenticatedUserService;
import br.com.gtech.assistencia.domain.usuario.Usuario;
import br.com.gtech.assistencia.infrastructure.persistence.UsuarioRepository;
import br.com.gtech.assistencia.web.exception.ResourceNotFoundException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class SecurityContextAuthenticatedUserService implements AuthenticatedUserService {

    private final UsuarioRepository usuarioRepository;

    public SecurityContextAuthenticatedUserService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public Usuario getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            throw new ResourceNotFoundException("Usuario autenticado nao encontrado no contexto de seguranca.");
        }

        String username = authentication.getName();
        return usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario autenticado nao encontrado na base de dados."));
    }
}
