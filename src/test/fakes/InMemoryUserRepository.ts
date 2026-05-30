import type { IUserRepository } from '@/core/ports';
import type { User } from '@/domain/entities';

export class InMemoryUserRepository implements IUserRepository {
  constructor(private users: User[]) {}

  async list(): Promise<User[]> {
    return [...this.users];
  }
}
