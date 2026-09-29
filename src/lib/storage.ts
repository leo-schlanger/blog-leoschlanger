import { useCallback, useSyncExternalStore } from 'react';

/**
 * Estado persistido em localStorage e compartilhado entre todas as
 * instâncias do hook (e entre abas, via evento `storage`).
 *
 * Leitura e escrita toleram storage indisponível (modo privado, cota
 * cheia, cookies bloqueados): nesse caso o estado vive só em memória.
 */
export interface PersistentStore<T> {
  get: () => T;
  set: (updater: T | ((prev: T) => T)) => void;
  subscribe: (listener: () => void) => () => void;
}

export function createPersistentStore<T>(
  key: string,
  fallback: T,
  isValid: (value: unknown) => value is T
): PersistentStore<T> {
  const listeners = new Set<() => void>();
  let cache: T | undefined;

  const read = (): T => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      const parsed: unknown = JSON.parse(raw);
      return isValid(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  };

  const get = (): T => {
    if (cache === undefined) cache = read();
    return cache;
  };

  const emit = () => listeners.forEach(listener => listener());

  const set = (updater: T | ((prev: T) => T)) => {
    const next = typeof updater === 'function'
      ? (updater as (prev: T) => T)(get())
      : updater;
    cache = next;
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Sem storage: mantém apenas em memória
    }
    emit();
  };

  const onStorage = (event: StorageEvent) => {
    if (event.key === key) {
      cache = read();
      emit();
    }
  };

  const subscribe = (listener: () => void) => {
    if (listeners.size === 0 && typeof window !== 'undefined') {
      window.addEventListener('storage', onStorage);
    }
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0 && typeof window !== 'undefined') {
        window.removeEventListener('storage', onStorage);
      }
    };
  };

  return { get, set, subscribe };
}

export function usePersistentStore<T>(store: PersistentStore<T>) {
  const value = useSyncExternalStore(store.subscribe, store.get, store.get);
  const setValue = useCallback(
    (updater: T | ((prev: T) => T)) => store.set(updater),
    [store]
  );
  return [value, setValue] as const;
}

/** Lê uma chave simples (string) sem lançar exceção. */
export function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Grava uma chave simples (string) sem lançar exceção. */
export function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Sem storage disponível
  }
}
