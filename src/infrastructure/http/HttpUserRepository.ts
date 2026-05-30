import type { IHttpClient, IUserRepository } from '@/core/ports';
import type { User } from '@/domain/entities';

export class HttpUserRepository implements IUserRepository {
  constructor(private readonly http: IHttpClient) {}

  list(): Promise<User[]> {
    return this.http.get<User[]>('/users');
  }
}
