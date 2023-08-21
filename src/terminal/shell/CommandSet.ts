/**
 * @file  CommandSet.ts
 *
 * @filetype  Typescript
 * @author    Will Brandon
 * @created   July 31, 2023
 *
 * @description Defines a class that represents a set of Linux commands.
 */
import ShellCommand from "./command/ShellCommand";
import Shell from "./Shell";

export default class CommandSet
{
  public readonly commands: ShellCommand[];

  public constructor(commands: ShellCommand[] = [])
  {
    // Initialize the command array empty.
    this.commands = [];

    // Register the commands via the register function to ensure there are no duplicated command names.
    this.register(...commands);
  }

  public size(): number
  {
    return this.commands.length;
  }

  public find(name: string): ShellCommand | undefined
  {
    return this.commands.find(command => command.name === name);
  }

  public subset(names: string[]): [CommandSet, string[]]
  {
    const subset = new CommandSet();
    const missing = [] as string[];

    names.forEach(name => {
      const command = this.find(name);

      if (command)
        subset.register(command);
      else
        missing.push(name);
    });

    return [subset, missing];
  }

  public register(...commands: ShellCommand[]): boolean
  {
    commands.forEach(command => {
      if (this.find(command.name)) {
        return false;
      }

      this.commands.push(command);
    });

    return true;
  }

  public exec(shell: Shell, name: string, args: string[]): number | undefined
  {
    const command = this.find(name);

    if (!command)
    {
      return undefined;
    }

    return command.exec(shell, args);
  }
}