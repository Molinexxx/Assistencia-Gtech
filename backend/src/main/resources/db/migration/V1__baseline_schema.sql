CREATE TABLE usuarios (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(150) NOT NULL,
    username VARCHAR(80) NOT NULL,
    email VARCHAR(180) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    perfil VARCHAR(30) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    CONSTRAINT uk_usuarios_username UNIQUE (username),
    CONSTRAINT uk_usuarios_email UNIQUE (email),
    CONSTRAINT ck_usuarios_perfil CHECK (perfil IN ('ADMIN','ATENDENTE','TECNICO'))
) ENGINE=InnoDB;

CREATE TABLE clientes (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(150) NOT NULL,
    cpf_cnpj VARCHAR(18) NOT NULL,
    email VARCHAR(180) NULL,
    telefone VARCHAR(20) NOT NULL,
    logradouro VARCHAR(180) NULL,
    numero VARCHAR(20) NULL,
    bairro VARCHAR(120) NULL,
    cidade VARCHAR(120) NULL,
    uf CHAR(2) NULL,
    cep VARCHAR(10) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    CONSTRAINT uk_clientes_cpf_cnpj UNIQUE (cpf_cnpj)
) ENGINE=InnoDB;

CREATE TABLE aparelhos (
    id BIGINT NOT NULL AUTO_INCREMENT,
    cliente_id BIGINT NOT NULL,
    marca VARCHAR(80) NOT NULL,
    modelo VARCHAR(120) NOT NULL,
    cor VARCHAR(40) NULL,
    imei VARCHAR(20) NOT NULL,
    numero_serie VARCHAR(80) NULL,
    bloqueio_conta BOOLEAN NOT NULL DEFAULT FALSE,
    bloqueio_frp BOOLEAN NOT NULL DEFAULT FALSE,
    senha_criptografada VARBINARY(512) NULL,
    senha_iv VARBINARY(64) NULL,
    observacoes TEXT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    CONSTRAINT uk_aparelhos_imei UNIQUE (imei),
    CONSTRAINT fk_aparelhos_clientes FOREIGN KEY (cliente_id) REFERENCES clientes (id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE estoque_pecas (
    id BIGINT NOT NULL AUTO_INCREMENT,
    sku VARCHAR(80) NOT NULL,
    nome VARCHAR(160) NOT NULL,
    descricao VARCHAR(500) NULL,
    unidade_medida VARCHAR(20) NOT NULL DEFAULT 'UN',
    custo_medio DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    preco_venda DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    quantidade_atual DECIMAL(15,3) NOT NULL DEFAULT 0.000,
    estoque_minimo DECIMAL(15,3) NOT NULL DEFAULT 0.000,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    version BIGINT NOT NULL DEFAULT 0,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    CONSTRAINT uk_estoque_pecas_sku UNIQUE (sku),
    CONSTRAINT ck_estoque_pecas_custo_medio CHECK (custo_medio >= 0),
    CONSTRAINT ck_estoque_pecas_preco_venda CHECK (preco_venda >= 0),
    CONSTRAINT ck_estoque_pecas_quantidade_atual CHECK (quantidade_atual >= 0),
    CONSTRAINT ck_estoque_pecas_estoque_minimo CHECK (estoque_minimo >= 0)
) ENGINE=InnoDB;

CREATE TABLE ordens_servico (
    id BIGINT NOT NULL AUTO_INCREMENT,
    codigo VARCHAR(40) NOT NULL,
    cliente_id BIGINT NOT NULL,
    aparelho_id BIGINT NOT NULL,
    atendente_id BIGINT NOT NULL,
    tecnico_id BIGINT NULL,
    status VARCHAR(30) NOT NULL,
    problema_relatado VARCHAR(1000) NOT NULL,
    checklist_tela VARCHAR(300) NOT NULL,
    checklist_carcaca VARCHAR(300) NOT NULL,
    checklist_botoes VARCHAR(300) NOT NULL,
    checklist_conectores VARCHAR(300) NOT NULL,
    checklist_cameras VARCHAR(300) NULL,
    checklist_biometria VARCHAR(300) NULL,
    checklist_oxidacao BOOLEAN NOT NULL DEFAULT FALSE,
    acessorios_recebidos VARCHAR(300) NULL,
    imei_confirmado VARCHAR(20) NOT NULL,
    valor_pecas DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    valor_mao_obra DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    desconto DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    valor_total DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    data_entrada DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    data_previsao DATETIME(3) NULL,
    data_fechamento DATETIME(3) NULL,
    data_entrega DATETIME(3) NULL,
    version BIGINT NOT NULL DEFAULT 0,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    CONSTRAINT uk_ordens_servico_codigo UNIQUE (codigo),
    CONSTRAINT ck_ordens_servico_status CHECK (status IN ('EM_ANALISE','AGUARDANDO_APROVACAO','EM_REPARO','AGUARDANDO_PECA','FINALIZADA','ENTREGUE','CANCELADA')),
    CONSTRAINT ck_ordens_servico_valor_pecas CHECK (valor_pecas >= 0),
    CONSTRAINT ck_ordens_servico_valor_mao_obra CHECK (valor_mao_obra >= 0),
    CONSTRAINT ck_ordens_servico_desconto CHECK (desconto >= 0),
    CONSTRAINT ck_ordens_servico_valor_total CHECK (valor_total >= 0),
    CONSTRAINT fk_ordens_servico_clientes FOREIGN KEY (cliente_id) REFERENCES clientes (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_ordens_servico_aparelhos FOREIGN KEY (aparelho_id) REFERENCES aparelhos (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_ordens_servico_atendente FOREIGN KEY (atendente_id) REFERENCES usuarios (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_ordens_servico_tecnico FOREIGN KEY (tecnico_id) REFERENCES usuarios (id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE itens_os_pecas (
    id BIGINT NOT NULL AUTO_INCREMENT,
    ordem_servico_id BIGINT NOT NULL,
    estoque_peca_id BIGINT NULL,
    descricao VARCHAR(200) NOT NULL,
    quantidade DECIMAL(15,3) NOT NULL DEFAULT 1.000,
    valor_unitario DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    subtotal DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    CONSTRAINT ck_itens_os_quantidade CHECK (quantidade > 0),
    CONSTRAINT ck_itens_os_valor_unitario CHECK (valor_unitario >= 0),
    CONSTRAINT ck_itens_os_subtotal CHECK (subtotal >= 0),
    CONSTRAINT fk_itens_os_pecas_os FOREIGN KEY (ordem_servico_id) REFERENCES ordens_servico (id) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT fk_itens_os_pecas_estoque FOREIGN KEY (estoque_peca_id) REFERENCES estoque_pecas (id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE movimentacao_estoque (
    id BIGINT NOT NULL AUTO_INCREMENT,
    estoque_peca_id BIGINT NOT NULL,
    ordem_servico_id BIGINT NULL,
    usuario_id BIGINT NOT NULL,
    tipo_movimento VARCHAR(30) NOT NULL,
    quantidade DECIMAL(15,3) NOT NULL,
    saldo_anterior DECIMAL(15,3) NOT NULL,
    saldo_posterior DECIMAL(15,3) NOT NULL,
    observacao VARCHAR(500) NULL,
    data_movimento DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    CONSTRAINT ck_movimentacao_quantidade CHECK (quantidade > 0),
    CONSTRAINT ck_movimentacao_tipo CHECK (tipo_movimento IN ('ENTRADA','SAIDA','AJUSTE_POSITIVO','AJUSTE_NEGATIVO','RESERVA','ESTORNO')),
    CONSTRAINT fk_movimentacao_estoque_peca FOREIGN KEY (estoque_peca_id) REFERENCES estoque_pecas (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_movimentacao_os FOREIGN KEY (ordem_servico_id) REFERENCES ordens_servico (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_movimentacao_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE financeiro_lancamentos (
    id BIGINT NOT NULL AUTO_INCREMENT,
    ordem_servico_id BIGINT NULL,
    usuario_id BIGINT NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    categoria VARCHAR(80) NOT NULL,
    descricao VARCHAR(300) NOT NULL,
    forma_pagamento VARCHAR(30) NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    data_lancamento DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    CONSTRAINT ck_financeiro_tipo CHECK (tipo IN ('RECEITA','DESPESA')),
    CONSTRAINT ck_financeiro_status CHECK (status IN ('PENDENTE','CONFIRMADO','ESTORNADO','CANCELADO')),
    CONSTRAINT ck_financeiro_valor CHECK (valor >= 0),
    CONSTRAINT fk_financeiro_os FOREIGN KEY (ordem_servico_id) REFERENCES ordens_servico (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_financeiro_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE comissoes_tecnicos (
    id BIGINT NOT NULL AUTO_INCREMENT,
    ordem_servico_id BIGINT NOT NULL,
    tecnico_id BIGINT NOT NULL,
    base_calculo DECIMAL(15,2) NOT NULL,
    percentual DECIMAL(5,2) NOT NULL,
    valor_comissao DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    periodo_referencia CHAR(7) NOT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    CONSTRAINT uk_comissoes_tecnicos_ordem_servico UNIQUE (ordem_servico_id),
    CONSTRAINT ck_comissoes_base_calculo CHECK (base_calculo >= 0),
    CONSTRAINT ck_comissoes_percentual CHECK (percentual >= 0),
    CONSTRAINT ck_comissoes_valor CHECK (valor_comissao >= 0),
    CONSTRAINT ck_comissoes_status CHECK (status IN ('A_APURAR','APURADA','PAGA','CANCELADA')),
    CONSTRAINT fk_comissoes_tecnicos_os FOREIGN KEY (ordem_servico_id) REFERENCES ordens_servico (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT fk_comissoes_tecnicos_usuario FOREIGN KEY (tecnico_id) REFERENCES usuarios (id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE auditoria_atividade (
    id BIGINT NOT NULL AUTO_INCREMENT,
    entidade VARCHAR(60) NOT NULL,
    entidade_id BIGINT NOT NULL,
    acao VARCHAR(60) NOT NULL,
    detalhes VARCHAR(1000) NOT NULL,
    usuario_id BIGINT NOT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    CONSTRAINT fk_auditoria_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB;

CREATE INDEX idx_clientes_cpf_cnpj ON clientes (cpf_cnpj);
CREATE INDEX idx_clientes_nome_telefone ON clientes (nome, telefone);
CREATE INDEX idx_aparelhos_cliente_id ON aparelhos (cliente_id);
CREATE INDEX idx_aparelhos_marca_modelo ON aparelhos (marca, modelo);
CREATE INDEX idx_ordens_servico_status_data_entrada ON ordens_servico (status, data_entrada);
CREATE INDEX idx_ordens_servico_cliente_data_entrada ON ordens_servico (cliente_id, data_entrada);
CREATE INDEX idx_ordens_servico_aparelho_data_entrada ON ordens_servico (aparelho_id, data_entrada);
CREATE INDEX idx_itens_os_pecas_ordem_servico ON itens_os_pecas (ordem_servico_id);
CREATE INDEX idx_movimentacao_estoque_peca_data ON movimentacao_estoque (estoque_peca_id, data_movimento);
CREATE INDEX idx_movimentacao_estoque_os_data ON movimentacao_estoque (ordem_servico_id, data_movimento);
CREATE INDEX idx_financeiro_lancamentos_data_status ON financeiro_lancamentos (data_lancamento, status);
CREATE INDEX idx_financeiro_lancamentos_tipo_data ON financeiro_lancamentos (tipo, data_lancamento);
CREATE INDEX idx_comissoes_tecnicos_tecnico_periodo ON comissoes_tecnicos (tecnico_id, periodo_referencia);
CREATE INDEX idx_auditoria_atividade_entidade_data ON auditoria_atividade (entidade, entidade_id, created_at);
