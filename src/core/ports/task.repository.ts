import type {
  CreateTaskInput,
  PaginatedTasks,
  Task,
  TaskListParams,
  UpdateTaskInput,
} from '@/domain/entities';

export interface ITaskReader {
  list(params: TaskListParams): Promise<PaginatedTasks>;
  getById(id: string): Promise<Task>;
}

export interface ITaskWriter {
  create(input: CreateTaskInput): Promise<Task>;
  update(id: string, input: UpdateTaskInput): Promise<Task>;
  remove(id: string): Promise<void>;
}

export type ITaskRepository = ITaskReader & ITaskWriter;
