"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import SwitcherThree from "../Switchers/SwitcherThree";

export default function EditQuiz({ id, quiz }) {
  const router = useRouter();
  const [title, setTitle]  = useState(quiz.title || "");
  const [description, setDescription]  = useState(quiz.description || "");
  const [timer, setTimer] = useState(quiz.quizDuration ||5);
  const [result, setResult] = useState(quiz.showResult ||false);
  const [activeTab, setActiveTab] = useState(1);

  const [quizQuestions, setQuizQuestions] = useState(
    quiz.questions || [{ question: "", questionType: "MCQ", answers: ["", ""], correctAnswer: "" }]
  );

  const handleAddQuestion = () => {
    setQuizQuestions([
      ...quizQuestions,
      { question: "", questionType: "MCQ", answers: ["", ""], correctAnswer: "" },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    setQuizQuestions(quizQuestions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quizQuestions];
    updatedQuestions[index][field] = value;

    if (field === "questionType" && value === "TRUE/FALSE") {
      updatedQuestions[index].answers = ["True", "False"];
      updatedQuestions[index].correctAnswer = "";
    }

    setQuizQuestions(updatedQuestions);
  };

  const handleAnswerChange = (qIndex, aIndex, value) => {
    const updatedQuestions = [...quizQuestions];
    updatedQuestions[qIndex].answers[aIndex] = value;
    setQuizQuestions(updatedQuestions);
  };

  const handleAddAnswer = (qIndex) => {
    const updatedQuestions = [...quizQuestions];
    if (updatedQuestions[qIndex].answers.length < 5) {
      updatedQuestions[qIndex].answers.push("");
      setQuizQuestions(updatedQuestions);
    }
  };

  const handleRemoveAnswer = (qIndex, aIndex) => {
    const updatedQuestions = [...quizQuestions];
    updatedQuestions[qIndex].answers = updatedQuestions[qIndex].answers.filter((_, i) => i !== aIndex);
    if (updatedQuestions[qIndex].correctAnswer === updatedQuestions[qIndex].answers[aIndex]) {
      updatedQuestions[qIndex].correctAnswer = "";
    }
    setQuizQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Quiz title is required.");
      return;
    }

    for (const q of quizQuestions) {
      if (!q.question.trim() || q.answers.length < 2 || !q.correctAnswer.trim()) {
        alert("All questions must have text, at least two answers, and a correct answer.");
        return;
      }
    }

    try {
      const session = await getSession();
      const res = await fetch(`http://localhost:3000/api/quiz/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ title, description, showResult: result, quizDuration: timer,questions: quizQuestions, createdBy: session.user._id }),
      });

      if (res.ok) {
        router.push("/quizzes");
        router.refresh()
      } else {
        throw new Error("Failed to update quiz");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">Create Quiz</h3>
    </div>
    <div className="flex border-b border-stroke">
        <button
            className={`flex-1 py-2 ${activeTab === 1 ? 'bg-primary text-white' : 'text-black dark:text-white'}`}
            onClick={() => setActiveTab(1)}
        >
            Quiz Settings
        </button>
        <button
            className={`flex-1 py-2 ${activeTab === 2 ? 'bg-primary text-white' : 'text-black dark:text-white'}`}
            onClick={() => setActiveTab(2)}
        >
            Add Questions
        </button>
    </div>
    <form
        onSubmit={handleSubmit}
        className="p-6.5"
    >
        {activeTab === 1 && (
            <div>
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
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    ></textarea>
                </div>
                <div className="mb-4.5">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">Quiz Duration</label>
                    <input
                        type="text"
                        placeholder="Enter quiz title"
                        value={timer}
                        onChange={(e) => setTimer(e.target.value)}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        required
                    />
                </div>
                <div className="flex mb-4.5">
                    <label className="py-2 block text-sm font-medium text-black dark:text-white">Show Results</label>
                    &nbsp;&nbsp;&nbsp;<SwitcherThree {...{result, setResult}}/>
                </div>
            </div>
        )}
        {activeTab === 2 && (
            <div>
                {quizQuestions.map((question, qIndex) => (
                    <div
                        key={qIndex}
                        className="border border-stroke bg-white p-4 mb-4 dark:border-strokedark dark:bg-boxdark rounded"
                    >
                        {/* Question fields */}
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
                        {/* Question type */}
                        <div className="mb-4.5">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Question Type
                            </label>
                            <select
                                value={question.questionType}
                                onChange={(e) => handleQuestionChange(qIndex, "questionType", e.target.value)}
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            >
                                <option value="MCQ">MCQ</option>
                                <option value="TRUE/FALSE">TRUE/FALSE</option>
                            </select>
                        </div>
                        {/* Choices */}
                        <div className="mb-4.5">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Choices
                            </label>
                            {question.answers.map((answer, aIndex) => (
                                <div key={aIndex} className="flex gap-4 items-center mb-2">
                                    <input
                                        type="text"
                                        placeholder={`Choice ${aIndex + 1}`}
                                        value={answer}
                                        onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value)}
                                        className="flex-grow rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        disabled={question.questionType === "TRUE/FALSE"}
                                    />
                                    {question.questionType === "MCQ" && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAnswer(qIndex, aIndex)}
                                            className="text-meta-1"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                          {question.questionType === "MCQ" && question.answers.length < 5 && (
                                <button
                                    type="button"
                                    onClick={() => handleAddAnswer(qIndex)}
                                    className="text-primary"
                                >
                                    Add Choice
                                </button>
                            )}
                        </div>
                        {/* Correct Answer */}
                        <div className="mb-4.5">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Correct Answer
                            </label>
                            <select
                                value={question.correctAnswer}
                                onChange={(e) => handleQuestionChange(qIndex, "correctAnswer", e.target.value)}
                                className="w-fit rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
                {quizQuestions.length < 50 && (
                    <button
                        type="button"
                        onClick={handleAddQuestion}
                        className="mb-4 w-fit flex justify-center rounded bg-primary p-2 font-medium text-white hover:bg-opacity-90"
                    >
                        Add Question
                    </button>
                )}
            </div>
        )}
        <div className="flex flex-row">
            <button
                type="submit"
                className="w-fit flex justify-center rounded bg-green-600 p-2 font-medium text-white hover:bg-opacity-90"
            >
                Update Quiz
            </button>
            &nbsp;&nbsp;
            <button
                type="button"
                onClick={() => router.push("/quizzes")}
                className="w-fit flex justify-center rounded bg-primary p-2 font-medium text-white hover:bg-opacity-90"
            >
                Cancel
            </button>
        </div>
    </form>
</div>
  );
}
