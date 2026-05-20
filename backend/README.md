# Backend Spring Boot

## Estrutura

```text
backend/
  pom.xml
  README.md
  src/
    main/
      java/
        br/com/gtech/assistencia/
          AssistenciaApplication.java
          application/
            security/
              AuthenticatedUserService.java
              EncryptedPayload.java
              SensitiveDataCryptoService.java
            service/
              OrdemServicoService.java
          domain/
            aparelho/
              Aparelho.java
            auditoria/
              AuditoriaAtividade.java
            cliente/
              Cliente.java
            estoque/
              EstoquePeca.java
            os/
              ItemOrdemServicoPeca.java
              OrdemServico.java
              StatusOrdemServico.java
            shared/
              AuditableEntity.java
            usuario/
              PerfilUsuario.java
              Usuario.java
          infrastructure/
            persistence/
              AparelhoRepository.java
              AuditoriaAtividadeRepository.java
              ClienteRepository.java
              EstoquePecaRepository.java
              OrdemServicoRepository.java
              UsuarioRepository.java
            security/
              AesGcmSensitiveDataCryptoService.java
              SecurityConfig.java
              SecurityContextAuthenticatedUserService.java
          web/
            controller/
              OrdemServicoController.java
            dto/
              OrdemServicoRequestDTO.java
              OrdemServicoResponseDTO.java
            exception/
              ApiErrorResponse.java
              BusinessException.java
              GlobalExceptionHandler.java
              ResourceConflictException.java
              ResourceNotFoundException.java
      resources/
        application.yml
        db/
          migration/
            V1__baseline_schema.sql
```

## Escopo Entregue

- Migration Flyway com DDL inicial do MySQL 8.x.
- Entidades JPA principais da abertura de OS.
- `@Version` em `OrdemServico` e `EstoquePeca` para optimistic locking.
- Controller, DTOs validados e service transacional para abertura de OS.
- Criptografia AES-GCM para senha do aparelho na camada de aplicacao.
- Autenticacao JWT com Spring Security e usuario administrador bootstrap.
- Endpoints funcionais para autenticacao, clientes, ordens de servico, usuarios tecnicos e estoque.

## Endpoints Principais

- `POST /api/v1/auth/login`
- `POST /api/v1/clientes`
- `GET /api/v1/clientes`
- `GET /api/v1/clientes/{id}`
- `PUT /api/v1/clientes/{id}`
- `POST /api/v1/ordens-servico`
- `GET /api/v1/ordens-servico`
- `GET /api/v1/ordens-servico/{id}`
- `PUT /api/v1/ordens-servico/{id}`
- `PUT /api/v1/ordens-servico/{id}/status`
- `GET /api/v1/usuarios/tecnicos`
- `POST /api/v1/estoque/pecas`
- `GET /api/v1/estoque/pecas`
- `GET /api/v1/estoque/pecas/{id}`
- `PUT /api/v1/estoque/pecas/{id}`
- `POST /api/v1/estoque/pecas/{id}/ajustes`
- `GET /api/v1/estoque/alertas/minimo`

## Bootstrap

- Usuario inicial padrao: `admin`
- Senha inicial padrao: `Admin@123`
- Altere via variaveis `BOOTSTRAP_ADMIN_USERNAME`, `BOOTSTRAP_ADMIN_PASSWORD`, `BOOTSTRAP_ADMIN_EMAIL` e `BOOTSTRAP_ADMIN_NOME`

## Subida Local

Com wrapper recomendado:

```bash
cd backend
.\mvnw.cmd clean spring-boot:run
```

Opcional para apenas subir a aplicacao:

```bash
cd backend
.\mvnw.cmd spring-boot:run
```

## Observacoes

- O `mvnw.cmd` baixa automaticamente uma versao fixa do Maven se ele nao estiver instalado na maquina.
- Antes de subir, garanta Java 17 e MySQL 8.x ativos com credenciais compativeis com `application.yml`.