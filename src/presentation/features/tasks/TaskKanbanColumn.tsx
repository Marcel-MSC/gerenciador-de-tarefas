import { useState, type DragEvent } from 'react';
import type { Task, TaskStatus, User } from '@/domain/entities';
import { TaskCard } from './TaskCard';
import { STATUS_CONFIG } from '@/presentation/lib/taskConfig';
import { cn } from '@/presentation/lib/cn';

const TASK_ID_MIME = 'application/task-id';

interface TaskKanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  userMap: Map<string, User>;
  updatingTaskId?: string;
  draggingTaskId?: string;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
}

export function TaskKanbanColumn({
  status,
  tasks,
  userMap,
  updatingTaskId,
  draggingTaskId,
  onEdit,
  onDelete,
  onStatusChange,
  onDragStart,
  onDragEnd,
}: TaskKanbanColumnProps) {
  const [dragOver, setDragOver] = useState(false);
  const config = STATUS_CONFIG[status];

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    const taskId = event.dataTransfer.getData(TASK_ID_MIME);
    if (!taskId) return;
    const taskInColumn = tasks.find((t) => t.id === taskId);
    if (taskInColumn) return;
    onStatusChange(taskId, status);
  };

  const handleCardDragStart = (task: Task, event: DragEvent<HTMLElement>) => {
    event.dataTransfer.setData(TASK_ID_MIME, task.id);
    event.dataTransfer.effectAllowed = 'move';
    onDragStart(task.id);
  };

  return (
    <section
      className={cn(
        'flex min-h-[120px] flex-col rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50',
        dragOver && 'ring-2 ring-indigo-400',
      )}
      data-testid={`kanban-column-${status}`}
      aria-label={`Coluna ${config.label}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <header className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          {config.label}
        </h2>
        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200">
          {tasks.length}
        </span>
      </header>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            assignee={userMap.get(task.userId)}
            compact
            draggable={updatingTaskId !== task.id}
            dragging={draggingTaskId === task.id}
            onEdit={onEdit}
            onDelete={onDelete}
            onDragStart={handleCardDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
    </section>
  );
}

export { TASK_ID_MIME };
