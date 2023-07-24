/**
 * @file  Terminal.tsx
 *
 * @filetype  XML-Friendly Typescript
 * @author    Will Brandon
 * @created   July 23, 2023
 *
 * @description Defines the functional component for a simulated Linux terminal.
 */

import {ReactElement, useState} from 'react';
import './Terminal.css';
import ElementStream from './../util/ElementStream';
import Shell from "./shell/Shell";

/**
 * Functional component for the main app.
 */
const Terminal = (): ReactElement =>
{
  const [elementStream] = useState<ElementStream>(new ElementStream());
  const [shell] = useState<Shell>(new Shell(elementStream));

  shell.exec("a");

  return (
    <div className="terminal">
      {elementStream.render()}
    </div>
  );
}

export default Terminal;
