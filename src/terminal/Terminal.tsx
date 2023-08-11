/**
 * @file  Terminal.tsx
 *
 * @filetype  XML-Friendly Typescript
 * @author    Will Brandon
 * @created   July 23, 2023
 *
 * @description Defines the functional component for a simulated Linux terminal.
 */

import {ReactElement, useEffect, useRef, useState} from 'react';
import './Terminal.css';
import ElementStream from './../util/ElementStream';
import Shell, {ShellLogin} from "./shell/Shell";
import Prompt from "./prompt/Prompt";
import PromptMessage from "./prompt/PromptMessage";

const TERMINAL_SHELL_NAME = "wsh";

/**
 * @description The default user and host who start logged in when the shell session begins.
 */
const DEFAULT_TERMINAL_SHELL_LOGIN: ShellLogin = {user: "guest", host: "willbrandon.com"};

/**
 * @description Functional component for a simulated Linux terminal.
 *
 * @return  the rendered React element for the terminal
 */
const Terminal = (): ReactElement => {

  // Create a reference to the viewport element.
  const viewportRef = useRef<HTMLDivElement>(null);

  // Manage the state of the feed which consists of an array of React elements. These elements are composed of previous
  // prompts followed by the commands that were input as well as all output from commands via the element stream.
  const [feed, setFeed] = useState<ReactElement[]>([]);

  /**
   * @description Pushes the given React element into the feed and immediately flushes the feed.
   *
   * @param element the new React element to push into the feed
   */
  function pushFeed(element: ReactElement): void
  {
    setFeed(feed => [...feed, element]);
  }

  /**
   * @description Clears the feed array, removing all React elements. It is immediately flushed.
   */
  function clearFeed(): void
  {
    setFeed([]);
  }

  // Create a stream of the React elements output by the simulated Linux shell.
  const [elementStream] = useState<ElementStream>(new ElementStream(pushFeed));

  // Manage the state of a simulated Linux shell.
  const [shell, setShell] = useState<Shell>(
    new Shell(TERMINAL_SHELL_NAME, DEFAULT_TERMINAL_SHELL_LOGIN, elementStream, undefined, clearFeed)
  );

  function exec(command: string): void
  {
    elementStream.append(<PromptMessage login={shell.login} staticCommand={command} />).flush();
    shell.exec(command);
    setShell(shell => shell);
  }

  function scrollToBottom():  void
  {
    viewportRef.current!.scrollTo(0, 100000000);
  }

  useEffect(() => {
    scrollToBottom();
  }, [feed]);

  // Render the terminal prompt and the stream of React elements from the shell output. Include the command prompt if
  // the shell is active.
  return (
    <div className="terminal-viewport" ref={viewportRef}>
      <div className="terminal">
        <div className="feed">{feed}</div>
        {
          shell.isActive() ? <Prompt login={shell.login} onChange={scrollToBottom} onExec={exec} /> : ""
        }
      </div>
    </div>
  );
}

export default Terminal;
