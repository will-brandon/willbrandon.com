/**
 * @file  OutputHTMLStream.ts
 *
 * @filetype  Typescript
 * @author    Will Brandon
 * @created   July 23, 2023
 *
 * @fileOverview  Defines a class that represents a stream by which to send output HTML elements.
 */



class OutputHTMLStream
{
  private root?: HTMLElement

  public constructor() {}

  public assignNewRoot(root: HTMLElement): void
  {
    this.root = root;
  }

  public send(content: HTMLElement): void
  {
    if (this.root)
    {
      this.root.append(content);
    }
  }
}

export default OutputHTMLStream;