import type { ITaskRepository, IUserRepository } from '@/core/ports';
import { apiClient, ApiClient } from '@/infrastructure/http/apiClient';
import { HttpTaskRepository } from '@/infrastructure/http/HttpTaskRepository';
import { HttpUserRepository } from '@/infrastructure/http/HttpUserRepository';

export interface Repositories {
  tasks: ITaskRepository;
  users: IUserRepository;
}

export function createRepositories(http: ApiClient = apiClient): Repositories {
  return {
    tasks: new HttpTaskRepository(http),
    users: new HttpUserRepository(http),
  };
}

export { apiClient };
