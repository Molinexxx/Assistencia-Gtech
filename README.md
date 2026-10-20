# GTech — Gestão de assistência técnica e estoque

Projeto em desenvolvimento com backend Java/Spring Boot, banco MySQL, interface web React/TypeScript e uma base de aplicativo desktop Electron.

O foco atual é concluir e validar o controle de estoque. Clientes, aparelhos e ordens de serviço já têm implementação no backend, mas a aplicação completa ainda tem pendências descritas abaixo.

## Organização

```text
backend/      API Java 17, Spring Boot 3.3.5, JPA, Security e Flyway
pagina-web/   Interface utilizada atualmente: React 19, TypeScript e Vite 8
software/     Aplicativo Electron que utiliza a interface de pagina-web/
frontend/     Outra árvore de interface; comparar antes de arquivar ou remover
docs/         Planejamentos e documentação técnica
```

Fluxo de uma operação: **tela → API Java → regras de negócio → MySQL → resposta para a tela**.

## Estoque: funcionalidades disponíveis

- Cadastro com SKU, nome, descrição, unidade, categoria, custo, preço, saldo inicial e estoque mínimo.
- Categorias salvas no banco: `PECAS`, `ACESSORIOS` e `FERRAMENTAS`, escolhidas no cadastro e na edição.
- Busca por nome ou SKU, incluindo trechos e sem diferenciar maiúsculas e minúsculas.
- Filtros por categoria utilizando o valor salvo, sem classificação automática pelo nome.
- Entrada de unidades de uma peça existente.
- Saída com quantidade e motivo, mensagem de confirmação e atualização da lista.
- Bloqueio de saldo negativo e de novas saídas pela tela quando o estoque está zerado.
- Alertas visuais: amarelo para saldo baixo e vermelho para saldo crítico ou zerado.
- Histórico por peça com data, tipo, quantidade, motivo, responsável, saldo anterior e saldo posterior. A consulta traz 20 registros por página, dos mais recentes para os mais antigos.
- Edição de nome, descrição, categoria, custo, preço e estoque mínimo.
- Proteção no backend contra alteração de quantidade pela edição do cadastro. Mudanças de saldo devem usar as operações de movimentação.
- Controle de versão para recusar edições com dados desatualizados.
- Mensagens de cadastro para SKU repetido, campos obrigatórios e valores negativos dentro da janela de formulário, preservando os dados preenchidos em caso de erro.

Na interface, **Entrada de mercadoria** cadastra um novo item. **Registrar entrada** adiciona unidades de um item já cadastrado.

### Atualização do banco

O Flyway executa as migrations ao iniciar o backend:

- `V1__baseline_schema.sql`: estrutura inicial.
- `V2__categoria_estoque.sql`: adiciona categoria ao estoque, com restrição aos três valores permitidos.

Os itens existentes recebem inicialmente `PECAS` e podem ser reclassificados pela edição. A migration preserva cadastros, saldos e histórico. Não é necessário apagar ou recriar o banco para aplicá-la.

Requisições de cadastro e edição devem incluir `categoria`. A edição também deve informar a versão atual e o saldo já existente, sem modificá-lo.

## Executar no Windows / PowerShell

### Pré-requisitos

- Java 17 disponível no terminal.
- Node.js compatível com o Vite 8: `^20.19.0` ou `>=22.12.0`.
- MySQL 8 ativo e um banco chamado `assistencia_gtech`.
- Usuário MySQL com acesso ao banco e permissão para executar as migrations.

Para criar o banco, execute no MySQL com um usuário autorizado:

```sql
CREATE DATABASE IF NOT EXISTS assistencia_gtech
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 1. Backend — primeiro terminal

Partindo da pasta principal do projeto:

```powershell
Set-Location backend

# Ajuste para o usuário e a senha do seu MySQL local.
$env:SPRING_DATASOURCE_USERNAME = 'SEU_USUARIO_MYSQL'
$env:SPRING_DATASOURCE_PASSWORD = 'SUA_SENHA_LOCAL'

.\mvnw.cmd spring-boot:run
```

A URL padrão do banco está em `backend/src/main/resources/application.yml`. Ela também pode ser substituída pela variável `SPRING_DATASOURCE_URL`.

Aguarde `Started AssistenciaApplication`. A API fica em `http://localhost:8080/api/v1`. O wrapper pode baixar Maven e dependências na primeira execução.

### 2. Interface — segundo terminal

Abra outro terminal na pasta principal:

```powershell
Set-Location pagina-web
npm.cmd ci
npm.cmd run dev
```

Acesse o endereço local exibido pelo Vite, normalmente `http://localhost:5173`. Mantenha os dois terminais abertos.

No PowerShell, `npm.cmd` pode ser usado quando a política de execução bloqueia `npm.ps1`, sem alterar a política do Windows.

O endereço padrão da API é `http://localhost:8080/api/v1`; a interface aceita `VITE_API_BASE_URL` para outro ambiente.

### Acesso inicial de desenvolvimento

- Usuário: `admin`
- Senha: `Admin@123`

São valores de bootstrap para um banco sem o administrador cadastrado. As variáveis `BOOTSTRAP_ADMIN_USERNAME`, `BOOTSTRAP_ADMIN_PASSWORD`, `BOOTSTRAP_ADMIN_EMAIL` e `BOOTSTRAP_ADMIN_NOME` permitem configurar a criação inicial; não representam uma troca automática da senha de um usuário existente.

Antes de uso real, configure credenciais próprias e as variáveis `JWT_SECRET` e `APARELHO_SECRET_KEY`. A chave de aparelho precisa ter exatamente 32 bytes. Não versione senhas ou chaves reais.

### Após alterar código

- Mudanças da interface normalmente aparecem automaticamente pelo Vite.
- Após mudanças no Java ou em migrations, interrompa o backend com `Ctrl + C` e execute novamente `.\mvnw.cmd spring-boot:run`.

## Verificações

### Backend

```powershell
Set-Location backend
.\mvnw.cmd test
```

Há cinco testes automatizados em `EstoqueServiceTest`, cobrindo edição de preço sem movimentar saldo, bloqueio de alteração de quantidade pelo cadastro, versão desatualizada, mudança explícita de categoria e preservação da categoria ao renomear a peça.

### Interface

```powershell
Set-Location pagina-web
npm.cmd run build
npm.cmd run lint
```

Os cinco testes Java e o build completo da interface passaram. A checagem de tipos e o ESLint dos arquivos alterados também passaram. O lint completo ainda aponta um problema preexistente em `src/components/ui/SearchableSelect.tsx`, relacionado a `setQuery` dentro de um efeito.

Foram verificados pela interface: cadastro e persistência após atualizar a página; entrada e saída; alertas de estoque baixo, zerado e reposição; histórico; SKU duplicado; nome obrigatório; quantidade negativa; busca por nome e código; edição de preço e descrição; persistência e filtros de categorias. Esses testes não equivalem à validação de todos os módulos ou de um ambiente de produção.

## Desktop

Com backend e banco configurados, os scripts existentes são:

```powershell
Set-Location software
npm.cmd ci
npm.cmd run desktop:dev

# Para gerar o instalador Windows:
npm.cmd run dist:win
```

O desktop utiliza o build de `pagina-web/`; após mudanças web, gere-o novamente. A geração e a instalação do executável ainda precisam de validação. A configuração de conexão está em `software/desktop/app-config.json`.

## Próximas etapas

1. Desativar e reativar itens preservando cadastro e histórico — ainda não implementado na tela.
2. Revisar ajustes, concorrência e consistência entre saldo e movimentações.
3. Criar relatórios de estoque, movimentos por período e exportação.
4. Revisar permissões, tratamento de falhas e configurações de segurança.
5. Preparar backup do MySQL e testar restauração.
6. Ampliar testes automatizados e corrigir o lint pendente.
7. Validar instalação e conexão do aplicativo desktop.
8. Completar a tela independente de clientes e integrar consumo de peças às ordens de serviço.

Limitações conhecidas: peças incluídas em uma OS ainda não provocam baixa automática; o indicador de faturamento soma valores de ordens pela data de entrada, sem confirmar recebimentos; a listagem de OS precisa de revisão por devolver a senha descriptografada do aparelho; o monitor desktop usa `/actuator/health`, mas o backend ainda não declara o starter Actuator. Financeiro e comissões têm tabelas planejadas, sem módulos completos validados.

## Documentação complementar

- [Backend](backend/README.md)
- [Interface web](pagina-web/README.md)
- [Fluxos e módulos](docs/fase-1-teoria-fluxos-modulos.md)
- [Planejamento](docs/fase-1-planejamento-detalhado.md)
- [Backend, banco e APIs](docs/fase-2-backend-banco-apis.md)
- [Frontend, UX e deploy](docs/fase-3-frontend-ux-deploy.md)
- [Arquitetura da interface](docs/arquitetura-tecnica-fase-3-frontend.md)
- [Revisão de arquitetura](docs/revisao-critica-arquitetura.md)

Os documentos de fases incluem planos e propostas; consulte o código e esta lista de pendências para distinguir planejamento de funcionalidades já verificadas.
