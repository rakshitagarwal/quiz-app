"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import SwitcherThree from "../Switchers/SwitcherThree";

export default function EditQuiz({ id, title, description, questions, privacy }) {
  const router = useRouter();
  const [quizTitle, setQuizTitle] = useState(title || "");
  const [quizDescription, setQuizDescription] = useState(description || "");
  const [isPrivate, setIsPrivate] = useState(privacy)
  const [quizQuestions, setQuizQuestions] = useState(
    questions || [{ question: "", questionType: "MCQ", answers: ["", ""], correctAnswer: "" }]
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

    if (!quizTitle.trim()) {
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
        body: JSON.stringify({ title: quizTitle, description: quizDescription, questions: quizQuestions, user: session.user._id, privacy: isPrivate }),
      });

      if (res.ok) {
        router.push("/tables");
        router.refresh()
      } else {
        throw new Error("Failed to update quiz");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">Edit Quiz</h3>
        </div>
        <div className="p-6.5">
          <div className="mb-4.5">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Quiz Title</label>
            <input
              type="text"
              placeholder="Enter quiz title"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              required
            />
          </div>
          <div className="mb-4.5">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Quiz Description</label>
            <textarea
              rows={3}
              placeholder="Enter quiz description"
              value={quizDescription}
              onChange={(e) => setQuizDescription(e.target.value)}
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            ></textarea>
          </div>
          <div className="flex mb-4.5">
            <label className="py-1 block text-sm font-medium text-black dark:text-white">Private Quiz?</label>
            &nbsp;&nbsp;&nbsp;&nbsp; <SwitcherThree isPrivate={isPrivate} setIsPrivate={setIsPrivate} />
          </div>
          {quizQuestions.map((question, qIndex) => (
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
              className="mb-4 w-32 flex justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90"
            >
              Add Question
            </button>
          )}
          <div className="flex">
            <button
              type="submit"
              className="w-32 flex justify-center rounded bg-green-600 p-3 font-medium text-white hover:bg-opacity-90"
            >
              Update Quiz
            </button>&nbsp;&nbsp;
            <button
              type="button"
              onClick={() => router.push('/tables')}
              className="w-32 flex justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
