import { createRef, FormEvent, useState } from 'react';
import './App.css';

function Result({ result }: { result: Result }) {
  const keys = Object.keys(result);
  return (
    <article>
      {keys.map((key) => (
        <p>
          {key.toUpperCase()} Count: {result[key]}
        </p>
      ))}
    </article>
  );
}

function App() {
  const fileRef = createRef<HTMLInputElement>();
  const [result, setResult] = useState({} as Result);

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
        handleTextCount(reader.result as string); // will never be ArrayBuffer because we only acept txt file
      }
    };
  };

  const handleTextCount = (text: string) => {
    const textArr = text.split('\n');
    const selectedChar = ['e', 't', 'h'];

    const result = textArr.reduce((agg, line) => {
      const trimmedLine = line.trim();
      const lastChar = trimmedLine.charAt(trimmedLine.length - 1).toLowerCase();
      const isValidLine = selectedChar.includes(lastChar);

      if (isValidLine) {
        if (!!agg[lastChar]) {
          // if key exists
          agg[lastChar] = agg[lastChar] + 1;
        } else {
          agg[lastChar] = 1;
        }
      }

      return agg;
    }, {} as Result);

    setResult(result);
    console.log('result', result);
  };

  const checkType = (file: File) => {
    const allowedTypes = ['text/plain'];
    const currentType = file.type;

    return allowedTypes.includes(currentType);
  };

  return (
    <div className="App">
      <form onSubmit={onSubmit}>
        <input type="file" id="myfile" name="myfile" ref={fileRef}></input>
        <button type="submit">Submit</button>
      </form>
      <Result result={result}></Result>
    </div>
  );
}

interface Result {
  [letter: string]: number;
}

export default App;
