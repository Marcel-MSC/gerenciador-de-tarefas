import type { IHttpClient, ITaskRepository } from '@/core/ports';
import type {
  CreateTaskInput,
  PaginatedTasks,
  Task,
  TaskListParams,
  UpdateTaskInput,
} from '@/domain/entities';

export class HttpTaskRepository implements ITaskRepository {
  constructor(private readonly http: IHttpClient) {}

  async list(params: TaskListParams): Promise<PaginatedTasks> {
    const search = new URLSearchParams();
    if (params.page) search.set('page', String(params.page));
    if (params.limit) search.set('limit', String(params.limit));
    if (params.q) search.set('q', params.q);
    if (params.status) search.set('status', params.status);
    if (params.priority) search.set('priority', params.priority);
    if (params.userId) search.set('userId', params.userId);
    if (params.tag) search.set('tag', params.tag);
    if (params.sort) search.set('sort', params.sort);
    const qs = search.toString();
    return this.http.get<PaginatedTasks>(`/tasks${qs ? `?${qs}` : ''}`);
  }

  getById(id: string): Promise<Task> {
    return this.http.get<Task>(`/tasks/${id}`);
  }

  create(input: CreateTaskInput): Promise<Task> {
    return this.http.post<Task>('/tasks', input);
  }

  update(id: string, input: UpdateTaskInput): Promise<Task> {
    return this.http.patch<Task>(`/tasks/${id}`, input);
  }

  remove(id: string): Promise<void> {
    return this.http.delete(`/tasks/${id}`);
  }
}
