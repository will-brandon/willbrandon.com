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
import TerminalPrompt from "./prompt/Prompt";

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
  const [elementStream, setElementStream] = useState<ElementStream>(new ElementStream());

  // Create a simulated Linux shell.
  const [shell, setShell] = useState<Shell>(new Shell(elementStream, DEFAULT_TERMINAL_USER, DEFAULT_TERMINAL_HOST));

  console.log(elementStream.bufferSize());

  function exec(command: string): void
  {
    console.log(command);
    setElementStream(elementStream => elementStream.push(<p>Command: {command}</p>));
    console.log(elementStream.bufferSize());
  }

  // Render the terminal prompt and the stream of React elements from the shell output.
  return (
    <div className="terminal-viewport">
      <div className="terminal">
        {elementStream.renderAll()}
        <TerminalPrompt user={shell.user} host={shell.host} onExec={exec} />
      </div>
    </div>
  );
}

export default Terminal;
