![Badger Tasks](/.github/images/badger-tasks-logo-github.png)

# Bager Tasks

Sistema web mobile-first de gestão de tarefas desenvolvido para o projeto de extensão [Badger Racing](https://www.instagram.com/badger.racing/) (anteriormente Fórmula CP), esquipe de Fórmula SAE da UTFPR Câmpus Cornélio Procópio.

Construído com objetivo de substituir o Notion da equipe, que atingiu seu limite de blocos, por uma solução personalizada com controle hierárquico, rastreabilidade de contribuições e interface adaptada ao ambiente de oficina.
 
Projeto fullstack com frontend em Next.js, backend em Java Spring Boot, banco de dados PostgreSQL e infraestrutura em Docker.

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
badger-tasks/
│
├── backend/        # API Spring Boot
├── docs/           # Documentação do projeto
├── frontend/       # Aplicação Next.js
├── seed/           # Scripts de seeding do banco
└── README.md
```
-->

---

## Como Rodar o Sistema

### Instalação

```bash
git clone https://github.com/mateusmcamargo/badger-tasks
cd badger-tasks
```

### Backend (Spring Boot)

> A API roda em ambiente Java com JDK **[VERSÃO]** e Spring Boot **[VERSÃO]**

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

### Frontend

> O sistema utiliza Next.js LTS **[VERSÃO]**, rodando com NPM LTS **[VERSÃO]**

1. Acesse a pasta do frontend:

```bash
cd frontend
```

2. Instale as dependências:

```bash
npm install
```

> As dependências usadas no último build seguem as versões:

``` json
"dependencies": {
  "lucide-react": "^1.14.0",
  "next": "16.2.3",
  "react": "19.2.4",
  "react-dom": "19.2.4",
  "sass": "^1.99.0"
},
"devDependencies": {
  "@tailwindcss/postcss": "^4.2.4",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "autoprefixer": "^10.5.0",
  "babel-plugin-react-compiler": "1.0.0",
  "eslint": "^9",
  "eslint-config-next": "16.2.3",
  "postcss": "^8.5.14",
  "tailwindcss": "^4.2.4",
  "typescript": "^5"
}
```

3. Rode o servidor de desenvolvimento:

```bash
npm run dev
```

4. Abra no navegador:

http://localhost:3000

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
