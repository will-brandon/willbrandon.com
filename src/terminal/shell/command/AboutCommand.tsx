/**
 * @file  AboutCommand.tsx
 *
 * @filetype  Typescript
 * @author    Will Brandon
 * @created   August 29, 2023
 *
 * @description Defines a class that represents a shell command that displays information about me.
 */

import Shell from "../Shell";
import ShellCommand from "./ShellCommand";

export default class AboutCommand extends ShellCommand
{
  public constructor()
  {
    super("about", "about", "Displays information about me.", 0, 0);
  }

  protected override main(shell: Shell, args: string[]): number
  {
    shell.printStream.println(args.join(" "));
    return 0;
  }
}