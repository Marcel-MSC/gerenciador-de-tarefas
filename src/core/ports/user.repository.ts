import type { User } from '@/domain/entities';

export interface IUserReader {
  list(): Promise<User[]>;
}

export type IUserRepository = IUserReader;
