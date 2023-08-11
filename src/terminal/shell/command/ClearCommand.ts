/**
 * @file  ClearCommand.ts
 *
 * @filetype  Typescript
 * @author    Will Brandon
 * @created   July 31, 2023
 *
 * @description Defines a class that represents a shell command that clears the console.
 */
import Shell from "../Shell";
import ShellCommand from "./ShellCommand";

export default class ClearCommand extends ShellCommand
{
  public constructor()
  {
    super("clear", "clear", "Clears the terminal window.");
  }

  public override exec(shell: Shell, args: string[]): number
  {
    if (args.length > 0)
    {
      shell.elementStream.errorln("No arguments are accepted.");
      return 1;
    }

    shell.clear();
    return 0;
  }
}