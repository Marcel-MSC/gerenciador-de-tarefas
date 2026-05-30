import type { Task } from '@/domain/entities';
import { Button } from '@/presentation/components/ui/Button';
import { Modal } from '@/presentation/components/ui/Modal';

interface DeleteTaskDialogProps {
  task: Task | null;
  open: boolean;
  loading?: boolean;
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteTaskDialog({
  task,
  open,
  loading,
  error,
  onConfirm,
  onCancel,
}: DeleteTaskDialogProps) {
  return (
    <Modal open={open} onClose={onCancel} title="Confirmar exclusão">
      <p className="text-slate-600 dark:text-slate-400">
        Tem certeza que deseja excluir a tarefa{' '}
        <strong className="text-slate-900 dark:text-white">{task?.title}</strong>?
        Esta ação não pode ser desfeita.
      </p>
      {error && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="danger" loading={loading} onClick={onConfirm} data-testid="confirm-delete">
          Excluir
        </Button>
      </div>
    </Modal>
  );
}
