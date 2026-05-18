# Fase 2 - Engenharia de Dados e Backend

## 1. Modelagem do Banco de Dados (MySQL) — DDL completo

```sql
CREATE DATABASE IF NOT EXISTS assistencia_gtech
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE assistencia_gtech;

CREATE TABLE clientes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(150) NOT NULL,
  cpf CHAR(11) NULL,
  email VARCHAR(180) NULL,
  telefone VARCHAR(20) NULL,
  endereco_logradouro VARCHAR(180) NULL,
  endereco_numero VARCHAR(20) NULL,
  endereco_bairro VARCHAR(120) NULL,
  endereco_cidade VARCHAR(120) NULL,
  endereco_uf CHAR(2) NULL,
  endereco_cep CHAR(8) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  CONSTRAINT uk_clientes_cpf UNIQUE (cpf),
  INDEX idx_clientes_nome (nome),
  INDEX idx_clientes_telefone (telefone)
) ENGINE=InnoDB;

CREATE TABLE usuarios (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(150) NOT NULL,
  username VARCHAR(60) NOT NULL,
  email VARCHAR(180) NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('ADMIN','ATENDENTE','TECNICO') NOT NULL,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  CONSTRAINT uk_usuarios_username UNIQUE (username),
  CONSTRAINT uk_usuarios_email UNIQUE (email),
  INDEX idx_usuarios_role (role),
  INDEX idx_usuarios_ativo (ativo)
) ENGINE=InnoDB;

CREATE TABLE aparelhos (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  cliente_id BIGINT UNSIGNED NOT NULL,
  marca VARCHAR(80) NOT NULL,
  modelo VARCHAR(120) NOT NULL,
  cor VARCHAR(60) NULL,
  imei VARCHAR(20) NOT NULL,
  serial_number VARCHAR(60) NULL,
  bloqueio_icould TINYINT(1) NOT NULL DEFAULT 0,
  bloqueio_frp TINYINT(1) NOT NULL DEFAULT 0,
  observacoes VARCHAR(500) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  CONSTRAINT fk_aparelhos_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  CONSTRAINT uk_aparelhos_imei UNIQUE (imei),
  INDEX idx_aparelhos_cliente (cliente_id),
  INDEX idx_aparelhos_marca_modelo (marca, modelo)
) ENGINE=InnoDB;

CREATE TABLE estoque_pecas (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  sku VARCHAR(60) NOT NULL,
  nome VARCHAR(160) NOT NULL,
  descricao VARCHAR(500) NULL,
  unidade VARCHAR(20) NOT NULL DEFAULT 'un',
  custo_medio DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  preco_venda DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  quantidade_atual DECIMAL(12,3) NOT NULL DEFAULT 0.000,
  estoque_minimo DECIMAL(12,3) NOT NULL DEFAULT 0.000,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  CONSTRAINT uk_estoque_pecas_sku UNIQUE (sku),
  INDEX idx_estoque_pecas_nome (nome),
  INDEX idx_estoque_pecas_ativo (ativo)
) ENGINE=InnoDB;

CREATE TABLE ordens_servico (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  codigo VARCHAR(30) NOT NULL,
  cliente_id BIGINT UNSIGNED NOT NULL,
  aparelho_id BIGINT UNSIGNED NOT NULL,
  atendente_id BIGINT UNSIGNED NOT NULL,
  tecnico_id BIGINT UNSIGNED NULL,

  status ENUM(
    'RASCUNHO',
    'RECEBIDA',
    'EM_DIAGNOSTICO',
    'AGUARDANDO_APROVACAO',
    'EM_REPARO',
    'AGUARDANDO_PECA',
    'FINALIZADA',
    'ENTREGUE',
    'CANCELADA'
  ) NOT NULL DEFAULT 'RECEBIDA',

  problema_relatado VARCHAR(800) NOT NULL,
  diagnostico VARCHAR(1200) NULL,
  servico_executado VARCHAR(1200) NULL,

  checklist_tela VARCHAR(200) NOT NULL,
  checklist_carcaca VARCHAR(200) NOT NULL,
  checklist_botoes VARCHAR(200) NOT NULL,
  checklist_conectores VARCHAR(200) NOT NULL,
  checklist_oxidacao TINYINT(1) NOT NULL DEFAULT 0,
  acessorios_recebidos VARCHAR(300) NULL,

  senha_coletada VARBINARY(512) NULL,
  imei_confirmado VARCHAR(20) NOT NULL,

  valor_mao_obra DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  valor_pecas DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  desconto DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  valor_total DECIMAL(12,2) NOT NULL DEFAULT 0.00,

  pago TINYINT(1) NOT NULL DEFAULT 0,
  data_previsao_entrega DATETIME(3) NULL,
  data_fechamento DATETIME(3) NULL,
  data_entrega DATETIME(3) NULL,

  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (id),
  CONSTRAINT uk_ordens_servico_codigo UNIQUE (codigo),
  CONSTRAINT fk_os_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  CONSTRAINT fk_os_aparelho FOREIGN KEY (aparelho_id) REFERENCES aparelhos(id),
  CONSTRAINT fk_os_atendente FOREIGN KEY (atendente_id) REFERENCES usuarios(id),
  CONSTRAINT fk_os_tecnico FOREIGN KEY (tecnico_id) REFERENCES usuarios(id),
  INDEX idx_os_cliente (cliente_id),
  INDEX idx_os_aparelho (aparelho_id),
  INDEX idx_os_status (status),
  INDEX idx_os_codigo (codigo),
  INDEX idx_os_datas (created_at, data_fechamento, data_entrega)
) ENGINE=InnoDB;

CREATE TABLE itens_os (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  os_id BIGINT UNSIGNED NOT NULL,
  peca_id BIGINT UNSIGNED NULL,
  tipo ENUM('PECA','SERVICO') NOT NULL DEFAULT 'PECA',
  descricao VARCHAR(200) NOT NULL,
  quantidade DECIMAL(12,3) NOT NULL DEFAULT 1.000,
  valor_unitario DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  custo_unitario DECIMAL(12,2) NULL,
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  CONSTRAINT fk_itens_os_os FOREIGN KEY (os_id) REFERENCES ordens_servico(id),
  CONSTRAINT fk_itens_os_peca FOREIGN KEY (peca_id) REFERENCES estoque_pecas(id),
  INDEX idx_itens_os_os (os_id),
  INDEX idx_itens_os_peca (peca_id),
  INDEX idx_itens_os_tipo (tipo)
) ENGINE=InnoDB;

CREATE TABLE os_anexos (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  os_id BIGINT UNSIGNED NOT NULL,
  tipo ENUM('FOTO','OUTRO') NOT NULL DEFAULT 'FOTO',
  file_name VARCHAR(180) NOT NULL,
  content_type VARCHAR(100) NOT NULL,
  storage_key VARCHAR(300) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  CONSTRAINT fk_os_anexos_os FOREIGN KEY (os_id) REFERENCES ordens_servico(id),
  INDEX idx_os_anexos_os (os_id),
  INDEX idx_os_anexos_tipo (tipo)
) ENGINE=InnoDB;

CREATE TABLE financeiro (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  os_id BIGINT UNSIGNED NULL,
  tipo ENUM('RECEITA','DESPESA') NOT NULL,
  categoria VARCHAR(80) NOT NULL,
  descricao VARCHAR(300) NOT NULL,
  forma_pagamento ENUM('DINHEIRO','PIX','CARTAO_CREDITO','CARTAO_DEBITO','BOLETO','OUTRO') NOT NULL,
  valor DECIMAL(12,2) NOT NULL,
  status ENUM('PENDENTE','CONFIRMADO','ESTORNADO','CANCELADO') NOT NULL DEFAULT 'CONFIRMADO',
  data_lancamento DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  CONSTRAINT fk_financeiro_os FOREIGN KEY (os_id) REFERENCES ordens_servico(id),
  INDEX idx_financeiro_os (os_id),
  INDEX idx_financeiro_tipo_status (tipo, status),
  INDEX idx_financeiro_data (data_lancamento)
) ENGINE=InnoDB;

CREATE TABLE comissoes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  os_id BIGINT UNSIGNED NOT NULL,
  tecnico_id BIGINT UNSIGNED NOT NULL,
  modelo ENUM('MAO_DE_OBRA','MARGEM','HIBRIDA') NOT NULL,
  base_calculo DECIMAL(12,2) NOT NULL,
  percentual DECIMAL(5,2) NULL,
  valor_comissao DECIMAL(12,2) NOT NULL,
  status ENUM('A_APURAR','APURADA','PAGA','CANCELADA') NOT NULL DEFAULT 'A_APURAR',
  periodo_referencia CHAR(7) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  CONSTRAINT uk_comissoes_os UNIQUE (os_id),
  CONSTRAINT fk_comissoes_os FOREIGN KEY (os_id) REFERENCES ordens_servico(id),
  CONSTRAINT fk_comissoes_tecnico FOREIGN KEY (tecnico_id) REFERENCES usuarios(id),
  INDEX idx_comissoes_tecnico_periodo (tecnico_id, periodo_referencia),
  INDEX idx_comissoes_status (status)
) ENGINE=InnoDB;
```

### PKs, FKs, Uniques e Índices (o que está cobrindo)
- **Uniques**: `clientes.cpf`, `aparelhos.imei`, `usuarios.username`, `ordens_servico.codigo`, `comissoes.os_id` (1 comissão por OS).
- **Índices de busca rápida**:
  - Cliente: `idx_clientes_nome`, `uk_clientes_cpf`, `idx_clientes_telefone`
  - Aparelho: `uk_aparelhos_imei`, `idx_aparelhos_cliente`, `idx_aparelhos_marca_modelo`
  - OS: `idx_os_status`, `idx_os_cliente`, `idx_os_aparelho`, `idx_os_codigo`, `idx_os_datas`
  - Estoque: `uk_estoque_pecas_sku`, `idx_estoque_pecas_nome`
  - Financeiro: `idx_financeiro_data`, `idx_financeiro_tipo_status`, `idx_financeiro_os`

### Justificativa da normalização aplicada
- Estrutura em **3FN (terceira forma normal)**:
  - Dados do **cliente** não se repetem na OS/aparelho; OS referencia por FK.
  - Dados do **aparelho** ficam em tabela própria; a OS referencia o aparelho (histórico por aparelho).
  - Itens consumidos/serviços da OS ficam em `itens_os` (relação 1:N), evitando colunas repetidas.
  - Financeiro e comissão ficam separados porque têm vida própria (status/estorno/pagamento/fechamento), evitando dependências transitivas dentro da OS.
- **Snapshots controlados** (desnormalização intencional mínima):
  - `itens_os.descricao`, `valor_unitario`, `custo_unitario` guardam o "valor no momento", evitando que uma alteração futura de `estoque_pecas` mude o histórico de uma OS já fechada.

---

## 2. Arquitetura do Backend Java (Clean Architecture / DDD)

Estrutura sugerida (um monólito bem modular em Spring Boot, com separação por camadas e bounded contexts):

```text
src/main/java/com/suagtech/assistencia
  /bootstrap
    AssistenciaApplication.java

  /domain
    /cliente
      Cliente.java
      ClienteId.java
      ClienteRepository.java
    /usuario
      Usuario.java
      Role.java
      UsuarioRepository.java
    /aparelho
      Aparelho.java
      AparelhoRepository.java
    /os
      OrdemServico.java
      OsStatus.java
      ItemOs.java
      OsAnexo.java
      OrdemServicoRepository.java
    /estoque
      PecaEstoque.java
      EstoqueRepository.java
    /financeiro
      LancamentoFinanceiro.java
      FinanceiroRepository.java
    /comissao
      Comissao.java
      ComissaoRepository.java

  /application
    /usecases
      /cliente
        CriarClienteUseCase.java
        AtualizarClienteUseCase.java
        BuscarClienteUseCase.java
      /os
        AbrirOsUseCase.java
        AtualizarStatusOsUseCase.java
        FecharOsUseCase.java
      /estoque
        CadastrarPecaUseCase.java
        AjustarEstoqueUseCase.java
        BaixarEstoquePorOsUseCase.java
    /dto
    /ports
      /in
      /out
    /security
      PermissionService.java

  /infrastructure
    /persistence
      /jpa
        /entities
        /mappers
        /repositories
    /web
      /controllers
      /requests
      /responses
      /exception
    /security
      JwtService.java
      JwtAuthenticationFilter.java
      SecurityConfig.java
      UserDetailsServiceImpl.java
    /storage
      AnexoStorageService.java

src/main/resources
  application.yml
  db/migration (se usar Flyway)
```

- **Domain**: regra e modelo (sem depender de Spring).
- **Application**: casos de uso (transações, orquestração, validações).
- **Infrastructure**: JPA, controllers REST, segurança JWT, storage de anexos.

---

## 3. Design de APIs (RESTful)

### 3.1 Clientes
- `POST /api/clientes` cria cliente
- `GET /api/clientes/{id}` detalha cliente
- `GET /api/clientes?cpf=...` busca por CPF
- `GET /api/clientes?nome=...` busca por nome (parcial)
- `PUT /api/clientes/{id}` atualiza cliente
- `DELETE /api/clientes/{id}` inativa/exclui (recomendado: inativar)

### 3.2 Ordens de Serviço (OS)
- `POST /api/ordens-servico` abre OS (complexa)
- `GET /api/ordens-servico/{id}` detalha OS (cliente, aparelho, itens, anexos)
- `GET /api/ordens-servico?status=...&clienteId=...&imei=...&codigo=...` listagem com filtros
- `PUT /api/ordens-servico/{id}` atualiza dados editáveis (ex.: problema relatado, técnico, previsão)
- `PUT /api/ordens-servico/{id}/status` muda status (com regra por perfil)
- `POST /api/ordens-servico/{id}/itens` adiciona item (peça/serviço)
- `PUT /api/ordens-servico/{id}/itens/{itemId}` altera item
- `DELETE /api/ordens-servico/{id}/itens/{itemId}` remove item
- `POST /api/ordens-servico/{id}/fechamento` fecha OS (calcula totais, baixa estoque, gera financeiro/comissão conforme política)
- `POST /api/ordens-servico/{id}/anexos` adiciona anexo (alternativa recomendada: multipart)
- `GET /api/ordens-servico/{id}/anexos` lista anexos

### 3.3 Estoque
- `POST /api/estoque/pecas` cadastra peça
- `GET /api/estoque/pecas/{id}` detalha peça
- `GET /api/estoque/pecas?sku=...&nome=...` busca/lista
- `PUT /api/estoque/pecas/{id}` atualiza dados (preço, mínimo, etc.)
- `POST /api/estoque/pecas/{id}/ajustes` ajuste de estoque (entrada/saída com motivo e permissão)
- `GET /api/estoque/alertas/minimo` lista itens abaixo do mínimo

### 3.4 Payloads — criação de OS “complexa” (com aparelho, fotos e peças)

**Request** `POST /api/ordens-servico`
```json
{
  "cliente": {
    "id": 123
  },
  "aparelho": {
    "id": null,
    "marca": "Samsung",
    "modelo": "Galaxy S21",
    "cor": "Preto",
    "imei": "356789012345678",
    "serialNumber": "SN-ABC-123",
    "bloqueioIcloud": false,
    "bloqueioFrp": true,
    "observacoes": "Aparelho com película trincada"
  },
  "problemaRelatado": "Não carrega e está desligando sozinho",
  "checklist": {
    "tela": "Sem trincas, com riscos leves",
    "carcaca": "Marcas de uso na lateral direita",
    "botoes": "Power ok, volume ok",
    "conectores": "USB com folga",
    "oxidacao": false,
    "acessoriosRecebidos": "Sem chip, sem capa"
  },
  "imeiConfirmado": "356789012345678",
  "senha": {
    "tipo": "SENHA",
    "valor": "1234"
  },
  "itens": [
    {
      "tipo": "PECA",
      "pecaId": 55,
      "descricao": "Conector de carga",
      "quantidade": 1,
      "valorUnitario": 120.00
    },
    {
      "tipo": "SERVICO",
      "pecaId": null,
      "descricao": "Mão de obra",
      "quantidade": 1,
      "valorUnitario": 150.00
    }
  ],
  "fotos": [
    {
      "fileName": "entrada-frente.jpg",
      "contentType": "image/jpeg",
      "contentBase64": "..."
    }
  ],
  "dataPrevisaoEntrega": "2026-05-20T18:00:00-03:00",
  "tecnicoId": 9
}
```

**Response (resumo)** `201 Created`
```json
{
  "id": 987,
  "codigo": "OS-2026-000987",
  "status": "RECEBIDA",
  "clienteId": 123,
  "aparelhoId": 456,
  "valorPecas": 120.00,
  "valorMaoObra": 150.00,
  "desconto": 0.00,
  "valorTotal": 270.00,
  "pago": false,
  "createdAt": "2026-05-18T10:15:22.123-03:00",
  "links": {
    "self": "/api/ordens-servico/987",
    "anexos": "/api/ordens-servico/987/anexos"
  }
}
```

---

## 4. Autenticação e Permissões (Spring Security + JWT)

### 4.1 Papéis (roles)
- `ADMIN`: acesso total, inclusive ajustes e estornos.
- `ATENDENTE`: cria/edita cliente, abre OS, atualiza campos operacionais; não faz ajuste de estoque/estorno crítico.
- `TECNICO`: atua na OS (diagnóstico, execução, itens), mas com limites em financeiro e regras sensíveis.

### 4.2 JWT (conceito)
- Usuário autentica em `POST /api/auth/login` com `username` e `password`.
- Backend emite `access_token` (curto) contendo claims como:
  - `sub` (id/username)
  - `roles` (ex.: `["TECNICO"]`)
- Spring Security valida token em cada request (filtro JWT) e cria o contexto de autenticação.

### 4.3 Autorização por endpoint e por método
- Regras típicas:
  - Clientes:
    - `GET/POST/PUT` → `ATENDENTE` ou `ADMIN`
  - OS:
    - abrir OS (`POST /ordens-servico`) → `ATENDENTE` ou `ADMIN`
    - atualizar diagnóstico/itens/status técnicos → `TECNICO` (e `ADMIN`)
    - cancelar/reabrir/descontos acima do limite → `ADMIN`
  - Estoque:
    - cadastro/ajuste → `ADMIN`
    - consulta/alertas → `ADMIN` (e opcionalmente `ATENDENTE` para visualização)
- Além do papel, aplicar **regras de negócio**:
  - Ex.: técnico só pode alterar OS se for o técnico responsável (validação em use case).
  - Ex.: acesso à "senha do aparelho" somente `ADMIN` e, se necessário, `TECNICO` com auditoria de leitura (idealmente nem retornar esse campo em responses padrão).
