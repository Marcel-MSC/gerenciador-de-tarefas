import { useCallback, useState } from 'react';
import { apiClient } from '@/di/container';

export type SimulateErrorMode =
  | 'none'
  | 'tasks-list'
  | 'task-save'
  | 'task-delete';

export function useSimulateError() {
  const [mode, setMode] = useState<SimulateErrorMode>('none');

  const apply = useCallback((next: SimulateErrorMode) => {
    setMode(next);
    if (next === 'none') {
      apiClient.clearHeader('X-Simulate-Error');
    } else {
      apiClient.setHeaders({ 'X-Simulate-Error': next });
    }
  }, []);

  return { mode, setMode: apply };
}
