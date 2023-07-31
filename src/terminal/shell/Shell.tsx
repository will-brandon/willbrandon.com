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

export interface ShellLogin
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
 * @description Represents a simulated Linux shell.
 */
export default class Shell
{
  /**
   * @description Contains user and host login details.
   */
  public readonly login: ShellLogin;

  /**
   * @description Determines whether the shell has exited.
   */
  private didExit: boolean;

  /**
   * @description The exit code of the previous program.
   */
  private lastExitCode: number;

  /**
   * @description The stream of React elements that the shell has output.
   */
  private readonly elementStream: ElementStream;

  private readonly exitFunc?: (code: number) => void;

  private readonly clearFunc?: () => void;

  /**
   * @description Creates a new simulated Linux shell.
   *
   * @param elementStream a stream of React elements where new program output can be appended
   * @param login         an object describing the user and host
   * @param exitFunc      an optional function that instructs the environment to exit with a given exit code
   * @param clearFunc     an optional function that instructs the environment to clear its output buffer
   */
  public constructor(
    elementStream: ElementStream,
    login: ShellLogin,
    exitFunc?: (code: number) => void,
    clearFunc?: () => void
  ) {
    this.didExit = false;
    this.lastExitCode = 0;
    this.elementStream = elementStream;
    this.login = login;
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
    return this;
  }
}
