/**
 * @file  ElementPrintStream.tsx
 *
 * @filetype  XML-Friendly Typescript
 * @author    Will Brandon
 * @created   August 10, 2023
 *
 * @description Defines a class that represents a buffered print stream that yields React elements.
 */

import React, {ReactElement} from 'react';
import {v4 as uuid} from 'uuid';
import ElementStream from "./ElementStream";

/**
 * @description Represents a buffered print stream that yields React elements.
 */
export default class ElementPrintStream extends ElementStream
{
  private lineBuffer: ReactElement[];

  /**
   * @description Creates a new React element print stream.
   *
   * @param receiver  a function that receives an output stream element
   */
  public constructor(receiver: (element: ReactElement) => void)
  {
    super(receiver);

    // The line buffer begins empty.
    this.lineBuffer = [];
  }

  public flush(): ElementPrintStream
  {
    this.push(
      <React.Fragment>
        {
          this.lineBuffer.map(item =>
            <pre key={uuid()} className="line">{item}</pre>)
        }
      </React.Fragment>
    );

    this.lineBuffer = [];

    // Return this object for convenience.
    return this;
  }
  
  /**
   * @description Pushes a new React element into the stream.
   *
   * @param element the new React element
   *
   * @return  the element stream object for convenience
   */
  public append(element: ReactElement): ElementPrintStream
  {
    this.lineBuffer.push(element);

    // Return this object for convenience.
    return this;
  }

  public print(
    str: string = "",
    paddingSize: number = 0,
    paddingChar: string = " ",
    className?: string
  ): ElementPrintStream
  {
    // Split the string into multiple lines.
    const lines = str.split("\n");

    for (let i = lines[0].length; i <= paddingSize; i++)
    {
      lines[0] += paddingChar;
    }

    // Add each line to the stream and delimiter them with line breaks,
    for (let i = 0; i < lines.length; i++)
    {
      if (className)
      {
        this.append(<pre className={className}>{lines[i]}</pre>);
      }
      else
      {
        this.append(<React.Fragment>{lines[i]}</React.Fragment>);
      }

      if (i < lines.length - 1)
      {
        this.flush();
      }
    }

    // Return this object for convenience.
    return this;
  }

  /**
   * @description Prints a new string into the stream. Newlines are delimitered with HTML line breaks. The stream is
   * flushed immediately.
   *
   * @param str       the string to add to the stream
   * @param className the HTML class for an inner pre element
   *
   * @return  the element stream object for convenience
   */
  public println(str: string = "", paddingSize: number = 0, paddingChar: string = " ", className?: string): ElementPrintStream
  {
    // Add a newline character after the string.
    this.print(str + "\n", paddingSize, paddingChar, className);

    // Return this object for convenience.
    return this;
  }

  /**
   * @description Prints a new error string into the stream. CSS styles should be assigned. Newlines are delimitered
   * with HTML line breaks.
   *
   * @param str the string to add to the stream
   *
   * @return  the element stream object for convenience
   */
  public error(str?: string, paddingSize: number = 0, paddingChar: string = " "): ElementPrintStream
  {
    // Print the message in an "error-line" HTML class pre element.
    this.print(str, paddingSize, paddingChar, "error");

    // Return this object for convenience.
    return this;
  }

  /**
   * @description Prints a new error string into the stream. CSS styles should be assigned. Newlines are delimitered
   * with HTML line breaks. The stream is flushed immediately.
   *
   * @param str the string to add to the stream
   *
   * @return  the element stream object for convenience
   */
  public errorln(str?: string, paddingSize: number = 0, paddingChar: string = " "): ElementPrintStream
  {
    // Print the message in an "error-line" HTML class pre element.
    this.println(str, paddingSize, paddingChar, "error");

    // Return this object for convenience.
    return this;
  }

  public link(label: string, ref: string = ".", newTab: boolean = false): ElementPrintStream
  {
    if (label.includes("\n"))
    {
      throw TypeError("Link labels cannot contain newline characters.");
    }

    const target = newTab ? "_blank" : "_self";

    this.lineBuffer.push(
      <a href={ref} target={target}>{label}</a>
    );

    // Return this object for convenience.
    return this;
  }
}
