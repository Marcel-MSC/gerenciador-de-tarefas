import { useMemo, useState } from 'react';
import type { Task, TaskStatus, User } from '@/domain/entities';
import { EmptyState } from '@/presentation/components/ui/EmptyState';
import { Spinner } from '@/presentation/components/ui/Spinner';
import { KANBAN_COLUMN_ORDER } from '@/presentation/lib/taskConfig';
import { TaskKanbanColumn } from './TaskKanbanColumn';

interface TaskKanbanProps {
  tasks: Task[];
  users: User[];
  loading: boolean;
  updatingTaskId?: string;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

export function TaskKanban({
  tasks,
  users,
  loading,
  updatingTaskId,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskKanbanProps) {
  const [draggingTaskId, setDraggingTaskId] = useState<string>();

  const userMap = useMemo(() => new Map(users.map((u) => [u.id, u])), [users]);

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      pending: [],
      in_progress: [],
      done: [],
    };
    for (const task of tasks) {
      grouped[task.status].push(task);
    }
    return grouped;
  }, [tasks]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="Nenhuma tarefa encontrada"
        description="Ajuste os filtros ou crie uma nova tarefa."
      />
    );
  }

  return (
    <div
      className="grid grid-cols-1 gap-4 md:grid-cols-3"
      data-testid="task-kanban"
    >
      {KANBAN_COLUMN_ORDER.map((status) => (
        <TaskKanbanColumn
          key={status}
          status={status}
          tasks={tasksByStatus[status]}
          userMap={userMap}
          updatingTaskId={updatingTaskId}
          draggingTaskId={draggingTaskId}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onDragStart={setDraggingTaskId}
          onDragEnd={() => setDraggingTaskId(undefined)}
        />
      ))}
    </div>
  );
}
