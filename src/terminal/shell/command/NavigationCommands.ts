/**
 * @file  NavigationCommands.ts
 *
 * @filetype  Typescript
 * @author    Will Brandon
 * @created   August 9, 2023
 *
 * @description Defines a class that represents a shell command that navigates to a URL in a new tab.
 */

import Shell from "../Shell";
import ShellCommand from "./ShellCommand";
import {navigateTo} from "../../../util/Browser";
import myInfoJSON from "../../../my-info.json";

class NavigationCommands extends ShellCommand
{
  public readonly url: string;

  public constructor(name: string, url: string, usage?: string, description?: string)
  {
    super(name, usage, description, 0, 1);

    this.url = url;
  }

  protected override main(shell: Shell, args: string[]): number
  {
    const printStream = shell.printStream;

    let newTab = true;

    if (args.length === 1)
    {
      switch (args[0])
      {
        case "-n":
          break;
        case "-s":
          newTab = false;
          break;
        default:
          printStream.errorln("Invalid option '" + args[0] + "'. Usage: " + this.usage);
          return 1;
      }
    }

    navigateTo(this.url, newTab);
    return 0;
  }
}

export class ResumeCommand extends NavigationCommands
{
  public constructor()
  {
    super("resume", myInfoJSON.resume_url, "resume [-n | -s]", "Opens my resume in a new tab (-n) or the same tab" +
      " (-s).");
  }
}

export class LinkedInCommand extends NavigationCommands
{
  public constructor()
  {
    super("linkedin", myInfoJSON.linkedin_url, "linkedin [-n | -s]", "Opens my LinkedIn profile in a new tab (-n) or" +
      " the same tag (-s).");
  }
}

export class GitHubCommand extends NavigationCommands
{
  public constructor()
  {
    super("github", myInfoJSON.github_url, "github [-n | -s]", "Opens my GitHub profile in a new tab (-n) or" +
      " the" +
      " same tag (-s).");
  }
}
