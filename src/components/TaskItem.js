// src/components/TaskItem.js
import React from 'react';

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  return (
    <article className="task-item">
      <label>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task)}
        />
        <span className={task.completed ? 'done' : ''}>{task.title}</span>
      </label>
      <div className="task-actions">
        <button onClick={() => onEdit(task)}>Editar</button>
        <button onClick={() => onDelete(task._id)}>Eliminar</button>
      </div>
    </article>
  );
}
