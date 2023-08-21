/**
 * @file  ManualCommandts
 *
 * @filetype  Typescript
 * @author    Will Brandon
 * @created   August 20, 2023
 *
 * @description Defines a class that represents a shell command that provides a brief manual of the available commands.
 */

import Shell from "../Shell";
import ShellCommand from "./ShellCommand";

class ManualCommand extends ShellCommand
{
  public constructor()
  {
    super("man", "man [command]",
      "Displays information about all commands or a specific given command.");
  }

  protected override main(shell: Shell, args: string[]): number
  {
    const printStream = shell.printStream;

    if (args.length === 1)
    {

    }


    return 0;
  }
}
