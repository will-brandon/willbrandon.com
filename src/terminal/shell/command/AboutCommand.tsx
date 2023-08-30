/**
 * @file  AboutCommand.tsx
 *
 * @filetype  Typescript
 * @author    Will Brandon
 * @created   August 29, 2023
 *
 * @description Defines a class that represents a shell command that displays information about me.
 */

import Shell from "../Shell";
import ShellCommand from "./ShellCommand";
import React from "react";

export default class AboutCommand extends ShellCommand
{
  public constructor()
  {
    super("about", "about", "Displays information about me.", 0, 0);
  }

  protected override main(shell: Shell, args: string[]): number
  {
    const printStream = shell.printStream;

    printStream.println();

    printStream.pushSplit(30,
      <img src="/resources/will.jpg" className="large" />,
      <React.Fragment>
        <pre className="line"><pre className="light-blue">Will Brandon</pre></pre>
      </React.Fragment>
    );

    printStream.println();

    return 0;
  }
}