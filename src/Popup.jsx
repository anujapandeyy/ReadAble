import { useState } from "react";

const Popup = () => {
  const [font, setFont] = useState("");
  const [spacing, setSpacing] = useState("");
  const [bgColor, setBgColor] = useState("#ffffff"); // Default white color

  const applyChanges = () => {
    chrome.storage.sync.set({ font, spacing, bgColor }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "apply", font, spacing, bgColor });
      });
    });
  };

  const resetChanges = () => {
    chrome.storage.sync.remove(["font", "spacing", "bgColor"], () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "reset" });
      });
    });
  
    // Reset UI state
    setFont("");
    setSpacing("");
    setBgColor("#ffffff"); // Ensure a valid color
  };
  

  return (
    <div style={{ padding: "10px", width: "220px" }}>
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
  onChange={(e) => setBgColor(e.target.value || "#ffffff")} // Ensure valid color
/>


      <button onClick={applyChanges}>Apply</button>
      <button onClick={resetChanges} style={{ marginLeft: "5px" }}>Reset</button>
    </div>
  );
};

export default Popup;
