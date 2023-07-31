/**
 * @file  StringUtil.ts
 *
 * @filetype  XML-Friendly Typescript
 * @author    Will Brandon
 * @created   July 31, 2023
 *
 * @description Defines utility functions for manipulating and parsing strings.
 */

export function parseTokens(command: string): string[]
{
  const tokens: string[] = [];

  let workingTokenIndex = 0;
  let hangingQuote = "";
  let hangingEscape = false;

  for (let i = 0; i < command.length; i++)
  {
    const char = command.charAt(i);

    if (char === "\\")
    {
      hangingEscape = true;
      continue;
    }

    if (!hangingEscape && (char === "'" || char === "\""))
    {
      if (hangingQuote === char)
      {
        hangingQuote = "";
        continue;
      }
      else if (hangingQuote === "")
      {
        hangingQuote = char;
        continue;
      }
    }

    if (hangingQuote === "" && char.trim() === "")
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
