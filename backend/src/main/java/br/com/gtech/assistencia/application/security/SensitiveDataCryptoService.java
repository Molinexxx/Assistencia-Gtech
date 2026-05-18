package br.com.gtech.assistencia.application.security;

public interface SensitiveDataCryptoService {

    EncryptedPayload encrypt(String plainText);

    String decrypt(byte[] cipherText, byte[] iv);
}
