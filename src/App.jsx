import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <div>
        <textarea 
         placeholder="Paste text here"
         cols={50}
         rows={10}
        
        />
      </div>
      <div>
        <button>
          Summarize
        </button>
      </div>
    </div>
  );
}

export default App;
