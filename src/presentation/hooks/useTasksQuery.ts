import { useQuery } from '@tanstack/react-query';
import type { TaskListParams } from '@/domain/entities';
import { useRepositories } from './useRepositories';

export function useTasksQuery(params: TaskListParams) {
  const { tasks } = useRepositories();

  return useQuery({
    queryKey: ['tasks', params],
    queryFn: () => tasks.list(params),
  });
}

export function useUsersQuery() {
  const { users } = useRepositories();

  return useQuery({
    queryKey: ['users'],
    queryFn: () => users.list(),
  });
}
