# Fase 3 - Interface React, Dashboard e Conclusão

## 1. Estrutura do Frontend React

Para garantir escalabilidade, manutenção e performance, adotaremos uma arquitetura baseada em **Features** (módulos) e **Componentes Compartilhados**, utilizando o ecossistema moderno do React.

### 1.1. Estrutura de Pastas Profissional
```text
src/
  ├── assets/           # Imagens, logos, ícones estáticos
  ├── components/       # Componentes UI globais (Button, Input, Modal, Table)
  ├── contexts/         # Contextos globais (AuthContext, ThemeContext)
  ├── hooks/            # Hooks customizados (useAuth, useToast)
  ├── layouts/          # Layouts estruturais (MainLayout com Sidebar, AuthLayout)
  ├── pages/            # Páginas mapeadas nas rotas
  │   ├── Dashboard/
  │   ├── OS/
  │   │   ├── OsList.jsx
  │   │   ├── OsCreate.jsx
  │   │   └── components/   # Componentes específicos de OS (ChecklistVisual.jsx)
  │   ├── Clientes/
  │   └── Estoque/
  ├── routes/           # Configuração do React Router (públicas e privadas)
  ├── services/         # Configuração do Axios e chamadas de API (api.js, osService.js)
  ├── store/            # Gerenciamento de estado global (Zustand ou Redux, se necessário)
  └── utils/            # Funções utilitárias (formatadores de moeda, data, máscaras)
```

### 1.2. Bibliotecas Recomendadas (Stack)
- **Vite**: Ferramenta de build super rápida para inicializar o projeto React.
- **TailwindCSS**: Framework utilitário para estilização rápida, responsiva e padronizada.
- **Axios**: Cliente HTTP para consumir as APIs do Spring Boot.
- **React Router DOM v6**: Gerenciamento de rotas e navegação SPA.
- **TanStack Query (React Query)**: Para *data fetching*, cache, sincronização e atualização de estado do servidor (essencial para a listagem de OS e Dashboard).
- **React Hook Form + Zod**: Para criação de formulários complexos (como a abertura de OS) com validação de tipagem estrita.
- **Lucide React**: Biblioteca de ícones moderna e leve.
- **Recharts** ou **Chart.js**: Para renderização dos gráficos no Dashboard.

---

## 2. Modelagem das Telas e UX

### 2.1. Arquitetura da Tela "Abertura de OS"
Para não sobrecarregar o atendente, a abertura de OS deve seguir o padrão **Wizard/Stepper** (passo a passo):

*   **Passo 1: Identificação (Cliente)**
    *   Busca rápida por CPF ou Nome. Se não existir, abre um modal lateral para cadastro rápido (nome e telefone).
*   **Passo 2: Aparelho e Checklist Visual (O Coração da UX)**
    *   **UI/UX**: Em vez de apenas campos de texto, exibir um vetor/imagem genérica de um smartphone (frente, verso e bordas).
    *   O atendente clica na área danificada (ex: quina superior direita) e adiciona a observação (ex: "Amassado forte").
    *   Toggles rápidos (Sim/Não) para: Liga? Touch funciona? Câmeras ok? Biometria ok? Sinais de oxidação?
    *   Campo seguro (input type password com botão de "olho" para ver temporariamente) para a senha do aparelho.
*   **Passo 3: Relato e Orçamento Prévio**
    *   Textarea grande para o relato do cliente.
    *   Opção de adicionar itens (peças) buscando do estoque dinamicamente.
*   **Passo 4: Revisão e Assinatura**
    *   Resumo dos dados. Botão para "Gerar OS e Imprimir Termo".

### 2.2. Design Lógico do Dashboard Administrativo
O Dashboard é a tela inicial (Home) e deve fornecer um raio-X da assistência.
*   **KPIs Superiores (Cards)**:
    *   OS Abertas hoje / OS Finalizadas hoje.
    *   Receita do Dia (R$).
    *   Alertas de Estoque (Peças abaixo do mínimo - em vermelho).
*   **Gráfico Principal (Bar Chart)**: Faturamento dos últimos 30 dias (consumido via React Query de um endpoint analítico do Java).
*   **Gráfico Secundário (Donut Chart)**: Distribuição de status das OS em andamento (X% Aguardando Peça, Y% Em Reparo, Z% Aguardando Aprovação).
*   **Fila de Trabalho (Lista Rápida)**: Tabela com as 5 OS mais antigas que ainda não foram entregues, ordenadas por urgência.

---

## 3. Funcionalidades Extras e Integrações

### 3.1. WhatsApp Automático
*   **Onde fica a lógica?** No **Backend (Java)**. O React apenas dispara a intenção (ou acontece automaticamente via mudança de status).
*   **Como funciona**:
    *   O Spring Boot integra-se a uma API de WhatsApp (ex: Evolution API, Z-API, ou WhatsApp Cloud API oficial).
    *   Quando o técnico muda o status da OS de `EM_REPARO` para `FINALIZADA` via React, o backend intercepta o evento, busca o telefone do cliente e dispara: *"Olá [Nome], seu aparelho [Modelo] já está pronto para retirada! Valor: R$ [X]."*
    *   No Frontend, podemos ter um botão manual na OS: "Enviar mensagem no WhatsApp", que chama um endpoint `POST /api/ordens-servico/{id}/notificar-cliente`.

### 3.2. Geração de PDF (Ordem de Serviço / Termo de Garantia)
*   **Solução Robusta (Backend)**: O Java utiliza a biblioteca **JasperReports** ou **iTextPDF** para gerar o documento oficial (com logo da loja, dados do cliente, código de barras/QR Code da OS). O React faz um GET para `/api/ordens-servico/{id}/pdf`, recebe um `Blob` (application/pdf) e abre em uma nova aba para impressão.
*   **Vantagem**: Garante que o PDF seja sempre igual, independente do navegador do usuário, e pode ser enviado como anexo no WhatsApp automaticamente.

---

## 4. Código Inicial (Boilerplate) - Listagem e Atualização de OS

Abaixo, um exemplo de componente React moderno utilizando TailwindCSS, Axios e TanStack Query para listar OS e atualizar o status rapidamente.

**`src/services/osService.js`**
```javascript
import api from './api'; // Instância do axios pré-configurada (com token JWT)

export const getOrdensServico = async () => {
  const { data } = await api.get('/ordens-servico');
  return data;
};

export const updateStatusOs = async ({ id, status }) => {
  const { data } = await api.put(`/ordens-servico/${id}/status`, { status });
  return data;
};
```

**`src/pages/OS/OsList.jsx`**
```jsx
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrdensServico, updateStatusOs } from '../../services/osService';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const statusColors = {
  RECEBIDA: 'bg-gray-200 text-gray-800',
  EM_DIAGNOSTICO: 'bg-blue-100 text-blue-800',
  AGUARDANDO_APROVACAO: 'bg-yellow-100 text-yellow-800',
  EM_REPARO: 'bg-purple-100 text-purple-800',
  FINALIZADA: 'bg-green-100 text-green-800',
};

export default function OsList() {
  const queryClient = useQueryClient();

  // Buscar OS via React Query
  const { data: ordens, isLoading, isError } = useQuery({
    queryKey: ['ordens-servico'],
    queryFn: getOrdensServico,
  });

  // Mutação para atualizar o status
  const mutation = useMutation({
    mutationFn: updateStatusOs,
    onSuccess: () => {
      // Invalida o cache e refaz a busca automaticamente
      queryClient.invalidateQueries({ queryKey: ['ordens-servico'] });
    },
  });

  const handleStatusChange = (id, newStatus) => {
    mutation.mutate({ id, status: newStatus });
  };

  if (isLoading) return <div className="p-4 text-center">Carregando OS...</div>;
  if (isError) return <div className="p-4 text-red-500">Erro ao carregar dados.</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Fila de Ordens de Serviço</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 font-semibold text-gray-600">OS</th>
              <th className="py-3 px-4 font-semibold text-gray-600">Cliente</th>
              <th className="py-3 px-4 font-semibold text-gray-600">Aparelho</th>
              <th className="py-3 px-4 font-semibold text-gray-600">Status</th>
              <th className="py-3 px-4 font-semibold text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody>
            {ordens.map((os) => (
              <tr key={os.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-mono text-sm">{os.codigo}</td>
                <td className="py-3 px-4">{os.clienteNome}</td>
                <td className="py-3 px-4">{os.aparelhoModelo}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[os.status]}`}>
                    {os.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <select 
                    className="border rounded p-1 text-sm bg-white cursor-pointer"
                    value={os.status}
                    onChange={(e) => handleStatusChange(os.id, e.target.value)}
                    disabled={mutation.isPending}
                  >
                    <option value="RECEBIDA">Recebida</option>
                    <option value="EM_DIAGNOSTICO">Em Diagnóstico</option>
                    <option value="AGUARDANDO_APROVACAO">Aguardando Aprovação</option>
                    <option value="EM_REPARO">Em Reparo</option>
                    <option value="FINALIZADA">Finalizada</option>
                    <option value="ENTREGUE">Entregue</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## 5. Plano de Deploy e Segurança

Para colocar o sistema em produção com segurança corporativa:

### 5.1. Hospedagem e Arquitetura Cloud
*   **Frontend (React)**: Hospedar na **Vercel** ou **Netlify**. É gratuito/barato, tem CDN global (super rápido), deploy automático a partir do GitHub e já fornece certificado SSL nativo.
*   **Backend (Spring Boot Java)**: Hospedar na **AWS (EC2 ou Elastic Beanstalk)**, **DigitalOcean (App Platform)** ou **Railway**. Recomenda-se empacotar a aplicação via **Docker**.
*   **Banco de Dados (MySQL)**: Utilizar um serviço gerenciado (Managed Database) como **AWS RDS** ou **DigitalOcean Databases**.
    *   *Por que?* Backups são automáticos, há proteção contra falhas de hardware e *Point-in-Time Recovery* (restaurar o banco para um minuto específico em caso de desastre).

### 5.2. Segurança e Compliance
*   **Firewall (Inbound Rules)**: O banco de dados MySQL **NÃO** deve estar exposto para a internet. O firewall do banco deve aceitar conexões APENAS do IP interno do servidor Backend.
*   **SSL/TLS (HTTPS)**: Toda a comunicação entre o React (cliente) e o Spring Boot (API) deve ocorrer via HTTPS (Let's Encrypt é gratuito e automatizável).
*   **Armazenamento de JWT**: O token JWT gerado pelo Java deve ser idealmente armazenado em **Cookies `HttpOnly`** (previne ataques XSS, pois o JavaScript não consegue ler o cookie) em vez de `localStorage`.
*   **Backup (Disaster Recovery)**: Configurar rotina de backup diário do banco de dados retido por 30 dias. Fotos e anexos da OS devem ser salvos em um Bucket **AWS S3** (nunca no banco de dados).

---

## Conclusão: O Caminho para Iniciar Imediatamente

Com as 3 fases concluídas, você tem a **fundação completa** de um software profissional de alto nível. Para iniciar o código hoje, siga esta ordem:

1.  **Kickoff do Banco (Fase 2)**: Conecte-se ao MySQL local e rode o script DDL. O coração do sistema está pronto.
2.  **Scaffold do Backend (Fase 2)**: Crie o projeto Spring Boot (Spring Initializr), configure a string de conexão no `application.yml`, crie as Entidades JPA e exponha as APIs básicas de Cliente e OS.
3.  **Scaffold do Frontend (Fase 3)**: Rode `npm create vite@latest assistencia-web -- --template react`, instale Tailwind, Axios e React Router.
4.  **Integração (Fase 1 e 3)**: Conecte o formulário React à API Java, testando o fluxo operacional desenhado na Fase 1 (Cliente -> Aparelho -> OS).

A arquitetura está escalável, segura e orientada a negócios. O projeto está pronto para a etapa de codificação real!
