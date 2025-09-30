// src/components/layout/Header.js
import React from 'react';
import '../../styles/Header.css';

export default function Header({ title = 'To-Do PWA' }) {
  return (
    <header className="app-header">
      <div className="header-left">
        <img src="/logo192.png" alt="logo" className="logo" />
        <h1>{title}</h1>
      </div>
      <nav className="header-right">
      </nav>
    </header>
  );
}
