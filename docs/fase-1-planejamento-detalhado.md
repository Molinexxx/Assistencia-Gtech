# FASE 1 - PLANEJAMENTO, FLUXOS E MODELAGEM CONCEITUAL

## 1. Visão Geral e Objetivo do Software
O sistema de Assistência Técnica de Eletrônicos (focado em Celulares) tem como objetivo central transformar a operação empírica e manual em um processo **rastreável, auditável e previsível**. 

O impacto na operação diária inclui:
*   **Fim do "boca a boca":** Toda a comunicação, orçamentos e diagnósticos ficam registrados no sistema, eliminando dúvidas sobre o que foi combinado com o cliente.
*   **Controle de Perdas (Leakage):** Impede que peças sejam retiradas do estoque sem estarem vinculadas a uma Ordem de Serviço (OS) validada e paga.
*   **Eficiência Financeira:** O caixa reflete exatamente o que foi executado. Comissões deixam de ser calculadas em planilhas manuais e passam a ser regras matemáticas automáticas.
*   **Segurança e LGPD:** Proteção jurídica para a assistência, garantindo que o estado físico do aparelho e seus dados sensíveis (senhas) sejam tratados com rigor e conformidade.

## 2. Fluxo Operacional Interconectado
A arquitetura do sistema baseia-se no modelo de "Efeito Dominó" (Event-Driven conceitual), onde uma entidade alimenta a próxima:

1.  **Entrada:** O **Cliente** (novo ou existente) entra na loja. O sistema vincula este cliente a um **Aparelho** físico (com IMEI único).
2.  **Geração da OS:** O Aparelho é vinculado a uma **Ordem de Serviço**, que atua como o "coração" da operação. A OS herda os dados do cliente e do aparelho.
3.  **Execução e Estoque:** O técnico assume a OS. Ao identificar o problema, ele adiciona **Itens/Peças** à OS. Nesse momento, o sistema se comunica com o **Estoque** para verificar disponibilidade e fazer uma "reserva" lógica da peça.
4.  **Fechamento e Financeiro:** Com o reparo concluído e o cliente na loja para retirar, a OS é fechada. Isso engatilha duas ações:
    *   **Estoque:** A "reserva" vira uma "baixa definitiva".
    *   **Financeiro:** O valor total (peças + mão de obra) gera um lançamento de **Contas a Receber** ou entrada no **Caixa** (se pago à vista).
5.  **Comissionamento:** Assim que o status do pagamento muda para "Confirmado", o módulo de **Comissões** lê a regra do técnico vinculado à OS e credita o valor na sua carteira mensal.

## 3. Fluxogramas Textuais Detalhados

### 3.1. Fluxo Geral de Navegação do Sistema
*   **Passo 1:** Autenticação do usuário (Login) e direcionamento ao Dashboard (Painel de Controle).
*   **Passo 2:** No Dashboard, o usuário visualiza alertas (ex: peças acabando, OS atrasadas) e acessa a barra de busca rápida (por CPF, OS ou IMEI).
*   **Passo 3:** O Atendente inicia o fluxo de atendimento em "Nova OS", passando pela triagem do Cliente e Aparelho.
*   **Passo 4:** A OS vai para a "Fila de Reparos" do Técnico.
*   **Passo 5:** O Técnico atualiza o status, anexa fotos e insere peças.
*   **Passo 6:** O Atendente/Caixa realiza a cobrança, emite o termo de garantia e entrega o aparelho.

### 3.2. Fluxo Crítico de Entrada e Abertura de OS (Triagem)
*   **1. Identificação:** Busca de cliente por CPF/Telefone. Se não existir, cadastro rápido.
*   **2. Registro do Aparelho:** Inserção de Marca, Modelo e IMEI. O sistema valida se o IMEI já tem histórico de OS anteriores na loja.
*   **3. Checklist Físico Obrigatório:**
    *   Verificação de tela (trincada, riscada, intacta).
    *   Verificação de carcaça e botões.
    *   Sinais de oxidação ou contato com líquido.
    *   Testes básicos (Câmera, FaceID/TouchID, Alto-falante).
*   **4. Coleta de Dados Sensíveis:**
    *   Registro de bloqueios (iCloud, Conta Google, FRP).
    *   Coleta da senha de desbloqueio do aparelho.
*   **5. Sintomas:** Relato do cliente sobre o defeito.
*   **6. Conclusão:** OS gerada com status `RECEBIDA`. Impressão de via do cliente com QR Code para acompanhamento.

### 3.3. Fluxo de Baixa Automática de Estoque
*   **1. Inserção:** Técnico insere "Tela iPhone 11" na OS. O status da OS muda para `EM_REPARO` ou `AGUARDANDO_APROVACAO`.
*   **2. Reserva Lógica:** O estoque da peça passa de "10" para "9 disponíveis e 1 reservada". (Impede que outro técnico use a mesma peça).
*   **3. Validação:** Técnico finaliza o reparo e muda o status para `FINALIZADA`.
*   **4. Efetivação:** O cliente aprova e paga. A OS muda para `ENTREGUE`.
*   **5. Baixa:** A reserva é consumida. O estoque real cai para 9. Um log de auditoria é gerado vinculando a saída da peça ao ID da OS.

### 3.4. Fluxo Financeiro e de Comissões
*   **1. Faturamento:** OS entra em status `ENTREGUE`. O sistema consolida (Valor Mão de Obra + Valor Peças - Descontos).
*   **2. Recebimento:** O Caixa seleciona a forma de pagamento (ex: Pix + Cartão de Crédito parcelado).
*   **3. Lançamento:** O sistema gera as entradas no fluxo de caixa (Pix imediato) e contas a receber (Cartão para 30 dias).
*   **4. Apuração de Comissão:** O sistema verifica o perfil do Técnico. Se a regra for "30% sobre Mão de Obra", ele isola o valor das peças e calcula a porcentagem apenas sobre o serviço.
*   **5. Disponibilização:** O valor vai para o "Extrato do Técnico" como saldo a receber no próximo fechamento de folha.

## 4. Regras de Negócio Críticas e Segurança

### 4.1. Controle de Estoque
*   **Estoque Mínimo (Ponto de Pedido):** Cada peça terá um gatilho de estoque mínimo. Quando atingido, o sistema bloqueia novas reservas além do limite e dispara alerta visual para o setor de Compras.
*   **Bloqueio de OS sem Peça:** Uma OS não pode avançar para `EM_REPARO` se a peça solicitada não tiver saldo (ou reserva). Ela deve ficar em `AGUARDANDO_PECA`.

### 4.2. Segurança e LGPD (Senhas de Aparelhos)
*   **Criptografia At-Rest:** A senha do aparelho do cliente **NUNCA** deve ser armazenada em texto puro no banco de dados. Ela será criptografada (ex: AES-256) na camada de aplicação antes de ser salva no MySQL.
*   **Visualização Auditada:** A senha aparecerá ofuscada na interface (ex: `••••••`). Para visualizá-la, o Técnico precisa clicar em "Exibir Senha". Essa ação grava um log inalterável: *"Técnico X visualizou a senha da OS Y no dia/hora Z"*.
*   **Expiração de Dados:** Após a OS ser `ENTREGUE` e o prazo de garantia expirar, a senha do aparelho pode ser automaticamente expurgada ou ofuscada permanentemente do sistema (Data Minimization - LGPD).

### 4.3. Restrições de Status e Acessos (RBAC)
*   **Atendente:** Pode criar OS, cadastrar clientes e fechar vendas. **Não pode** alterar o diagnóstico técnico, dar descontos acima do limite pré-estabelecido, ou realizar baixas manuais de estoque.
*   **Técnico:** Pode alterar o status da OS (de `RECEBIDA` para `EM_DIAGNOSTICO`, etc.), adicionar peças à OS e inserir laudos. **Não pode** visualizar o faturamento da loja, custo de compra das peças, ou comissões de outros técnicos.
*   **Gerente/Admin:** Acesso total. Único perfil autorizado a reabrir uma OS já entregue, aprovar descontos livres, realizar estornos financeiros e ajustes de inventário.