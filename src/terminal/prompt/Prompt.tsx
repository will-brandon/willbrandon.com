/**
 * @file  Prompt.tsx
 *
 * @filetype  XML-Friendly Typescript
 * @author    Will Brandon
 * @created   July 24, 2023
 *
 * @description Defines the functional component for a Linux terminal prompt.
 */

import {ReactElement, useEffect, useRef} from 'react';
import './Prompt.css';
import PromptMessage from "./PromptMessage";
import {ShellLogin} from "../shell/Shell";

/**
 * @description Defines the properties that must be provided to a terminal prompt component.
 */
interface PromptProps
{
  /**
   * @description Contains the user and host login details.
   */
  login: ShellLogin;

  /**
   * @description An optional function that handles a command when the user submits the input.
   */
  onExec?: (command: string) => void;

  /**
   * @description An optional boolean determining whether the prompt hogs input focus. If no value is specified true is
   *              assumed.
   */
  hogFocus?: boolean;
}

/**
 * @description Functional component for a Linux terminal prompt.
 *
 * @param props the properties that must be provided
 *
 * @return  the rendered React element for the terminal prompt
 */
const Prompt = (props: PromptProps): ReactElement => {

  // Create a reference to the input element.
  const inputRef = useRef<HTMLInputElement>(null);

  // Implement functionality to handle when the component mounts (defined in function body) and the UI unmounts (defined
  // in returned function body).
  useEffect((): (() => void) => {

    // Acquire the current rendered text input element from the reference.
    const currentInput = inputRef.current!;

    /**
     * @description Resizes the current input element to fit the text it contains with no extra trailing space. When the
     *              input is empty one character of space is preserved because it makes debugging easier if the input
     *              does not have a width of 0.
     */
    function fitInputToText(): void
    {
      // Set the input's size to be the length of its content, but no less than 1.
      currentInput.size = Math.max(currentInput.value.length, 1);
    }

    /**
     * @description Gives the current input element user input focus if the hog focus configuration is enabled.
     */
    function focusInput(): void
    {
      // If the hog focus property is undefined, treat it as true by default.
      if (props.hogFocus === undefined || props.hogFocus)
      {
        currentInput.focus();
      }
    }

    /**
     * @description Handles the keydown events that occur on the current input.
     *
     * @param event an object representing the keyboard event
     */
    function onInputKeyDown(event: KeyboardEvent): void
    {
      // If the enter key is pressed execute the current command.
      if (event.key === "Enter")
      {
        // If the execution function exits, call it with the current input value.
        if (props.onExec)
        {
          props.onExec(currentInput.value);
        }

        // Clear the input value and resize it appropriately.
        currentInput.value = "";
        fitInputToText();
      }
    }

    /**
     * @description`Adds input listeners to the current input.
     */
    function initInputEventListeners(): void
    {
      // Delegate to a key down handler to handle the event.
      currentInput.addEventListener("keydown", onInputKeyDown);

      // If focus is ever lost, immediately regain it.
      currentInput.addEventListener("focusout", focusInput);

      // When the input value changes resize the input to the value.
      currentInput.addEventListener("input", fitInputToText);
    }

    /**
     * @description Removes the input listeners from the current input.
     */
    function deinitInputEventListeners(): void
    {
      // Remove all 3 input listeners.
      currentInput.removeEventListener("keydown", onInputKeyDown);
      currentInput.removeEventListener("focusout", focusInput);
      currentInput.removeEventListener("input", fitInputToText);
    }

    // When the element component renders create the event listeners, make the input the proper size, and give the input
    // focus.
    initInputEventListeners();
    fitInputToText();
    focusInput();

    // Return the event listener cleanup function so that it gets called when the component unmounts.
    return deinitInputEventListeners;

  }, [props]);

  // Render the terminal prompt message and input. Ensure the input element has no automatic correction or
  // capitalization and no spell check.
  return (
    <div className="terminal-prompt">
      <PromptMessage login={props.login} />
      <input
        ref={inputRef}
        type="text"
        autoCorrect="false"
        autoCapitalize="none"
        spellCheck="false"
      ></input>
    </div>
  );
}

export default Prompt;
