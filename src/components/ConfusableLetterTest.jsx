import { useState } from "react";

const questions = [
  {
    sentence: "This animal barks and is known as man's best friend.",
    correct: "dog",
    options: ["dog", "bog", "dop"],
  },
  {
    sentence: "A small flying insect that makes honey.",
    correct: "bee",
    options: ["bee", "dee", "pee"],
  },
  {
    sentence: "A place where books are stored and borrowed.",
    correct: "library",
    options: ["library", "libmary", "libnary"],
  },
  {
    sentence: "You use this to drink coffee or tea.",
    correct: "cup",
    options: ["cup", "qup", "cud"],
  },
  {
    sentence: "A person who fixes cars.",
    correct: "mechanic",
    options: ["mechanic", "mechamic", "mechnnic"],
  },
];

// Function to get stored Confusable Letter Test score
export const getConfusableLetterScore = () => {
  return parseInt(localStorage.getItem("confusableLetterScore")) || 0;
};

const ConfusableLetterTest = ({ goBack, onTestComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [testDone, setTestDone] = useState(false);

  // Shuffle options for each question
  const shuffledOptions = [...questions[currentQuestion].options].sort(() => Math.random() - 0.5);

  const handleAnswer = (selected) => {
    let newScore = score;
    if (selected === questions[currentQuestion].correct) {
      newScore += 4;
    }

    if (currentQuestion < questions.length - 1) {
      setScore(newScore);
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Finalize score and store in local storage
      const finalScore = Math.min(newScore, 20);
      localStorage.setItem("confusableLetterScore", finalScore);
      setScore(finalScore);
      setTestDone(true);

      // Pass the final score to the parent component
      onTestComplete(finalScore);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center w-full max-w-lg">
      <h2 className="text-xl font-bold mb-4">Confusable Letter Test</h2>

      {!testDone ? (
        <>
          <p className="mb-4">{questions[currentQuestion].sentence}</p>
          <div className="flex flex-col gap-2">
            {shuffledOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {option}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <h2 className="text-green-600 font-bold mt-4">Test Completed!</h2>
          <button onClick={goBack}>Go Back</button>
          <p className="text-lg font-bold">Your Score: {score}</p>
        </>
      )}
    </div>
  );
};

export default ConfusableLetterTest;
