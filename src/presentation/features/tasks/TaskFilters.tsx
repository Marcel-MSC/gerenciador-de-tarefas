import { useEffect, useState } from 'react';
import type { TaskListParams, TaskPriority, TaskStatus, User } from '@/domain/entities';
import { Input } from '@/presentation/components/ui/Input';
import { Select } from '@/presentation/components/ui/Select';

interface TaskFiltersProps {
  users: User[];
  value: TaskListParams;
  onChange: (params: TaskListParams) => void;
  hideStatusFilter?: boolean;
}

const statusOptions = [
  { value: '', label: 'Todos os status' },
  { value: 'pending', label: 'Pendente' },
  { value: 'in_progress', label: 'Em andamento' },
  { value: 'done', label: 'Concluída' },
];

const priorityOptions = [
  { value: '', label: 'Todas as prioridades' },
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
];

const sortOptions = [
  { value: 'createdAt_desc', label: 'Mais recentes' },
  { value: 'dueDate_asc', label: 'Vencimento (crescente)' },
  { value: 'dueDate_desc', label: 'Vencimento (decrescente)' },
  { value: 'priority_desc', label: 'Prioridade (maior primeiro)' },
];

export function TaskFilters({ users, value, onChange, hideStatusFilter }: TaskFiltersProps) {
  const [search, setSearch] = useState(value.q ?? '');

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange({ ...value, q: search || undefined, page: 1 });
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const userOptions = [
    { value: '', label: 'Todos os responsáveis' },
    ...users.map((u) => ({ value: u.id, label: u.name })),
  ];

  return (
    <section
      className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50 md:grid-cols-2 lg:grid-cols-3"
      aria-label="Filtros de tarefas"
      data-testid="task-filters"
    >
      <Input
        label="Buscar"
        placeholder="Título ou descrição..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        data-testid="filter-search"
      />
      {!hideStatusFilter && (
        <Select
          label="Status"
          options={statusOptions}
          value={value.status ?? ''}
          onChange={(e) =>
            onChange({
              ...value,
              status: (e.target.value as TaskStatus) || undefined,
              page: 1,
            })
          }
          data-testid="filter-status"
        />
      )}
      <Select
        label="Prioridade"
        options={priorityOptions}
        value={value.priority ?? ''}
        onChange={(e) =>
          onChange({
            ...value,
            priority: (e.target.value as TaskPriority) || undefined,
            page: 1,
          })
        }
        data-testid="filter-priority"
      />
      <Select
        label="Responsável"
        options={userOptions}
        value={value.userId ?? ''}
        onChange={(e) =>
          onChange({
            ...value,
            userId: e.target.value || undefined,
            page: 1,
          })
        }
        data-testid="filter-user"
      />
      <Input
        label="Tag"
        placeholder="ex: frontend"
        value={value.tag ?? ''}
        onChange={(e) =>
          onChange({ ...value, tag: e.target.value || undefined, page: 1 })
        }
        data-testid="filter-tag"
      />
      <Select
        label="Ordenar por"
        options={sortOptions}
        value={value.sort ?? 'createdAt_desc'}
        onChange={(e) =>
          onChange({
            ...value,
            sort: e.target.value as TaskListParams['sort'],
            page: 1,
          })
        }
        data-testid="filter-sort"
      />
    </section>
  );
}
