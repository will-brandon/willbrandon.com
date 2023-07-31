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
export default class ElementStream
{
  
  /**
   * @description A function that receives an output stream element.
   */
  private readonly receiver: (element: ReactElement) => void;
  
  /**
   * @description Counts how many elements have flowed through the stream.
   */
  private flowCount: number;
  
  /**
   * @description Creates a new React element stream.
   *
   * @param receiver  a function that receives an output stream element
   */
  public constructor(receiver: (element: ReactElement) => void)
  {
    this.receiver = receiver;
    
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
}
