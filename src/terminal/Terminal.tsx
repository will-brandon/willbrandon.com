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
 * @description The default user who starts logged in when the shell session begins.
 */
const DEFAULT_TERMINAL_USER = "guest";

/**
 * @Description The default host used when the shell session begins.
 */
const DEFAULT_TERMINAL_HOST = "willbrandon.com";

/**
 * @description Functional component for a simulated Linux terminal.
 *
 * @return  the rendered React element for the terminal
 */
const Terminal = (): ReactElement => {

  // Create a stream of the React elements output by the simulated Linux shell.
  const [elementStream] = useState<ElementStream>(new ElementStream());

  // Create a simulated Linux shell.
  const [shell] = useState<Shell>(new Shell(elementStream, DEFAULT_TERMINAL_USER, DEFAULT_TERMINAL_HOST));

  // Render the terminal prompt and the stream of React elements from the shell output.
  return (
    <div className="terminal">
      {elementStream.render()}
    </div>
  );
}

export default Terminal;
