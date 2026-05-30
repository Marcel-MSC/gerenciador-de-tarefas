import type { ITaskStore } from '@/core/ports';
import type { Task, User } from '@/domain/entities';
import { seedTasks, seedUsers } from '@/infrastructure/msw/data/seed';

export class InMemoryTaskStore implements ITaskStore {
  private tasks: Task[];
  private users: User[];

  constructor(tasks: Task[] = [...seedTasks], users: User[] = [...seedUsers]) {
    this.tasks = tasks;
    this.users = users;
  }

  getTasks(): Task[] {
    return [...this.tasks];
  }

  saveTasks(tasks: Task[]): void {
    this.tasks = tasks;
  }

  getUsers(): User[] {
    return [...this.users];
  }

  saveUsers(users: User[]): void {
    this.users = users;
  }

  reset(): void {
    this.tasks = [...seedTasks];
    this.users = [...seedUsers];
  }
}
