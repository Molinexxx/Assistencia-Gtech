package br.com.gtech.assistencia.infrastructure.persistence;

import br.com.gtech.assistencia.domain.usuario.PerfilUsuario;
import br.com.gtech.assistencia.domain.usuario.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsername(String username);

    boolean existsByUsername(String username);

    List<Usuario> findByPerfilAndAtivoTrueOrderByNomeAsc(PerfilUsuario perfil);
}