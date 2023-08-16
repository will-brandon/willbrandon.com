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
  private readonly commands: ShellCommand[];

  public constructor()
  {
    this.commands = [];
  }

  public find(name: string): ShellCommand | undefined
  {
    return this.commands.find(command => command.name === name);
  }

  public register(...commands: ShellCommand[]): void
  {
    commands.forEach(command => {
      if (this.find(command.name)) {
        throw TypeError("Cannot register a command with a name that's already in the set registry.");
      }

      this.commands.push(command);
    });
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