"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

const ActiveQuiz = ({ id, title, description, questions }) => {
  const router = useRouter();
  const passPercentage = 60;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answerChecked, setAnswerChecked] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [quizResult, setQuizResult] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });

  const { question, answers, correctAnswer } = questions[currentQuestionIndex];
  const percentage = (quizResult.score / questions.length) * 100;
  const status = percentage >= passPercentage ? "Pass" : "Fail";

  const onAnswerSelected = (answer, idx) => {
    setSelectedAnswerIndex(idx);
    setSelectedAnswer(answer);
    setAnswerChecked(true);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === correctAnswer) {
      setQuizResult((prev) => ({
        ...prev,
        score: prev.score + 1,
        correctAnswers: prev.correctAnswers + 1,
      }));
    } else {
      setQuizResult((prev) => ({
        ...prev,
        wrongAnswers: prev.wrongAnswers + 1,
      }));
    }
    if (currentQuestionIndex !== questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
    setSelectedAnswer("");
    setSelectedAnswerIndex(null);
    setAnswerChecked(false);
  };

  const addEntry = async () => {
    try {
      const session = await getSession();
      const res = await fetch("http://localhost:3000/api/test", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          quiz: id,
          user: session.user._id,
          score: quizResult.score,
          correctResponses: quizResult.correctAnswers,
          incorrectResponses: quizResult.wrongAnswers,
          status,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to create a quiz");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (showResults) addEntry();
  }, [showResults]);

  const progressPercentage =
    ((currentQuestionIndex + 1) / questions.length) * 100;

  if (!questions.length) return <div>Loading Quiz...</div>;

  return (
    <div className="container mx-auto mt-5 w-[50%] px-4">
      <h1 className="mb-4 text-3xl font-bold">{title}</h1>
      <p className="mb-6 text-lg">{description}</p>
      <div>
        {!showResults ? (
          <>
            <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-2.5 rounded-full bg-blue-600"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h4 className="mb-4 text-2xl">{question}</h4>
              <ul className="space-y-3">
                {answers.map((answer, idx) => (
                  <li
                    key={idx}
                    onClick={() => onAnswerSelected(answer, idx)}
                    className={`cursor-pointer rounded p-3 hover:bg-gray-200 
                    ${selectedAnswerIndex === idx ? "bg-blue-100" : ""}`}
                  >
                    {answer}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between">
                <b>
                  Question {currentQuestionIndex + 1}/{questions.length}
                </b>
                <div>
                  <button
                    type="button"
                    className="bg-danger p-2 text-white"
                    onClick={() => router.push("/tables")}
                  >
                    Quit
                  </button>
                  &nbsp;&nbsp;
                  <button
                    onClick={handleNextQuestion}
                    className={`rounded bg-blue-500 px-4 py-2 text-white 
                                ${!answerChecked ? "cursor-not-allowed opacity-50" : ""}`}
                    disabled={!answerChecked}
                  >
                    {currentQuestionIndex === questions.length - 1
                      ? "Submit"
                      : "Next Question"}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-2xl">Quiz Results</h3>
            <table className="min-w-full table-auto">
              <tbody>
                <tr>
                  <td className="px-4 py-2 font-semibold">Total Questions:</td>
                  <td className="px-4 py-2">{questions.length}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">Total Score:</td>
                  <td className="px-4 py-2">{quizResult.score}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">Correct Answers:</td>
                  <td className="px-4 py-2">{quizResult.correctAnswers}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">
                    Incorrect Answers:
                  </td>
                  <td className="px-4 py-2">{quizResult.wrongAnswers}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">Percentage:</td>
                  <td className="px-4 py-2">{percentage.toFixed(2)}%</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">Status:</td>
                  <td className="px-4 py-2">{status}</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-6 flex justify-start">
              <button
                onClick={() => window.location.reload()}
                className="mr-3 rounded bg-blue-500 px-4 py-2 text-white"
              >
                Restart
              </button>
              <button
                onClick={() => router.push("/tables")}
                className="rounded bg-green-500 px-4 py-2 text-white"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveQuiz;
