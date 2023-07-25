/**
 * @file  ElementStream.tsx
 *
 * @filetype  XML-Friendly Typescript
 * @author    Will Brandon
 * @created   July 23, 2023
 *
 * @description Defines a class that represents a buffered stream of React elements.
 */

import React, {ReactElement} from 'react';

/**
 * @description Represents a buffered stream of React elements.
 */
class ElementStream
{
  /**
   * @description Stores the elements that have been pushed to the stream.
   */
  private elementBuffer: ReactElement[];

  /**
   * @description Creates a new React element stream.
   */
  public constructor()
  {
    this.elementBuffer = [];
  }

  /**
   * @description Renders the entire concatenated buffer of React elements to a single element.
   *
   * @return  a React element containing all the buffer elements
   */
  public render(): ReactElement
  {
    return (
      <React.Fragment>
        {this.elementBuffer}
      </React.Fragment>
    );
  }

  /**
   * @description Clears the buffer of all React elements.
   */
  public clear(): void
  {
    this.elementBuffer = [];
  }

  /**
   * @description Pushes a new React element to the buffer.
   *
   * @param element the new React element
   */
  public push(element: ReactElement): void
  {
    this.elementBuffer.push(element);
  }
}

export default ElementStream;
