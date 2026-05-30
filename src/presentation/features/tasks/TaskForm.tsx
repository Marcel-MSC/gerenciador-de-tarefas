import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { Task } from '@/domain/entities';
import { taskFormSchema, type TaskFormValues } from '@/domain/schemas/taskFormSchema';
import { Button } from '@/presentation/components/ui/Button';
import { Input } from '@/presentation/components/ui/Input';
import { Select } from '@/presentation/components/ui/Select';
import { Textarea } from '@/presentation/components/ui/Textarea';
import type { User } from '@/domain/entities';

interface TaskFormProps {
  users: User[];
  initial?: Task;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  serverError?: string;
}

const statusOptions = [
  { value: 'pending', label: 'Pendente' },
  { value: 'in_progress', label: 'Em andamento' },
  { value: 'done', label: 'Concluída' },
];

const priorityOptions = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
];

export function TaskForm({
  users,
  initial,
  onSubmit,
  onCancel,
  loading,
  serverError,
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: initial
      ? {
          userId: initial.userId,
          title: initial.title,
          status: initial.status,
          priority: initial.priority,
          description: initial.description ?? '',
          dueDate: initial.dueDate ?? '',
          tags: initial.tags?.join(', ') ?? '',
        }
      : {
          userId: '',
          title: '',
          status: 'pending',
          priority: 'medium',
          description: '',
          dueDate: '',
          tags: '',
        },
  });

  const userOptions = users.map((u) => ({ value: u.id, label: u.name }));

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      noValidate
    >
      {serverError && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300" role="alert">
          {serverError}
        </p>
      )}

      <Select
        label="Responsável *"
        options={userOptions}
        placeholder="Selecione..."
        error={errors.userId?.message}
        {...register('userId')}
      />
      <Input
        label="Título *"
        error={errors.title?.message}
        {...register('title')}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Status *"
          options={statusOptions}
          error={errors.status?.message}
          {...register('status')}
        />
        <Select
          label="Prioridade *"
          options={priorityOptions}
          error={errors.priority?.message}
          {...register('priority')}
        />
      </div>
      <Textarea label="Descrição" {...register('description')} />
      <Input label="Data de vencimento" type="date" {...register('dueDate')} />
      <Input
        label="Tags (separadas por vírgula)"
        placeholder="frontend, bug"
        {...register('tags')}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          Salvar
        </Button>
      </div>
    </form>
  );
}
