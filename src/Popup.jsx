import { useState, useEffect } from "react";
import Summarization from "./components/Summarization";
import TextToSpeech from "./components/TextToSpeech";
import WordReversalTest from "./components/WordReversalTest";
import ConfusableLetterTest, { getConfusableLetterScore } from "./components/ConfusableLetterTest";
import ReadingTest from "./components/ReadingTest";

const Popup = () => {
  const [font, setFont] = useState("OpenDyslexic");
  const [spacing, setSpacing] = useState(1);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000000");
  const [wordReversalScore, setWordReversalScore] = useState(50);
  const [confusableLetterScore, setConfusableLetterScore] = useState(50);
  const [readingScore, setReadingScore] = useState(50);
  const [severity, setSeverity] = useState(50);
  const [screen, setScreen] = useState("main");

  const applyChanges = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = new URL(tabs[0].url);
      const domain = url.hostname; // Get the domain name
  
      chrome.storage.sync.set({ [domain]: { font, spacing, bgColor, textColor } }, () => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "apply",
          font,
          spacing,
          bgColor,
          textColor,
        });
      });
    });
  };
  
  const resetChanges = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = new URL(tabs[0].url);
      const domain = url.hostname;
  
      chrome.storage.sync.remove(domain, () => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "reset" });
      });
    });
  
    setFont("OpenDyslexic");
    setSpacing(1);
    setBgColor("#ffffff");
    setTextColor("#000000");
  };

  useEffect(() => {
    chrome.storage.local.get(["wordReversalScore", "confusableLetterScore","readingScore"], (data) => {
      const wordScore = data.wordReversalScore || 50;
      const letterScore = getConfusableLetterScore();
      const readScore = getReadingScore(); 
      setWordReversalScore(wordScore);
      setConfusableLetterScore(letterScore);
      setReadingScore(readScore);

      const combinedSeverity = Math.min((wordScore + letterScore + readScore) / 3, 100);
      setSeverity(combinedSeverity);
    });
  }, []);

  const updateWordReversalScore = (newScore) => {
    setWordReversalScore(newScore);
    chrome.storage.local.set({ wordReversalScore: newScore });

    setSeverity(Math.min((newScore + confusableLetterScore) / 2, 100));
  };

  const updateConfusableLetterScore = (newScore) => {
    setConfusableLetterScore(newScore);
    chrome.storage.local.set({ confusableLetterScore: newScore });

    setSeverity(Math.min((wordReversalScore + newScore) / 2, 100));
  };

  if (screen === "summarization") {
    return <Summarization goBack={() => setScreen("main")} />;
  }

  if (screen === "textToSpeech") {
    return <TextToSpeech goBack={() => setScreen("main")} />;
  }

  if (screen === "wordReversalTest") {
    return <WordReversalTest goBack={() => setScreen("main")} updateSeverity={updateWordReversalScore} />;
  }

  if (screen === "confusableLetterTest") {
    return <ConfusableLetterTest goBack={() => setScreen("main")} onTestComplete={updateConfusableLetterScore} />;
  }

  if (screen === "readingTest") {
    return <ReadingTest goBack={() => setScreen("main")} onTestComplete={updateConfusableLetterScore} />;
  }

  return (
    <div style={{ padding: "15px", width: "250px", fontFamily: "Arial" }}>
      <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>Readable</h2>

      <label>Font:</label>
      <select
        value={font}
        onChange={(e) => setFont(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      >
        <option value="Arial">Arial</option>
        <option value="Comic Sans MS">Comic Sans</option>
        <option value="OpenDyslexic">OpenDyslexic</option>
      </select>

      <label>Letter Spacing ({spacing}px):</label>
      <input
        type="range"
        min="0"
        max="5"
        step="0.5"
        value={spacing}
        onChange={(e) => setSpacing(e.target.value)}
        style={{ width: "100%" }}
      />

      <label>Background Color:</label>
      <input
        type="color"
        value={bgColor}
        onChange={(e) => setBgColor(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <label>Text Color:</label>
      <input
        type="color"
        value={textColor}
        onChange={(e) => setTextColor(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <h4>Preview</h4>
      <div
        style={{
          padding: "10px",
          backgroundColor: bgColor,
          color: textColor,
          fontFamily: font,
          letterSpacing: `${spacing}px`,
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      >
        This is a preview of how text will appear with your selected settings.
      </div>

      <button onClick={() => applyChanges()} style={{ width: "100%", marginTop: "10px" }}>
        Apply
      </button>
      <button onClick={() => resetChanges()} style={{ width: "100%", marginTop: "5px" }}>
        Reset
      </button>

      <hr />

      <button onClick={() => setScreen("summarization")}>Summarize Text</button>
      <button onClick={() => setScreen("textToSpeech")} style={{ marginLeft: "5px" }}>
        Text to Speech
      </button>

      <hr />

      <h4>Dyslexia Tests</h4>
      <button onClick={() => setScreen("wordReversalTest")} style={{ width: "100%", marginTop: "10px" }}>
        Start Word Reversal Test
      </button>
      <button onClick={() => setScreen("confusableLetterTest")} style={{ width: "100%", marginTop: "5px" }}>
        Start Confusable Letter Test
      </button>
      <button onClick={() => setScreen("readingTest")} style={{ width: "100%", marginTop: "5px" }}>
        Start Reading Test
      </button>

      <hr />
      <h4>Test Scores:</h4>
      <p>🌀 <b>Word Reversal Score:</b> {wordReversalScore}</p>
      <p>🔠 <b>Confusable Letter Score:</b> {confusableLetterScore}</p>
      <p>🔠 <b>Reading Score:</b> {readingScore}</p>
      <h4>🚀 Combined Severity Score: {severity}</h4>
    </div>
  );
};

export default Popup;