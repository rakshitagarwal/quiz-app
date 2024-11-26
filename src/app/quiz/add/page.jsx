"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default function AddQuiz() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [questions, setQuestions] = useState([
        { questionText: "", type: "Multiple Choice", options: [{ text: "", isCorrect: false }] },
    ]);

    const handleAddQuestion = () => {
        setQuestions([
            ...questions,
            { questionText: "", type: "Multiple Choice", options: [{ text: "", isCorrect: false }] },
        ]);
    };

    const handleRemoveQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    // const handleQuestionChange = (index, field, value) => {
    //     const updatedQuestions = [...questions];
    //     updatedQuestions[index][field] = value;

    //     if (field === "type" && value !== "Multiple Choice") {
    //         updatedQuestions[index].options = []; // Clear options if not MCQ
    //     }
    //     setQuestions(updatedQuestions);
    // };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
    
        if (field === "type") {
            if (value === "Multiple Choice") {
                updatedQuestions[index].options = [{ text: "", isCorrect: false }];
            } else if (value === "True/False") {
                updatedQuestions[index].options = [
                    { text: "True", isCorrect: false },
                    { text: "False", isCorrect: false },
                ];
            } else {
                updatedQuestions[index].options = []; // Clear options for Short Answer
            }
        }
        setQuestions(updatedQuestions);
    };
    

    // const handleOptionChange = (qIndex, oIndex, field, value) => {
    //     const updatedQuestions = [...questions];
    //     updatedQuestions[qIndex].options[oIndex][field] = value;
    //     setQuestions(updatedQuestions);
    // };

    const handleOptionChange = (qIndex, oIndex, field, value) => {
        const updatedQuestions = [...questions];
        if (field === "isCorrect" && value === true) {
            updatedQuestions[qIndex].options.forEach((option, index) => {
                option.isCorrect = index === oIndex;
            });
        } else {
            updatedQuestions[qIndex].options[oIndex][field] = value;
        }
        setQuestions(updatedQuestions);
    }; 

    const handleAddOption = (qIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options.push({ text: "", isCorrect: false });
        setQuestions(updatedQuestions);
    };

    const handleRemoveOption = (qIndex, oIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.filter((_, i) => i !== oIndex);
        setQuestions(updatedQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert("Quiz title is required.");
            return;
        }
    
        if (questions.some(q => !q.questionText.trim())) {
            alert("All questions must have text.");
            return;
        }
    
        if (
            questions.some(q => q.type === "Multiple Choice" && 
                (q.options.length < 2 || !q.options.some(o => o.isCorrect)))
        ) {
            alert("Multiple Choice questions must have at least two options and one correct answer.");
            return;
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
            console.log(error);
        }
    };

    return (
        <DefaultLayout>
            <form onSubmit={handleSubmit} className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
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
                        />
                    </div>
                    <div className="mb-4.5">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">Quiz Description</label>
                        <input
                            type="text"
                            placeholder="Enter quiz description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>
                    {questions.map((question, qIndex) => (
                        <div key={qIndex} className="border border-stroke bg-white p-4 mb-4 dark:border-strokedark dark:bg-boxdark rounded">
                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">Question Text</label>
                                <input
                                    type="text"
                                    placeholder="Enter question text"
                                    value={question.questionText}
                                    onChange={(e) => handleQuestionChange(qIndex, "questionText", e.target.value)}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>
                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">Question Type</label>
                                <select
                                    value={question.type}
                                    onChange={(e) => handleQuestionChange(qIndex, "type", e.target.value)}
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                >
                                    <option value="Multiple Choice">Multiple Choice</option>
                                    <option value="True/False">True/False</option>
                                    <option value="Short Answer">Short Answer</option>
                                </select>
                            </div>
                            {question.type === "Multiple Choice" && (
                                <>
                                    {question.options.map((option, oIndex) => (
                                        <div key={oIndex} className="flex gap-4 items-center mb-2">
                                            <input
                                                type="text"
                                                placeholder={`Option ${oIndex + 1}`}
                                                value={option.text}
                                                onChange={(e) => handleOptionChange(qIndex, oIndex, "text", e.target.value)}
                                                className="flex-grow rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={option.isCorrect}
                                                    onChange={(e) => handleOptionChange(qIndex, oIndex, "isCorrect", e.target.checked)}
                                                    className="w-5 h-5"
                                                />
                                                <span className={option.isCorrect ? "text-green-600" : "text-gray-500"}>
                                                    Mark as Correct
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveOption(qIndex, oIndex)}
                                                className="text-meta-1"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                    {question.options.length < 5 && (
                                        <button
                                            type="button"
                                            onClick={() => handleAddOption(qIndex)}
                                            className="text-primary"
                                        >
                                            Add Option
                                        </button>
                                    )}
                                </>
                            )}
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
                            className="mb-4 w-32 flex justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90"
                        >
                            Add Question
                        </button>
                    )}
                    <button
                        type="submit"
                        className="w-32 flex justify-center rounded bg-green-600 p-3 font-medium text-white hover:bg-opacity-90"
                    >
                        Add Quiz
                    </button>
                </div>
            </form>
        </DefaultLayout>
    );
}
