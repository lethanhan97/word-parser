import React, { createRef, FormEvent, Fragment, useState } from 'react';
import './App.css';

function ResultDisplay({ result }: { result: Result }) {
  const keys = Object.keys(result);
  return (
    <article>
      {keys.map((key) => (
        <p key={key}>
          <b>{key.toUpperCase()}</b> Count: {result[key]}
        </p>
      ))}
    </article>
  );
}

function App() {
  const fileRef = createRef<HTMLInputElement>();
  const [result, setResult] = useState({} as Result);
  const [textDisplay, setTextDisplay] = useState(['No data'] as string[]);
  const [validLetters, setValidLetters] = useState(['e', 't', 'h']);
  const [rawInput, setRawInput] = useState('e,t,h' as string | undefined);
  const [inputIsValid, setInputIsValid] = useState(true);
  const [displayProcessingResult, setDisplayProcessingResult] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentFile = fileRef.current?.files?.item(0);

    if (!currentFile) {
      alert("You didn't put in a file...");
      return;
    }

    const fileIsValid = checkType(currentFile);
    if (!fileIsValid) {
      alert('You put in the wrong type of file');
      return;
    }

    const reader = new FileReader();
    reader.readAsText(currentFile);
    reader.onload = () => {
      if (!!reader.result) {
        handleTextDisplay(reader.result as string);
        handleTextCount(reader.result as string); // will never be ArrayBuffer because we only acept txt file
      }
    };
  };

  const handleTextDisplay = (text: string) => {
    if (!inputIsValid) {
      setTextDisplay(['Invalid Input']);
      return;
    }

    const textArr = text.split('\n');
    setTextDisplay(textArr);
  };

  const handleTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    const textArr = text.split(',');
    const formattedArr = [] as string[];
    let inputIsValid = true;
    setRawInput(text);

    textArr.forEach((text) => {
      const formattedText = text.toLowerCase().trim();
      if (formattedText.length !== 1) {
        inputIsValid = false;
      }

      formattedArr.push(formattedText);
    });
    setValidLetters(formattedArr);
    setInputIsValid(inputIsValid);
  };

  const handleTextCount = (text: string) => {
    if (!inputIsValid) {
      setDisplayProcessingResult(false);
      return;
    }

    const textArr = text.split('\n');
    const initialResult = validLetters.reduce((agg, key) => {
      agg[key] = 0;
      return agg;
    }, {} as Result);

    const result = textArr.reduce((agg, line) => {
      const trimmedLine = line.trim();
      const lastChar = trimmedLine.charAt(trimmedLine.length - 1).toLowerCase();
      const isValidLine = validLetters.includes(lastChar);

      if (isValidLine) {
        agg[lastChar] = agg[lastChar] + 1;
      }

      return agg;
    }, initialResult);

    setResult(result);
    setDisplayProcessingResult(true);
  };

  const checkType = (file: File) => {
    const allowedTypes = ['text/plain'];
    const currentType = file.type;

    return allowedTypes.includes(currentType);
  };

  return (
    <div className="app-wrapper">
      <header>
        <h1>Letter Counter</h1>
      </header>

      <p>
        Input the letters you want to see ending count in the text box below,
        delimited by comma. Do note that if the input is NOT a letter, the
        program will NOT run for you. Duplicate letters will be ignored. No
        trailing comma is allowed
      </p>

      <p>
        E.g:
        <br></br>
        a, b, c will work
        <br></br>
        a, bc, d will not work
        <br></br>
        a, b, c, will NOT work
      </p>

      <form onSubmit={onSubmit}>
        <header>
          <h2>Input</h2>
        </header>
        <input
          type="text"
          value={rawInput}
          placeholder="e.g e,t,h"
          onChange={handleTextInput}
          className="text-input"
        ></input>
        <label style={{ color: inputIsValid ? 'green' : 'red' }}>
          {inputIsValid ? 'Valid' : 'Invalid'} input
        </label>
        <br></br>
        <input type="file" id="myfile" name="myfile" ref={fileRef}></input>
        <button type="submit">Submit</button>
      </form>

      <section>
        <header>
          <h2>Processing Result</h2>
        </header>
        {displayProcessingResult ? (
          <ResultDisplay result={result}></ResultDisplay>
        ) : (
          <div>No result to show.</div>
        )}
      </section>

      <section>
        <header>
          <h2>File Data</h2>
        </header>

        <p>
          {textDisplay.map((line, i) => {
            return (
              <Fragment key={i}>
                {line} <br></br>
              </Fragment>
            );
          })}
        </p>
      </section>
    </div>
  );
}

interface Result {
  [letter: string]: number;
}

export default App;
