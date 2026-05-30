import type { Task, User } from '@/domain/entities';
import { EmptyState } from '@/presentation/components/ui/EmptyState';
import { Spinner } from '@/presentation/components/ui/Spinner';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  users: User[];
  loading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskList({
  tasks,
  users,
  loading,
  onEdit,
  onDelete,
}: TaskListProps) {
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

  const userMap = new Map(users.map((u) => [u.id, u]));

  return (
    <ul className="grid gap-4 md:grid-cols-2" data-testid="task-list">
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskCard
            task={task}
            assignee={userMap.get(task.userId)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}
