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
    super("declare", "declare [name] [value]",
      "Declares a variable or displays existing variables.", 0, 2);
  }

  protected override main(shell: Shell, args: string[], argQuoteWraps: boolean[]): number {
    const printStream = shell.printStream;

    console.log(args, argQuoteWraps);

    if (args.length === 0) {
      for (const key in shell.vars)
      {
        const value = shell.vars[key]!;

        printStream.print("(" + typeof value + ") ");
        printStream.println(key + "=" + value!.toString());
      }

      return 0;
    }

    if (args.length === 1)
    {
      shell.vars[args[0]] = "";
      return 0;
    }

    if (argQuoteWraps[1] === true)
    {
      shell.vars[args[0]] = args[1];
      return 0;
    }

    const numValue = parseInt(args[1], 10);

    if (Number.isNaN(numValue))
    {
      shell.vars[args[0]] = args[1];
    }
    else
    {
      shell.vars[args[0]] = numValue;
    }

    return 0;
  }
}
