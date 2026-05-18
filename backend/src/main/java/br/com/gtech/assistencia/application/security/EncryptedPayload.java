package br.com.gtech.assistencia.application.security;

public record EncryptedPayload(byte[] cipherText, byte[] iv) {
}
