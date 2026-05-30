import type { ITaskStore } from '@/core/ports';
import { InMemoryTaskStore } from './InMemoryTaskStore';
import { LocalStorageTaskStore } from './LocalStorageTaskStore';

let store: ITaskStore | null = null;

export function getTaskStore(): ITaskStore {
  if (!store) {
    const useLocalStorage =
      typeof localStorage !== 'undefined' &&
      import.meta.env.VITE_USE_LOCAL_STORAGE !== 'false';
    store = useLocalStorage
      ? new LocalStorageTaskStore()
      : new InMemoryTaskStore();
  }
  return store;
}

export function resetTaskStore(): void {
  store = null;
}
