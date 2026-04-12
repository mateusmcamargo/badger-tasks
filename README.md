# Bager Tasks

Sistema web de gestão de tarefas desenvolvido para a equipe Badger Racing, com foco em produtividade, controle hierárquico e acompanhamento de atividades em ambiente universitário.

Projeto fullstack com front-end em Next.js e back-end em Java Spring Boot, com banco de dados PostgreSQL.

## Principais Funcionalidades

* Gestão de Membros: Cadastro, edição e visualização de membros da equipe com hierarquia definida (Capitão, Gestor, Líder e Membro);
* Gestão de Tarefas: Criação, edição e acompanhamento de tarefas com associação a membros;
* Controle de Acesso por Papel: Cada usuário acessa apenas as informações permitidas pelo seu nível hierárquico;
* Associação Membro-Tarefa: Permite vincular responsáveis a tarefas específicas;
* Listagem com Filtros: Visualização de tarefas com filtros personalizados;
* Interface Mobile-First: Sistema projetado para uso com uma mão, mesmo em ambientes como oficina;
* Histórico de Contribuições (futuro): Registro de atividades realizadas por cada membro ao longo do tempo;
* Dashboard (futuro): Visualização de produtividade e progresso da equipe através de gráficos e relatórios;

## Tecnologias Utilizadas

* Front-end:
  * Next.js (React)
  * TypeScript
  * TailwindCSS

* Back-end:
  * Java
  * Spring Boot

* Banco de Dados:
  * PostgreSQL

## Equipe e Metodologia

> Este projeto segue os princípios do Manifesto Ágil, utilizando Scrum para organização das tarefas e desenvolvimento iterativo por sprints.

* *Mateus de Melo Camargo* **https://github.com/mateusmcamargo**
* *Gabriel Almeida* **[Link GitHub]**
* *Heitor Stefani Alves* **[Link GitHub]**

## Estrutura do Projeto

```
task-manager/
│
├── frontend/        # Aplicação Next.js
├── backend/        # API Spring Boot
├── docs/           # Documentação do projeto
├── docker/         # Configurações de container (opcional)
├── docker-compose.yml
└── README.md
```

## Como Rodar o Sistema

> O sistema utiliza Node.js LTS e ambiente Java para o backend

### Frontend

1. Acesse a pasta do frontend:

```bash
cd frontend
```

2. Instale as dependências:

```bash
npm install
```

3. Rode o servidor de desenvolvimento:

```bash
npm run dev
```

4. Abra no navegador:

http://localhost:3000

### Backend (Spring Boot)

1. Acesse a pasta do backend:

```bash
cd backend
```

2. Execute a aplicação:

```bash
./mvnw spring-boot:run
```

> Certifique-se de que o PostgreSQL está configurado corretamente no application.properties

## Requisitos do Sistema

* Interface simples, rápida e intuitiva;
* Operação em dispositivos móveis (Android 8+ e iOS 14+);
* Controle de acesso baseado em papéis;
* Persistência segura de dados;
* Escalabilidade da arquitetura;

## Metodologia de Desenvolvimento

O projeto será desenvolvido em sprints:

* Sprint 01: Modelagem do banco + autenticação + controle de acesso;
* Sprint 02: CRUD de tarefas + associação membro-tarefa;
* Sprint 03: Ajustes de UX e interface mobile-first;
* Sprint 04: Testes, validação e documentação;

## Considerações Finais

O sistema tem como objetivo melhorar a organização, comunicação e produtividade da equipe Badger Racing, substituindo ferramentas genéricas por uma solução personalizada e eficiente.

Este projeto também serve como prática de desenvolvimento fullstack com tecnologias modernas amplamente utilizadas no mercado.