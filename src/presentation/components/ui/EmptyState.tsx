interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center" data-testid="empty-state">
      <p className="text-lg font-medium text-slate-700 dark:text-slate-300">{title}</p>
      {description && (
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      )}
    </div>
  );
}
