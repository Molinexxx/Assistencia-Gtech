# Sistema de Assistencia Tecnica GTech

Sistema profissional para gestao de assistencia tecnica de celulares e eletronicos, com backend em Spring Boot, banco MySQL e frontend React voltado para operacao real de balcao, tecnicos e gestao.

## Visao Geral

O projeto foi estruturado em fases para evoluir com consistencia entre negocio, banco de dados, backend e interface web. Hoje o repositorio ja contem backend funcional, documentacao consolidada e frontend React implementado com dashboard, autenticacao e abertura de OS em etapas.

## Stack Tecnologica

- Backend: Java 17 + Spring Boot 3.x
- Seguranca: Spring Security + JWT
- Persistencia: Spring Data JPA + Flyway
- Banco de dados: MySQL 8.x
- Frontend: React 19 + TypeScript + Vite 8
- UI: TailwindCSS 4 + Lucide React + Recharts
- Estado e formularios: TanStack Query + React Hook Form + Zod
- HTTP Client: Axios com interceptor JWT
- Build backend: Maven

## Estado Atual do Projeto

### Backend concluido

- Autenticacao JWT e bootstrap de usuario administrador
- Endpoints principais de clientes, ordens de servico e estoque
- Auditoria de operacoes criticas
- Criptografia de dados sensiveis do aparelho
- Controle de concorrencia com optimistic locking
- CORS configurado para integracao local com o frontend

### Frontend concluido na Fase 3

- Login integrado ao backend com persistencia local da sessao
- Rotas protegidas por perfil (`ADMIN`, `ATENDENTE`, `TECNICO`)
- Dashboard administrativo com cards, graficos e fila operacional
- Layout premium com sidebar fixa, branding e visual SaaS
- Listagem de ordens de servico com filtros e atualizacao de status
- Formulario multi-step de abertura de OS
- Preenchimento automatico de endereco por CEP no cadastro de cliente
- Estrutura profissional de pastas pronta para crescimento do projeto

## Estrutura do Repositorio

```text
backend/   API Spring Boot + JPA + Security + Flyway
frontend/  Aplicacao React + Vite + Tailwind
docs/      Documentacao funcional, arquitetural e tecnica
```

## Documentacao

- [Fase 1 - Teoria, Fluxos e Modulos](docs/fase-1-teoria-fluxos-modulos.md)
- [Fase 1 - Planejamento Detalhado](docs/fase-1-planejamento-detalhado.md)
- [Fase 2 - Backend, Banco e APIs](docs/fase-2-backend-banco-apis.md)
- [Fase 3 - Frontend, UX e Deploy](docs/fase-3-frontend-ux-deploy.md)
- [Revisao Critica de Arquitetura](docs/revisao-critica-arquitetura.md)
- [README do Backend](backend/README.md)
- [README do Frontend](frontend/README.md)

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

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplicacao local esperada:

```text
http://localhost:5173
```

### Login padrao

```text
usuario: admin
senha: Admin@123
```

## Funcionalidades Ja Entregues

- Cadastro e consulta de clientes
- Cadastro, consulta e ajuste de estoque
- Abertura, consulta e atualizacao de status de ordens de servico
- Dashboard administrativo para acompanhamento da operacao
- Interface responsiva para equipe tecnica e gestao
- Autocomplete de endereco por CEP na abertura de OS
- Base pronta para evolucao de modulos financeiros, PDF e notificacoes

## Proximas Evolucoes Recomendadas

- Integrar modulo completo de clientes com busca e edicao dedicada
- Integrar modulo visual de estoque com alertas e ajustes no frontend
- Criar endpoint de listagem de tecnicos para substituir o `tecnicoId` manual
- Adicionar endpoints especificos de dashboard e BI
- Implementar geracao oficial de PDF pelo backend
- Integrar notificacoes operacionais via WhatsApp/API de mensageria
- Publicar repositorio em remoto com pipeline de deploy

## Observacoes de Git

- Arquivos de apoio local como `.trae/` e `tools/` ficam ignorados no controle de versao
- O commit local registra o estado atual do backend e da Fase 3 do frontend
- Nao existe remoto configurado neste repositorio no momento, entao o backup no Git sera local ate configurar um `origin`