/**
 * @file main.jsx
 * @description Entry point for the React application; mounts the root component into the DOM.
 * @author Joe Sicree (test@test.com)
 * @since 2026-03-23
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/app.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);