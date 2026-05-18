# Sistema de Assistência Técnica Gtech

Sistema profissional para gestão de assistência técnica de celulares e eletrônicos, desenvolvido para operação real com foco em rastreabilidade, segurança, controle de estoque, ordens de serviço, auditoria e escalabilidade.

## Visão Geral

O projeto foi planejado e estruturado em etapas para garantir evolução consistente entre negócio, banco de dados, backend e futura interface web. A solução utiliza backend em Java com Spring Boot, persistência em MySQL e arquitetura preparada para frontend em React.

## Stack Tecnológica

- Backend: Java 17 + Spring Boot 3.x
- Segurança: Spring Security + JWT
- Persistência: Spring Data JPA + Flyway
- Banco de dados: MySQL 8.x
- Build: Maven
- Frontend planejado: React.js + TailwindCSS

## Estado Atual

Atualmente o projeto já possui a fundação técnica da Fase 2 concluída e validada:

- Backend Spring Boot estruturado e funcional
- Banco MySQL modelado com migration Flyway
- Autenticação JWT implementada
- Endpoints principais de clientes, ordens de serviço e estoque
- Auditoria de operações críticas
- Criptografia de dados sensíveis do aparelho
- Controle de concorrência com optimistic locking em entidades críticas
- Documentação técnica consolidada das fases de planejamento, backend e frontend

## Estrutura do Repositório

- [backend](backend/README.md): implementação backend em Spring Boot
- [docs](file:///c:/Users/Administrator/Documents/projeto%20assistencia%20Gtech/docs): documentação funcional, arquitetural e técnica do projeto

## Documentação

- [fase-1-teoria-fluxos-modulos.md](file:///c:/Users/Administrator/Documents/projeto%20assistencia%20Gtech/docs/fase-1-teoria-fluxos-modulos.md)
- [fase-1-planejamento-detalhado.md](file:///c:/Users/Administrator/Documents/projeto%20assistencia%20Gtech/docs/fase-1-planejamento-detalhado.md)
- [fase-2-backend-banco-apis.md](file:///c:/Users/Administrator/Documents/projeto%20assistencia%20Gtech/docs/fase-2-backend-banco-apis.md)
- [fase-3-frontend-ux-deploy.md](file:///c:/Users/Administrator/Documents/projeto%20assistencia%20Gtech/docs/fase-3-frontend-ux-deploy.md)
- [revisao-critica-arquitetura.md](file:///c:/Users/Administrator/Documents/projeto%20assistencia%20Gtech/docs/revisao-critica-arquitetura.md)

## Backend

O backend já permite:

- autenticação de usuários com JWT
- cadastro e consulta de clientes
- cadastro, consulta e ajuste de estoque
- abertura, consulta e atualização de status de ordens de serviço
- auditoria de eventos importantes

Mais detalhes em [backend/README.md](file:///c:/Users/Administrator/Documents/projeto%20assistencia%20Gtech/backend/README.md).

## Próximas Atualizações

As próximas evoluções previstas para o projeto são:

- publicação do repositório remoto no GitHub
- criação do frontend em React com TailwindCSS
- tela de login integrada ao backend
- dashboard administrativo com indicadores operacionais
- telas de clientes, estoque e ordens de serviço
- geração de PDFs e integrações operacionais
- ampliação do módulo financeiro e comissão
- testes automatizados e pipeline de deploy

## Objetivo do Projeto

O objetivo é entregar um sistema robusto, profissional e pronto para produção para assistências técnicas de médio e grande porte, reduzindo controles manuais, melhorando rastreabilidade e aumentando a segurança operacional e financeira.
