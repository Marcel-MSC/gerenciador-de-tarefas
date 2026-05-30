import { http, HttpResponse } from 'msw';
import type { Task, TaskListParams } from '@/domain/entities';
import {
  applyTaskFilters,
  paginateTasks,
  sortTasks,
} from '@/domain/filters/taskFilters';
import { createTaskSchema } from '@/domain/schemas/taskFormSchema';
import { getTaskStore } from '@/infrastructure/persistence/getTaskStore';

function getSimulateError(request: Request): string | null {
  return request.headers.get('X-Simulate-Error');
}

function listTasksFromStore(url: URL) {
  const store = getTaskStore();
  const params: TaskListParams = {
    page: Number(url.searchParams.get('page') ?? 1),
    limit: Number(url.searchParams.get('limit') ?? 10),
    q: url.searchParams.get('q') ?? undefined,
    status: (url.searchParams.get('status') as TaskListParams['status']) ?? undefined,
    priority:
      (url.searchParams.get('priority') as TaskListParams['priority']) ?? undefined,
    userId: url.searchParams.get('userId') ?? undefined,
    tag: url.searchParams.get('tag') ?? undefined,
    sort: (url.searchParams.get('sort') as TaskListParams['sort']) ?? undefined,
  };

  const filtered = applyTaskFilters(store.getTasks(), params);
  const sorted = sortTasks(filtered, params.sort);
  return paginateTasks(sorted, params.page, params.limit);
}

export const taskHandlers = [
  http.get('/api/tasks', ({ request }) => {
    if (getSimulateError(request) === 'tasks-list') {
      return HttpResponse.json(
        { message: 'Falha ao carregar tarefas' },
        { status: 500 },
      );
    }
    const url = new URL(request.url);
    return HttpResponse.json(listTasksFromStore(url));
  }),

  http.get('/api/tasks/:id', ({ params }) => {
    const store = getTaskStore();
    const task = store.getTasks().find((t) => t.id === params.id);
    if (!task) {
      return HttpResponse.json({ message: 'Tarefa não encontrada' }, { status: 404 });
    }
    return HttpResponse.json(task);
  }),

  http.post('/api/tasks', async ({ request }) => {
    if (getSimulateError(request) === 'task-save') {
      return HttpResponse.json(
        { message: 'Falha ao salvar tarefa' },
        { status: 500 },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;
    const parsed = createTaskSchema.safeParse({
      userId: body.userId,
      title: body.title,
      status: body.status,
      priority: body.priority,
      description: body.description,
      dueDate: body.dueDate,
      tags: Array.isArray(body.tags)
        ? (body.tags as string[]).join(', ')
        : body.tags,
    });
    if (!parsed.success) {
      return HttpResponse.json(
        { message: 'Dados inválidos', errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const store = getTaskStore();
    const tasks = store.getTasks();
    const now = new Date().toISOString();
    const values = parsed.data;
    const tagsFromBody = body.tags as string[] | string | undefined;
    const tags = Array.isArray(tagsFromBody)
      ? tagsFromBody
      : values.tags
        ? values.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : undefined;
    const newTask: Task = {
      id: `t${Date.now()}`,
      userId: values.userId,
      title: values.title,
      description: values.description,
      status: values.status,
      priority: values.priority,
      dueDate: values.dueDate || undefined,
      tags,
      createdAt: now,
      updatedAt: now,
    };
    store.saveTasks([newTask, ...tasks]);
    return HttpResponse.json(newTask, { status: 201 });
  }),

  http.patch('/api/tasks/:id', async ({ request, params }) => {
    if (getSimulateError(request) === 'task-save') {
      return HttpResponse.json(
        { message: 'Falha ao salvar tarefa' },
        { status: 500 },
      );
    }

    const store = getTaskStore();
    const tasks = store.getTasks();
    const index = tasks.findIndex((t) => t.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ message: 'Tarefa não encontrada' }, { status: 404 });
    }

    const body = (await request.json()) as Partial<Task>;
    const updated: Task = {
      ...tasks[index],
      ...body,
      id: tasks[index].id,
      updatedAt: new Date().toISOString(),
    };
    const next = [...tasks];
    next[index] = updated;
    store.saveTasks(next);
    return HttpResponse.json(updated);
  }),

  http.delete('/api/tasks/:id', ({ request, params }) => {
    if (getSimulateError(request) === 'task-delete') {
      return HttpResponse.json(
        { message: 'Falha ao excluir tarefa' },
        { status: 500 },
      );
    }

    const store = getTaskStore();
    const tasks = store.getTasks();
    const exists = tasks.some((t) => t.id === params.id);
    if (!exists) {
      return HttpResponse.json({ message: 'Tarefa não encontrada' }, { status: 404 });
    }
    store.saveTasks(tasks.filter((t) => t.id !== params.id));
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('/api/users', () => {
    const store = getTaskStore();
    return HttpResponse.json(store.getUsers());
  }),

  http.post('/api/store/reset', () => {
    getTaskStore().reset();
    return HttpResponse.json({ ok: true });
  }),
];
