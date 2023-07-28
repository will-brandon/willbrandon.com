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
  /**
   * @description The stream of React elements that the shell has output.
   */
  private readonly elementStream: ElementStream;

  /**
   * @description The exit code of the previous program.
   */
  private lastExitCode: number;

  /**
   * @description The user currently logged in.
   */
  public user: string;

  /**
   * @description The name of the host.
   */
  public host: string;

  /**
   * @description Creates a new simulated Linux shell.
   *
   * @param elementStream a stream of React elements where new program output can be appended
   * @param defaultUser   the user who is logged in at the start of the shell session
   * @param defaultHost   the name of the host machine at the start of the shell session
   */
  public constructor(elementStream: ElementStream, defaultUser: string, defaultHost: string)
  {
    this.elementStream = elementStream;
    this.lastExitCode = 0;
    this.user = defaultUser;
    this.host = defaultHost;
  }

  /**
   * @description Executes the given command string.
   *
   * @param command a string containing the command (and all of its arguments) to be executed
   *
   * @return  true if and only if the terminal session should end after the command is executed
   */
  public exec(command: string): boolean
  {
    this.elementStream.push(<h1>{command}</h1>).flush();
    return false;
  }
}

export default Shell;
