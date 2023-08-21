import {containsWhitespace} from "../../../util/StringUtil";
import Shell from "../Shell";

/**
 * @file  ClearCommand.ts
 *
 * @filetype  Typescript
 * @author    Will Brandon
 * @created   July 31, 2023
 *
 * @description Defines an abstract class that represents a shell command.
 */

export default abstract class ShellCommand
{
  public readonly name: string;
  public readonly usage?: string;
  public readonly description?: string;
  public readonly minArgs?: number;
  public readonly maxArgs?: number;

  protected constructor(name: string, usage?: string, description?: string, minArgs?: number, maxArgs?: number)
  {
    if (containsWhitespace(name))
    {
      throw TypeError("Command name cannot contain whitespace.");
    }

    this.name = name;
    this.usage = usage;
    this.description = description;
    this.minArgs = minArgs;
    this.maxArgs = maxArgs;
  }

  public validateArguments(shell: Shell, args: string[]): boolean
  {
    const printStream = shell.printStream;

    if (
      this.minArgs !== undefined
      && this.maxArgs !== undefined
      && this.minArgs === this.maxArgs
      && args.length !== this.minArgs
    ) {
      // For the sake of proper grammar separately handle the case where the required argument count is 0 or 1.
      if (this.minArgs === 0)
        printStream.errorln("No arguments are allowed.");
      else if (this.minArgs === 1)
        printStream.errorln("Exactly 1 argument is required. Usage: " + this.usage);
      else
        printStream.errorln("Exactly " + this.minArgs + " arguments are required. Usage: " + this.usage);

      return true;
    }

    if (this.minArgs !== undefined && args.length < this.minArgs)
    {
      // For the sake of proper grammar separately handle the case where the minimum argument count is 1.
      if (this.minArgs === 1)
        printStream.errorln("At least 1 argument is required. Usage: " + this.usage);
      else
        printStream.errorln("At least " + this.minArgs + " arguments are required. Usage: " + this.usage);

      return true;
    }

    if (this.maxArgs !== undefined && args.length > this.maxArgs)
    {
      // For the sake of proper grammar separately handle the cases where the maximum argument count is 1.
      if (this.maxArgs === 1)
        printStream.errorln("At most 1 argument is accepted. Usage: " + this.usage);
      else
        printStream.errorln("At most " + this.maxArgs + " arguments are accepted. Usage: " + this.usage);

      return true;
    }

    return false;
  }

  public exec(shell: Shell, args: string[]): number
  {
    // Perform any convenience pre-validation steps and if they fail return an exit code of 1 and don't bother starting
    // the main function.
    if (this.validateArguments(shell, args))
      return 1;

    return this.main(shell, args);
  }

  protected abstract main(shell: Shell, args: string[]): number;
}
