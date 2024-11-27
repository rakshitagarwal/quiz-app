"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const ActiveQuiz = ({ id, title, description, questions }) => {
    const router = useRouter();
    const passPercentage = 60;

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [answerChecked, setAnswerChecked] = useState(false);
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [quizResult, setQuizResult] = useState({
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
    });

    if (!questions.length) return <div>Loading Quiz...</div>;

    const { question, answers, correctAnswer } = questions[currentQuestionIndex];
    const percentage = (quizResult.score / (questions.length * 5)) * 100;
    const status = percentage >= passPercentage ? 'Pass' : 'Fail';

    const onAnswerSelected = (answer, idx) => {
        setSelectedAnswerIndex(idx);
        setSelectedAnswer(answer);
        setAnswerChecked(true);
    };

    const handleNextQuestion = () => {
        if (selectedAnswer === correctAnswer) {
            setQuizResult((prev) => ({
                ...prev,
                score: prev.score + 5,
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
        setSelectedAnswer('');
        setSelectedAnswerIndex(null);
        setAnswerChecked(false);
    };

    const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div className="container mx-auto mt-5 px-4">
            <h1 className="text-3xl font-bold mb-4">{title}</h1>
            <p className="text-lg mb-6">{description}</p>
            <div>
                {!showResults ? (
                    <>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }} />
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h4 className="text-2xl mb-4">{question}</h4>
                            <ul className="space-y-3">
                                {answers.map((answer, idx) => (
                                    <li
                                        key={idx}
                                        onClick={() => onAnswerSelected(answer, idx)}
                                        className={`p-3 rounded cursor-pointer hover:bg-gray-200 
                                    ${selectedAnswerIndex === idx ? 'bg-blue-100' : ''}`}
                                    >
                                        {answer}
                                    </li>
                                ))}
                            </ul>
                            <div className="flex justify-between mt-4">
                                <b>Question {currentQuestionIndex + 1}/{questions.length}</b>
                                <div>
                                <button type='button' className='bg-danger text-white p-2' onClick={()=>router.push('/tables')}>Quit</button>&nbsp;&nbsp;
                                <button
                                    onClick={handleNextQuestion}
                                    className={`px-4 py-2 rounded bg-blue-500 text-white 
                                ${!answerChecked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={!answerChecked}
                                >
                                    {currentQuestionIndex === questions.length - 1
                                        ? 'Submit'
                                        : 'Next Question'}
                                </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl mb-4">Quiz Results</h3>
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
                                    <td className="px-4 py-2 font-semibold">Incorrect Answers:</td>
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
                        <div className="flex justify-start mt-6">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-blue-500 text-white rounded mr-3"
                            >
                                Restart
                            </button>
                            <button
                                onClick={() => router.push('/tables')}
                                className="px-4 py-2 bg-green-500 text-white rounded"
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
