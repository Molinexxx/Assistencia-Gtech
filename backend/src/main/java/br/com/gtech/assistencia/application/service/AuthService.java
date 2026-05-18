package br.com.gtech.assistencia.application.service;

import br.com.gtech.assistencia.domain.usuario.Usuario;
import br.com.gtech.assistencia.infrastructure.persistence.UsuarioRepository;
import br.com.gtech.assistencia.infrastructure.security.JwtService;
import br.com.gtech.assistencia.web.dto.AuthResponseDTO;
import br.com.gtech.assistencia.web.dto.LoginRequestDTO;
import br.com.gtech.assistencia.web.exception.ResourceNotFoundException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;

    public AuthService(
            AuthenticationManager authenticationManager,
            UsuarioRepository usuarioRepository,
            JwtService jwtService
    ) {
        this.authenticationManager = authenticationManager;
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
    }

    public AuthResponseDTO autenticar(LoginRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario nao encontrado."));

        String token = jwtService.generateToken(usuario);
        return new AuthResponseDTO(
                token,
                "Bearer",
                jwtService.getExpirationSeconds(),
                usuario.getUsername(),
                usuario.getPerfil().name()
        );
    }
}
