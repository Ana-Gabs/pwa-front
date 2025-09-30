// src/components/layout/Footer.js
import React from 'react';
import '../../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="app-footer">
      <small>© {new Date().getFullYear()} Mi To-Do App — Offline & Sync</small>
    </footer>
  );
}
