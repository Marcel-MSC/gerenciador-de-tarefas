import type { ITaskStore } from '@/core/ports';
import type { Task, User } from '@/domain/entities';
import { seedTasks, seedUsers } from '@/infrastructure/msw/data/seed';

const TASKS_KEY = 'idealgroup_tasks';
const USERS_KEY = 'idealgroup_users';

export class LocalStorageTaskStore implements ITaskStore {
  getTasks(): Task[] {
    const raw = localStorage.getItem(TASKS_KEY);
    if (!raw) {
      this.saveTasks(seedTasks);
      return [...seedTasks];
    }
    return JSON.parse(raw) as Task[];
  }

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }

  getUsers(): User[] {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      this.saveUsers(seedUsers);
      return [...seedUsers];
    }
    return JSON.parse(raw) as User[];
  }

  saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  reset(): void {
    localStorage.removeItem(TASKS_KEY);
    localStorage.removeItem(USERS_KEY);
    this.saveTasks(seedTasks);
    this.saveUsers(seedUsers);
  }
}
