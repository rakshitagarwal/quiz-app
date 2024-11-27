"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default function AddQuiz() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [questions, setQuestions] = useState([
        { question: "", answers: ["", ""], correctAnswer: "" },
    ]);

    const handleAddQuestion = () => {
        setQuestions([...questions, { question: "", answers: ["", ""], correctAnswer: "" }]);
    };

    const handleRemoveQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    };

    const handleAnswerChange = (qIndex, aIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].answers[aIndex] = value;
        setQuestions(updatedQuestions);
    };

    const handleAddAnswer = (qIndex) => {
        const updatedQuestions = [...questions];
        if (updatedQuestions[qIndex].answers.length < 5) {
            updatedQuestions[qIndex].answers.push("");
            setQuestions(updatedQuestions);
        }
    };

    const handleRemoveAnswer = (qIndex, aIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].answers = updatedQuestions[qIndex].answers.filter((_, i) => i !== aIndex);
        if (updatedQuestions[qIndex].correctAnswer === updatedQuestions[qIndex].answers[aIndex]) {
            updatedQuestions[qIndex].correctAnswer = ""; // Clear correctAnswer if removed
        }
        setQuestions(updatedQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert("Quiz title is required.");
            return;
        }

        for (const q of questions) {
            if (!q.question.trim() || q.answers.length < 2 || !q.correctAnswer.trim()) {
                alert("All questions must have text, at least two answers, and a correct answer.");
                return;
            }
        }

        try {
            const res = await fetch("http://localhost:3000/api/quiz", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ title, description, questions }),
            });

            if (res.ok) {
                router.push("/tables");
            } else {
                throw new Error("Failed to create a quiz");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <DefaultLayout>
            <form
                onSubmit={handleSubmit}
                className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
            >
                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">Create Quiz</h3>
                </div>
                <div className="p-6.5">
                    <div className="mb-4.5">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">Quiz Title</label>
                        <input
                            type="text"
                            placeholder="Enter quiz title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            required
                        />
                    </div>
                    <div className="mb-4.5">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">Quiz Description</label>
                        <textarea
                            rows={3}
                            placeholder="Enter quiz description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        ></textarea>
                        
                    </div>
                    {questions.map((question, qIndex) => (
                        <div
                            key={qIndex}
                            className="border border-stroke bg-white p-4 mb-4 dark:border-strokedark dark:bg-boxdark rounded"
                        >
                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">Question</label>
                                <input
                                    type="text"
                                    placeholder="Enter question text"
                                    value={question.question}
                                    onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>
                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Answers
                                </label>
                                {question.answers.map((answer, aIndex) => (
                                    <div key={aIndex} className="flex gap-4 items-center mb-2">
                                        <input
                                            type="text"
                                            placeholder={`Answer ${aIndex + 1}`}
                                            value={answer}
                                            onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value)}
                                            className="flex-grow rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAnswer(qIndex, aIndex)}
                                            className="text-meta-1"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                {question.answers.length < 5 && (
                                    <button
                                        type="button"
                                        onClick={() => handleAddAnswer(qIndex)}
                                        className="text-primary"
                                    >
                                        Add Answer
                                    </button>
                                )}
                            </div>
                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Correct Answer
                                </label>
                                <select
                                    value={question.correctAnswer}
                                    onChange={(e) => handleQuestionChange(qIndex, "correctAnswer", e.target.value)}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                >
                                    <option value="">Select Correct Answer</option>
                                    {question.answers.map((answer, aIndex) => (
                                        <option key={aIndex} value={answer}>
                                            {answer || `Answer ${aIndex + 1}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveQuestion(qIndex)}
                                className="mt-4 text-meta-1"
                            >
                                Remove Question
                            </button>
                        </div>
                    ))}
                    {questions.length < 50 && (
                        <button
                            type="button"
                            onClick={handleAddQuestion}
                            className="mb-4 w-fit flex justify-center rounded bg-primary p-2 font-medium text-white hover:bg-opacity-90"
                        >
                            Add Question
                        </button>
                    )}
                    <div className="flex flex-row">
                    <button
                        type="submit"
                        className="w-fit flex justify-center rounded bg-green-600 p-2 font-medium text-white hover:bg-opacity-90"
                    >
                        Add Quiz
                    </button>
                    &nbsp;                    &nbsp;

                    <button
                        type="button"
                        onClick={()=> router.push('/tables')}
                        className="w-fit flex justify-center rounded bg-primary p-2 font-medium text-white hover:bg-opacity-90"
                    >
                        Cancel
                    </button>
                    </div>
                </div>
            </form>
        </DefaultLayout>
    );
}
