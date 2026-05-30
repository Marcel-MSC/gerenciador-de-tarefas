import type { Task, User } from '@/domain/entities';

export interface ITaskStore {
  getTasks(): Task[];
  saveTasks(tasks: Task[]): void;
  getUsers(): User[];
  saveUsers(users: User[]): void;
  reset(): void;
}
