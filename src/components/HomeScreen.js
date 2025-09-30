// src/components/HomeScreen.js
import React, { useEffect, useState } from 'react';
import Layout from './layout/Layout';
import SplashScreen from './SplashScreen';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import useOnline from '../hooks/useOnline';
import { fetchTasks, createTask, updateTask, deleteTask } from '../api/tasksApi';
import { STORAGE } from '../constants/index';
import { getAll, putItem, deleteItem } from '../utils/idb';

export default function HomeScreen() {
  const online = useOnline();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Inicialización: carga local y remota
  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const local = await getAll(STORAGE.TASKS_DB, STORAGE.TASKS_STORE);
        if (local && local.length) setTasks(local);
      } catch (err) {
        console.warn('No local tasks', err);
      }

      if (online) {
        try {
          const remote = await fetchTasks();
          setTasks(remote);
          // Guardar remoto en IDB
          for (const t of remote) {
            await putItem(STORAGE.TASKS_DB, STORAGE.TASKS_STORE, t);
          }
        } catch (err) {
          console.error('Error fetching remote tasks', err);
        }
      }
      setLoading(false);
    }
    init();
  }, [online]);

  // Crear nueva tarea
  async function handleCreate(task) {
    setShowForm(false);
    const temp = { ...task, _id: `local-${Date.now()}`, completed: false, createdAt: new Date().toISOString() };
    setTasks(prev => [temp, ...prev]);
    await putItem(STORAGE.TASKS_DB, STORAGE.TASKS_STORE, temp);

    if (online) {
      try {
        const saved = await createTask(task);
        await putItem(STORAGE.TASKS_DB, STORAGE.TASKS_STORE, saved);
        setTasks(prev => prev.map(t => (t._id === temp._id ? saved : t)));
      } catch (err) {
        console.error('Error creating remote task', err);
      }
    } else {
      await putItem(STORAGE.TASKS_DB, STORAGE.TASKS_STORE, { ...temp, _pending: 'create' });
    }
  }

  // Actualizar tarea existente
  async function handleUpdate(task) {
    const updated = { ...task, updatedAt: new Date().toISOString() };
    setTasks(prev => prev.map(t => (t._id === task._id ? updated : t)));
    await putItem(STORAGE.TASKS_DB, STORAGE.TASKS_STORE, updated);

    if (online && !String(task._id).startsWith('local-')) {
      try {
        await updateTask(task._id, updated);
      } catch (err) {
        console.error('Error actualizando tarea remota', err);
      }
    } else {
      await putItem(STORAGE.TASKS_DB, STORAGE.TASKS_STORE, { ...updated, _pending: 'update' });
    }
  }

  // Toggle completar tarea
  async function handleToggle(task) {
    const updated = { ...task, completed: !task.completed, updatedAt: new Date().toISOString() };
    setTasks(prev => prev.map(t => (t._id === task._id ? updated : t)));
    await putItem(STORAGE.TASKS_DB, STORAGE.TASKS_STORE, updated);

    if (online && !String(task._id).startsWith('local-')) {
      try {
        await updateTask(task._id, { completed: updated.completed });
      } catch (err) {
        console.error('Error updating remote task', err);
      }
    } else {
      await putItem(STORAGE.TASKS_DB, STORAGE.TASKS_STORE, { ...updated, _pending: 'update' });
    }
  }

  // Eliminar tarea
  async function handleDelete(id) {
    setTasks(prev => prev.filter(t => t._id !== id));
    await deleteItem(STORAGE.TASKS_DB, STORAGE.TASKS_STORE, id);

    if (online && !String(id).startsWith('local-')) {
      try {
        await deleteTask(id);
      } catch (err) {
        console.error('Error deleting remote task', err);
      }
    } else {
      await putItem(STORAGE.TASKS_DB, STORAGE.TASKS_STORE, { _id: id, _pending: 'delete' });
    }
  }

  if (loading) return <SplashScreen />;

  return (
    <Layout>
      <div className="home-top">
        <h2>Mis tareas</h2>
        <div>
          <button onClick={() => { setShowForm(true); setEditing(null); }}>+ Nueva</button>
        </div>
      </div>

      <p>{online ? 'En línea' : 'Offline — trabajando localmente'}</p>

      {showForm && (
        <TaskForm
          initial={editing || {}}
          onSave={editing ? handleUpdate : handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}

      <section className="tasks-list">
        {tasks.length === 0 ? <p>No hay tareas</p> : tasks.map(t => (
          <TaskItem
            key={t._id}
            task={t}
            onToggle={handleToggle}
            onEdit={(task) => { setEditing(task); setShowForm(true); }}
            onDelete={handleDelete}
          />
        ))}
      </section>
    </Layout>
  );
}
