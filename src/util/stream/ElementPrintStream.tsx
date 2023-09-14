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
import ElementStream, {StreamColor} from "./ElementStream";

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
    color: StreamColor = StreamColor.DEFAULT,
    paddingSize: number = 0,
    paddingChar: string = " "
  ): ElementPrintStream
  {
    // Split the string into multiple lines.
    const lines = str.split("\n");

    for (let i = lines[0].length; i <= paddingSize; i++)
    {
      lines[0] += paddingChar;
    }

    function element(index: number): ReactElement
    {
      return color.isDefault()
        ? <React.Fragment>{lines[index]}</React.Fragment>
        : <pre className={color.className}>{lines[index]}</pre>;
    }

    // Add each line to the stream and delimiter them with line breaks,
    for (let i = 0; i < lines.length - 1; i++)
    {
      this.append(element(i));
      this.flush();
      console.log(i);
    }

    if (lines[lines.length - 1] !== "")
    {
      this.append(element(lines.length - 1));
      console.log("base");
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
  public println(
    str: string = "",
    color: StreamColor = StreamColor.DEFAULT,
    paddingSize: number = 0,
    paddingChar: string = " "
  ): ElementPrintStream
  {
    // Add a newline character after the string.
    this.print(str + "\n", color, paddingSize, paddingChar);

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
    this.print(str, StreamColor.RED, paddingSize, paddingChar);

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
    this.println(str, StreamColor.RED, paddingSize, paddingChar);

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
