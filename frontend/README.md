# Frontend - Sistema de Assistencia GTech

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

## Estrutura

```text
src/
  components/
    branding/
    dashboard/
    layout/
    os/
    ui/
  contexts/
  hooks/
  layouts/
  pages/
  router/
  schemas/
  services/
  types/
  utils/
```

## Variaveis de Ambiente

Copie `.env.example` para `.env` se quiser customizar:

```bash
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_API_TIMEOUT_MS=10000
```

## Como Rodar Localmente

1. Garanta que o backend Java esteja ativo em `http://localhost:8080`.
2. No terminal do frontend, rode:

```bash
npm install
npm run dev
```

3. Abra em:

```text
http://localhost:5173
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Integracoes Recomendadas

### WhatsApp

- Fluxo simples: abrir link `https://wa.me/<numero>?text=<mensagem>` a partir do frontend.
- Fluxo profissional: o frontend chama o backend, e o backend dispara a mensageria via provider oficial de forma assincrona, com log e retry.

### PDF da OS

- Melhor pratica: gerar no backend Spring Boot para manter layout oficial, auditoria e assinatura centralizada.
- Alternativa rapida: `jsPDF` no frontend para recibos operacionais temporarios.

## Deploy e Seguranca

### Arquitetura sugerida

- Frontend React: Vercel ou Netlify
- Backend Spring Boot: Render, Railway, AWS Elastic Beanstalk ou ECS
- Banco MySQL: RDS, PlanetScale, Railway ou outro gerenciado
- Arquivos/PDFs: S3 ou bucket equivalente

### Regras de producao

- Mantenha `ProtectedRoute` no frontend para UX, mas nunca confie apenas nela.
- Valide perfis e autorizacao no backend com Spring Security.
- Configure CORS no Spring Boot aceitando somente o dominio real do frontend.
- Nunca salve segredo JWT ou credenciais no frontend.
- Prefira HTTPS em todos os ambientes publicos.

## Observacoes

- O dashboard atual calcula indicadores a partir da API de ordens de servico, porque ainda nao existe endpoint dedicado de BI.
- O campo `tecnicoId` no formulario ainda usa ID manual, pois o backend atual nao possui endpoint publico de listagem de tecnicos.
- O preenchimento automatico por CEP usa a API publica ViaCEP no front-end.
- As rotas usam lazy loading para reduzir o peso inicial da aplicacao.