// src/api/tasksApi.js
import Constants from '../constants';

export const getTasks = async () => {
  try {
    const response = await fetch(`${Constants.BASE_URL}${Constants.TASKS_ENDPOINT}`);
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo tareas:", error);
    return [];
  }
};

export const createTask = async (task) => {
  try {
    const response = await fetch(`${Constants.BASE_URL}${Constants.TASKS_ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    return await response.json();
  } catch (error) {
    console.error("Error creando tarea:", error);
  }
};

export const updateTask = async (id, updates) => {
  try {
    const response = await fetch(`${Constants.BASE_URL}${Constants.TASKS_ENDPOINT}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return await response.json();
  } catch (error) {
    console.error("Error actualizando tarea:", error);
  }
};

export const deleteTask = async (id) => {
  try {
    const response = await fetch(`${Constants.BASE_URL}${Constants.TASKS_ENDPOINT}/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  } catch (error) {
    console.error("Error eliminando tarea:", error);
  }
};
