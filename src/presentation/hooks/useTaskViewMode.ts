import { useEffect, useState } from 'react';

export type TaskViewMode = 'list' | 'kanban';

const VIEW_KEY = 'idealgroup_task_view';

export function useTaskViewMode() {
  const [viewMode, setViewModeState] = useState<TaskViewMode>(() => {
    if (typeof window === 'undefined') return 'list';
    const stored = localStorage.getItem(VIEW_KEY);
    return stored === 'kanban' ? 'kanban' : 'list';
  });

  useEffect(() => {
    localStorage.setItem(VIEW_KEY, viewMode);
  }, [viewMode]);

  const setViewMode = (mode: TaskViewMode) => setViewModeState(mode);

  return { viewMode, setViewMode };
}
