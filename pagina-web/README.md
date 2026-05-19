# Pagina Web - Sistema de Assistencia GTech

Frontend corporativo em React + Vite para o sistema de assistencia tecnica. Esta aplicacao consome o backend Spring Boot com JWT, organiza a operacao por perfis e entrega uma base pronta para crescer sem reescrita estrutural.

## Stack

- React 19 + TypeScript
- Vite 8
- TailwindCSS 4
- React Router
- TanStack Query
- Axios com interceptor JWT
- React Hook Form + Zod
- Recharts
- Lucide React

## Modulos Entregues

- Login com persistencia local e tratamento de expiracao de token
- Rotas protegidas por perfil (`ADMIN`, `ATENDENTE`, `TECNICO`)
- Dashboard administrativo com cards, graficos e fila operacional
- Listagem de ordens de servico com filtros e atualizacao de status
- Formulario multi-step para abertura de OS
- Cadastro de cliente com preenchimento automatico por CEP
- Layout premium com sidebar fixa, branding e visual corporativo
- Estrutura profissional de pastas em `src/`

## Como Rodar Localmente

```bash
cd pagina-web
npm install
npm run dev
```

## Build

```bash
npm run build
npm run lint
```

## Integracao com o Software Desktop

- O build gerado em `pagina-web/dist` e consumido pela camada Electron em `software/`
- Quando usado no desktop, o roteamento muda automaticamente para `HashRouter`
- A URL da API passa a ser lida dinamicamente pela bridge segura do Electron