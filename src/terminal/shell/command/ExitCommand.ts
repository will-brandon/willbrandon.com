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
    shell.exit();
    return 0;
  }
}