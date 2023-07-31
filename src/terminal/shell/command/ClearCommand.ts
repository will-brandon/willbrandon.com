/**
 * @file  ClearCommand.ts
 *
 * @filetype  Typescript
 * @author    Will Brandon
 * @created   July 31, 2023
 *
 * @description Defines a class that represents a shell command that clears the console.
 */
import Shell from "../Shell";
import ShellCommand from "./ShellCommand";

export default class ClearCommand extends ShellCommand
{
  public constructor() {
    super("clear");
  }

  public override exec(shell: Shell, args: string[]): number
  {
    shell.clear();
    return 0;
  }
}