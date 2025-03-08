import { useState } from "react";

const Popup = () => {
  const [font, setFont] = useState("OpenDyslexic");
  const [spacing, setSpacing] = useState(1);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000000");

  const applyChanges = () => {
    chrome.storage.sync.set({ font, spacing, bgColor, textColor }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "apply", font, spacing, bgColor, textColor });
      });
    });
  };

  const resetChanges = () => {
    chrome.storage.sync.remove(["font", "spacing", "bgColor", "textColor"], () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "reset" });
      });
    });
    setFont("OpenDyslexic");
    setSpacing(1);
    setBgColor("#ffffff");
    setTextColor("#000000");
  };

  return (
    <div style={{ padding: "15px", width: "250px", fontFamily: "Arial" }}>
      <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>Readable</h2>
      
      <label>Font:</label>
      <select value={font} onChange={(e) => setFont(e.target.value)} style={{ width: "100%", marginBottom: "10px" }}>
        <option value="Arial">Arial</option>
        <option value="Comic Sans MS">Comic Sans</option>
        <option value="OpenDyslexic">OpenDyslexic</option>
      </select>

      <label>Letter Spacing ({spacing}px):</label>
      <input type="range" min="0" max="5" step="0.5" value={spacing} onChange={(e) => setSpacing(e.target.value)} style={{ width: "100%" }} />
      
      <label>Background Color:</label>
      <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />
      
      <label>Text Color:</label>
      <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} style={{ width: "100%", marginBottom: "10px" }} />

      <h4>Preview</h4>
      <div style={{ padding: "10px", backgroundColor: bgColor, color: textColor, fontFamily: font, letterSpacing: `${spacing}px`, border: "1px solid #ccc", borderRadius: "5px" }}>
        This is a preview of how text will appear with your selected settings.
      </div>
      
      <button onClick={applyChanges} style={{ width: "100%", marginTop: "10px" }}>Apply</button>
      <button onClick={resetChanges} style={{ width: "100%", marginTop: "5px" }}>Reset</button>
    </div>
  );
};

export default Popup;