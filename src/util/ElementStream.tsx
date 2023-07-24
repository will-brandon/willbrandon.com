/**
 * @file  ElementStream.tsx
 *
 * @filetype  XML-Friendly Typescript
 * @author    Will Brandon
 * @created   July 23, 2023
 *
 * @description Defines a class that represents a stream of React elements.
 */

import { ReactElement } from 'react';

/**
 * Represents a stream of React elements.
 */
class ElementStream
{
  private elementBuffer: ReactElement[];

  public constructor()
  {
    this.elementBuffer = [];
  }

  public render(): ReactElement
  {
    return (
      <div className="element-stream">
        {this.elementBuffer}
      </div>
    );
  }

  public clear(): void
  {
    this.elementBuffer = [];
  }

  public push(element: ReactElement): void
  {
    this.elementBuffer.push(element);
  }
}

export default ElementStream;
