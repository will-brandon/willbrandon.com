/**
 * @file  Shell.ts
 *
 * @filetype  Typescript
 * @author    Will Brandon
 * @created   July 23, 2023
 *
 * @description Defines a class that represents a simulated Linux shell.
 */

import CommandSet from "./CommandSet";
import ShellCommand from "./command/ShellCommand";
import ExitCommand from "./command/ExitCommand";
import ClearCommand from "./command/ClearCommand";
import {GitHubCommand, LinkedInCommand, ResumeCommand} from "./command/NavigationCommands";
import ElementPrintStream from "../../util/stream/ElementPrintStream";
import EchoCommand from "./command/EchoCommand";
import CommandParser from "./CommandParser";
import ManualCommand from "./command/ManualCommand";

/**
 * @description Contains an instance of each command that is recognized by the shell.
 */
const COMMANDS: ShellCommand[] = [
  new ExitCommand(),
  new ManualCommand(),
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
 * @description Defines a union type for shell variables that can be numeric, strings, or empty (undefined).
 */
type ShellVarValue = number | string | undefined;

/**
 * @description Represents a simulated Linux shell.
 */
export default class Shell
{
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
  public readonly commandSet: CommandSet;

  /**
   * @description Determines whether the shell has exited.
   */
  private didExit: boolean;

  /**
   * @description A dictionary mapping shell variable names to their values.
   */
  private vars: Record<string, ShellVarValue>;

  /**
   * @description A running history of all command executed during the session.
   */
  private readonly history: string[];

  /**
   * @description The command parser utility.
   */
  private readonly parser: CommandParser;

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
    // Initialize the print stream and optional event handlers.
    this.printStream = printStream;
    this.onExit = onExit;
    this.onClear = onClear;

    // Create a new empty command set.
    this.commandSet = new CommandSet();

    // The shell starts in an active state, no exit has occurred.
    this.didExit = false;

    // The variable initial values are set in the resetVars function.
    this.vars = {};

    // The history begins empty.
    this.history = [];

    // Create a command parser that will be used for each command execution.
    this.parser = new CommandParser();

    // Register all the commands.
    this.commandSet.register(...COMMANDS);

    // Initialize the default variable values.
    this.resetVars(name, login);
  }

  /**
   * @description Sets the default varaibles to their initial values.
   */
  private resetVars(name: string, login: ShellLogin): void
  {
    // Set initial values for all variables and override the entire object.
    this.vars = {
      "?": 0,
      "SHELL": name,
      "USER": login.user,
      "HOST": login.host,
      "HISTORY": ""
    }
  }

  public set(name: string, value: ShellVarValue): void
  {
    this.vars[name] = value;
  }

  public get(name: string): ShellVarValue
  {
    return this.vars[name];
  }

  public safeGet(name: string): number | string
  {
    const value = this.vars[name];

    return value ? value : "";
  }

  public name(): string
  {
    return this.safeGet("SHELL").toString();
  }

  public login(): ShellLogin
  {
    return {
      "user": this.safeGet("USER").toString(),
      "host": this.safeGet("HOST").toString()
    };
  }

  public getHistory(): string[]
  {
    return this.history;
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

    // Initialize a token array that will be filled with token strings by the parser.
    let tokens: string[] = [];

    // Try to parse the command string into an array of tokens.
    try
    {
      tokens = this.parser.parse(command);
    }
    catch (err: any)
    {
      // If a syntax error occurs, print the error message. Otherwise, rethrow any other thrown object.
      if (err instanceof SyntaxError)
        this.printStream.errorln(this.name() + ": syntax error: " + err.message);
      else
        throw err;
    }

    // If the command was empty return immediately.
    if (tokens.length === 0)
    {
      // Return this object for convenience.
      return this;
    }

    // Add the command to the history.
    this.history.push(command);

    tokens = tokens.map(token => {

      if (token.charAt(0) !== "$")
        return token;

      const varValue = this.vars[token.substring(1)];

      return varValue ? varValue.toString() : "";
    });

    // Split the tokens into the command (the first token) and the arguments (all subsequent tokens).
    const commandName = tokens[0];
    const commandArgs = tokens.slice(1, tokens.length);

    // Try to execute the command.
    const exitCode = this.commandSet.exec(this, commandName, commandArgs);

    // If the exit code is defined, the command exists in the set. Set the shells last exit code variable to the exit
    // code.
    if (exitCode !== undefined)
    {
      this.set("?", exitCode!);
    }
    else
    {
      // If the returned exit code was undefined, this signifies that the command does not exist in the set. In this
      // case an error will be displayed to the print stream.
      this.printStream.errorln(this.name() + ": command not found: " + commandName);
    }

    // Return this object for convenience.
    return this;
  }
}
