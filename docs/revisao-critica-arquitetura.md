# Revisão Crítica de Arquitetura e Segurança (Code & Architecture Review)

Como Principal Architect, não estou aqui para dizer que a ideia é boa. Estou aqui para garantir que o sistema não quebre, não seja invadido e não corrompa dados quando a operação escalar. A arquitetura inicial proposta tem boas intenções, mas falha em pontos críticos de concorrência, segurança e resiliência em produção.

Abaixo estão os riscos ocultos e as soluções categóricas que devem ser implementadas.

---

## 1. Concorrência e Consistência no MySQL

### 1.1 Condições de Corrida no Estoque (Race Conditions)
**O Risco:** Dois técnicos (A e B) fecham OS quase no mesmo milissegundo. A peça "Tela iPhone 13" tem saldo 1. O banco lê saldo 1 para ambos; ambos dão baixa; o saldo vai para -1. O cliente de um dos técnicos ficará sem a peça.
**A Solução Técnica:** **Optimistic Locking via JPA (`@Version`)**.
- **Por que não Pessimistic Locking?** Pessimistic Locking (`SELECT ... FOR UPDATE`) trava a linha inteira no MySQL. Numa operação com dezenas de técnicos, isso gera gargalos de banco e risco severo de *Deadlocks*.
- **Como implementar:** Adicione um campo `version` (tipo `Long`) na entidade `PecaEstoque` mapeado com `@Version`. Se os dois técnicos lerem a versão 5 e tentarem salvar a versão 6, o primeiro commita, o banco atualiza para versão 6. O segundo tentará atualizar a versão 5 para 6, o JPA lançará `ObjectOptimisticLockingFailureException`.
- **Tratamento:** Capture essa exception no `@ControllerAdvice` e retorne um `409 Conflict` pro React, que deve avisar: *"O estoque foi atualizado por outro usuário. Verifique o saldo novamente"*.

### 1.2 Consistência Ácida (ACID) entre Módulos
**O Risco:** Fechar uma OS envolve: Baixar Estoque + Gerar Financeiro + Gerar Comissão + Alterar Status OS. Se a comissão falhar (ex: erro de NullPointer), a OS fecha, a peça some do estoque, mas a comissão não é gerada. Corrupção de estado.
**A Solução Técnica:** `@Transactional` é obrigatório, mas **sozinho não é suficiente** se os serviços crescerem ou se chamarem APIs externas.
- **Implementação:** O método `fecharOs()` no Service (Application Layer) **deve** ser anotado com `@Transactional(rollbackFor = Exception.class)`. Se qualquer etapa falhar, o Spring dá rollback no MySQL inteiro.
- **Atenção:** Nunca faça chamadas HTTP (ex: disparar WhatsApp) **dentro** do bloco `@Transactional`. Se a API do WhatsApp demorar 5 segundos, a transação no banco fica presa por 5 segundos. O banco vai esgotar conexões (*Connection Pool Exhaustion*). A notificação deve ser um evento assíncrono disparado *após* o commit (ver item 3).

---

## 2. Segurança e LGPD (Privacidade de Dados)

### 2.1 Armazenamento da Senha do Aparelho
**O Risco:** Guardar a senha em texto puro ou codificada fracamente. Um DBA mal-intencionado ou um vazamento de banco de dados expõe as senhas dos clientes, violando LGPD e gerando risco criminal.
**A Solução Técnica:** **Criptografia Simétrica (AES-256) na Camada de Aplicação**.
- **Por que não Hash (Bcrypt/Argon2)?** Hashes são irreversíveis (one-way). O técnico *precisa* ver a senha para testar o aparelho.
- **Como implementar:**
  1. O Spring Boot usa a biblioteca `javax.crypto` com AES-256-GCM.
  2. O banco armazena um campo `VARBINARY` (não VARCHAR) para a senha criptografada e outro para o *Initialization Vector (IV)*.
  3. A chave secreta (Master Key) **nunca** fica no código. Fica em variável de ambiente injetada via Kubernetes/Docker Secrets ou AWS Secrets Manager.
  4. **Auditoria Obrigatória:** O endpoint `GET /api/aparelhos/{id}/senha` deve exigir permissão estrita e gravar um log (`usuario_id`, `os_id`, `timestamp`, `ip`) sempre que a senha for descriptografada e enviada ao React.

### 2.2 Controle de Acesso Baseado em Funções (RBAC) Hardened
**O Risco:** Técnico descobre a URL `/api/financeiro/relatorios/faturamento-mensal` e tenta acessá-la pelo Postman com seu token.
**A Solução Técnica:** Autorização Granular por Método (`@PreAuthorize`) + Validação de Domínio.
- **Implementação:** No Spring Security, habilite `@EnableMethodSecurity`.
- Nos controllers administrativos: `@PreAuthorize("hasRole('ADMIN')")`.
- **Validação de Domínio (ABAC - Attribute Based Access Control):** Não basta ter a role `TECNICO`. O técnico pode alterar *qualquer* OS? Não. Ele só pode alterar a OS se for o `tecnico_id` atribuído a ela.
  - Exemplo: `@PreAuthorize("hasRole('ADMIN') or (hasRole('TECNICO') and @securityService.isTecnicoDaOs(#osId, authentication.principal.id))")`.

---

## 3. Resiliência em Integrações (WhatsApp e PDFs)

### 3.1 WhatsApp e APIs Externas (Sincronismo)
**O Risco:** O técnico clica em "Finalizar OS". O Java bate na API do WhatsApp. A API demora ou dá timeout (504). A tela do técnico trava girando. A transação do banco fica pendurada.
**A Solução Técnica:** **Event-Driven Architecture (Desacoplamento Assíncrono)**.
- **Implementação Inicial:** Use Spring Application Events com `@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)`.
  1. O método salva tudo e commita no MySQL.
  2. O Spring dispara o evento `OsFinalizadaEvent`.
  3. Um listener com `@Async` capta o evento e chama a API do WhatsApp. Se o WhatsApp falhar, a OS *já está fechada* no banco (não há rollback destrutivo).
- **Evolução (Scale-up):** Para resiliência real (retries), insira o RabbitMQ ou Redis. O Java posta a mensagem na fila `whatsapp-notifications`. Um *worker* consome e tenta enviar. Se falhar, vai pra *Dead Letter Queue (DLQ)* para tentativa posterior.

### 3.2 Geração de PDFs e Relatórios
**O Risco:** Gerar PDF no Backend Java consumindo JasperReports/iText consome muita CPU e Memória (Heap). Se 10 usuários pedirem relatórios simultaneamente, o servidor engasga e derruba a API principal.
**A Solução Técnica:** **Delegação baseada na complexidade**.
- **Para Relatórios Gerenciais (Gráficos/Tabelas):** Delegue a renderização 100% para o Frontend (React). O Java apenas retorna um JSON paginado rápido. O React plota com Recharts e exporta via bibliotecas nativas JS (ex: `jspdf` ou `html2pdf.js`).
- **Para Ordens de Serviço (Termos Fiscais/Jurídicos Oficiais):** Se a impressão *precisa* ser idêntica (layout imutável), o Backend deve gerar. Porém, mova a geração para uma rota assíncrona ou crie um microserviço/worker separado. Se manter no monolito, faça cache do PDF gerado em um Bucket S3 e armazene a URL no banco (`storage_key`), retornando apenas o link para o React.

---

## 4. Escalabilidade do Banco de Dados

### 4.1 Indexação para Tabelas de Alto Volume
**O Risco:** A tabela `logs_atividade` e `itens_os` vão para milhões de registros. Um simples `SELECT * FROM ordens_servico WHERE cliente_id = X ORDER BY created_at DESC` fará um *Full Table Scan* e travará o banco.
**A Solução Técnica:** **Índices Compostos e Estratégia de Arquivamento (Archiving)**.
- **Índices Críticos a adicionar (além dos listados na Fase 2):**
  1. `CREATE INDEX idx_os_cliente_data ON ordens_servico (cliente_id, created_at DESC);` (Essencial para o histórico do cliente).
  2. `CREATE INDEX idx_os_aparelho_data ON ordens_servico (aparelho_id, created_at DESC);` (Para histórico de manutenção do aparelho).
  3. `CREATE INDEX idx_financeiro_data_tipo ON financeiro (data_lancamento, tipo);` (Para dashboards de faturamento rápido).
- **Para Logs/Auditoria:**
  - Não coloque logs transacionais pesados no mesmo banco/schema do transacional principal, se possível. Se usar MySQL, particione a tabela de logs (`PARTITION BY RANGE`) por mês. Após 1 ano, faça *Cold Storage* exportando os dados antigos para o S3 (arquivos parquet/CSV) e apague do MySQL.

## Conclusão do Arquiteto
O sistema desenhado nas Fases 1, 2 e 3 funciona para um TCC ou sistema pequeno. Para um ambiente de **Alta Criticidade e Produção Real**, as correções acima não são opcionais, são **mandatórias**.
1. Proteja o banco com Optimistic Locking.
2. Encripte a senha do cliente no nível da aplicação (AES-256).
3. Isole o disparo de WhatsApp da transação principal (`AFTER_COMMIT` + `@Async`).
4. Trave o acesso por métodos (`@PreAuthorize`) com validação contextual de domínio.