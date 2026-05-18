package br.com.gtech.assistencia.web.dto;

public record AuthResponseDTO(
        String accessToken,
        String tokenType,
        long expiresIn,
        String username,
        String perfil
) {
}
