import { createRef, FormEvent } from 'react';
import './App.css';

function App() {
  const fileRef = createRef<HTMLInputElement>();
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentFile = fileRef.current?.files?.item(0);

    if (!currentFile) {
      alert("You didn't put in a file...");
      return;
    }
    const fileIsValid = checkType(currentFile as File);
    if (!fileIsValid) {
      alert('You put in the wrong type of file');
      return;
    }

    const reader = new FileReader();
    reader.readAsText(currentFile);
    reader.onload = () => console.log(reader.result);
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
    </div>
  );
}

export default App;
