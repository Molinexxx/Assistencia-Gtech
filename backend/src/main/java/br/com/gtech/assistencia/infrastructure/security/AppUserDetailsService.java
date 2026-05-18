package br.com.gtech.assistencia.infrastructure.security;

import br.com.gtech.assistencia.domain.usuario.Usuario;
import br.com.gtech.assistencia.infrastructure.persistence.UsuarioRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public AppUserDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario nao encontrado."));

        return User.builder()
                .username(usuario.getUsername())
                .password(usuario.getPasswordHash())
                .disabled(!usuario.isAtivo())
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getPerfil().name())))
                .build();
    }
}
