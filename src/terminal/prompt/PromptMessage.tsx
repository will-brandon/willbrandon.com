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
import {ShellLogin} from "../shell/Shell";

/**
 * @description Defines the properties that must be provided to a terminal prompt message component.
 */
interface PromptMessageProps
{
  /**
   * @description Contains the user and host login details.
   */
  login: ShellLogin;

  /**
   * @description An optional static command that cannot be edited. This is useful for the history of the terminal feed.
   */
  staticCommand?: string;
}

/**
 * @description Functional component for a Linux terminal prompt message that contains a username and hostname.
 *
 * @param props the properties that must be provided
 *
 * @return  the rendered React element for the terminal prompt message
 */
const PromptMessage = (props: PromptMessageProps): ReactElement => {

  // Render the terminal prompt message including the username and hostname. Append a static command to the end if one
  // is included.
  return (
    <div className="terminal-prompt-message">
      <pre className="user">{props.login.user}</pre>
      <pre>@</pre>
      <pre className="host">{props.login.host}</pre>
      <pre>$ </pre>
      {
        // If a static command is provided include it after the prompt.
        props.staticCommand ? <pre>{props.staticCommand}</pre> : ""
      }
    </div>
  );
}

export default PromptMessage;
