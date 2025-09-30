// src/constants/index.js
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const API = {
  TASKS: `${BASE_URL}/tasks`
};

export const STORAGE = {
  TASKS_DB: 'todo_pwa_db',
  TASKS_STORE: 'tasks'
};

