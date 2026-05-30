export type TaskStatus = 'pending' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskSort =
  | 'dueDate_asc'
  | 'dueDate_desc'
  | 'priority_desc'
  | 'createdAt_desc';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskListParams {
  page?: number;
  limit?: number;
  q?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  userId?: string;
  tag?: string;
  sort?: TaskSort;
}

export interface PaginatedTasks {
  data: Task[];
  total: number;
  page: number;
  limit: number;
}

export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTaskInput = Partial<
  Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
>;
