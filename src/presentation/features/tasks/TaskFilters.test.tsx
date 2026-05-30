import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TaskFilters } from './TaskFilters';

const users = [{ id: 'u1', name: 'Ana', email: 'a@t.com' }];

describe('TaskFilters', () => {
  it('applies status filter', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <TaskFilters users={users} value={{ page: 1, limit: 10 }} onChange={onChange} />,
    );

    await user.selectOptions(screen.getByTestId('filter-status'), 'done');

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'done', page: 1 }),
    );
  });
});
