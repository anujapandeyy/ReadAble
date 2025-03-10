import { useState } from "react";

const WordReversalTest = ({ goBack, updateSeverity }) => {
  const words = ["apple", "banana", "cherry", "grape", "orange", "mango", "peach", "melon", "berry", "plum"];
  const reversedWords = words.map(word => word.split("").reverse().join(""));

  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scrambledWord, setScrambledWord] = useState("");
  const [correctWord, setCorrectWord] = useState("");
  const [options, setOptions] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [severityScore, setSeverityScore] = useState(50); // Default severity
  const [completed, setCompleted] = useState(false);

  const startTest = () => {
    setTestStarted(true);
    setCurrentQuestion(0);
    generateQuestion(0);
  };

  const generateQuestion = (index) => {
    if (index >= 5) {
      setCompleted(true);
      return;
    }

    let wordIndex = Math.floor(Math.random() * words.length);
    let correct = words[wordIndex];
    let scrambled = reversedWords[wordIndex];

    let shuffledOptions = [...words]
      .filter(w => w !== correct)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    shuffledOptions.push(correct);
    shuffledOptions.sort(() => Math.random() - 0.5);

    setCorrectWord(correct);
    setScrambledWord(scrambled);
    setOptions(shuffledOptions);
    setStartTime(Date.now());
  };

  const checkAnswer = (selected) => {
    let endTime = Date.now();
    let reactionTime = (endTime - startTime) / 1000;

    let isCorrect = selected === correctWord;
    alert(isCorrect ? `✅ Correct! Time: ${reactionTime}s` : `❌ Wrong! It was ${correctWord}`);

    let score = isCorrect ? Math.max(0, 10 - reactionTime) * 10 : 0;

    let newSeverityScore = severityScore + (isCorrect ? -5 : 10);
    setSeverityScore(newSeverityScore);
    chrome.storage.local.set({ wordReversalScore: newSeverityScore });
    updateSeverity(newSeverityScore);

    if (currentQuestion < 4) {
      setCurrentQuestion(prev => prev + 1);
      generateQuestion(currentQuestion + 1);
    } else {
      setCompleted(true);
    }
  };

  return (
    <div>
      <h2>Word Reversal Test</h2>
      {!testStarted ? (
        <button onClick={startTest}>Start Test</button>
      ) : completed ? (
        <div>
          <h3>Test Completed!</h3>
          <p>Final Severity Score: <strong>{severityScore}</strong></p>
          <button onClick={goBack}>Go Back</button>
        </div>
      ) : (
        <div>
          <p>Question {currentQuestion + 1} of 5</p>
          <p>Identify this word: <strong>{scrambledWord}</strong></p>
          {options.map(option => (
            <button key={option} onClick={() => checkAnswer(option)}>
              {option}
            </button>
          ))}
        </div>
      )}
      <p>Current Severity Score: <strong>{severityScore}</strong></p>
    </div>
  );
};

export default WordReversalTest;