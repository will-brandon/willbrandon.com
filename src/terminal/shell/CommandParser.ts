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
type ParserQuoteState = "" | "\"" | "'" | ".";

/**
 * @description Contains all information about the current state of the parser.
 */
interface ParserState
{
  /**
   * @description An array of tokens that will be accumulated.
   */
  tokens: string[];

  /**
   * @description The current character being analyzed. It is encoded as a string because Typescript doesn't have a
   *              character type however its length should always be 1 when the parser steps.
   */
  char: string;

  /**
   * @description Indicates the index of the token currently being worked on within the array.
   */
  workingTokenIndex: number;

  /**
   * @description Indicates the current quote state.
   */
  quoteState: ParserQuoteState;

  /**
   * @description Indicates whether an escaping backslash was encountered so the following character should be escaped.
   */
  hangingEscape: boolean;

  /**
   * @description Indicates whether the last character processed was whitespace.
   */
  lastWasWhitespace: boolean;
}

/**
 * @description Defines the initial parser state.
 */
const INITIAL_STATE = {
  tokens: [],
  char: "\0",
  workingTokenIndex: 0,
  quoteState: "",
  hangingEscape: false,
  lastWasWhitespace: true
} as ParserState;

/**
 * @description Parses command strings into tokens. The parser is forward-looking meaning that it steps forward though
 *              each character in a linear format without ever looking backward at previously encountered characters.
 *              The parser works like a state machine that resets and starts fresh for each input string.
 */
export default class CommandParser
{
  /**
   * @description Contains all information about the current state of the parser.
   */
  private state: ParserState;

  /**
   * @description When enabled the state object is displayed at the start of the parse and after each step.
   */
  private debugLogStates: boolean;

  /**
   * @description Creates a new command parser.
   *
   * @param debugLogStates  when enabled the state object is displayed at the start of the parse and after each step
   */
  public constructor(debugLogStates = false)
  {
    // Each time the parser begins parsing the state is reset. The state values are initialized in the constructor
    // simply for type compliance so that they do not have to be optional types.
    this.state = INITIAL_STATE;

    // Set the debug option.
    this.debugLogStates = debugLogStates;
  }

  /**
   * @description Resets the state of the parser. All state related fields are reinitialized to their start values.
   */
  private reset(): void
  {
    // Set each state variable to it's initial value (stored in initial state constant).
    this.state = INITIAL_STATE;
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
    return this.state.char.trim() === "";
  }

  /**
   * @description Determines whether the current character is a backslash.
   *
   * @return  true if and only if the current character is a backslash
   */
  private isBackslash(): boolean
  {
    return this.state.char === "\\";
  }

  /**
   * @description Determines whether the current character is either a single or a double quotation mark.
   *
   * @return  true if and only if the current character is a quote
   */
  private isQuote(): boolean
  {
    return this.state.char === "\"" || this.state.char === "'";
  }

  /**
   * @description Determines whether the current quote state indicates an open single or a double quote block.
   *
   * @return  true if and only if a quote block is open
   */
  private openQuoteBlock(): boolean
  {
    return this.state.quoteState === "\"" || this.state.quoteState === "'";
  }

  /**
   * @description Appends the current character to the end of the current working token. If the current working token
   *              has not yet been created, create it with the current character as its initial value. Optionally an
   *              empty value can be pumped into the token as well which does nothing if the current token already has a
   *              value, but it initializes the token to an empty string if it does not already exist.
   *
   * @param empty whether an empty string should be pushed instead of the current character
   *
   * @return  false under all circumstances so that this function can be used as a bypass in 'or' short-circuit chaining
   */
  private push(empty: boolean = false): boolean
  {
    // If the token already exists and is not empty append the current character. An empty string could simply be
    // ignored.
    if (this.state.tokens[this.state.workingTokenIndex])
    {
      this.state.tokens[this.state.workingTokenIndex] += this.state.char;
    }
    else
    {
      // If the token does not exist in the array or is an empty string, set the current working token to the current
      // character or an empty string
      this.state.tokens[this.state.workingTokenIndex] = empty ? "" : this.state.char;
    }

    // Return false to function as an 'or' short-circuiting bypass.
    return false;
  }

  /**
   * @description Increments the working token index to move to the next working token. No increment occurs if the
   *              current working token doesn't exist yet or is still empty in which case a new token is not needed.
   */
  private nextToken(): void
  {
    // Only increment the working token index if the last token exists (it is okay if it is empty).
    if (this.state.tokens[this.state.workingTokenIndex] !== undefined)
      this.state.workingTokenIndex++;
  }

  private stepWhitespace(): boolean
  {
    if (this.isWhitespace())
    {
      if (this.state.hangingEscape || this.openQuoteBlock())
        return false;

      // If the quote state was a recent quote block termination state it can now return to an empty quote state since
      // whitespace was seen.
      if (this.state.quoteState === ".")
        this.state.quoteState = "";

      this.nextToken();

      this.state.lastWasWhitespace = true;
      return true;
    }
    else
    {
      if (this.state.quoteState === ".")
        throw SyntaxError("Command must contain whitespace immediately after a quote block terminates.");

      return false;
    }
  }

  private stepEscapeStart(): boolean
  {
    if (!this.isBackslash() || this.state.hangingEscape)
      return false;

    this.state.hangingEscape = true;
    return true;
  }

  private stepHangingEscape(): boolean
  {
    if (!this.state.hangingEscape)
      return false;

    if (this.isQuote() || this.isBackslash())
    {
      this.push();
      this.state.hangingEscape = false;
      return true;
    }

    throw SyntaxError("Only a quotation mark or backslash can be escaped by a backslash in a command.");
  }

  private stepQuote(): boolean
  {
    if (!this.isQuote())
      return false;

    switch (this.state.quoteState)
    {
      case "":

        if (!this.state.lastWasWhitespace)
          throw SyntaxError("A command cannot start a quote block immediately after a character.");

        this.state.quoteState = this.state.char as ParserQuoteState;
        break;

      case this.state.char:
        this.push(true);
        this.state.quoteState = ".";
        break;

      case ".":
        break;

      default:
        this.push();
    }

    return true;
  }

  private conclude(): boolean
  {
    this.state.lastWasWhitespace = false;
    return false;
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
    if (this.state.hangingEscape)
      throw SyntaxError("A command cannot end with a hanging unresolved escape.");

    // Ensure there is no open quote block.
    if (this.openQuoteBlock())
      throw SyntaxError("A command cannot end without terminating all quoted blocks.");
  }

  /**
   * @description Steps the parser on the current character and updates the state accordingly. The token array may be
   *              updated during this process.
   *
   * @throws SyntaxError  if the character generates a syntax error in the current state
   */
  private step(): void
  {
    // 'Or' short-circuiting is used to create a waterfall of calls until the first function returns true indicating
    // that the character at this step was completely handled and no more checks are needed. The order of these
    // functions is crucial as the commutative result of the boolean expression is discarded, the true importance is the
    // cascade of calls to check different properties of the character. Refer to the documentation for each function to
    // understand a comprehensive description of what each check is looking for.
    this.stepWhitespace()
      || this.stepEscapeStart()
      || this.stepHangingEscape()
      || this.stepQuote()
      || this.push()
      || this.conclude();
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

    // If debug logging is enabled log the initial state to the console.
    if (this.debugLogStates)
      console.log(this.state);

    // Process the character at each index within the input string one-by-one in a linear forward-looking process.
    for (let i = 0; i < command.length; i++)
    {
      // Put the character currently in focus to into the character state.
      this.state.char = command.charAt(i);

      // Step the parser with the new character.
      this.step();

      // If debug logging is enabled log each state to the console.
      if (this.debugLogStates)
        console.log(this.state);
    }

    // Ensure the state is in a valid end configuration upon input string termination.
    this.assertTerminationState();

    // Return the accumulated token array.
    return this.state.tokens;
  }
}
