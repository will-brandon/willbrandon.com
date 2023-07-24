/**
 * @file  TerminalPrompt.tsx
 *
 * @filetype  XML-Friendly Typescript
 * @author    Will Brandon
 * @created   July 24, 2023
 *
 * @description Defines the functional component for a Linux terminal prompt.
 */

import {ReactElement} from 'react';
import './TerminalPrompt.css';

/**
 * @description Defines the properties that must be provided to a prompt component.
 */
interface PromptProps
{
  /**
   * @description The user currently logged in.
   */
  user: string;

  /**
   * @description The name of the host.
   */
  host: string;
}

/**
 * @description Functional component for a Linux terminal prompt.
 *
 * @param props the properties that must be provided
 *
 * @return  the rendered React element for the terminal prompt
 */
const TerminalPrompt = (props: PromptProps): ReactElement => {

  // Render the terminal prompt and the stream of React elements from the shell output.
  return (
    <div className="terminal-prompt">
      <div>
        <pre className="user">{props.user}</pre>
        <pre>@</pre>
        <pre className="host">{props.host}</pre>
        <pre>$ </pre>
      </div>
      <input type="text"></input>
    </div>
  );
}

export default TerminalPrompt;
