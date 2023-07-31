/**
 * @file  ElementStream.tsx
 *
 * @filetype  XML-Friendly Typescript
 * @author    Will Brandon
 * @created   July 23, 2023
 *
 * @description Defines a class that represents an unbuffered stream of React elements.
 */

import React, {ReactElement} from 'react';

/**
 * @description Represents an unbuffered stream of React elements.
 */
class ElementStream
{
  
  /**
   * @description A function that receives an output stream element.
   */
  private readonly receiver: (element: ReactElement) => void;
  
  /**
   * @description An optional function that flushes the receiver's output buffer.
   */
  private readonly flushFunc?: () => void;
  
  /**
   * @description Counts how many elements have flowed through the stream.
   */
  private flowCount: number;
  
  /**
   * @description Creates a new React element stream.
   *
   * @param receiver  a function that receives an output stream element
   * @param flushFunc an optional function that flushes the receiver's output buffer
   */
  public constructor(receiver: (element: ReactElement) => void, flushFunc?: () => void)
  {
    this.receiver = receiver;
    this.flushFunc = flushFunc;
    
    // The flow count starts at 0 since no elements have been pushed yet.
    this.flowCount = 0;
  }
  
  /**
   * @description Pushes a new React element into the stream.
   *
   * @param element the new React element
   *
   * @return  the element stream object for convenience
   */
  public push(element: ReactElement): ElementStream
  {
    // Increment the flow count indicating that a new item has been pushed.
    this.flowCount += 1;
    
    // Wrap the element in a div with a React render-identifier key.
    const identifiableElement = (
      <div key={this.flowCount} className="stream-item">{element}</div>
    );
    
    // Pass the identifiable element along to the receiver.
    this.receiver(identifiableElement);
    
    // Return this object for convenience.
    return this;
  }
  
  /**
   * @description Flushes the receiver buffer if a flusher function was given upon construction of the stream.
   *
   * @return  the element stream object for convenience
   */
  public flush(): ElementStream
  {
    // If a flusher function was specified use the function to flush the receiver buffer.
    if (this.flushFunc) {
      this.flushFunc();
    }
    
    // Return this object for convenience.
    return this;
  }
}

export default ElementStream;
