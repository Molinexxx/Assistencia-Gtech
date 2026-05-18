package br.com.gtech.assistencia.application.security;

import br.com.gtech.assistencia.domain.usuario.Usuario;

public interface AuthenticatedUserService {

    Usuario getCurrentUser();
}
