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
export default class CommandParser
{
  /**
   * @description An array of tokens that will be accumulated.
   */
  private tokens: string[];

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
   * @description Creates a new command parser.
   */
  public constructor()
  {
    // Each time the parser begins parsing the state is reset. The state values are initialized in the constructor
    // simply for type compliance so that they do not have to be optional types.
    this.tokens = [];
    this.workingTokenIndex = 0;
    this.quoteState = "";
    this.hangingEscape = false;
  }

  /**
   * @description Resets the state of the parser. All state related fields are reinitialized to their start values.
   */
  private reset(): void
  {
    // Set each state variable to it's initial value.
    this.tokens = [];
    this.workingTokenIndex = 0;
    this.quoteState = "";
    this.hangingEscape = false;
  }

  /**
   * @description Accepts the next character in the input string and updates the state accordingly. The token array will
   *              be updated during this process.
   *
   * @param char  the character to process (encoded as a string because Typescript doesn't have a character type).
   *
   * @throws SyntaxError if the character generates a syntax error in the current state
   */
  private acceptChar(char: string): void
  {
    this.tokens.push(char);
  }

  /**
   * @description Parses the given command string into an array of token strings.
   *
   * @param command the command string
   *
   * @return  an array containing the token strings
   *
   * @throws SyntaxError if there is a syntax error in the command while parsing.
   */
  public parse(command: string): string[]
  {
    // Reset the state before starting to parse.
    this.reset();

    // Process the character at each index within the input string one-by-one in a linear forward-looking process.
    for (let i = 0; i < command.length; i++)
    {
      // Insert the character currently in focus to the character accepted function.
      this.acceptChar(command.charAt(i));
    }

    // Return the accumulated token array.
    return this.tokens;
  }
}
