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

const EXIT_COMMAND_NAME = "exit";
const EXIT_COMMAND_USAGE = EXIT_COMMAND_NAME + ": [code]";
const EXIT_COMMAND_DESCRIPTION = "Exits the shell session.";

export default class ExitCommand extends ShellCommand
{
  public constructor()
  {
    super(EXIT_COMMAND_NAME, EXIT_COMMAND_USAGE, EXIT_COMMAND_DESCRIPTION);
  }

  public override exec(shell: Shell, args: string[]): number
  {
    const stream = shell.elementStream;

    let code = 0;

    if (args.length > 1)
    {
      stream.println("Only one argument is accepted. Usage: " + this.usage);
      return 1;
    }
    else if (args.length === 1)
    {
      code = parseInt(args[0], 10);

      if (Number.isNaN(code))
      {
        stream.println("Invalid exit code given: '" + args[0] + "'");
        return 1;
      }
    }

    stream
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