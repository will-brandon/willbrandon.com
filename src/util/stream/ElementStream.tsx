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
import {v4 as uuid} from 'uuid';

/**
 * @description Represents the possible color CSS classes for text.
 */
export enum ColorClass
{
  DEFAULT = 0,
  RED = 1,
  GREEN = 2,
  BLUE = 3,
  LIGHT_BLUE = 4,
  VIOLET = 5,
  AQUA = 6
}

/**
 * @description Represents an unbuffered stream of React elements.
 */
export default class ElementStream
{
  /**
   * @description A function that receives a React element from the stream when it is flushed.
   */
  private readonly receiver: (element: ReactElement) => void;
  
  /**
   * @description Creates a new React element stream.
   *
   * @param receiver  a function that receives an output stream element
   */
  public constructor(receiver: (element: ReactElement) => void)
  {
    // The receiver is initialized from the constructor.
    this.receiver = receiver;
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
    // Wrap the element in a div with a React render-identifier key.
    const identifiableElement = (
      <div key={uuid()} className="stream-item">{element}</div>
    );

    // Pass the identifiable element to the receiver.
    this.receiver(identifiableElement);
    
    // Return this object for convenience.
    return this;
  }

  /**
   * @description Pushes a new line composed of only a string into the stream.
   *
   * @param str the string to be put into a line
   *
   * @return  the element stream object for convenience
   */
  public pushStr(str: string): ElementStream
  {
    // Push the string as a fragment i.e. it is place raw inside the line div.
    this.push(<React.Fragment>{str}</React.Fragment>);

    // Return this object for convenience.
    return this;
  }
}
