/**
 * @file  StringUtil.ts
 *
 * @filetype  Typescript
 * @author    Will Brandon
 * @created   July 31, 2023
 *
 * @description Defines utility functions for manipulating and parsing strings.
 */

export function containsWhitespace(str: string): boolean
{
  return str.trim().length !== str.length;
}

export function formatPhoneNumber(num: number): string
{
  let str = num.toString(10);

  if (str.length === 10)
  {
    str = "1" + str;
  }

  if (str.length < 10 || str.length > 11)
  {
    throw TypeError("Phone number must be 10 or 11 digits.");
  }

  str = "+" + str.charAt(0) + " (" + str.substring(1, 4) + ") " + str.substring(4, 7) + "-" + str.substring(7, 11);

  return str;
}

export function parseTokens(command: string): string[]
{
  const tokens: string[] = [];

  let workingTokenIndex = 0;
  let quoteState: "" | "\"" | "'" | "." = "";
  let hangingEscape = false;

  for (let i = 0; i < command.length; i++)
  {
    const char = command.charAt(i);

    if (quoteState === ".")
    {
      if (char.trim() === "")
      {
        quoteState = "";
      }
      else
      {
        throw TypeError("Whitespace must immediately follow quoted block.");
      }
    }

    if (char === "\\")
    {
      hangingEscape = true;
      continue;
    }

    if (!hangingEscape && (char === "'" || char === "\""))
    {
      if (quoteState === char)
      {
        quoteState = ".";
        continue;
      }
      else if (quoteState === "")
      {
        if (tokens[workingTokenIndex])
        {
          throw TypeError("Whitespace must immediately precede quoted block.");
        }
        else
        {
          quoteState = char;
          continue;
        }
      }
    }

    if (quoteState === "" && char.trim() === "")
    {
      if (tokens[workingTokenIndex])
      {
        workingTokenIndex++;
      }
    }
    else
    {
      if (tokens[workingTokenIndex])
      {
        tokens[workingTokenIndex] += char;
      } else
      {
        tokens[workingTokenIndex] = char;
      }
    }

    hangingEscape = false;
  }

  return tokens;
}
