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
import {parseCommandTokens} from "./util/StringUtil";

// Find the root HTML root div element and make it the React root element.
const htmlRootElement = document.getElementById('root') as HTMLDivElement
const reactRootElement = ReactDOM.createRoot(htmlRootElement);

console.log(parseCommandTokens(""));
console.log(parseCommandTokens("a b c"));
console.log(parseCommandTokens("\"This 'is\" a test!!!\t!"));
console.log(parseCommandTokens("  'hello  ' world \"\" ''     I want to \"TEST \" strings and escapes."));
//console.log(parseCommandTokens("   yup, that \" SHOULD' \" DO it"));

// Render the app in the React root element.
reactRootElement.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
