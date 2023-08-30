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
export class StreamColor
{
  public static readonly DEFAULT = new StreamColor();
  public static readonly RED = new StreamColor("red");
  public static readonly GREEN = new StreamColor("green");
  public static readonly BLUE = new StreamColor("blue");
  public static readonly LIGHT_BLUE = new StreamColor("light-blue");
  public static readonly VIOLET = new StreamColor("violet");
  public static readonly AQUA = new StreamColor("aqua");

  public static readonly ALL_COLORS = [
    StreamColor.DEFAULT, StreamColor.RED, StreamColor.GREEN, StreamColor.BLUE,
    StreamColor.LIGHT_BLUE, StreamColor.VIOLET, StreamColor.AQUA
  ];

  public readonly className: string;

  private constructor(className?: string)
  {
    this.className = className ? className : "default";
  }

  public isDefault(): boolean
  {
    return this.className === "default";
  }
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
    // Pass an identifiable element to the receiver.
    this.receiver(<div key={uuid()} className="stream-item">{element}</div>);
    
    // Return this object for convenience.
    return this;
  }

  public pushSplit(spacing: number, ...elements: ReactElement[]): ElementStream
  {
    const spacerStyles = {display: "inline-block", width: spacing, fontSize: 0};

    const spacedPanes = elements.map((element, index) => (
      // Each fragment must have a unique key so that they can be distinguished within the final pushed fragment below.
      <React.Fragment key={uuid()}>
        <div key={uuid()} className="pane">{element}</div>
        {
          spacing > 0 && index < elements.length - 1 ?
            <div key={uuid()} className="spacer" style={spacerStyles}></div> : ""
        }
      </React.Fragment>
    ));

    this.push(<React.Fragment>{spacedPanes}</React.Fragment>);

    // Return this object for convenience.
    return this;
  }
}
