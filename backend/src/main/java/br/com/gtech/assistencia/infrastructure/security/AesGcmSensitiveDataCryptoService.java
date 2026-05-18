package br.com.gtech.assistencia.infrastructure.security;

import br.com.gtech.assistencia.application.security.EncryptedPayload;
import br.com.gtech.assistencia.application.security.SensitiveDataCryptoService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class AesGcmSensitiveDataCryptoService implements SensitiveDataCryptoService {

    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int IV_LENGTH = 12;
    private static final int TAG_LENGTH = 128;

    private final SecretKeySpec secretKeySpec;
    private final SecureRandom secureRandom = new SecureRandom();

    public AesGcmSensitiveDataCryptoService(@Value("${app.security.aparelho-secret-key}") String secretKey) {
        byte[] rawKey = secretKey.getBytes(StandardCharsets.UTF_8);
        if (rawKey.length != 32) {
            throw new IllegalArgumentException("A chave AES precisa ter 32 bytes para AES-256.");
        }
        this.secretKeySpec = new SecretKeySpec(rawKey, "AES");
    }

    @Override
    public EncryptedPayload encrypt(String plainText) {
        if (plainText == null || plainText.isBlank()) {
            return new EncryptedPayload(null, null);
        }

        try {
            byte[] iv = new byte[IV_LENGTH];
            secureRandom.nextBytes(iv);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, new GCMParameterSpec(TAG_LENGTH, iv));

            byte[] cipherText = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));
            return new EncryptedPayload(cipherText, iv);
        } catch (Exception exception) {
            throw new IllegalStateException("Falha ao criptografar dado sensivel.", exception);
        }
    }

    @Override
    public String decrypt(byte[] cipherText, byte[] iv) {
        if (cipherText == null || iv == null) {
            return null;
        }

        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, new GCMParameterSpec(TAG_LENGTH, iv));
            byte[] plainBytes = cipher.doFinal(cipherText);
            return new String(plainBytes, StandardCharsets.UTF_8);
        } catch (Exception exception) {
            throw new IllegalStateException("Falha ao descriptografar dado sensivel.", exception);
        }
    }

    public String encryptToBase64(String plainText) {
        EncryptedPayload payload = encrypt(plainText);
        if (payload.cipherText() == null) {
            return null;
        }
        return Base64.getEncoder().encodeToString(payload.cipherText());
    }
}
