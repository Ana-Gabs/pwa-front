// src/components/SplashScreen.js
import React from 'react';
import '../styles/SplashScreen.css';

export default function SplashScreen() {
  return (
    <div className="splash">
      <p>Cargando tareas…</p>
      <div className="spinner" />
    </div>
  );
}
