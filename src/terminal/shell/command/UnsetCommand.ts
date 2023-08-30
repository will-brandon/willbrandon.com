/**
 * @file  UnsetCommand.ts
 *
 * @filetype  Typescript
 * @author    Will Brandon
 * @created   August 29, 2023
 *
 * @description Defines a class that represents a shell command that unsets a variable.
 */

import Shell from "../Shell";
import ShellCommand from "./ShellCommand";

export default class UnsetCommand extends ShellCommand
{

  public constructor()
  {
    super("unset", "unset <name>",
      "Unsets a variable with the given name.", 1, 1);
  }

  protected override main(shell: Shell, args: string[]): number {

    if (shell.vars[args[0]])
    {
      delete shell.vars[args[0]];
    }

    return 0;
  }
}
