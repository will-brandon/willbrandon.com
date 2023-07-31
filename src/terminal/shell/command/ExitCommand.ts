/**
 * @file  ExitCommand.ts
 *
 * @filetype  Typescript
 * @author    Will Brandon
 * @created   July 31, 2023
 *
 * @description Defines a class that represents a shell command that exits the shell session.
 */
import Shell from "../Shell";
import ShellCommand from "./ShellCommand";

export default class ExitCommand extends ShellCommand
{
  public constructor() {
    super("exit");
  }

  public override exec(shell: Shell, args: string[]): number
  {
    shell.elementStream.println();
    shell.elementStream.println("Saving session...");
    shell.elementStream.println("...copying shared history...");
    shell.elementStream.println("...saving history...truncating history files...");
    shell.elementStream.println("...completed.");
    shell.elementStream.println();
    shell.elementStream.println("[Process completed]");

    shell.exit();
    return 0;
  }
}