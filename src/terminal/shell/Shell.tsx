/**
 * @file  Shell.tsx
 *
 * @filetype  XML-Friendly Typescript
 * @author    Will Brandon
 * @created   July 23, 2023
 *
 * @description Defines a class that represents a simulated Linux shell.
 */

import ElementStream from './../../util/ElementStream';

/**
 * @description Represents a simulated Linux shell.
 */
class Shell
{
  private didExit: boolean;

  /**
   * @description The exit code of the previous program.
   */
  private lastExitCode: number;

  /**
   * @description The stream of React elements that the shell has output.
   */
  private readonly elementStream: ElementStream;

  /**
   * @description The user currently logged in.
   */
  public user: string;

  /**
   * @description The name of the host.
   */
  public host: string;

  private readonly exitFunc?: (code: number) => void;

  private readonly clearFunc?: () => void;

  /**
   * @description Creates a new simulated Linux shell.
   *
   * @param elementStream a stream of React elements where new program output can be appended
   * @param defaultUser   the user who is logged in at the start of the shell session
   * @param defaultHost   the name of the host machine at the start of the shell session
   * @param exitFunc      an optional function that instructs the environment to exit with a given exit code
   * @param clearFunc     an optional function that instructs the environment to clear its output buffer
   */
  public constructor(
    elementStream: ElementStream,
    defaultUser: string,
    defaultHost: string,
    exitFunc?: (code: number) => void,
    clearFunc?: () => void
  ) {
    this.didExit = false;
    this.lastExitCode = 0;
    this.elementStream = elementStream;
    this.user = defaultUser;
    this.host = defaultHost;
    this.exitFunc = exitFunc;
    this.clearFunc = clearFunc;
  }

  public isActive(): boolean
  {
    return !this.didExit;
  }

  public exit(code: number = 0): Shell
  {
    if (this.exitFunc)
    {
      this.exitFunc(code);
    }

    this.didExit = true;

    return this;
  }

  public clear(): Shell
  {
    if (this.clearFunc)
    {
      this.clearFunc();
    }

    return this;
  }

  /**
   * @description Executes the given command string.
   *
   * @param command a string containing the command (and all of its arguments) to be executed
   */
  public exec(command: string): Shell
  {
    if (command === "clear")
    {
      console.log("CLEARING...");
      this.clear();
    }
    else if (command === "exit")
    {
      console.log("EXITING...");
      this.exit(0);
    }

    return this;
  }
}

export default Shell;
