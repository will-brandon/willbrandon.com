/**
 * @file  Prompt.tsx
 *
 * @filetype  XML-Friendly Typescript
 * @author    Will Brandon
 * @created   July 21, 2023
 *
 * @fileOverview  Defines a React component that renders a terminal prompt.
 */

import React, { ReactElement, useEffect, useRef } from 'react';
import './Prompt.css';

type SubmitFunction = (command: string) => void;

interface PromptProps
{
  user: string;
  host: string;
  onExec?: SubmitFunction;
}

/**
 * Component that renders a terminal prompt.
 */
function Prompt(props: PromptProps): ReactElement
{
  const inputRef = useRef<HTMLInputElement>(null);

  function resizeInput(): void
  {
    const currentInput = inputRef.current!
    currentInput.size = Math.max(currentInput.value.length, 1);
  }

  function focusInput(): void
  {
    inputRef.current!.focus();
  }

  function inputKeydown(event: KeyboardEvent): void
  {
    const currentInput = inputRef.current!

    if (event.key === "Enter")
    {
      if (props.onExec)
      {
        props.onExec(currentInput.value);
      }

      currentInput.value = "";
    }
  }

  function initInputListeners(): void
  {
    const currentInput = inputRef.current!
    currentInput.addEventListener("focusout", focusInput);
    currentInput.addEventListener("keydown", inputKeydown);
  }

  useEffect(() => {
    resizeInput();
    focusInput();
    initInputListeners();
  }, []);

  return (
    <div className="terminal-prompt">
      <div className="message">
        <pre className="user">{props.user}</pre>
        <pre>@</pre>
        <pre className="host">{props.host}</pre>
        <pre>$ </pre>
      </div>
      <input type="text" ref={inputRef} onChange={resizeInput}></input>
    </div>
  );
}

export default Prompt;
