/**
 * @file  Terminal.tsx
 *
 * @filetype  XML-Friendly Typescript
 * @author    Will Brandon
 * @created   July 21, 2023
 *
 * @fileOverview  Defines a React component that renders a terminal.
 */

import React, { ReactElement, useState, useRef } from 'react';
import './Terminal.css';
import Prompt from './Prompt';
import Shell from './shell/Shell';

const DEFAULT_SHELL_USER = "guest";
const DEFAULT_SHELL_HOST = "willbrandon.com";

/**
 * Component that renders a terminal.
 */
function Terminal(): ReactElement
{
  // Persist the state of a shell throughout renders.
  const [shell, _] = useState<Shell>(new Shell(DEFAULT_SHELL_USER, DEFAULT_SHELL_HOST));

  function execCommand(command: string): void
  {
    shell.exec(command)
  }

  return (
    <div className="terminal">
      <Prompt user={shell.user} host={shell.host} onExec={execCommand} />
    </div>
  );
}

export default Terminal;
