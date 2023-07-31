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

const CLEAR_COMMAND_NAME = "clear";
const CLEAR_COMMAND_USAGE = CLEAR_COMMAND_NAME;
const CLEAR_COMMAND_DESCRIPTION = "Clears the terminal window.";

export default class ClearCommand extends ShellCommand
{
  public constructor()
  {
    super(CLEAR_COMMAND_NAME, CLEAR_COMMAND_USAGE, CLEAR_COMMAND_DESCRIPTION);
  }

  public override exec(shell: Shell, args: string[]): number
  {
    if (args.length > 0)
    {
      shell.elementStream.println("No arguments are accepted.");
      return 1;
    }

    shell.clear();
    return 0;
  }
}