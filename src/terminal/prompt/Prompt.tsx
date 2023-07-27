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

/**
 * @description Defines the properties that must be provided to a terminal prompt component.
 */
interface PromptProps
{
  /**
   * @description The user currently logged in.
   */
  user: string;

  /**
   * @description The name of the host.
   */
  host: string;

  /**
   * @description An optional function that handles a command when the user submits the input.
   */
  onExec?: (command: string) => void;
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

  useEffect((): void => {

    /**
     * @description Resizes the current input element to fit the text it contains with no extra trailing space. When the
     *              input is empty one character of space is preserved because it makes debugging easier if the input does
     *              not have a width of 0.
     */
    function fitInputToText(): void
    {
      // Obtain the current input element from the reference.
      const currentInput = inputRef.current!;

      // Set the input's size to be the length of its content, but no less than 1.
      currentInput.size = Math.max(currentInput.value.length, 1);
    }

    /**
     * @description Gives the current input element user input focus.
     */
    function focusInput(): void
    {
      inputRef.current!.focus();
    }

    function onInputKeyDown(event: KeyboardEvent): void
    {
      // Obtain the current input element from the reference.
      const currentInput = inputRef.current!;

      if (event.key === "Enter")
      {
        if (props.onExec)
        {
          props.onExec(currentInput.value);
        }

        currentInput.value = "";
        fitInputToText();
      }
    }

    function initInputEventListeners(): void
    {
      // Obtain the current input element from the reference.
      const currentInput = inputRef.current!;

      // Delegate to a key down handler to handle the event.
      currentInput.addEventListener("keydown", onInputKeyDown);

      // If focus is ever lost, immediately regain it.
      currentInput.addEventListener("focusout", focusInput);

      currentInput.addEventListener("input", fitInputToText);
    }

    initInputEventListeners();
    fitInputToText();
    focusInput();

  }, [props]);

  // Render the terminal prompt message and input.
  return (
    <div className="terminal-prompt">
      <PromptMessage user={props.user} host={props.host} />
      <input type="text" ref={inputRef}></input>
    </div>
  );
}

export default Prompt;
