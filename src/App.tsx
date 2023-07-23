/**
 * @file  App.tsx
 *
 * @filetype  XML-Friendly Typescript
 * @author    Will Brandon
 * @created   July 21, 2023
 *
 * @fileOverview  Defines a React component that renders my personal website.
 */

import React, {ReactElement} from 'react';
import './App.css';
import Terminal from './terminal/Terminal'

/**
 * React component that renders my personal website.
 */
function App(): ReactElement
{
  return (
    <div className="app">
        <Terminal />
    </div>
  );
}

export default App;
