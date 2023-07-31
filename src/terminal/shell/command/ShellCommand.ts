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
  public readonly usage: string;
  public readonly description: string;

  protected constructor(name: string, usage: string, description: string)
  {
    if (containsWhitespace(name))
    {
      throw TypeError("Command name cannot contain whitespace.");
    }

    this.name = name;
    this.usage = usage;
    this.description = description;
  }

  public abstract exec(shell: Shell, args: string[]): number;
}
