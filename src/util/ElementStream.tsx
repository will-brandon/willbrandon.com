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
   * @description Determines how many React elements have been pushed into the stream and collected into the buffer.
   *
   * @return  an integer identifying how many React elements are in the buffer
   */
  public bufferSize(): number
  {
    return this.elementBuffer.length;
  }

  /**
   * @description Renders the entire concatenated buffer of React elements to a concatenated React fragment.
   *
   * @return  a React element containing all the buffer elements
   */
  public renderAll(): ReactElement
  {
    return (
      <React.Fragment>
        {this.elementBuffer}
      </React.Fragment>
    );
  }

  /**
   * @description Clears the buffer of all React elements.
   *
   * @return  the element stream object for convenience
   */
  public clear(): ElementStream
  {
    // Set the buffer to an empty array.
    this.elementBuffer = [];

    // Return this object for convenience.
    return this;
  }

  /**
   * @description Pushes a new React element to the buffer.
   *
   * @param element the new React element
   *
   * @return  the element stream object for convenience
   */
  public push(element: ReactElement): ElementStream
  {
    // Push the element to the buffer.
    this.elementBuffer.push(element);

    // Return this object for convenience.
    return this;
  }
}

export default ElementStream;
