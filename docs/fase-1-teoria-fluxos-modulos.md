# Fase 1 — Teoria, Fluxos e Módulos

## 1. Visão Geral e Objetivo do Software

O Sistema de Assistência Técnica de Celulares tem como objetivo padronizar e rastrear toda a operação (atendimento → diagnóstico → reparo → entrega → cobrança), reduzindo perdas de informação, inconsistências financeiras e falhas de estoque.

Impactos diretos no dia a dia:

- Centraliza o histórico do cliente, do aparelho e das ordens de serviço (OS), evitando retrabalho e “informação solta” em WhatsApp/papel.
- Aumenta previsibilidade do estoque, vinculando consumo de peças ao ciclo real do reparo.
- Mantém o caixa e o faturamento coerentes com a operação (o que foi feito e entregue vira movimento financeiro).
- Garante rastreabilidade e auditoria: quem fez o quê, quando, e por qual motivo (mudanças de status, valores, descontos).
- Eleva segurança e conformidade, especialmente no tratamento de dados sensíveis (senhas/padrões/biometria e informações do aparelho).

## 2. Fluxo Operacional e Lógica dos Módulos

### 2.1 Entidades centrais (conceito)

- Cliente: pessoa/empresa com dados de contato e histórico.
- Aparelho: unidade física vinculada ao cliente (marca/modelo, IMEI/serial, condição física, acessórios, bloqueios).
- Ordem de Serviço (OS): processo de atendimento técnico com status, orçamento, peças, mão de obra, prazos, técnico responsável e evidências.
- Estoque: peças/produtos com saldo, custo médio (ou custo por lote), mínimo, reservas e movimentações.
- Financeiro: caixa, contas a receber/pagar, formas de pagamento, faturamento/recibos/notas, conciliações.
- Comissão: regras por técnico e cálculo por OS (mão de obra e/ou margem de peças), com apuração e fechamento.

### 2.2 Módulos e como se conectam

#### (A) Cadastro/CRM (Clientes)

- Entrada principal de atendimento.
- Fornece base para: criação de Aparelho, OS, histórico e relatórios (retorno, recorrência, garantia).

#### (B) Gestão de Aparelhos

- Cada registro de aparelho é a “âncora” do histórico técnico.
- Guarda dados críticos: IMEI/serial, estado físico, fotos/evidências, acessórios recebidos, bloqueios (iCloud/FRP), senha/padrão (armazenamento protegido), observações.

#### (C) Ordem de Serviço (OS)

- Núcleo operacional.
- Consome dados do Cliente e do Aparelho.
- Controla: checklist obrigatório, diagnóstico, orçamento, aprovações, execução, testes, entrega, garantia.
- Integra com:
  - Estoque: reserva/consumo de peças.
  - Financeiro: geração de cobranças/recebimentos.
  - Comissão: cálculo ao fechar/entregar (conforme regra).
  - Auditoria: trilha de mudanças de status, valores e descontos.

#### (D) Estoque

- Mantém saldos e custo.
- Interage com OS em dois momentos:
  1. Prévia/Reserva (opcional, mas recomendado): ao montar orçamento ou separar peças.
  2. Baixa efetiva: ao fechar OS (ou em marcos configuráveis).
- Produz movimentações: entrada (compra), saída (consumo OS), ajuste, devolução, transferência.

#### (E) Financeiro

- Recebe eventos da OS:
  - Sinal/adiantamento (antes do fechamento).
  - Cobrança final na entrega.
  - Estornos e ajustes.
- Separa conceitos:
  - Movimento de Caixa (entrada/saída no dia).
  - Contas a Receber (parcelas futuras, cartão, boleto).
  - Faturamento (documento fiscal/recibo, se aplicável).
- Alimenta relatórios de lucratividade por OS e por técnico.

#### (F) Comissão do Técnico

- Pode ser calculada por:
  - Percentual da mão de obra.
  - Percentual da margem (receita - custo peças).
  - Regra híbrida com tetos/condições.
- Disparos típicos:
  - “OS concluída e paga” → gera comissão “a apurar”.
  - “Fechamento mensal” → consolida e trava período (sem alterações retroativas sem permissão).

#### (G) Usuários, Perfis e Auditoria

- Define quem pode:
  - Alterar status de OS.
  - Aprovar descontos.
  - Ver/editar dados sensíveis (senha do aparelho).
  - Ajustar estoque e financeiro.
- Auditoria registra mudanças sensíveis (status, valores, estoque, senha).

### 2.3 Encadeamento fim a fim (exemplo)

1. Entrada do Cliente (cadastro/consulta)
2. Cria/seleciona Aparelho do cliente (IMEI/estado físico/senha protegida)
3. Abre OS vinculada ao aparelho
4. OS passa por diagnóstico e gera orçamento (mão de obra + peças)
5. Ao aprovar, OS pode reservar peças no Estoque
6. Ao finalizar/entregar, OS baixa peças automaticamente no Estoque
7. Fechamento/entrega gera lançamento financeiro (caixa/contas a receber)
8. Com pagamento confirmado, OS gera comissão do técnico conforme regras
9. Tudo fica auditado e disponível em relatórios (produtividade, lucro, consumo de peças, taxa de retorno/garantia)

## 3. Fluxogramas Textuais Completos (Mermaid)

### 3.1 Fluxo geral do sistema

```mermaid
flowchart TD
A[Atendimento] --> B[Cliente: localizar/cadastrar]
B --> C[Aparelho: localizar/cadastrar]
C --> D[Abrir OS]
D --> E[Checklist + Evidências]
E --> F[Diagnóstico]
F --> G[Orçamento]
G --> H{Cliente aprovou?}
H -- Não --> I[Encerrar/Cancelar OS com motivo]
H -- Sim --> J[Separar/Reservar peças (opcional)]
J --> K[Execução do reparo]
K --> L[Testes e validação]
L --> M{Pronto para entrega?}
M -- Não --> K
M -- Sim --> N[Fechar OS]
N --> O[Baixa de estoque]
O --> P[Financeiro: cobrança/recebimento]
P --> Q{Pagamento confirmado?}
Q -- Não --> R[Contas a receber + pendência]
Q -- Sim --> S[Comissão do técnico]
S --> T[Entrega + Termo/Garantia]
```

### 3.2 Fluxo crítico: abertura de OS (com checklist obrigatório, IMEI e senha)

```mermaid
flowchart TD
A[Início: Recepção do aparelho] --> B[Identificar Cliente]
B --> C{Cliente existe?}
C -- Não --> D[Cadastrar Cliente]
C -- Sim --> E[Selecionar Cliente]
D --> E

E --> F[Registrar/Selecionar Aparelho]
F --> G[Capturar IMEI/Serial]
G --> H[Registrar marca/modelo/cor]
H --> I[Checklist físico obrigatório]
I --> I1[Tela: riscos/quebras/manchas]
I --> I2[Carcaça: amassados/aberturas]
I --> I3[Câmeras/biometria/botões]
I --> I4[Conectores/alto-falante/mic]
I --> I5[Sinais de oxidação]
I --> J[Registrar acessórios recebidos]
J --> K[Coletar senha/padrão (campo protegido)]
K --> L[Registrar bloqueios: iCloud/FRP/Pin SIM]
L --> M[Fotos/Evidências anexadas]
M --> N{Checklist completo?}
N -- Não --> O[Impedir abertura / solicitar completar]
N -- Sim --> P[Abrir OS com status: Recebida]
P --> Q[Gerar protocolo e termo]
```

### 3.3 Fluxo de movimentação de estoque (baixa automática ao fechar OS)

```mermaid
flowchart TD
A[OS em execução] --> B[Selecionar peças na OS]
B --> C{Modelo de estoque}
C -- Reserva habilitada --> D[Reservar saldo]
C -- Sem reserva --> E[Somente listar itens]
D --> F[OS Finalizada/Fechada]
E --> F

F --> G[Validar itens vinculados (quantidade > 0)]
G --> H{Saldo disponível?}
H -- Não --> I[Bloquear fechamento ou exigir autorização + backorder]
H -- Sim --> J[Gerar movimentações de saída]
J --> K[Atualizar saldo e custo]
K --> L[Registrar vínculo Movimentação ↔ OS]
L --> M[Auditar usuário/data]
```

### 3.4 Fluxo financeiro (caixa, faturamento e comissão)

```mermaid
flowchart TD
A[OS Fechada] --> B[Calcular total: peças + mão de obra + taxas - descontos]
B --> C{Há adiantamento?}
C -- Sim --> D[Abater adiantamento do saldo]
C -- Não --> E[Saldo integral]

D --> F[Gerar cobrança]
E --> F
F --> G{Forma de pagamento}
G --> G1[Dinheiro/Pix: entrada imediata no caixa]
G --> G2[Cartão: registrar recebível + taxas]
G --> G3[Parcelado: contas a receber por parcelas]
G --> G4[Boleto/Link: contas a receber]

G1 --> H[Pagamento confirmado]
G2 --> I[Confirmar conforme conciliação]
G3 --> I
G4 --> I
I --> H

H --> J{Faturamento necessário?}
J -- Sim --> K[Emitir documento: recibo/nota (se aplicável)]
J -- Não --> L[Pular]

K --> M[Comissão: calcular base]
L --> M
M --> N{Regra de comissão}
N --> N1[% mão de obra]
N --> N2[% margem]
N --> N3[Híbrida/condicional]
N1 --> O[Gerar comissão a pagar]
N2 --> O
N3 --> O
O --> P[Fechamento de comissão por período]
```

## 4. Definição das Regras de Negócio Críticas

### 4.1 Segurança e controle de acesso (RBAC + auditoria)

- Perfis e permissões por módulo: atendimento, técnico, estoque, financeiro, gestor, administrador.
- Transições de status da OS controladas por perfil:
  - Exemplo: somente gestor pode mover para “Cancelada”, “Entregue sem pagamento”, “Reaberta”, ou aplicar descontos acima de um limite.
- Auditoria obrigatória para eventos críticos:
  - Alteração de valores, descontos, forma de pagamento, estornos, exclusão de itens de OS, ajuste de estoque, mudança de técnico responsável, alteração de status.
- Dados sensíveis do aparelho (senha/padrão/PIN):
  - Devem ser armazenados de forma protegida (criptografia no servidor e acesso estritamente por permissão).
  - Visualização deve ser registrada em auditoria (quem acessou e quando).
  - Opção de expiração/mascaramento: após entrega, ocultar automaticamente e manter apenas se exigido por política interna.
- Evidências (fotos/checklist):
  - Imutabilidade prática: após OS avançar além de certo status, alterações só via perfil gestor e com motivo.
- Sessões e autenticação:
  - Políticas de senha forte, expiração de sessão, bloqueio por tentativas, e logs de login.
- Segregação de função:
  - Usuário que ajusta estoque não deve necessariamente poder estornar pagamentos (evita fraude interna), conforme decisão da gestão.

### 4.2 Regras operacionais da OS

- Checklist obrigatório antes de “Recebida”/“Aberta”:
  - Não permitir criação de OS sem IMEI/serial (ou justificativa obrigatória quando tecnicamente impossível) e estado físico mínimo preenchido.
- Estados e transições válidas (exemplo conceitual):
  - Rascunho → Recebida → Em diagnóstico → Aguardando aprovação → Em reparo → Aguardando peça → Finalizada → Entregue
  - Cancelada pode ocorrer apenas até certo ponto, com motivo e permissão.
- Aprovação de orçamento:
  - Registro de quem aprovou, data/hora, canal (presencial/telefone/WhatsApp) e valor aprovado.
  - Alterações no orçamento após aprovado exigem nova aprovação.
- Garantia:
  - OS entregue pode gerar “período de garantia” e regras de retorno (ex.: garantia só cobre mão de obra/defeito do serviço, não cobre oxidação/mau uso).
- Reabertura de OS:
  - Se reabrir após baixa de estoque/financeiro, deve gerar fluxo de ajuste: devolução/novo consumo e estorno/ajuste financeiro (controlado por permissão).

### 4.3 Regras de estoque

- Estoque mínimo:
  - Cada peça pode ter “mínimo” e “ponto de reposição”; ao atingir, gerar alerta (dashboard/relatório).
- Baixa automática ao fechar OS:
  - Só ocorre se OS estiver em status finalizável e itens estiverem consistentes.
  - Se não houver saldo, definir política: bloquear fechamento ou permitir com autorização (gerando pendência/backorder).
- Custo e margem:
  - Definir método de custo (médio, FIFO por lote, etc.) porque impacta lucro e comissão por margem.
- Movimentação sempre por documento:
  - Nenhuma alteração de saldo “direta”; toda mudança gera registro de movimentação com motivo.

### 4.4 Regras financeiras e de comissão

- Caixa e contas a receber separados:
  - Cartão/parcelas não entram como “dinheiro disponível” imediatamente; viram recebíveis.
- Descontos e estornos:
  - Desconto acima de limite exige permissão; estorno exige motivo e vínculo à transação original.
- Comissão só com pagamento confirmado (regra recomendada):
  - Evita comissão sobre OS não recebida ou posteriormente estornada.
- Base de comissão explícita:
  - Comissão sobre mão de obra, ou sobre margem, ou híbrida; peças com margem negativa podem ter regra específica (ex.: não comissiona).
- Fechamento de período:
  - Ao fechar mês/quinzena, comissões ficam “travadas”; mudanças posteriores exigem processo de ajuste formal (e permissão).

