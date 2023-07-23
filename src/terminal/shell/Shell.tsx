/**
 * @file Shell.tsx
 *
 *
 *
 * @filetype  Typescript
 * @author    Will Brandon
 * @created   July 21, 2023
 *
 * @fileOverview Provides a class to manage an HTML shell-script simulator. Command-output is HTML.
 */

import { ReactElement } from "react";
import OutputHTMLStream from "../../util/OutputHTMLStream";

interface CommandResult
{
  output: ReactElement;
  exitCode: number;
  shouldExit: boolean;
}

class Shell
{
  readonly user: string;
  readonly host: string;

  private outputStream: OutputHTMLStream;

  public constructor(user: string, host: string)
  {
    this.user = user;
    this.host = host;
  }

  public exec(command: string): CommandResult
  {
    return {output: <h1>Success</h1>, exitCode: 0, shouldExit: false};
  }
}


export default Shell;
