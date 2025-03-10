import { useState } from "react";

const WordReversalTest = ({ goBack, updateSeverity }) => {
  const words = ["apple", "banana", "cherry", "grape", "orange"];
  const reversedWords = words.map(word => word.split("").reverse().join(""));

  const [testStarted, setTestStarted] = useState(false);
  const [scrambledWord, setScrambledWord] = useState("");
  const [correctWord, setCorrectWord] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [severityScore, setSeverityScore] = useState(50); // Default severity

  const startTest = () => {
    setTestStarted(true);
    let index = Math.floor(Math.random() * words.length);
    setCorrectWord(words[index]);
    setScrambledWord(reversedWords[index]);
    setStartTime(Date.now());
  };

  const checkAnswer = (selected) => {
    let endTime = Date.now();
    let reactionTime = (endTime - startTime) / 1000;

    let isCorrect = selected === correctWord;
    alert(isCorrect ? `✅ Correct! Time: ${reactionTime}s` : `❌ Wrong! It was ${correctWord}`);

    let score = isCorrect ? Math.max(0, 10 - reactionTime) * 10 : 0;

    // Adjust severity score
    let newSeverityScore = severityScore + (isCorrect ? -5 : 10);
    setSeverityScore(newSeverityScore);
    
    // Save to Chrome Storage
    chrome.storage.local.set({ wordReversalScore: newSeverityScore });

    // Pass updated severity to parent
    updateSeverity(newSeverityScore);
  };

  return (
    <div>
      <h2>Word Reversal Test</h2>
      {!testStarted ? (
        <button onClick={startTest}>Start Test</button>
      ) : (
        <div>
          <p>Identify this word: {scrambledWord}</p>
          {words.sort(() => Math.random() - 0.5).map(option => (
            <button key={option} onClick={() => checkAnswer(option)}>
              {option}
            </button>
          ))}
        </div>
      )}
      <p>Current Severity Score: <strong>{severityScore}</strong></p>
      <button onClick={goBack}>Go Back</button>
    </div>
  );
};

export default WordReversalTest;
