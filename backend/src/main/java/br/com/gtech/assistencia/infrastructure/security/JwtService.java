package br.com.gtech.assistencia.infrastructure.security;

import br.com.gtech.assistencia.domain.usuario.Usuario;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long expirationSeconds;

    public JwtService(
            @Value("${app.security.jwt-secret}") String jwtSecret,
            @Value("${app.security.jwt-expiration-seconds}") long expirationSeconds
    ) {
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
        this.expirationSeconds = expirationSeconds;
    }

    public String generateToken(Usuario usuario) {
        Instant now = Instant.now();
        Instant expiration = now.plusSeconds(expirationSeconds);

        return Jwts.builder()
                .subject(usuario.getUsername())
                .claim("perfil", usuario.getPerfil().name())
                .claim("userId", usuario.getId())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiration))
                .signWith(secretKey)
                .compact();
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    public long getExpirationSeconds() {
        return expirationSeconds;
    }

    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    private io.jsonwebtoken.Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
