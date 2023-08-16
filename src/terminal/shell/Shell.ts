/**
 * @file  Shell.ts
 *
 * @filetype  Typescript
 * @author    Will Brandon
 * @created   July 23, 2023
 *
 * @description Defines a class that represents a simulated Linux shell.
 */

import {parseCommandTokens} from "../../util/StringUtil";
import CommandSet from "./CommandSet";
import ShellCommand from "./command/ShellCommand";
import ExitCommand from "./command/ExitCommand";
import ClearCommand from "./command/ClearCommand";
import {GitHubCommand, LinkedInCommand, ResumeCommand} from "./command/NavigationCommands";
import ElementPrintStream from "../../util/stream/ElementPrintStream";
import EchoCommand from "./command/EchoCommand";

/**
 * @description Contains an instance of each command that is recognized by the shell.
 */
const COMMANDS: ShellCommand[] = [
  new ExitCommand(),
  new EchoCommand(),
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
  /**
   * @description The name of the shell.
   */
  public readonly name: string;

  /**
   * @description Contains user and host login details.
   */
  public readonly login: ShellLogin;

  /**
   * @description The print stream of React elements that the shell has output.
   */
  public readonly printStream: ElementPrintStream;

  /**
   * @description An optional handler called when the shell session exits. The exit code is given as a parameter.
   */
  private readonly onExit?: (code: number) => void;

  /**
   * @description An optional handler called when the shell requests an output buffer clear.
   */
  private readonly onClear?: () => void;

  /**
   * @description A set of all commands that are recognized by the shell.
   */
  private readonly commandSet: CommandSet;

  /**
   * @description Determines whether the shell has exited.
   */
  private didExit: boolean;

  /**
   * @description The exit code of the previous program.
   */
  public lastExitCode: number;

  /**
   * @description Creates a new simulated Linux shell.
   *
   * @param name        the name of the shell
   * @param login       an object describing the user and host
   * @param printStream a print stream of React elements where new program output can be appended
   * @param onExit      an optional function called when the environment exits
   * @param onClear     an optional function called when the environment requests that the output buffer be cleared
   */
  public constructor(
    name: string,
    login: ShellLogin,
    printStream: ElementPrintStream,
    onExit?: (code: number) => void,
    onClear?: () => void
  ) {
    // Initialize the shell meta information, print stream, and optional event handlers.
    this.name = name;
    this.login = login;
    this.printStream = printStream;
    this.onExit = onExit;
    this.onClear = onClear;

    // Create a new empty command set.
    this.commandSet = new CommandSet();

    // The shell starts in an active state, no exit has occurred.
    this.didExit = false;

    // The last exit code starts as 0.
    this.lastExitCode = 0;

    // Register all the commands.
    this.commandSet.register(...COMMANDS);
  }

  /**
   * @description Determines whether the shell session is active (i.e. has not exited).
   */
  public isActive(): boolean
  {
    // The shell is active so long as it has not yet exited.
    return !this.didExit;
  }

  /**
   * @description Immediately exits the shell session with the given exit code.
   *
   * @param code  the exit code (0 by default)
   *
   * @return  the shell object for convenience
   */
  public exit(code: number = 0): Shell
  {
    // If an exit event handler was provided invoke it snd supply it with the exit code.
    if (this.onExit)
    {
      this.onExit(code);
    }

    // Inform the shell state that it has exited.
    this.didExit = true;

    // Return this object for convenience.
    return this;
  }

  /**
   * @description Requests that the output buffer clear its content. Note that this is not guaranteed, it is dependent
   *              on the implementation of the clear callback function.
   *
   * @return  the shell object for convenience
   */
  public clear(): Shell
  {
    // If a clear event handler was provided invoke it.
    if (this.onClear)
    {
      this.onClear();
    }

    // Return this object for convenience.
    return this;
  }

  /**
   * @description Executes the given command string.
   *
   * @param command a string containing the command (and all its arguments) to be executed
   *
   * @return  the shell object for convenience
   */
  public exec(command: string): Shell {

    // Ensure the shell is active i.e. has not exited.
    if (this.didExit)
    {
      throw Error("Inactive shell cannot execute a command.");
    }

    // Parse the command string into an array of tokens.
    const tokens = parseCommandTokens(command);

    // If the command was empty return immediately.
    if (tokens.length === 0)
    {
      // Return this object for convenience.
      return this;
    }

    // Split the tokens into the command (the first token) and the arguments (all subsequent tokens).
    const commandName = tokens[0];
    const commandArgs = tokens.slice(1, tokens.length);

    // Try to execute the command.
    const exitCode = this.commandSet.exec(this, commandName, commandArgs);

    // If the exit code is defined, the command exists in the set. Set the shells last exit code state to the exit code.
    if (exitCode !== undefined)
    {
      this.lastExitCode = exitCode!;
    }
    else
    {
      // If the returned exit code was undefined, this signifies that the command does not exist in the set. In this
      // case an error will be displayed to the print stream.
      this.printStream.errorln(this.name + ": command not found: " + commandName);
    }

    // Return this object for convenience.
    return this;
  }
}
