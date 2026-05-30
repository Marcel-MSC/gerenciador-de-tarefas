# Gerenciador de Tarefas — Teste Ideal Group

Aplicação frontend para gerenciamento de tarefas em um workspace, com API mockada (MSW), arquitetura **SOLID** em camadas e execução via Docker.

## Pré-requisitos

- [Docker](https://www.docker.com/) (recomendado para avaliação)
- Node.js 20+ (desenvolvimento local e testes)

## Execução com Docker

```bash
docker compose up --build
```

Acesse: **http://localhost:8080**

O build habilita MSW (`VITE_ENABLE_MSW=true`) para que a API mockada funcione sem backend real.

## Desenvolvimento local

```bash
cp .env.example .env
npm install
npx msw init public --save
npm run dev
```

Abra **http://localhost:5173**

## Testes

```bash
# Unitários e integração (Vitest)
npm test

# E2E (Playwright — sobe o dev server automaticamente)
npm run test:e2e
```

## Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `VITE_ENABLE_MSW` | `true` para ativar Mock Service Worker |
| `VITE_API_BASE` | Prefixo da API (padrão: `/api`) |
| `VITE_USE_LOCAL_STORAGE` | `true` persiste dados mockados no localStorage |

## Estratégia de mock da API

- **MSW (Mock Service Worker)** intercepta requisições `fetch` para `/api/*`.
- Handlers em `src/infrastructure/msw/handlers/` delegam leitura/escrita ao `ITaskStore`.
- **Persistência**: `LocalStorageTaskStore` mantém tarefas entre recarregamentos.
- **Cenários de erro**: header `X-Simulate-Error` (`tasks-list`, `task-save`, `task-delete`) ou seletor na UI.

## Arquitetura SOLID

```
presentation/  → UI, hooks (TanStack Query)
core/ports/    → ITaskRepository, IUserRepository, IHttpClient, ITaskStore
domain/        → entidades, Zod, filtros (sem React)
infrastructure/→ HttpTaskRepository, MSW, localStorage
di/            → composition root (createRepositories + Provider)
```

| Princípio | Aplicação |
|-----------|-----------|
| **S** | Cada pasta/módulo com uma responsabilidade (ex.: `taskFilters.ts` só filtra) |
| **O** | Novos filtros via funções em `domain/filters/`; storage substituível |
| **L** | `InMemoryTaskRepository` substitui `HttpTaskRepository` nos testes |
| **I** | `ITaskReader` / `ITaskWriter` segregados; `IUserReader` separado |
| **D** | Features usam hooks → repositórios injetados via `RepositoryProvider` |

Para trocar o mock por API real: implemente `ITaskRepository` apontando para o backend e registre em `createRepositories()` — **sem alterar** componentes em `presentation/features/`.

## Funcionalidades

- Listagem com paginação, loading, vazio e erro
- Filtros: busca, status, prioridade, responsável, tag, ordenação
- CRUD com validação (Zod + React Hook Form)
- Confirmação antes de excluir
- Modo escuro, a11y básica, simulação de erros, reset de dados

## Deploy (Vercel)

1. Importe o repositório na [Vercel](https://vercel.com)
2. Framework: Vite
3. Variáveis: `VITE_ENABLE_MSW=true`, `VITE_API_BASE=/api`
4. Build: `npm run build` — Output: `dist`

## Trade-offs

- MSW no build de produção simplifica o Docker; em produção real removeria MSW e usaria API verdadeira.
- Hooks no lugar de classes “use-case” mantêm o projeto enxuto para o prazo do teste.
- Playwright E2E depende de Chromium instalado (`npx playwright install`).

## Estrutura principal

Ver `src/` — `domain`, `core/ports`, `infrastructure`, `presentation`, `di`, `test/fakes`.
