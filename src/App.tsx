/**
 * @file  App.tsx
 *
 * @filetype  XML-Friendly Typescript
 * @author    Will Brandon
 * @created   July 23, 2023
 *
 * @description Defines the functional component for the main app.
 */

import { ReactElement } from 'react';
import './App.css';
import './terminal/Terminal';
import Terminal from "./terminal/Terminal";

/**
 * Functional component for the main app.
 */
const App = (): ReactElement =>
{
  return (
    <div className="app">
      <Terminal />
    </div>
  );
}

export default App;
