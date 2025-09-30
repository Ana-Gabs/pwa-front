import React, { useState, useEffect } from 'react';
import CameraInput from './ui/CameraInput';
import { getCurrentLocation } from '../utils/location';
import { requestNotificationPermission, showNotification } from '../utils/notifications';

export default function TaskForm({ initial = {}, onSave, onClose }) {
  const [title, setTitle] = useState(initial.title || '');
  const [description, setDescription] = useState(initial.description || '');
  const [photo, setPhoto] = useState(initial.photo || null);
  const [location, setLocation] = useState(initial.location || null);

  // Pedir permiso para notificaciones al cargar
  useEffect(() => {
    async function initNotifications() {
      await requestNotificationPermission();
    }
    initNotifications();
  }, []);

  useEffect(() => {
    setTitle(initial.title || '');
    setDescription(initial.description || '');
    setPhoto(initial.photo || null);
    setLocation(initial.location || null);
  }, [initial]);

  const handleCapture = (url, file) => {
    setPhoto(file || url);
  };

  const handleGetLocation = async () => {
    try {
      const loc = await getCurrentLocation();
      setLocation(loc);
    } catch (err) {
      alert('No se pudo obtener ubicación');
      console.error(err);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('Título requerido');

    const taskData = {
      ...initial,
      title,
      description,
      photo,
      location,
    };

    onSave(taskData);

    // 🔔 Notificación local
    showNotification('Tarea guardada', { body: title });
  };

  return (
    <form className="task-form" onSubmit={submit}>
      <label>Título</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />

      <label>Descripción</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

      <label>Foto (opcional)</label>
      <CameraInput onCapture={handleCapture} />
      {photo && (
        <img 
          src={photo instanceof File ? URL.createObjectURL(photo) : photo} 
          alt="Preview" 
          style={{ maxWidth: '100px', marginTop: '5px' }} 
        />
      )}

      <label>Ubicación (opcional)</label>
      <button type="button" onClick={handleGetLocation}>Obtener ubicación</button>
      {location && (
        <p>Lat: {location.latitude}, Lng: {location.longitude}</p>
      )}

      <div className="form-actions">
        <button type="submit">Guardar</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </div>
    </form>
  );
}
