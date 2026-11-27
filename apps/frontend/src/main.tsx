import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

/**
 * Mini App entry point.
 * The Telegram SDK script is loaded by index.html from our own origin (no third-party CDN), and
 * telegram.ts guards every call, so the same bundle also runs in a plain browser tab during development.
 */
const el = document.getElementById('root');
if (!el) throw new Error('#root is missing from index.html');
createRoot(el).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
