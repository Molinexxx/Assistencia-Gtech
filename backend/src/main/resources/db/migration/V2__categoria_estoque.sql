ALTER TABLE estoque_pecas
    ADD COLUMN categoria VARCHAR(30) NOT NULL DEFAULT 'PECAS',
    ADD CONSTRAINT ck_estoque_pecas_categoria
        CHECK (categoria IN ('PECAS', 'ACESSORIOS', 'FERRAMENTAS'));
