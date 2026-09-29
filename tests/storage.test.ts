import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createPersistentStore, safeGetItem, safeSetItem } from '../src/lib/storage';

class MemoryStorage {
  data = new Map<string, string>();
  failWrites = false;
  getItem(key: string) { return this.data.get(key) ?? null; }
  setItem(key: string, value: string) {
    if (this.failWrites) throw new Error('QuotaExceededError');
    this.data.set(key, value);
  }
  removeItem(key: string) { this.data.delete(key); }
}

let storage: MemoryStorage;
const isNumbers = (v: unknown): v is number[] => Array.isArray(v) && v.every(n => typeof n === 'number');

beforeEach(() => {
  storage = new MemoryStorage();
  (globalThis as { localStorage?: unknown }).localStorage = storage;
});

test('lê valor salvo e cai no fallback com JSON inválido ou formato errado', () => {
  storage.data.set('ok', '[1,2]');
  storage.data.set('broken', '{nope');
  storage.data.set('wrong', '["a"]');
  assert.deepEqual(createPersistentStore('ok', [], isNumbers).get(), [1, 2]);
  assert.deepEqual(createPersistentStore('broken', [], isNumbers).get(), []);
  assert.deepEqual(createPersistentStore('wrong', [], isNumbers).get(), []);
});

test('set persiste, aceita updater e notifica todos os inscritos', () => {
  const store = createPersistentStore<number[]>('ids', [], isNumbers);
  let calls = 0;
  const unsubA = store.subscribe(() => calls++);
  const unsubB = store.subscribe(() => calls++);

  store.set(prev => [...prev, 7]);
  assert.deepEqual(store.get(), [7]);
  assert.equal(storage.data.get('ids'), '[7]');
  assert.equal(calls, 2);

  unsubA();
  unsubB();
  store.set([]);
  assert.equal(calls, 2);
});

test('storage indisponível não quebra: estado segue em memória', () => {
  storage.failWrites = true;
  const store = createPersistentStore<number[]>('ids', [], isNumbers);
  assert.doesNotThrow(() => store.set([1]));
  assert.deepEqual(store.get(), [1]);
});

test('safeGetItem/safeSetItem toleram ausência de localStorage', () => {
  delete (globalThis as { localStorage?: unknown }).localStorage;
  assert.equal(safeGetItem('x'), null);
  assert.doesNotThrow(() => safeSetItem('x', 'y'));
});
