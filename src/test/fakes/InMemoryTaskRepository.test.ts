import { describe, expect, it } from 'vitest';
import type { Task } from '@/domain/entities';
import { InMemoryTaskRepository } from './InMemoryTaskRepository';

const sample: Task[] = [
  {
    id: '1',
    userId: 'u1',
    title: 'One',
    status: 'pending',
    priority: 'low',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
];

describe('InMemoryTaskRepository', () => {
  it('creates and lists tasks', async () => {
    const repo = new InMemoryTaskRepository([...sample]);
    const created = await repo.create({
      userId: 'u1',
      title: 'New',
      status: 'pending',
      priority: 'medium',
    });
    const result = await repo.list({ page: 1, limit: 10 });
    expect(result.data.some((t) => t.id === created.id)).toBe(true);
  });

  it('updates task', async () => {
    const repo = new InMemoryTaskRepository([...sample]);
    const updated = await repo.update('1', { status: 'done' });
    expect(updated.status).toBe('done');
  });
});
