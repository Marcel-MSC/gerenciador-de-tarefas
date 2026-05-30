import type { TaskViewMode } from '@/presentation/hooks/useTaskViewMode';
import { Button } from '@/presentation/components/ui/Button';
import { cn } from '@/presentation/lib/cn';

interface TaskViewToggleProps {
  value: TaskViewMode;
  onChange: (mode: TaskViewMode) => void;
}

export function TaskViewToggle({ value, onChange }: TaskViewToggleProps) {
  return (
    <div
      className="flex items-center justify-end gap-1"
      role="group"
      aria-label="Modo de visualização"
    >
      <Button
        variant="secondary"
        aria-pressed={value === 'list'}
        data-testid="view-toggle-list"
        className={cn(value === 'list' && 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-950')}
        onClick={() => onChange('list')}
      >
        Lista
      </Button>
      <Button
        variant="secondary"
        aria-pressed={value === 'kanban'}
        data-testid="view-toggle-kanban"
        className={cn(value === 'kanban' && 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-950')}
        onClick={() => onChange('kanban')}
      >
        Kanban
      </Button>
    </div>
  );
}
