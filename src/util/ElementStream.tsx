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
 * @description Represents an buffered stream of React elements.
 */
export default class ElementStream
{
  
  /**
   * @description A function that receives a React element from the stream when it is flushed.
   */
  private readonly receiver: (element: ReactElement) => void;

  /**
   * @private A buffer of React elements that have not yet been flushed to the receiver. The buffer will be flushed to
   * the receiver in first-in-first-out (FIFO) order.
   */
  private buffer: ReactElement[];
  
  /**
   * @description Counts how many elements have pushed into the stream during the stream's lifespan. This is useful for
   * assigning each element an identifier key that is unique within the stream.
   */
  private flowCount: number;
  
  /**
   * @description Creates a new React element stream.
   *
   * @param receiver  a function that receives an output stream element
   */
  public constructor(receiver: (element: ReactElement) => void)
  {
    // The receiver is initialized from the constructor.
    this.receiver = receiver;

    // The buffer begins empty.
    this.buffer = [];
    
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
  public append(element: ReactElement): ElementStream
  {
    // Increment the flow count indicating that a new item has been pushed.
    this.flowCount += 1;
    
    // Wrap the element in a div with a React render-identifier key.
    const identifiableElement = (
      <div key={this.flowCount} className="stream-item">{element}</div>
    );

    // Push the identifiable element to the buffer.
    this.buffer.push(identifiableElement);
    
    // Return this object for convenience.
    return this;
  }

  public flush(): ElementStream
  {
    // Pass each element along to the receiver.
    this.buffer.forEach(element => {
      this.receiver(element);
    });

    // Clear the buffer after its content has been flushed.
    this.buffer = [];

    // Return this object for convenience.
    return this;
  }

  /**
   * @description Prints a new string into the stream. Newlines are delimitered with HTML line breaks. The stream is
   * flushed immediately.
   *
   * @param str       the string to add to the stream
   * @param className the HTML class for the pre element of each line
   *
   * @return  the element stream object for convenience
   */
  public println(str?: string, className: string = "line"): ElementStream
  {
    // If the string is undefined set it to an empty string.
    str = str ? str : "";

    // Split the string into multiple lines.
    const lines = str.split("\n");

    // Add each line to the stream and delimiter them with line breaks,
    lines.forEach(line => {
      this.append(<pre className={className}>{line}</pre>);
    });

    // Flush the stream immediately.
    this.flush();

    // Return this object for convenience.
    return this;
  }

  /**
   * @description Prints a new error string into the stream. CSS styles should be assigned. Newlines are delimitered
   * with HTML line breaks.The stream is flushed immediately.
   *
   * @param str the string to add to the stream
   *
   * @return  the element stream object for convenience
   */
  public errorln(str?: string): ElementStream
  {
    // Print the message in an "error-line" HTML class pre element.
    this.println(str, "error-line");

    // Return this object for convenience.
    return this;
  }
}
