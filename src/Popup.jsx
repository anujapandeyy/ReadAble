import { useState } from "react";
import Summarization from "./components/Summarization";
import TextToSpeech from "./components/TextToSpeech";

const Popup = () => {
  const [screen, setScreen] = useState("main");
  const [font, setFont] = useState("");
  const [spacing, setSpacing] = useState("");
  const [bgColor, setBgColor] = useState("#ffffff");

  const applyChanges = () => {
    chrome.storage.sync.set({ font, spacing, bgColor }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "apply",
          font,
          spacing,
          bgColor,
        });
      });
    });
  };

  const resetChanges = () => {
    chrome.storage.sync.remove(["font", "spacing", "bgColor"], () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "reset" });
      });
    });
    setFont("");
    setSpacing("");
    setBgColor("#ffffff");
  };

  return (
    <div style={{ padding: "10px", width: "250px" }}>
      {screen === "main" ? (
        <>
          <h2>Dyslexia Helper</h2>

          <label>Font:</label>
          <select value={font} onChange={(e) => setFont(e.target.value)}>
            <option value="">Default</option>
            <option value="Arial">Arial</option>
            <option value="Comic Sans MS">Comic Sans</option>
            <option value="OpenDyslexic">OpenDyslexic</option>
          </select>

          <label>Letter Spacing (px):</label>
          <input
            type="number"
            value={spacing}
            onChange={(e) => setSpacing(e.target.value)}
          />

          <label>Background Color:</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value || "#ffffff")}
          />

          <button onClick={applyChanges}>Apply</button>
          <button onClick={resetChanges} style={{ marginLeft: "5px" }}>
            Reset
          </button>

          <hr />

          {/* Navigation Buttons */}
          <button onClick={() => setScreen("summarization")}>
            Summarize Text
          </button>
          <button
            onClick={() => setScreen("textToSpeech")}
            style={{ marginLeft: "5px" }}
          >
            Text to Speech
          </button>
        </>
      ) : screen === "summarization" ? (
        <Summarization goBack={() => setScreen("main")} />
      ) : (
        <TextToSpeech goBack={() => setScreen("main")} />
      )}
    </div>
  );
};

export default Popup;
