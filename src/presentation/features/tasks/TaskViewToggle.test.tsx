import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TaskViewToggle } from './TaskViewToggle';

describe('TaskViewToggle', () => {
  it('marks list as pressed when list is active', () => {
    render(<TaskViewToggle value="list" onChange={() => {}} />);
    expect(screen.getByTestId('view-toggle-list')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('view-toggle-kanban')).toHaveAttribute('aria-pressed', 'false');
  });

  it('marks kanban as pressed when kanban is active', () => {
    render(<TaskViewToggle value="kanban" onChange={() => {}} />);
    expect(screen.getByTestId('view-toggle-kanban')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('view-toggle-list')).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onChange when switching view', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TaskViewToggle value="list" onChange={onChange} />);

    await user.click(screen.getByTestId('view-toggle-kanban'));
    expect(onChange).toHaveBeenCalledWith('kanban');
  });
});
