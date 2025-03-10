import { useState } from "react";

// Function to get stored Reading Test score
export const getReadingScore = () => {
  return parseInt(localStorage.getItem("readingScore")) || 0;
};

// Array of meaningful test paragraphs
const testParagraphs = [
  "Reading is a fundamental skill that shapes our ability to learn, comprehend, and communicate. Studies have shown that individuals who read regularly develop a richer vocabulary and improved cognitive function. Whether it is fiction, non-fiction, or academic material, reading enhances our understanding of the world around us and fosters creativity.",
  
  "The universe is vast and largely unexplored. Scientists estimate that there are over a hundred billion galaxies, each containing millions or even billions of stars. The possibility of life beyond Earth has intrigued astronomers for centuries, leading to continuous research and exploration of exoplanets that may have conditions suitable for life.",
  
  "Technology has significantly transformed the way we live and work. From smartphones to artificial intelligence, advancements in digital tools have improved efficiency and convenience. However, with these developments come concerns about privacy, cybersecurity, and the impact of automation on job markets worldwide.",
  
  "The human brain is one of the most complex structures in the known universe. With billions of neurons and intricate connections, it allows us to think, create, and solve problems. Neuroscientists continue to study how the brain functions, seeking to understand memory, emotions, and cognitive abilities that shape human behavior.",
  
  "Climate change is one of the most pressing issues of our time. Rising global temperatures, melting ice caps, and extreme weather events are all indicators of an environmental crisis. Scientists and policymakers are working together to develop sustainable solutions, reduce carbon emissions, and protect our planet for future generations."
];

const ReadingTest = ({ goBack, onTestComplete }) => {
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [readingScore, setReadingScore] = useState(0);
  const [selectedParagraph, setSelectedParagraph] = useState("");

  const handleStartTest = () => {
    const randomParagraph = testParagraphs[Math.floor(Math.random() * testParagraphs.length)];
    setSelectedParagraph(randomParagraph);
    setStartTime(Date.now());
    setTestStarted(true);
  };

  const handleEndTest = () => {
    if (!startTime) return;

    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000; // Time in seconds

    const words = selectedParagraph.split(" ").length;
    const wordsPerMinute = (words / timeTaken) * 60;

    // Scoring: Faster reading earns a higher score (out of 20)
    let score = Math.min(20, Math.max(0, Math.round(wordsPerMinute / 10))); 

    localStorage.setItem("readingScore", score);
    setReadingScore(score);
    setTestCompleted(true);

    // Pass the final score to the parent component
    onTestComplete(score);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center w-full max-w-lg">
      <h2 className="text-xl font-bold mb-4">📖 Reading Test</h2>

      {!testStarted ? (
        <button 
          onClick={handleStartTest} 
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Start Test
        </button>
      ) : !testCompleted ? (
        <>
          <p className="mb-4 text-gray-700 text-justify leading-relaxed">{selectedParagraph}</p>
          <button 
            onClick={handleEndTest} 
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
          >
            End Test
          </button>
        </>
      ) : (
        <>
          <h2 className="text-green-600 font-bold mt-4">🎉 Test Completed!</h2>
          <p className="text-lg font-bold">Your Score: {readingScore}</p>
          <button 
            onClick={goBack} 
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300"
          >
            Go Back
          </button>
        </>
      )}
    </div>
  );
};


export default ReadingTest;
