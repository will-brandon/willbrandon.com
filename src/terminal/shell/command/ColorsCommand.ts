/**
 * @file  ColorsCommands.ts
 *
 * @filetype  Typescript
 * @author    Will Brandon
 * @created   August 20, 2023
 *
 * @description Defines a class that represents a shell command that tests the terminal colors.
 */

import Shell from "../Shell";
import ShellCommand from "./ShellCommand";
import {ColorClass} from "../../../util/stream/ElementStream";

export default class ColorsCommand extends ShellCommand
{

  public constructor()
  {
    super("colors", "colors", "Displays all supported terminal colors for debugging.", 0, 0);
  }

  protected override main(shell: Shell, args: string[]): number
  {
    const printStream = shell.printStream;

    printStream.println();

    let i = 0;
    Object.keys(ColorClass).forEach(colorClass => {
      printStream.println(colorClass, ColorClass.);
      i++;
    });

    printStream.println();

    return 0;
  }
}
