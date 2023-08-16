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
  public constructor()
  {
    super("exit", "exit [code]", "Exits the shell session.");
  }

  public override exec(shell: Shell, args: string[]): number
  {
    const printStream = shell.printStream;

    let code = 0;

    if (args.length > 1)
    {
      printStream.errorln("Only one argument is accepted. Usage: " + this.usage);
      return 1;
    }

    if (args.length === 1)
    {
      code = parseInt(args[0], 10);

      if (Number.isNaN(code))
      {
        printStream.errorln("Invalid exit code given: '" + args[0] + "'");
        return 1;
      }
    }

    printStream
      .println("")
      .println("Exiting with code " + code)
      .println("")
      .println("Saving session...")
      .println("...copying shared history...")
      .println("...saving history...truncating history files...")
      .println("...completed.")
      .println()
      .println("[Process completed]");

    shell.exit();
    return 0;
  }
}