/**
 * @file  index.tsx
 *
 * @filetype  XML-Friendly Typescript
 * @author    Will Brandon
 * @created   July 23, 2023
 *
 * @description Main index page for my personal home page.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import CommandParser from "./terminal/shell/CommandParser";

// Find the root HTML root div element and make it the React root element.
const htmlRootElement = document.getElementById('root') as HTMLDivElement
const reactRootElement = ReactDOM.createRoot(htmlRootElement);

const p = new CommandParser(true);

//console.log(p.parse("\\n"));

// Render the app in the React root element.
reactRootElement.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
