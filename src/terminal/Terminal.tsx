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
import Prompt from "./prompt/Prompt";
import PromptMessage from "./prompt/PromptMessage";

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
  
  const [feed, setFeed] = useState<ReactElement[]>([]);

  console.log("ON RENDER: " + feed);
  
  function pushFeed(element: ReactElement): void
  {
    console.log("PRE PUSH: " + feed);
    feed.push(element);
    console.log("POST PUSH: " + feed);
  }

  function flushFeed(): void
  {
    console.log("PRE FLUSH: " + feed);
    setFeed([...feed]);
    console.log("POST FLUSH: " + feed);
  }

  function clearFeed(): void
  {
    console.log("PRE CLEAR: " + feed);
    setFeed([]);
    console.log("POST CLEAR: " + feed);
  }

  // Create a stream of the React elements output by the simulated Linux shell.
  const [elementStream] = useState<ElementStream>(new ElementStream(pushFeed, flushFeed));

  // Create a simulated Linux shell.
  const [shell] = useState<Shell>(
    new Shell(elementStream, DEFAULT_TERMINAL_USER, DEFAULT_TERMINAL_HOST, flushFeed, clearFeed)
  );

  function exec(command: string): void
  {
    elementStream.push(<PromptMessage user={shell.user} host={shell.host} staticCommand={command} />).flush();
    shell.exec(command);
  }

  // Render the terminal prompt and the stream of React elements from the shell output.
  return (
    <div className="terminal-viewport">
      <div className="terminal">
        <div className="feed">{feed}</div>
        <Prompt user={shell.user} host={shell.host} onExec={exec} />
      </div>
    </div>
  );
}

export default Terminal;
