/**
 * @file  CommandSet.ts
 *
 * @filetype  Typescript
 * @author    Will Brandon
 * @created   July 31, 2023
 *
 * @description Defines a class that represents a set of Linux commands.
 */

import Shell from "../Shell";
import ShellCommand from "./ShellCommand";

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

  public register(command: ShellCommand): void
  {
    if (this.find(command.name))
    {
      throw TypeError("Cannot register a command with a name that's already in the set registry.");
    }

    this.commands.push(command);
  }

  public exec(shell: Shell, name: string, args: string[]): number
  {
    const command = this.find(name);

    if (!command)
    {
      throw TypeError("Command named " + name + " doesn't exist in the set.");
    }

    return command.exec(shell, args);
  }
}