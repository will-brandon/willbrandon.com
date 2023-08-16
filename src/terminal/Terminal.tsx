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
import Shell, {ShellLogin} from "./shell/Shell";
import Prompt from "./prompt/Prompt";
import PromptMessage from "./prompt/PromptMessage";
import ElementPrintStream from "../util/stream/ElementPrintStream";

/**
 * @description The name of the shell.
 */
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

  /**
   * @description Scrolls the terminal viewport to the far bottom of its content.
   */
  function scrollToBottom():  void
  {
    viewportRef.current!.scrollTo(0, Number.MAX_SAFE_INTEGER);
  }

  // Track the state of a print stream for the React elements output by the simulated Linux shell. This stream state
  // should never be set.
  const [printStream] = useState<ElementPrintStream>(

      // The print stream flows into the feed buffer.
      new ElementPrintStream(pushFeed)
  );

  // Manage the state of a simulated Linux shell.
  const [shell, setShell] = useState<Shell>(

    // The shell uses the print stream and has a clear callback but does not need an exit callback.
    new Shell(TERMINAL_SHELL_NAME, DEFAULT_TERMINAL_SHELL_LOGIN, printStream, undefined, clearFeed)
  );

  /**
   * @description Executes a given command string in the shell.
   *
   * @param command a string containing a command
   */
  function exec(command: string): void
  {
    // Push a prompt message with the static executed command to the stream so that a history of executed commands are
    // in the feed.
    printStream.push(<PromptMessage login={shell.login} staticCommand={command} />);

    // Execute the command string in the shell.
    shell.exec(command);

    // Set the shell state to itself signaling a state change within the shell to trigger a rerender.
    setShell(shell => shell);
  }

  // Each time the feed updates scroll to the bottom of the viewport.
  useEffect(scrollToBottom, [feed]);

  // Render the terminal prompt and the stream of React elements from the shell output. Include the command prompt if
  // the shell is active.
  return (
    <div className="terminal-viewport" ref={viewportRef}>
      <div className="terminal">
        <div className="feed">{feed}</div>
        {
          // If the shell is active display an interactive prompt.
          shell.isActive() ? <Prompt login={shell.login} onChange={scrollToBottom} onExec={exec} /> : ""
        }
      </div>
    </div>
  );
}

export default Terminal;
