"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

const kidFriendlyFont = 'Comic Sans MS, cursive';
const primaryColor = 'bg-purple-400';
const primaryTextColor = 'text-white';
const secondaryColor = 'bg-yellow-300';
const secondaryTextColor = 'text-purple-800';
const correctColor = 'bg-green-200';
const incorrectColor = 'bg-red-200';
const defaultOptionColor = 'bg-blue-100 hover:bg-blue-200';
const borderColor = 'border-purple-300';
const shadowStyle = 'shadow-md';

const quizzes = [
  {
    question: "What is 7 × 8?",
    options: ["54", "56", "64", "48"],
    answer: "56",
  },
  {
    question: "What is half of 1/4?",
    options: ["1/2", "1/8", "1/6", "1/4"],
    answer: "1/8",
  },
  {
    question: "What is the perimeter of a square with side 5cm?",
    options: ["10cm", "20cm", "25cm", "15cm"],
    answer: "20cm",
  },
];

export default function DailyQuiz() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [selected, setSelected] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [quiz, setQuiz] = useState<any>(null);
  const [timer, setTimer] = useState(40);
  const today = new Date().toLocaleDateString();

  useEffect(() => {
    setQuiz(quizzes[Math.floor(Math.random() * quizzes.length)]);
  }, []);

  useEffect(() => {
    if (!showQuiz || attempted) return;

    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setAttempted(true);
    }
  }, [timer, showQuiz, attempted]);

  const handleOption = async (option: string) => {
    if (attempted) return;
    setSelected(option);
    setAttempted(true);
    const isCorrect = option === quiz.answer;
    setCorrect(isCorrect);

    if (isCorrect) {
      confetti();
      await fetch("/api/logReward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: "student_001",
          source: "Daily Quiz",
          date: new Date().toISOString(),
          points: 5,
        }),
      });
    }
  };

  return (
    <div className="fixed bottom-1/8 left-10 transform -translate-y-1/2 z-50">
    {!showQuiz && (
      <button
        onClick={() => setShowQuiz(true)}
        className="bg-yellow-300 border-4 border-purple-500 text-purple-800 font-extrabold px-6 py-4 rounded-xl shadow-lg hover:bg-yellow-400 hover:shadow-2xl transition-all text-lg"
        style={{ fontFamily: kidFriendlyFont }}
      >
        🧠 Solve Daily! Math Quiz
      </button>
    )}


      {/* Quiz Popup (Open State) */}
      {showQuiz && quiz && (
        <div className={`bg-white p-6 rounded-xl ${shadowStyle} w-96 mt-4 border-4 ${borderColor}`}>
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-bold ${primaryTextColor} ${primaryColor} rounded-full px-4 py-2`} style={{ fontFamily: kidFriendlyFont }}>
              Math Challenge!
            </h2>
            <button onClick={() => setShowQuiz(false)} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Date */}
          <div className="text-sm text-gray-600 mb-2">📅 {today}</div>

          {/* Question */}
          <p className="font-bold text-lg text-gray-800 mb-3" style={{ fontFamily: kidFriendlyFont }}>{quiz.question}</p>

          {/* Options */}
          <ul className="space-y-3">
            {quiz.options.map((option: string) => (
              <li key={option}>
                <button
                  disabled={attempted}
                  onClick={() => handleOption(option)}
                  className={`w-full text-left ${secondaryTextColor} p-3 border rounded-lg ${borderColor} ${
                    selected === option
                      ? option === quiz.answer
                        ? correctColor
                        : incorrectColor
                      : defaultOptionColor
                  } font-semibold text-lg`}
                  style={{ fontFamily: kidFriendlyFont }}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>

          {/* Feedback and Timer */}
          <div className="mt-4 text-sm text-gray-700 font-semibold" style={{ fontFamily: kidFriendlyFont }}>
            {attempted
              ? correct
                ? "🎉 You got it! +5 points!"
                : `😔 Oops! The right answer was ${quiz.answer}.`
              : `⏱️ Time left: ${timer} seconds`}
          </div>
        </div>
      )}
    </div>
  );
}