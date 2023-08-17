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
