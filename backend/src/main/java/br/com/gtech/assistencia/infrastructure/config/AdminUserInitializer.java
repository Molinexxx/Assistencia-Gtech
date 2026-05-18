package br.com.gtech.assistencia.infrastructure.config;

import br.com.gtech.assistencia.domain.usuario.PerfilUsuario;
import br.com.gtech.assistencia.domain.usuario.Usuario;
import br.com.gtech.assistencia.infrastructure.persistence.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminUserInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminUsername;
    private final String adminPassword;
    private final String adminEmail;
    private final String adminNome;

    public AdminUserInitializer(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.bootstrap.admin.username:admin}") String adminUsername,
            @Value("${app.bootstrap.admin.password:Admin@123}") String adminPassword,
            @Value("${app.bootstrap.admin.email:admin@gtech.local}") String adminEmail,
            @Value("${app.bootstrap.admin.nome:Administrador}") String adminNome
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
        this.adminEmail = adminEmail;
        this.adminNome = adminNome;
    }

    @Override
    public void run(String... args) {
        if (usuarioRepository.existsByUsername(adminUsername)) {
            return;
        }

        Usuario admin = new Usuario();
        admin.setNome(adminNome);
        admin.setUsername(adminUsername);
        admin.setEmail(adminEmail);
        admin.setPasswordHash(passwordEncoder.encode(adminPassword));
        admin.setPerfil(PerfilUsuario.ADMIN);
        admin.setAtivo(true);
        usuarioRepository.save(admin);
    }
}
