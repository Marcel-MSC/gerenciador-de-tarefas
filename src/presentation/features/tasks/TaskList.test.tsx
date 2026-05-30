import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Task, User } from '@/domain/entities';
import { TaskList } from './TaskList';

const users: User[] = [{ id: 'u1', name: 'Ana', email: 'a@t.com' }];

const tasks: Task[] = [
  {
    id: 't1',
    userId: 'u1',
    title: 'Tarefa teste',
    status: 'pending',
    priority: 'medium',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
];

describe('TaskList', () => {
  it('renders task list', () => {
    render(
      <TaskList
        tasks={tasks}
        users={users}
        loading={false}
        onEdit={() => {}}
        onDelete={() => {}}
      />,
    );
    expect(screen.getByText('Tarefa teste')).toBeInTheDocument();
    expect(screen.getByTestId('task-list')).toBeInTheDocument();
  });

  it('shows empty state', () => {
    render(
      <TaskList
        tasks={[]}
        users={users}
        loading={false}
        onEdit={() => {}}
        onDelete={() => {}}
      />,
    );
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('shows loading spinner', () => {
    render(
      <TaskList
        tasks={[]}
        users={users}
        loading={true}
        onEdit={() => {}}
        onDelete={() => {}}
      />,
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
