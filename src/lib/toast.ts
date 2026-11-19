/** Tiny app-wide message bus: any component can call `showToast`, `Toaster` displays it. */

export interface ToastMessage {
  id: number;
  message: string;
}

type Listener = (toast: ToastMessage) => void;

const listeners = new Set<Listener>();
let nextId = 0;

export function showToast(message: string): void {
  const toast = { id: (nextId += 1), message };
  for (const listener of listeners) listener(toast);
}

export function subscribeToasts(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
