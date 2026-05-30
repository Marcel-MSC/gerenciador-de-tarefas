Teste Técnico Frontend — Nível Pleno
React com TypeScript, API mockada e Docker obrigatório
Objetivo	Avaliar habilidades práticas de frontend em uma aplicação pequena, com consumo de API mockada, estado, componentes, UX básica, validação e testes.
Nível esperado	Pleno / Mid-level — aproximadamente 2 a 4 anos de experiência.
Tempo estimado	4 a 8 horas. O teste deve ser possível de concluir em um único dia.
Entrega	Repositório privado no GitHub, compartilhado com os avaliadores informados pela empresa.
Prazo sugerido	Definir no envio do desafio, conforme o processo seletivo.

1. Contexto
Você deve construir uma pequena aplicação frontend para gerenciamento de tarefas em um espaço de trabalho. A aplicação deve consumir uma API mockada, permitindo que o avaliador execute o projeto localmente sem depender de backend real.
O objetivo é avaliar organização de código, componentes reutilizáveis, manipulação de estado, integração com dados externos, tratamento de loading/erro, validação de formulário, testes e documentação.
2. Tecnologias permitidas
    • React com TypeScript é obrigatório.
    • Vite, Next.js ou configuração equivalente para React.
    • CSS Modules, Tailwind CSS, Styled Components, Sass ou CSS puro.
    • TanStack Query, Zustand, Context API ou abordagem equivalente para estado e cache.
    • Jest, Vitest, Testing Library, Cypress ou Playwright para testes.
    • API mockada com MSW, MirageJS, json-server, arquivo JSON local, interceptadores ou mocks internos. MSW ou json-server são recomendados.
    • O projeto deve subir com um comando claro, por exemplo: docker compose up --build.
    • Docker é obrigatório. O projeto deve conter Dockerfile e docker-compose.yml para executar a aplicação frontend.
3. Requisitos funcionais
3.1 Listagem de tarefas
Criar uma tela principal com a listagem de tarefas retornadas pela API mockada.
    • Exibir título, status, prioridade, responsável, data de vencimento e tags.
    • Exibir estados de carregamento, vazio e erro.
    • Permitir paginação simples ou carregamento por limite de registros.
3.2 Filtros e busca
Adicionar filtros para facilitar a navegação.
    • Busca por título ou descrição.
    • Filtro por status: pendente, em andamento e concluída.
    • Filtro por prioridade: baixa, média e alta.
    • Filtro por responsável ou tag.
    • Os filtros podem ser aplicados localmente ou simulados pela API mockada.
3.3 Criação de tarefa
Criar um formulário para cadastro de tarefas.
    • Campos obrigatórios: responsável, título, status e prioridade.
    • Campos opcionais: descrição, data de vencimento e tags.
    • Validar campos obrigatórios antes de enviar.
    • Exibir mensagens de erro claras para campos inválidos.
    • Após criar, atualizar a listagem ou invalidar o cache da consulta.
3.4 Edição de tarefa
Permitir edição de uma tarefa existente.
    • A edição pode ser feita em uma página própria, modal ou drawer.
    • Permitir alteração de status e prioridade.
    • Preservar os dados anteriores ao abrir o formulário.
    • Atualizar a listagem após salvar.
3.5 Exclusão de tarefa
Permitir exclusão de uma tarefa.
    • Solicitar confirmação antes de excluir.
    • Remover o item da listagem após confirmação.
    • Tratar erro de exclusão de forma visível ao usuário.
4. API mockada
A aplicação não deve depender de uma API real. O candidato deve implementar uma API mockada com dados iniciais.
4.1 Modelo de dados sugerido
Task {
  id: string
  userId: string
  title: string
  description?: string
  status: "pending" | "in_progress" | "done"
  priority: "low" | "medium" | "high"
  dueDate?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

User {
  id: string
  name: string
  email: string
}
4.2 Endpoints simulados sugeridos
Método	Rota	Descrição
GET	/tasks	Lista tarefas com filtros e paginação.
GET	/tasks/:id	Retorna uma tarefa específica.
POST	/tasks	Cria uma nova tarefa.
PATCH	/tasks/:id	Atualiza parcialmente uma tarefa.
DELETE	/tasks/:id	Remove uma tarefa.
GET	/users	Lista usuários disponíveis para associação nas tarefas.
4.3 Dados iniciais
    • Incluir pelo menos 5 usuários mockados.
    • Incluir pelo menos 15 tarefas mockadas, com variação de status, prioridade, datas e tags.
    • Simular ao menos um cenário de erro, como falha ao carregar tarefas ou falha ao salvar.
5. Requisitos de UX e interface
    • A interface deve ser clara, responsiva e utilizável em desktop e dispositivos menores.
    • Não é necessário seguir um design system específico.
    • Componentes reutilizáveis são esperados, por exemplo: Button, Input, Select, Modal, Badge, TaskCard ou TaskTable.
    • Status e prioridade devem ser visualmente identificáveis.
    • A aplicação deve evitar telas quebradas, estados sem feedback e ações sem confirmação quando necessário.
6. Testes esperados
Incluir testes relevantes. Não é necessário cobrir 100% da aplicação.
    • Renderização da listagem de tarefas.
    • Aplicação de filtro ou busca.
    • Validação do formulário de criação ou edição.
    • Criação ou atualização de tarefa com mock de API.
    • Estado vazio ou erro de carregamento.
7. Entrega
O candidato deve entregar o teste por meio de um repositório privado no GitHub.
    • Criar um repositório privado com o código da solução.
    • Adicionar como colaboradores os usuários do GitHub informados pela empresa.
    • Enviar o link do repositório após conceder o acesso.
    • Não enviar arquivos compactados por e-mail, salvo se solicitado explicitamente.
7.1 O repositório deve conter
    • Código-fonte da aplicação.
    • README com instruções de instalação e execução via Docker.
    • Instruções para rodar os testes.
    • Explicação da estratégia usada para mockar a API.
    • Arquivo .env.example, se houver variáveis de ambiente.
    • Dockerfile e docker-compose.yml funcionais.
    • Observações sobre decisões técnicas e trade-offs feitos por limitação de tempo.
8. Critérios de avaliação
Critério	O que será avaliado
Organização do projeto	Estrutura de pastas, separação de responsabilidades e clareza da arquitetura.
Componentização	Uso de componentes reutilizáveis, coesos e fáceis de manter.
TypeScript	Tipagem adequada de entidades, props, respostas da API e formulários.
Consumo de API mockada	Abstração de chamadas HTTP, tratamento de loading, sucesso e erro.
Estado e cache	Controle adequado de estado local, cache e atualização da lista após mutações.
Formulários e validação	Validação clara, feedback ao usuário e prevenção de dados inválidos.
Testes	Testes úteis, estáveis e executáveis localmente.
UX básica	Interface limpa, responsiva e com bons estados visuais.
Documentação	README suficiente para executar e avaliar o projeto sem explicações adicionais.
9. Bônus opcionais
    • Ordenação por data de vencimento ou prioridade.
    • Persistência local dos dados mockados usando localStorage ou IndexedDB.
    • Modo escuro.
    • Testes end-to-end simples com Cypress ou Playwright.
    • Acessibilidade básica: labels, navegação por teclado e contraste adequado.
    • Deploy em Vercel, Netlify ou serviço equivalente.
10. O que não é esperado
    • Não é necessário criar backend real.
    • Não é necessário implementar autenticação.
    • Não é necessário usar banco de dados.
    • Não é necessário construir uma aplicação grande ou com muitas telas.
    • Não é necessário gastar mais de um dia no desafio.
11. Sugestão de divisão de tempo
Etapa	Tempo sugerido
Setup do projeto e estrutura inicial	30 a 60 minutos
Mock da API e modelos de dados	60 a 90 minutos
Listagem, filtros e estados visuais	2 a 3 horas
Formulários de criação/edição/exclusão	1 a 2 horas
Testes	1 a 2 horas
README e ajustes finais	30 a 60 minutos
12. Observações para o candidato
Este teste não busca avaliar quantidade de telas ou complexidade visual. O foco está em construir uma solução simples, funcional, bem organizada e fácil de entender.
Em caso de limitações de tempo, priorize os requisitos principais, mantenha o código limpo e documente no README o que ficou fora do escopo.