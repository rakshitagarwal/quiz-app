'use client';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/navigation';

const ActiveQuiz = ({id, title, description, questions}) => {
    const router = useRouter();
    const [quizTitle, setQuizTitle] = useState(title || "");
    const [quizDescription, setQuizDescription] = useState(description || "");
    const [quizQuestions, setQuizQuestions] = useState(
        questions || [{ question: "", answers: ["", ""], correctAnswer: "" }]
    );
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

    const passPercentage = 60;

    const getQuizById = async () => {
        try {
            // const newId = '6746b7390d694f52fb83cc0d'
            const res = await fetch(`http://localhost:3000/api/quiz/${id}`, {
                cache: "no-store",
            });

            if (!res.ok) {
                throw new Error("Failed to fetch topic");
            }
            const {quiz} = await res.json();
            console.log("quiz", quiz);
            
            setQuizQuestions(quiz.questions)
            return ;
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getQuizById(id)
    }, [id]);

    if (!quizQuestions.length) return <div>Loading Quiz...</div>;

    const { question, answers, correctAnswer } = quizQuestions[currentQuestionIndex];
    const percentage = (quizResult.score / (quizQuestions.length * 5)) * 100;
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

    return (
        <div className="container mt-5">
            <div>
                {!showResults ? (
                    <div className="card p-4">
                        <h4>{question}</h4>
                        <ul className="list-group">
                            {answers.map((answer, idx) => (
                                <li
                                    key={idx}
                                    onClick={() => onAnswerSelected(answer, idx)}
                                    className={
                                        'list-group-item ' +
                                        (selectedAnswerIndex === idx ? 'active' : '') +
                                        ' cursor-pointer'
                                    }
                                >
                                    {answer}
                                </li>
                            ))}
                        </ul>
                        <div className="d-flex justify-content-between mt-3">
                            <b>
                                Question {currentQuestionIndex + 1}/{questions.length}
                            </b>
                            <button
                                onClick={handleNextQuestion}
                                className="btn btn-primary"
                                disabled={!answerChecked}
                            >
                                {currentQuestionIndex === questions.length - 1
                                    ? 'Submit'
                                    : 'Next Question'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="card p-4">
                        <h3>Quiz Results</h3>
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td>Total Questions:</td>
                                    <td>{questions.length}</td>
                                </tr>
                                <tr>
                                    <td>Total Score:</td>
                                    <td>{quizResult.score}</td>
                                </tr>
                                <tr>
                                    <td>Correct Answers:</td>
                                    <td>{quizResult.correctAnswers}</td>
                                </tr>
                                <tr>
                                    <td>Wrong Answers:</td>
                                    <td>{quizResult.wrongAnswers}</td>
                                </tr>
                                <tr>
                                    <td>Percentage:</td>
                                    <td>{percentage.toFixed(2)}%</td>
                                </tr>
                                <tr>
                                    <td>Status:</td>
                                    <td>{status}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='flow'>

                        <button
                            onClick={() => window.location.reload()}
                            className="btn btn-primary mt-3"
                            >
                            Restart
                        </button>
                        &nbsp;&nbsp;
                        <button
                            onClick={() => router.push('/tables')}
                            className="btn btn-success mt-3"
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
