import { API } from '../constants/index';

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'API error');
  }
  return res.json();
}

export async function fetchTasks() {
  const res = await fetch(API.TASKS);
  return handleResponse(res);
}

// Crear tarea con FormData (para fotos y ubicación)
export async function createTask(task) {
  const formData = new FormData();
  formData.append('title', task.title);
  formData.append('description', task.description || '');
  if (task.photo instanceof File) {
    formData.append('photo', task.photo); // archivo físico
  }
  if (task.location) {
    formData.append('location', JSON.stringify(task.location));
  }

  const res = await fetch(API.TASKS, {
    method: 'POST',
    body: formData
  });

  return handleResponse(res);
}

// Actualizar tarea con FormData
export async function updateTask(id, task) {
  const formData = new FormData();
  if (task.title) formData.append('title', task.title);
  if (task.description) formData.append('description', task.description);
  if (task.photo instanceof File) formData.append('photo', task.photo);
  if (task.location) formData.append('location', JSON.stringify(task.location));

  const res = await fetch(`${API.TASKS}/${id}`, {
    method: 'PUT',
    body: formData
  });

  return handleResponse(res);
}

export async function deleteTask(id) {
  const res = await fetch(`${API.TASKS}/${id}`, { method: 'DELETE' });
  return handleResponse(res);
}
