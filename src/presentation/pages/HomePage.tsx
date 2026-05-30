import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Task, TaskListParams, TaskStatus } from '@/domain/entities';
import type { TaskFormValues } from '@/domain/schemas/taskFormSchema';
import { ApiError } from '@/infrastructure/http/errors';
import { Button } from '@/presentation/components/ui/Button';
import { ErrorState } from '@/presentation/components/ui/ErrorState';
import { Modal } from '@/presentation/components/ui/Modal';
import { DeleteTaskDialog } from '@/presentation/features/tasks/DeleteTaskDialog';
import { Pagination } from '@/presentation/features/tasks/Pagination';
import { TaskFilters } from '@/presentation/features/tasks/TaskFilters';
import { TaskForm } from '@/presentation/features/tasks/TaskForm';
import { TaskKanban } from '@/presentation/features/tasks/TaskKanban';
import { TaskList } from '@/presentation/features/tasks/TaskList';
import { TaskViewToggle } from '@/presentation/features/tasks/TaskViewToggle';
import { useSimulateError, type SimulateErrorMode } from '@/presentation/hooks/useSimulateError';
import {
  useCreateTask,
  useDeleteTask,
  useUpdateTask,
} from '@/presentation/hooks/useTaskMutations';
import { useTasksQuery, useUsersQuery } from '@/presentation/hooks/useTasksQuery';
import { useTheme } from '@/presentation/hooks/useTheme';
import { useTaskViewMode } from '@/presentation/hooks/useTaskViewMode';
import { parseTags } from '@/presentation/lib/taskConfig';
import { apiClient } from '@/di/container';

const defaultParams: TaskListParams = {
  page: 1,
  limit: 10,
  sort: 'createdAt_desc',
};

function getInitialParams(): TaskListParams {
  if (typeof window === 'undefined') return defaultParams;
  const stored = localStorage.getItem('idealgroup_task_view');
  if (stored === 'kanban') {
    return { ...defaultParams, limit: 100 };
  }
  return defaultParams;
}

export function HomePage() {
  const [params, setParams] = useState<TaskListParams>(getInitialParams);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);
  const [formError, setFormError] = useState<string>();
  const [deleteError, setDeleteError] = useState<string>();
  const [statusChangeError, setStatusChangeError] = useState<string>();
  const [updatingTaskId, setUpdatingTaskId] = useState<string>();

  const { dark, toggle } = useTheme();
  const { viewMode, setViewMode } = useTaskViewMode();
  const queryClient = useQueryClient();
  const { mode, setMode } = useSimulateError();
  const { data: users = [] } = useUsersQuery();
  const { data, isLoading, isError, error, refetch, isFetching } =
    useTasksQuery(params);

  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();
  const deleteMutation = useDeleteTask();

  const handleCreate = async (values: TaskFormValues) => {
    setFormError(undefined);
    try {
      await createMutation.mutateAsync({
        userId: values.userId,
        title: values.title,
        status: values.status,
        priority: values.priority,
        description: values.description || undefined,
        dueDate: values.dueDate || undefined,
        tags: parseTags(values.tags),
      });
      setCreateOpen(false);
    } catch (e) {
      setFormError(
        e instanceof ApiError ? e.message : 'Erro ao criar tarefa',
      );
    }
  };

  const handleUpdate = async (values: TaskFormValues) => {
    if (!editTask) return;
    setFormError(undefined);
    try {
      await updateMutation.mutateAsync({
        id: editTask.id,
        input: {
          userId: values.userId,
          title: values.title,
          status: values.status,
          priority: values.priority,
          description: values.description || undefined,
          dueDate: values.dueDate || undefined,
          tags: parseTags(values.tags),
        },
      });
      setEditTask(null);
    } catch (e) {
      setFormError(
        e instanceof ApiError ? e.message : 'Erro ao atualizar tarefa',
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteTask) return;
    setDeleteError(undefined);
    try {
      await deleteMutation.mutateAsync(deleteTask.id);
      setDeleteTask(null);
    } catch (e) {
      setDeleteError(
        e instanceof ApiError ? e.message : 'Erro ao excluir tarefa',
      );
    }
  };

  const handleResetData = async () => {
    await apiClient.post('/store/reset', {});
    refetch();
  };

  const handleSimulateErrorChange = (next: SimulateErrorMode) => {
    setMode(next);
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  };

  const handleViewModeChange = (mode: 'list' | 'kanban') => {
    setViewMode(mode);
    setStatusChangeError(undefined);
    if (mode === 'kanban') {
      setParams((p) => ({
        ...p,
        limit: 100,
        page: 1,
        status: undefined,
      }));
    } else {
      setParams((p) => ({
        ...p,
        limit: 10,
        page: 1,
      }));
    }
  };

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    setStatusChangeError(undefined);
    setUpdatingTaskId(taskId);
    try {
      await updateMutation.mutateAsync({ id: taskId, input: { status } });
    } catch (e) {
      setStatusChangeError(
        e instanceof ApiError ? e.message : 'Erro ao atualizar status',
      );
    } finally {
      setUpdatingTaskId(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Gerenciador de Tarefas
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              Simular erro:
              <select
                className="rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-800"
                value={mode}
                onChange={(e) =>
                  handleSimulateErrorChange(e.target.value as SimulateErrorMode)
                }
                data-testid="simulate-error"
              >
                <option value="none">Nenhum</option>
                <option value="tasks-list">Listagem</option>
                <option value="task-save">Salvar</option>
                <option value="task-delete">Excluir</option>
              </select>
            </label>
            <Button variant="ghost" onClick={toggle} aria-label="Alternar tema">
              {dark ? '☀️' : '🌙'}
            </Button>
            <Button variant="secondary" onClick={handleResetData}>
              Restaurar dados
            </Button>
            <Button onClick={() => setCreateOpen(true)} data-testid="new-task-btn">
              Nova tarefa
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <TaskFilters
          users={users}
          value={params}
          onChange={setParams}
          hideStatusFilter={viewMode === 'kanban'}
        />

        <TaskViewToggle value={viewMode} onChange={handleViewModeChange} />

        {statusChangeError && (
          <p
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
            role="alert"
            data-testid="status-change-error"
          >
            {statusChangeError}
          </p>
        )}

        {isError ? (
          <ErrorState
            message={
              error instanceof ApiError
                ? error.message
                : 'Falha ao carregar tarefas'
            }
            onRetry={() => refetch()}
          />
        ) : viewMode === 'kanban' ? (
          <TaskKanban
            tasks={data?.data ?? []}
            users={users}
            loading={isLoading || isFetching}
            updatingTaskId={updatingTaskId}
            onEdit={setEditTask}
            onDelete={setDeleteTask}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <>
            <TaskList
              tasks={data?.data ?? []}
              users={users}
              loading={isLoading || isFetching}
              onEdit={setEditTask}
              onDelete={setDeleteTask}
            />
            {data && (
              <Pagination
                page={data.page}
                total={data.total}
                limit={data.limit}
                onPageChange={(page) => setParams((p) => ({ ...p, page }))}
              />
            )}
          </>
        )}
      </main>

      <Modal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          setFormError(undefined);
        }}
        title="Nova tarefa"
      >
        <TaskForm
          users={users}
          onSubmit={handleCreate}
          onCancel={() => setCreateOpen(false)}
          loading={createMutation.isPending}
          serverError={formError}
        />
      </Modal>

      <Modal
        open={!!editTask}
        onClose={() => {
          setEditTask(null);
          setFormError(undefined);
        }}
        title="Editar tarefa"
      >
        {editTask && (
          <TaskForm
            users={users}
            initial={editTask}
            onSubmit={handleUpdate}
            onCancel={() => setEditTask(null)}
            loading={updateMutation.isPending}
            serverError={formError}
          />
        )}
      </Modal>

      <DeleteTaskDialog
        task={deleteTask}
        open={!!deleteTask}
        loading={deleteMutation.isPending}
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteTask(null);
          setDeleteError(undefined);
        }}
      />
    </div>
  );
}
