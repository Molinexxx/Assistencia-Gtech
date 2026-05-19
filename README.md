# Sistema de Assistencia Tecnica GTech

Sistema profissional para gestao de assistencia tecnica de celulares e eletronicos, com backend em Spring Boot, banco MySQL, pagina web em React e base desktop em Electron.

## Organizacao Atual das Pastas

```text
backend/      API Spring Boot + JPA + Security + Flyway
software/     Aplicacao desktop Electron / executavel Windows
pagina-web/   Frontend React + Vite + Tailwind
docs/         Documentacao funcional, arquitetural e tecnica
```

## Visao Geral

O projeto foi estruturado em fases para evoluir com consistencia entre negocio, banco de dados, backend, frontend web e aplicacao desktop. Hoje o repositorio contem backend funcional, pagina web premium com foco operacional para assistencia tecnica e base desktop pronta para empacotamento em Windows.

## Stack Tecnologica

- Backend: Java 17 + Spring Boot 3.x
- Seguranca: Spring Security + JWT
- Persistencia: Spring Data JPA + Flyway
- Banco de dados: MySQL 8.x
- Frontend Web: React 19 + TypeScript + Vite 8
- UI: TailwindCSS 4 + Lucide React + Recharts
- Estado e formularios: TanStack Query + React Hook Form + Zod
- HTTP Client: Axios com interceptor JWT
- Desktop: Electron + contextBridge + preload seguro
- Build backend: Maven

## Estado Atual do Projeto

### Backend

- Autenticacao JWT e bootstrap de usuario administrador
- Endpoints principais de clientes, ordens de servico e estoque
- Auditoria de operacoes criticas
- Criptografia de dados sensiveis do aparelho
- Controle de concorrencia com optimistic locking
- CORS configurado para integracao local com frontend e desktop
- Busca de tecnicos por nome para alimentar o fluxo operacional da OS
- Endpoint de detalhe da OS por ID
- Endpoint de edicao completa da OS com reaproveitamento de cliente, aparelho, checklist e itens

### Pagina Web

- Login integrado ao backend com persistencia local da sessao
- Rotas protegidas por perfil (`ADMIN`, `ATENDENTE`, `TECNICO`)
- Dashboard administrativo com cards, graficos e fila operacional
- Layout premium com sidebar fixa, branding e visual SaaS
- Sidebar com estado ativo exclusivo para evitar destaque duplicado
- Listagem de ordens de servico com filtros, atualizacao de status e edicao direta
- Busca global de clientes por nome, CPF ou telefone dentro do modulo de OS
- Formulario multi-step de abertura e edicao de OS
- Selects buscaveis para marca, modelo e tecnico responsavel
- PIN pad visual para senha do aparelho com operacao por mouse ou toque
- Preenchimento automatico de endereco por CEP no cadastro do cliente
- Modulo de estoque premium com filtros por categoria, alertas semanticos e entrada de mercadoria
- Componentes reutilizaveis para modal, select com busca e blocos operacionais

### Software Desktop

- Estrutura Electron separada em `software/`
- `main.js` seguro com `contextBridge`, `preload` e `nodeIntegration: false`
- Configuracao externa da URL da API sem recompilar
- Monitoramento de conexao com overlay de reconexao
- Compatibilidade com `file://` via roteamento adaptado
- Base de empacotamento Windows com NSIS

## Principais Atualizacoes Recentes

### Refatoracao da Nova OS

- Stepper operacional em 3 etapas com foco em velocidade de atendimento
- Etapa de aparelho com selecao de marca e modelo via busca interna
- PIN pad visual para senha do aparelho
- Tecnico responsavel exibido por nome, nao por ID
- Edicao completa da OS existente a partir da listagem

### Gestao de Ordens de Servico

- Busca global de cliente por nome, CPF e telefone
- Atualizacao de status com controle de versao
- Tabela operacional com acesso rapido a edicao
- Retorno detalhado da OS para reabrir formularios sem perda de contexto

### Modulo de Estoque

- Interface premium nas cores azul marinho, grafite e branco
- Filtros por categoria: pecas, acessorios e ferramentas
- Alertas semanticos para estoque baixo e critico
- Modal de entrada de mercadoria
- Acao rapida de reposicao por item

## Como Rodar

### Backend

```bash
cd backend
mvn spring-boot:run
```

API local esperada:

```text
http://localhost:8080/api/v1
```

Health check esperado:

```text
http://localhost:8080/actuator/health
```

### Pagina Web

```bash
cd pagina-web
npm install
npm run dev
```

Aplicacao web local esperada:

```text
http://localhost:5173
```

### Software Desktop

```bash
cd software
npm install
npm run desktop:dev
```

Para gerar instalador Windows:

```bash
cd software
npm run dist:win
```

## Login Padrao

```text
usuario: admin
senha: Admin@123
```

## Documentacao

- [Fase 1 - Teoria, Fluxos e Modulos](docs/fase-1-teoria-fluxos-modulos.md)
- [Fase 1 - Planejamento Detalhado](docs/fase-1-planejamento-detalhado.md)
- [Fase 2 - Backend, Banco e APIs](docs/fase-2-backend-banco-apis.md)
- [Fase 3 - Frontend, UX e Deploy](docs/fase-3-frontend-ux-deploy.md)
- [PRD Fase 3 Frontend React](docs/prd-fase-3-frontend-react.md)
- [Arquitetura Tecnica Fase 3 Frontend](docs/arquitetura-tecnica-fase-3-frontend.md)
- [Resumo Para GitHub](docs/resumo-atualizacoes-github.md)
- [Revisao Critica de Arquitetura](docs/revisao-critica-arquitetura.md)
- [README do Backend](backend/README.md)
- [README da Pagina Web](pagina-web/README.md)

## Observacoes

- A pasta `software/` concentra somente o app desktop / executavel
- A pasta `pagina-web/` concentra somente a interface web React
- O backend continua compartilhado por ambas as experiencias
- Para refletir as mudancas da pagina web no executavel, e necessario recompilar o desktop apos gerar novo build