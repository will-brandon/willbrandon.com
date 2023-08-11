/**
 * @file  Shell.ts
 *
 * @filetype  Typescript
 * @author    Will Brandon
 * @created   July 23, 2023
 *
 * @description Defines a class that represents a simulated Linux shell.
 */

import ElementStream from './../../util/ElementStream';
import {parseTokens} from "../../util/StringUtil";
import CommandSet from "./CommandSet";
import ShellCommand from "./command/ShellCommand";
import ExitCommand from "./command/ExitCommand";
import ClearCommand from "./command/ClearCommand";
import {GitHubCommand, LinkedInCommand, ResumeCommand} from "./command/NavigationCommands";

const COMMANDS: ShellCommand[] = [
  new ExitCommand(),
  new ClearCommand(),
  new ResumeCommand(),
  new LinkedInCommand(),
  new GitHubCommand()
];

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
  public readonly name: string;

  /**
   * @description Contains user and host login details.
   */
  public readonly login: ShellLogin;

  /**
   * @description The stream of React elements that the shell has output.
   */
  public readonly elementStream: ElementStream;

  private readonly onExit?: (code: number) => void;

  private readonly onClear?: () => void;

  public readonly commandSet: CommandSet;

  /**
   * @description Determines whether the shell has exited.
   */
  private didExit: boolean;

  /**
   * @description The exit code of the previous program.
   */
  private lastExitCode: number;

  /**
   * @description Creates a new simulated Linux shell.
   *
   * @param name          the name of the shell
   * @param login         an object describing the user and host
   * @param elementStream a stream of React elements where new program output can be appended
   * @param onExit        an optional function that instructs the environment to exit with a given exit code
   * @param onClear       an optional function that instructs the environment to clear its output buffer
   */
  public constructor(
    name: string,
    login: ShellLogin,
    elementStream: ElementStream,
    onExit?: (code: number) => void,
    onClear?: () => void
  ) {
    this.name = name;
    this.login = login;
    this.elementStream = elementStream;
    this.onExit = onExit;
    this.onClear = onClear;
    this.commandSet = new CommandSet();
    this.didExit = false;
    this.lastExitCode = 0;

    this.commandSet.register(...COMMANDS);
  }

  public isActive(): boolean
  {
    return !this.didExit;
  }

  public exit(code: number = 0): Shell
  {
    if (this.onExit)
    {
      this.onExit(code);
    }

    this.didExit = true;

    return this;
  }

  public clear(): Shell
  {
    if (this.onClear)
    {
      this.onClear();
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
    const tokens = parseTokens(command);

    if (tokens.length === 0)
    {
      return this;
    }

    const commandName = tokens[0];
    const commandArgs = tokens.slice(1, tokens.length);

    try
    {
      this.lastExitCode = this.commandSet.exec(this, commandName, commandArgs);
    }
    catch
    {
      this.elementStream.errorln(this.name + ": command not found: " + commandName);
    }

    return this;
  }
}
