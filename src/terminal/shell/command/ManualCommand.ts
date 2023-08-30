/**
 * @file  ManualCommand.ts
 *
 * @filetype  Typescript
 * @author    Will Brandon
 * @created   August 20, 2023
 *
 * @description Defines a class that represents a shell command that provides a brief manual of the available commands.
 */

import Shell from "../Shell";
import ShellCommand from "./ShellCommand";
import {StreamColor} from "../../../util/stream/ElementStream";

export default class ManualCommand extends ShellCommand
{
  public constructor()
  {
    super("man", "man [-v] [commands...]",
      "Displays information about all commands or a specific given list of commands.");
  }

  protected override main(shell: Shell, args: string[]): number
  {
    const printStream = shell.printStream;

    let commandSet = shell.commandSet;
    let missing = [] as string[];

    if (args.length > 0)
    {
      [commandSet, missing] = shell.commandSet.subset(args);
    }
    else
    {
      printStream.println("\n  Manual", StreamColor.LIGHT_BLUE);
    }


    if (commandSet.size() > 0)
    {
      printStream.println();
    }

    commandSet.commands.forEach(command => {
      printStream.print("  ");
      printStream.print(command.usage, StreamColor.DEFAULT, 23);
      printStream.println(command.description);
    });

    printStream.println();

    if (missing.length > 0)
    {
      printStream.errorln("  No manual entry for command(s): '" + missing.join("', '") + "'");
      printStream.println();
    }

    return 0;
  }
}
