import type { Task, User } from '@/domain/entities';
import { Badge } from '@/presentation/components/ui/Badge';
import { Button } from '@/presentation/components/ui/Button';
import {
  formatDate,
  PRIORITY_CONFIG,
  STATUS_CONFIG,
} from '@/presentation/lib/taskConfig';

interface TaskCardProps {
  task: Task;
  assignee?: User;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, assignee, onEdit, onDelete }: TaskCardProps) {
  const status = STATUS_CONFIG[task.status];
  const priority = PRIORITY_CONFIG[task.priority];

  return (
    <article
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      data-testid={`task-card-${task.id}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          {task.title}
        </h3>
        <div className="flex gap-2">
          <Badge className={status.className}>{status.label}</Badge>
          <Badge className={priority.className}>{priority.label}</Badge>
        </div>
      </div>

      {task.description && (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {task.description}
        </p>
      )}

      <dl className="mt-3 grid gap-1 text-sm text-slate-600 dark:text-slate-400 sm:grid-cols-2">
        <div>
          <dt className="inline font-medium">Responsável: </dt>
          <dd className="inline">{assignee?.name ?? '—'}</dd>
        </div>
        <div>
          <dt className="inline font-medium">Vencimento: </dt>
          <dd className="inline">{formatDate(task.dueDate)}</dd>
        </div>
      </dl>

      {task.tags && task.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <Badge
              key={tag}
              className="bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <Button variant="secondary" onClick={() => onEdit(task)} aria-label={`Editar ${task.title}`}>
          Editar
        </Button>
        <Button variant="danger" onClick={() => onDelete(task)} aria-label={`Excluir ${task.title}`}>
          Excluir
        </Button>
      </div>
    </article>
  );
}
