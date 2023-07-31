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
import {parseTokens} from "./util/StringUtil";

const str = "    This is\n   \t an \"exam\"ple 'command'\\\"    that 'I am testing' ri\tght now.\n   ";
console.log(str);
console.log(parseTokens(str));

// Find the root HTML root div element and make it thw React root element.
const htmlRootElement = document.getElementById('root') as HTMLDivElement
const reactRootElement = ReactDOM.createRoot(htmlRootElement);

// Render the app in the React root element.
reactRootElement.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
