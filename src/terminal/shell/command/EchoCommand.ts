/**
 * @file  EchoCommand.ts
 *
 * @filetype  Typescript
 * @author    Will Brandon
 * @created   August 13, 2023
 *
 * @description Defines a class that represents a shell command that echos a series of strings to the console.
 */

import Shell from "../Shell";
import ShellCommand from "./ShellCommand";

export default class EchoCommand extends ShellCommand
{
  public constructor()
  {
    super("echo", "echo [strings...]", "Prints a list of strings to the console.");
  }

  public override exec(shell: Shell, args: string[]): number
  {
    shell.printStream.print("This is a test 1");
    shell.printStream.error(" ERROR");
    shell.printStream.print(" Google: ");
    shell.printStream.link("Click Me!", "https://www.google.com", true);
    shell.printStream.println(" <-- Cool huh?");

    return 0;
  }
}