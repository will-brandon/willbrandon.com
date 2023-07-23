/**
 * @file  index.tsx
 *
 * @filetype  XML-Friendly Typescript
 * @author    Will Brandon
 * @created   July 21, 2023
 *
 * @fileOverview  Entrypoint for my personal website React app.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Create a React root DOM element from the div in the HTML file.
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Render the React app in the root element.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
