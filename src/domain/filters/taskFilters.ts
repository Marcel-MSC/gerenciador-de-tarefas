import type { Task, TaskListParams } from '@/domain/entities';

const PRIORITY_ORDER = { high: 3, medium: 2, low: 1 };

export function matchesSearch(task: Task, q?: string): boolean {
  if (!q?.trim()) return true;
  const term = q.toLowerCase();
  return (
    task.title.toLowerCase().includes(term) ||
    (task.description?.toLowerCase().includes(term) ?? false)
  );
}

export function matchesStatus(task: Task, status?: Task['status']): boolean {
  if (!status) return true;
  return task.status === status;
}

export function matchesPriority(task: Task, priority?: Task['priority']): boolean {
  if (!priority) return true;
  return task.priority === priority;
}

export function matchesUser(task: Task, userId?: string): boolean {
  if (!userId) return true;
  return task.userId === userId;
}

export function matchesTag(task: Task, tag?: string): boolean {
  if (!tag?.trim()) return true;
  return task.tags?.some((t) => t.toLowerCase() === tag.toLowerCase()) ?? false;
}

export function applyTaskFilters(tasks: Task[], params: TaskListParams): Task[] {
  return tasks.filter(
    (task) =>
      matchesSearch(task, params.q) &&
      matchesStatus(task, params.status) &&
      matchesPriority(task, params.priority) &&
      matchesUser(task, params.userId) &&
      matchesTag(task, params.tag),
  );
}

export function sortTasks(tasks: Task[], sort?: TaskListParams['sort']): Task[] {
  const copy = [...tasks];
  switch (sort) {
    case 'dueDate_asc':
      return copy.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
    case 'dueDate_desc':
      return copy.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return b.dueDate.localeCompare(a.dueDate);
      });
    case 'priority_desc':
      return copy.sort(
        (a, b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority],
      );
    case 'createdAt_desc':
    default:
      return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

export function paginateTasks<T>(
  items: T[],
  page = 1,
  limit = 10,
): { data: T[]; total: number; page: number; limit: number } {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  const start = (safePage - 1) * safeLimit;
  return {
    data: items.slice(start, start + safeLimit),
    total: items.length,
    page: safePage,
    limit: safeLimit,
  };
}
