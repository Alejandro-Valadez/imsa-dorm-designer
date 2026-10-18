import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { inject } from "@vercel/analytics";

// Vercel Web Analytics: page views, no cookies.
inject();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
