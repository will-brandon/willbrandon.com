/**
 * @file  DeclareCommand.ts
 *
 * @filetype  Typescript
 * @author    Will Brandon
 * @created   August 29, 2023
 *
 * @description Defines a class that represents a shell command that declares a variable or displays existing variables.
 */

import Shell from "../Shell";
import ShellCommand from "./ShellCommand";

export default class DeclareCommand extends ShellCommand
{

  public constructor()
  {
    super("declare", "declare [name=value]",
      "Declares a variable or displays existing variables.", 0, 1);
  }

  protected override main(shell: Shell, args: string[]): number {
    const printStream = shell.printStream;

    if (args.length === 0) {
      for (const key in shell.vars)
      {
        const value = shell.vars[key]!;

        printStream.print("(" + typeof value + ") ");
        printStream.println(key + "=" + value!.toString());
      }

      return 0;
    }

    const tokens = args[0].split("=");

    if (tokens.length > 2)
    {
      printStream.errorln("Invalid syntax. The '=' operator should only be used between the name and value.");
      return 1;
    }

    if (tokens.length === 1)
    {
      shell.vars[tokens[0]] = "";
    }
    else
    {
      shell.vars[tokens[0]] = tokens[1];
    }

    return 0;
  }
}
