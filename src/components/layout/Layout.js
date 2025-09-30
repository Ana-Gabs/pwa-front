// src/components/layout/Layout.js
import React from 'react';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="app-container">
      <Header />
      <main className="app-main">{children}</main>
      <Footer />
    </div>
  );
}
