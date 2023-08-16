/**
 * @file  StringUtil.ts
 *
 * @filetype  Typescript
 * @author    Will Brandon
 * @created   July 31, 2023
 *
 * @description Defines utility functions for manipulating and parsing strings.
 */

/**
 * @description Determines whether the given string contains any whitespace.
 *
 * @param str the string to check
 *
 * @return  true if and only if there is at least one character of whitespace in the string
 */
export function containsWhitespace(str: string): boolean
{
  // Use the trim function which removes any whitespace then compare its length to the untrimmed string. If they differ,
  // the trim function must have found some whitespace to remove.
  return str.trim().length !== str.length;
}

/**
 * @description Formats a phone number from an integer to a string. The last 10 digits are used as the primary portion
 *              of the phone number. Any digits before the last 10 are interpreted as a country code. If no country code
 *              is provided (i.e. the integer is exactly 10 digits long) then a country code of 1 (United States) is
 *              assumed.
 *
 * @param int the integer phone number to be formatted
 *
 * @return  the formatted string phone number
 */
export function formatPhoneNumber(int: number): string
{
  // Ensure the given number is an integer.
  if (!Number.isInteger(int))
  {
    throw TypeError("A numeric phone number can only be represented by an integer.");
  }

  // Convert the integer to a string.
  const str = int.toString(10);

  // Ensure the integer is at least 10 digits long.
  if (str.length < 10)
  {
    throw TypeError("Phone number must be at least 10 digits.");
  }

  // By default, a country code of 1 is assumed.
  let countryCode = "1";

  // If the length of the integer is greater than 10, interpret all digits before the last 10 as the country code.
  if (str.length > 10)
  {
    countryCode = str.substring(0, str.length - 10);
  }

  // Grab the 3 parts of the primary number from the last 10 digits of the number.
  const areaCode = str.substring(str.length - 10, str.length - 7);
  const telePrefix = str.substring(str.length - 7, str.length - 4);
  const lineNumber = str.substring(str.length - 4, str.length);

  // Combine the country code, area code, telephone prefix, and line number into the final formatted string.
  return "+" + countryCode + " (" + areaCode + ") " + telePrefix + "-" + lineNumber;
}

/**
 * @description Parses a string containing a command into tokens.
 *
 * @param command the command string
 *
 * @return  an array containing the token strings
 */
export function parseCommandTokens(command: string): string[]
{
  // Define a union type for the 4 different possible states the parser is in for quote escaping.
  //  - The empty state, indicates no quotes have been encountered.
  //  - The double quote state, '"', indicates that the parser encountered a double-quoted token that has not yet
  //    closed.
  //  - The single quote state, ''' indicates that the parser encountered a single-quoted token that has not yet closed.
  //  - The recent quote termination state, '.', indicates that the previous character ended a quote block so the next
  //    character must be whitespace.
  type QuoteState = "" | "\"" | "'" | ".";

  // Initialize an array of tokens that will be accumulated.
  const tokens: string[] = [];

  // Create a counter to track the index of the token currently being worked on within the array.
  let workingTokenIndex = 0;

  // Indicates the current quote state.
  let quoteState: QuoteState = "";

  // Indicates whether the previous character was a backslash so the current character should be escaped.
  let hangingEscape = false;

  // Process each character index within the input string one-by-one.
  for (let i = 0; i < command.length; i++)
  {
    // Get the character at the index.
    const char = command.charAt(i);

    // If the previous character ended a quote block, the current character must be whitespace.
    if (quoteState === ".")
    {
      // If the character is whitespace set the quote state to empty. Don't skip to the next character yet because the
      // working token index will be incremented later on.
      if (char.trim() === "")
      {
        quoteState = "";
      }
      else
      {
        // If the character was not whitespace throw an error.
        throw TypeError("Whitespace must immediately follow quoted block.");
      }
    }

    // If the character is an escaping backslash, indicate that there is a hanging escape and skip ahead to the next
    // character.
    if (char === "\\")
    {
      hangingEscape = true;
      continue;
    }

    // If the prior character was not an escape backslash and the current character is some sort of quote then manage
    // the quote state appropriately.
    if (!hangingEscape && (char === "'" || char === "\""))
    {
      // If the quote state is already the quote at the current character then switch to a recent quote termination
      // state and skip to the next character.
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

  // Return the array of parsed tokens.
  return tokens;
}
