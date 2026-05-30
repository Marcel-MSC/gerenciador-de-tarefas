import type { TaskPriority, TaskStatus } from '@/domain/entities';

export const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; className: string }
> = {
  pending: {
    label: 'Pendente',
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
  },
  in_progress: {
    label: 'Em andamento',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
  },
  done: {
    label: 'Concluída',
    className: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
  },
};

export const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; className: string }
> = {
  low: {
    label: 'Baixa',
    className: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
  },
  medium: {
    label: 'Média',
    className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200',
  },
  high: {
    label: 'Alta',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
  },
};

export function formatDate(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR');
}

export function parseTags(tags?: string): string[] | undefined {
  if (!tags?.trim()) return undefined;
  return tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}
