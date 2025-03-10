import { useState } from "react";

const Summarization = ({ goBack }) => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");

  const summarizeText = async () => {
    if (!text.trim()) return;

    const apiKey = "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";
    const apiUrl =
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: text }),
      });

      const result = await response.json();
      setSummary(result[0]?.summary_text || "Failed to summarize text.");
    } catch (error) {
      console.error("Summarization Error:", error);
      setSummary("Error fetching summary.");
    }
  };

  return (
    <div>
      <h2>Summarize Text</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text here..."
        rows="5"
        style={{ width: "100%" }}
      />
      <button onClick={summarizeText}>Summarize</button>

      {summary && (
        <div>
          <h3>Summary:</h3>
          <p>{summary}</p>
        </div>
      )}

      <button onClick={goBack} style={{ marginTop: "10px" }}>
        Back
      </button>
    </div>
  );
};

export default Summarization;
