import { describe, expect, it } from 'vitest';
import type { Task } from '@/domain/entities';
import { applyTaskFilters, sortTasks } from './taskFilters';

const tasks: Task[] = [
  {
    id: '1',
    userId: 'u1',
    title: 'Alpha task',
    description: 'first',
    status: 'pending',
    priority: 'low',
    tags: ['frontend'],
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: '2',
    userId: 'u2',
    title: 'Beta',
    status: 'done',
    priority: 'high',
    dueDate: '2026-06-01',
    createdAt: '2026-01-02',
    updatedAt: '2026-01-02',
  },
];

describe('applyTaskFilters', () => {
  it('filters by status', () => {
    const result = applyTaskFilters(tasks, { status: 'pending' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('filters by search query', () => {
    const result = applyTaskFilters(tasks, { q: 'beta' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('filters by tag', () => {
    const result = applyTaskFilters(tasks, { tag: 'frontend' });
    expect(result).toHaveLength(1);
  });
});

describe('sortTasks', () => {
  it('sorts by priority desc', () => {
    const result = sortTasks(tasks, 'priority_desc');
    expect(result[0].priority).toBe('high');
  });
});
