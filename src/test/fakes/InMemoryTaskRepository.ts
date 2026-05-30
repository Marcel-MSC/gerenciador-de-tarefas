import type { ITaskRepository } from '@/core/ports';
import type {
  CreateTaskInput,
  PaginatedTasks,
  Task,
  TaskListParams,
  UpdateTaskInput,
} from '@/domain/entities';
import {
  applyTaskFilters,
  paginateTasks,
  sortTasks,
} from '@/domain/filters/taskFilters';

export class InMemoryTaskRepository implements ITaskRepository {
  constructor(private tasks: Task[]) {}

  async list(params: TaskListParams): Promise<PaginatedTasks> {
    const filtered = applyTaskFilters(this.tasks, params);
    const sorted = sortTasks(filtered, params.sort);
    return paginateTasks(sorted, params.page ?? 1, params.limit ?? 10);
  }

  async getById(id: string): Promise<Task> {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) throw new Error('Not found');
    return task;
  }

  async create(input: CreateTaskInput): Promise<Task> {
    const now = new Date().toISOString();
    const task: Task = {
      ...input,
      id: `t${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    this.tasks = [task, ...this.tasks];
    return task;
  }

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Not found');
    const updated = {
      ...this.tasks[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    this.tasks = [...this.tasks];
    this.tasks[index] = updated;
    return updated;
  }

  async remove(id: string): Promise<void> {
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }

  setTasks(tasks: Task[]) {
    this.tasks = tasks;
  }
}
