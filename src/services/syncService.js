// src/services/syncService.js
// Ejecutar cuando la app vuelve a estar online.
// Lee items en IDB con _pending y sincroniza con backend.
import { getAll, putItem, deleteItem } from '../utils/idb';
import { STORAGE } from '../constants';
import { createTask, updateTask, deleteTask } from '../api/tasksApi';

export async function syncPending() {
  const all = await getAll(STORAGE.TASKS_DB, STORAGE.TASKS_STORE);
  for (const item of all) {
    if (!item._pending) continue;
    try {
      if (item._pending === 'create') {
        const { _id: localId, _pending, ...payload } = item;
        const saved = await createTask(payload);
        await putItem(STORAGE.TASKS_DB, STORAGE.TASKS_STORE, saved);
        // TODO: remove old localId entry if key changed
      } else if (item._pending === 'update') {
        const { _id, _pending, ...payload } = item;
        await updateTask(_id, payload);
        await putItem(STORAGE.TASKS_DB, STORAGE.TASKS_STORE, { ...item, _pending: undefined });
      } else if (item._pending === 'delete') {
        const { _id } = item;
        await deleteTask(_id);
        await deleteItem(STORAGE.TASKS_DB, STORAGE.TASKS_STORE, _id);
      }
    } catch (err) {
      console.error('Sync failed for', item, err);
      // leave it for next sync
    }
  }
}
