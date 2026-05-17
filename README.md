![Badger Tasks](/.github/images/badger-tasks-logo-github.png)

# Bager Tasks

Sistema web mobile-first de gestão de tarefas desenvolvido para o projeto de extensão ([Badger Racing](https://www.instagram.com/badger.racing/), anteriormente Fórmula CP), esquipe de Fórmula SAE da UTFPR Câmpus Cornélio Procópio, com objetivo de substituir o Notion, que atingiu seu limite de blocos, por uma solução personalizada com controle hierárquico, rastreabilidade de contribuições e interface adaptada ao ambiente de oficina.
 
Projeto fullstack com frontend em Next.js e backend em Java Spring Boot, banco de dados PostgreSQL e infraestrutura em Docker.

---

## Principais Funcionalidades

* Gestão de Membros: Cadastro, edição e visualização de membros da equipe com hierarquia definida (Capitão, Gestor, Líder e Membro);
* Gestão de Tarefas: Criação, edição e acompanhamento de tarefas com associação a membros;
* Controle de Acesso por Papel: Cada usuário acessa apenas as informações permitidas pelo seu nível hierárquico;
* Associação Membro-Tarefa: Permite vincular responsáveis a tarefas específicas;
* Listagem com Filtros: Visualização de tarefas com filtros personalizados;
* Interface Mobile-First: Interface responsiva e adaptável;
* Loop de uso simples: Sistema projetado para uso com uma mão, mesmo em ambientes como oficina;
* Histórico de Contribuições (futuro): Registro de atividades realizadas por cada membro ao longo do tempo;
* Dashboard (futuro): Visualização de produtividade e progresso da equipe através de gráficos e relatórios;

---

## Tecnologias Utilizadas

* Front-end:
  * Next.js (React)
  * TypeScript
  * Módulos SCSS
* Back-end:
  * Java
  * Spring Boot
* Banco de Dados:
  * PostgreSQL
* Infraestrutura e Versionamento:
  * Docker e Docker Desktop
  * Git e Github

---

## Equipe e Metodologia

> Este projeto segue os princípios do Manifesto Ágil, utilizando Scrum para organização das tarefas e desenvolvimento iterativo por sprints.

* [Mateus de Melo Camargo](https://github.com/mateusmcamargo)
* [Gabriel Almeida](https://github.com)
* [Heitor Stefani Alves](https://github.com/HeitorStefani)

<!-- ## Estrutura do Projeto

```
task-manager/
│
├── frontend/        # Aplicação Next.js
├── backend/        # API Spring Boot
├── docs/           # Documentação do projeto
├── docker/         # Configurações de container (opcional)
├── docker-compose.yml
└── README.md
``` -->

---

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

1. Para usar o Docker, abra o aplicativo [Docker Desktop](https://www.docker.com/products/docker-desktop/):

> Certifique-se de que o PostgreSQL está configurado corretamente no application.properties

2. Acesse a pasta do backend:

```bash
cd backend
```

3. Inicialize o container:

```bash
docker compose up -d
```

3. Verifique se o container inicializou corretamente:

```bash
docker ps
```

> Você deverá ver algo assim no console:

```
CONTAINER ID  IMAGE               COMMAND       CREATED    STATUS    PORTS            NAMES
f880008f8c05  postgres:16-alpine  "docker-en…"  14 sec...  Up 14...  0.0.0.0:5433...  badger-tasks-db
```

4. Execute a aplicação:

```bash
./mvnw spring-boot:run
```

---

## Requisitos do Sistema

* Interface simples, rápida e intuitiva;
* Operação em dispositivos móveis (Android 8+ e iOS 14+);
* Controle de acesso baseado em papéis;
* Persistência segura de dados;
* Escalabilidade da arquitetura;

---

## Metodologia de Desenvolvimento

O projeto será desenvolvido em sprints:

* Sprint 01: Modelagem do banco + autenticação + controle de acesso;
* Sprint 02: CRUD de tarefas + associação membro-tarefa;
* Sprint 03: Ajustes de UX e interface mobile-first;
* Sprint 04: Testes, validação e documentação;

---

## Considerações Finais

O sistema tem como objetivo melhorar a organização, comunicação e produtividade da equipe Badger Racing, substituindo ferramentas genéricas por uma solução personalizada e eficiente.

Este projeto também serve como prática de desenvolvimento fullstack com tecnologias modernas amplamente utilizadas no mercado.