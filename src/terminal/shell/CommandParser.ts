/**
 * @file  CommandParser.ts
 *
 * @filetype  Typescript
 * @author    Will Brandon
 * @created   August 16, 2023
 *
 * @description Defines a class that parses command strings into tokens.
 */

/**
 * @description A union type for the 4 different possible states the parser is in for quote blocking. The following
 *              state values are possible:
 *
 *              <ul>
 *                <li>'': The empty state indicates no quotes have been encountered.</li>
 *                <li>'"': The double quote state indicates that the parser encountered a double-quoted token
 *                  that has not yet closed.</li>
 *                <li>''': The single quote state indicates that the parser encountered a single-quoted token that has
 *                  not yet closed.</li>
 *                <li>'.': The recent quote termination state indicates that the previous character ended a quote block
 *                  so the next character must be whitespace.</li>
 *              </ul>
 */
type QuoteState = "" | "\"" | "'" | ".";

/**
 * @description Parses command strings into tokens. The parser is forward-looking meaning that it steps forward though
 *              each character in a linear format without ever looking backward at previously encountered characters.
 *              The parser works like a state machine that resets and starts fresh for each input string.
 */
export default class CommandParser {
  /**
   * @description An array of tokens that will be accumulated.
   */
  private tokens: string[];

  /**
   * @description The current character being analyzed. It is encoded as a string because Typescript doesn't have a
   *              character type however its length should always be 1 when the parser steps.
   */
  private char: string;

  /**
   * @description Indicates the index of the token currently being worked on within the array.
   */
  private workingTokenIndex: number;

  /**
   * @description Indicates the current quote state.
   */
  private quoteState: QuoteState;

  /**
   * @description Indicates whether an escaping backslash was encountered so the following character should be escaped.
   */
  private hangingEscape: boolean;

  /**
   * @description Indicates whether the last character processed was whitespace.
   */
  private lastWasWhitespace: boolean;

  /**
   * @description Creates a new command parser.
   */
  public constructor() {
    // Each time the parser begins parsing the state is reset. The state values are initialized in the constructor
    // simply for type compliance so that they do not have to be optional types.
    this.tokens = [];
    this.char = "\0";
    this.workingTokenIndex = 0;
    this.quoteState = "";
    this.hangingEscape = false;
    this.lastWasWhitespace = true;
  }

  /**
   * @description Resets the state of the parser. All state related fields are reinitialized to their start values.
   */
  private reset(): void {
    // Set each state variable to it's initial value.
    this.tokens = [];
    this.char = "\0";
    this.workingTokenIndex = 0;
    this.quoteState = "";
    this.hangingEscape = false;
    this.lastWasWhitespace = true;
  }

  /**
   * @description Determines whether the current character is any type of whitespace character.
   *
   * @return  true if and only if the current character is whitespace
   */
  private isWhitespace(): boolean
  {
    // Use the trim function which removes any whitespace then check if the character string is empty. If it is empty,
    // there must have been no characters besides whitespace.
    return this.char.trim() === "";
  }

  /**
   * @description Determines whether the current character is a backslash.
   *
   * @return  true if and only if the current character is a backslash
   */
  private isBackslash(): boolean
  {
    return this.char === "\\";
  }

  /**
   * @description Determines whether the current character is either a single or a double quotation mark.
   *
   * @return  true if and only if the current character is a quote
   */
  private isQuote(): boolean
  {
    return this.char === "\"" || this.char === "'";
  }

  /**
   * @description Determines whether the current quote state indicates an open single or a double quote block.
   *
   * @return  true if and only if a quote block is open
   */
  private openQuoteBlock(): boolean
  {
    return this.quoteState === "\"" || this.quoteState === "'";
  }

  private push(): boolean
  {
    if (this.tokens[this.workingTokenIndex])
      this.tokens[this.workingTokenIndex] += this.char;
    else
      this.tokens[this.workingTokenIndex] = this.char;

    return true;
  }

  /**
   * @description Increments the working token index to move to the next working token. No increment occurs if the
   *              current working token doesn't exist yet or is still empty in which case a new token is not needed.
   */
  private nextToken(): void
  {
    // Only increment the working token index if the last token exists and is not empty.
    if (this.tokens[this.workingTokenIndex])
      this.workingTokenIndex++;
  }

  private stepWhitespace(): boolean
  {
    if (this.isWhitespace())
    {
      if (this.hangingEscape || this.openQuoteBlock())
        //this.lastWasWhitespace = false;
        return false;

      // If the quote state was a recent quote block termination state it can now return to an empty quote state since
      // whitespace was seen.
      if (this.quoteState === ".")
        this.quoteState = "";

      //this.lastWasWhitespace = true;
      this.nextToken();

      return true;
    }
    else
    {
      if (this.quoteState === ".")
        throw SyntaxError("Command must contain whitespace immediately after a quote block terminates.");

      //this.lastWasWhitespace = false;
      return false;
    }
  }

  private stepEscapeStart(): boolean
  {
    if (!this.isBackslash() || this.hangingEscape)
      return false;

    this.hangingEscape = true;
    return true;
  }

  private stepHangingEscape(): boolean
  {
    if (!this.hangingEscape)
      return false;

    if (this.isQuote() || this.isBackslash())
    {
      this.push();
      this.hangingEscape = false;
      return true;
    }

    throw SyntaxError("Only a quotation mark or backslash can be escaped by a backslash in a command.");
  }

  private stepQuote(): boolean
  {
    if (!this.isQuote())
      return false;

    switch (this.quoteState)
    {
      case "":

        //if (this.lastWasWhitespace)
        //  throw SyntaxError("A command cannot start a quote block immediately after a character");

        this.quoteState = this.char as QuoteState;
        break;
      case this.char:
        this.quoteState = ".";
        break;
      case ".":
        break;
      default:
        this.push();
    }

    return true;
  }

  /**
   * @description Checks the current state to ensure that it is a proper termination state. If any state variable is not
   * in a valid state to terminate an error is thrown.
   *
   * @throws SyntaxError  if any aspect of the state is not prepared for the string to terminate
   */
  private assertTerminationState(): void
  {
    // Ensure a hanging backslash is not the last character.
    if (this.hangingEscape)
      throw SyntaxError("A command cannot end with a hanging unresolved escape.");

    // Ensure there is no open quote block.
    if (this.openQuoteBlock())
      throw SyntaxError("A command cannot end without terminating all quoted blocks.")
  }

  /**
   * @description Steps the parser on the current character and updates the state accordingly. The token array may be
   *              updated during this process.
   *
   * @throws SyntaxError  if the character generates a syntax error in the current state
   */
  private step(): void
  {
    this.stepWhitespace()
      || this.stepEscapeStart()
      || this.stepHangingEscape()
      || this.stepQuote()
      || this.push();
  }

  /**
   * @description Parses the given command string into an array of token strings.
   *
   * @param command the command string
   *
   * @return  an array containing the token strings
   *
   * @throws SyntaxError  if there is a syntax error in the command while parsing.
   */
  public parse(command: string): string[]
  {
    // Reset the state before starting to parse.
    this.reset();

    // Process the character at each index within the input string one-by-one in a linear forward-looking process.
    for (let i = 0; i < command.length; i++)
    {
      // Put the character currently in focus to into the character state.
      this.char = command.charAt(i);

      // Step the parser with the new character.
      this.step();
    }

    // Ensure the state is in a valid end configuration upon input string termination.
    this.assertTerminationState();

    // Return the accumulated token array.
    return this.tokens;
  }
}
