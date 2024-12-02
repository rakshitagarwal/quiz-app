"use client";

import { getSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import Countdown from "react-countdown";

const ActiveQuiz = ({ entryId, quiz }) => {
  const router = useRouter();
  const pathname = usePathname();
  const passPercentage = 60;
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answerChecked, setAnswerChecked] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [userSession, setUserSession] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [attemptedQuestions, setAttemptedQuestions] = useState([]);
  const [quizResult, setQuizResult] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });

  useEffect(() => {
    const userSession = async () => {
      const session = await getSession();
      if (!session) {
        router.push(`/signup?callbackUrl=${encodeURIComponent(pathname)}`);
      } else {
        router.refresh();
        setUserSession(session)
      }
    };
    userSession();
  }, []);

  const quizEndTime = useMemo(() => Date.now() + quiz.quizDuration * 60 * 1000, []);
  const { question, answers, correctAnswer } = quiz.questions[currentQuestionIndex];
  const percentage = (quizResult.score / quiz.questions.length) * 100;
  const status = percentage >= passPercentage ? "Pass" : "Fail";

  const onAnswerSelected = (answer, idx) => {
    setSelectedAnswerIndex(idx);
    setSelectedAnswer(answer);
    setAnswerChecked(true);
    if (!attemptedQuestions.includes(currentQuestionIndex)) {
      setAttemptedQuestions((prev) => [...prev, currentQuestionIndex]);
    }
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
    if (currentQuestionIndex !== quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setShowReport(true);
    }
    setSelectedAnswer("");
    setSelectedAnswerIndex(null);
    setAnswerChecked(false);
  };

  const updateEntry = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/test/${entryId}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          id: entryId,
          quiz: quiz._id,
          quizName: quiz.title,
          playedBy: userSession.user._id,
          createdBy: quiz.createdBy,
          score: quizResult.score,
          correctResponses: quizResult.correctAnswers,
          incorrectResponses: quizResult.wrongAnswers,
          status: status,
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
    if (showReport) updateEntry();
  }, [showReport]);

  const progressPercentage = (attemptedQuestions.length / quiz.questions.length) * 100;

  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="mb-4 mt-5 text-3xl font-bold">{quiz.title}</h1>
        <p className="mb-6 text-lg">{quiz.description}</p>
        {!isQuizStarted ? (
    <button
      onClick={() => setIsQuizStarted(true)}
      className="rounded bg-blue-500 px-6 py-3 text-white"
    >
      Start Quiz
    </button>
  ) : (
    !showReport && (
      <Countdown
        date={quizEndTime}
        onComplete={() => setShowReport(true)}
      />
    )
  )}
      </div>
      <div className="container mx-auto mt-5 flex w-[80%] flex-col items-center">
        <div className="w-full px-4">
          {!showReport ? (
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
                      <input
                        type="checkbox"
                        checked={selectedAnswerIndex === idx}
                        readOnly
                        className="mr-3"
                      />
                      {answer}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={handleNextQuestion}
                    className={`rounded bg-blue-500 px-4 py-2 text-white 
                          ${!answerChecked
                        ? "cursor-not-allowed opacity-50"
                        : ""
                      }`}
                    disabled={!answerChecked}
                  >
                    {currentQuestionIndex === quiz.questions.length - 1
                      ? "Submit"
                      : "Next Question"}
                  </button>
                </div>
              </div>
              {/* Question Numbers Below */}
              <div className="mt-6 flex justify-center space-x-2">
                {quiz.questions.map((_, idx) => (
                  <div
                    key={idx}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`cursor-pointer rounded-full px-3 py-2 
                ${currentQuestionIndex === idx
                        ? "bg-blue-500 text-white"
                        : attemptedQuestions.includes(idx)
                          ? "bg-green-300 hover:bg-green-400"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                  >
                    {idx + 1}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-2xl">Quiz Ended</h3>
              {quiz.showResult && (
                <table className="min-w-full table-auto">
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 font-semibold">
                        Total Questions:
                      </td>
                      <td className="px-4 py-2">{quiz.questions.length}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-semibold">Total Score:</td>
                      <td className="px-4 py-2">{quizResult.score}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-semibold">
                        Correct Answers:
                      </td>
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
              )}
            </div>
          )}
        </div>
      </div>

    </>
  );
};

export default ActiveQuiz;
