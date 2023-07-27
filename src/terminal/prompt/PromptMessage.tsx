/**
 * @file  PromptMessage.tsx
 *
 * @filetype  XML-Friendly Typescript
 * @author    Will Brandon
 * @created   July 25, 2023
 *
 * @description Defines the functional component for a Linux terminal prompt message that contains a username and
 *              hostname.
 */

import {ReactElement} from 'react';
import './PromptMessage.css';

/**
 * @description Defines the properties that must be provided to a terminal prompt message component.
 */
interface PromptMessageProps
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
 * @description Functional component for a Linux terminal prompt message that contains a username and hostname.
 *
 * @param props the properties that must be provided
 *
 * @return  the rendered React element for the terminal prompt message
 */
const PromptMessage = (props: PromptMessageProps): ReactElement => {

  // Render the terminal prompt message including the username and hostname.
  return (
    <div className="terminal-prompt-message">
      <pre className="user">{props.user}</pre>
      <pre>@</pre>
      <pre className="host">{props.host}</pre>
      <pre>$ </pre>
    </div>
  );
}

export default PromptMessage;