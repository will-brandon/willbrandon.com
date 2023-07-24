/**
 * @file  Shell.tsx
 *
 * @filetype  XML-Friendly Typescript
 * @author    Will Brandon
 * @created   July 23, 2023
 *
 * @description Defines a class that represents a simulated Linux shell.
 */

import { ReactElement } from 'react';
import ElementStream from './../../util/ElementStream';

class Shell
{
  private readonly elementStream: ElementStream;
  private lastExitCode: number;

  public constructor(elementStream: ElementStream)
  {
    this.elementStream = elementStream;
    this.lastExitCode = 0;
  }

  public exec(command: string): boolean
  {
    this.elementStream.push(<h1>{command}</h1>);
    return false;
  }
}

export default Shell;
