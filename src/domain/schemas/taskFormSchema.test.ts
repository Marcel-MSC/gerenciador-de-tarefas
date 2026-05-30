import { describe, expect, it } from 'vitest';
import { taskFormSchema } from './taskFormSchema';

describe('taskFormSchema', () => {
  it('rejects empty required fields', () => {
    const result = taskFormSchema.safeParse({
      userId: '',
      title: '',
      status: 'pending',
      priority: 'medium',
    });
    expect(result.success).toBe(false);
  });

  it('accepts valid payload', () => {
    const result = taskFormSchema.safeParse({
      userId: 'u1',
      title: 'Nova tarefa',
      status: 'pending',
      priority: 'high',
      description: 'desc',
      tags: 'a, b',
    });
    expect(result.success).toBe(true);
  });
});
