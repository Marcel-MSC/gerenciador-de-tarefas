import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Task, User } from '@/domain/entities';
import { TaskKanban } from './TaskKanban';
import { TASK_ID_MIME } from './TaskKanbanColumn';

const users: User[] = [{ id: 'u1', name: 'Ana', email: 'a@t.com' }];

const tasks: Task[] = [
  {
    id: 't1',
    userId: 'u1',
    title: 'Tarefa pendente',
    status: 'pending',
    priority: 'medium',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 't2',
    userId: 'u1',
    title: 'Tarefa em andamento',
    status: 'in_progress',
    priority: 'high',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 't3',
    userId: 'u1',
    title: 'Tarefa concluída',
    status: 'done',
    priority: 'low',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
];

describe('TaskKanban', () => {
  it('groups tasks into status columns', () => {
    render(
      <TaskKanban
        tasks={tasks}
        users={users}
        loading={false}
        onEdit={() => {}}
        onDelete={() => {}}
        onStatusChange={() => {}}
      />,
    );

    expect(screen.getByTestId('task-kanban')).toBeInTheDocument();
    expect(screen.getByTestId('kanban-column-pending')).toHaveTextContent('Tarefa pendente');
    expect(screen.getByTestId('kanban-column-in_progress')).toHaveTextContent('Tarefa em andamento');
    expect(screen.getByTestId('kanban-column-done')).toHaveTextContent('Tarefa concluída');
  });

  it('shows empty state', () => {
    render(
      <TaskKanban
        tasks={[]}
        users={users}
        loading={false}
        onEdit={() => {}}
        onDelete={() => {}}
        onStatusChange={() => {}}
      />,
    );
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('shows loading spinner', () => {
    render(
      <TaskKanban
        tasks={[]}
        users={users}
        loading={true}
        onEdit={() => {}}
        onDelete={() => {}}
        onStatusChange={() => {}}
      />,
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('calls onStatusChange when dropping task on another column', () => {
    const onStatusChange = vi.fn();
    render(
      <TaskKanban
        tasks={tasks}
        users={users}
        loading={false}
        onEdit={() => {}}
        onDelete={() => {}}
        onStatusChange={onStatusChange}
      />,
    );

    const card = screen.getByTestId('task-card-t1');
    const targetColumn = screen.getByTestId('kanban-column-in_progress');

    fireEvent.dragStart(card, {
      dataTransfer: { setData: vi.fn(), effectAllowed: 'move' },
    });

    fireEvent.dragOver(targetColumn);
    fireEvent.drop(targetColumn, {
      dataTransfer: { getData: (type: string) => (type === TASK_ID_MIME ? 't1' : '') },
    });

    expect(onStatusChange).toHaveBeenCalledWith('t1', 'in_progress');
  });
});
