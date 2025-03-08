import { useState } from "react";

const TextToSpeech = ({ goBack }) => {
  const [text, setText] = useState("");

  const speakText = () => {
    if (!text.trim()) return;
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  return (
    <div>
      <h2>Text to Speech</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text here..."
        rows="5"
        style={{ width: "100%" }}
      />
      <button onClick={speakText}>Speak</button>

      <button onClick={goBack} style={{ marginTop: "10px" }}>
        Back
      </button>
    </div>
  );
};

export default TextToSpeech;
