"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import SwitcherThree from "@/components/Switchers/SwitcherThree";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoRemoveCircleOutline } from "react-icons/io5";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

export default function AddQuiz() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timer, setTimer] = useState(5);
  const [result, setResult] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState([
    {
      question: "",
      questionType: "MCQ",
      answers: ["", "", "", ""],
      correctAnswer: "",
    },
  ]);

  const handleAddQuestion = () => {
    const newQuestion = {
      question: "",
      questionType: "MCQ",
      answers: ["", "", "", ""],
      correctAnswer: "",
    };
    setQuizQuestions([...quizQuestions, newQuestion]);
    setCurrentQuestionIndex(quizQuestions.length);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = quizQuestions.filter((_, i) => i !== index);
    setQuizQuestions(updatedQuestions);

    if (currentQuestionIndex >= updatedQuestions.length) {
      setCurrentQuestionIndex(updatedQuestions.length - 1);
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quizQuestions];
    updatedQuestions[index][field] = value;
    if (field === "questionType" && value === "TRUE/FALSE") {
      updatedQuestions[index].answers = ["True", "False"];
      updatedQuestions[index].correctAnswer = "";
    } else if (field === "questionType" && value === "MCQ") {
      updatedQuestions[index].answers = ["", "", "", ""];
      updatedQuestions[index].correctAnswer = "";
    }
    setQuizQuestions(updatedQuestions);
  };

  const handleAnswerChange = (qIndex, aIndex, value) => {
    const updatedQuestions = [...quizQuestions];
    updatedQuestions[qIndex].answers[aIndex] = value;
    setQuizQuestions(updatedQuestions);
  };

  const handleNavigation = (direction) => {
    setCurrentQuestionIndex((prevIndex) => {
      if (direction === "next") {
        return Math.min(prevIndex + 1, quizQuestions.length - 1);
      } else if (direction === "prev") {
        return Math.max(prevIndex - 1, 0);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Quiz title is required.");
      return;
    }

    for (const q of quizQuestions) {
      if (
        !q.question.trim() ||
        q.answers.length < 2 ||
        !q.correctAnswer.trim()
      ) {
        alert(
          "All questions must have text, at least two answers, and a correct answer.",
        );
        return;
      }
    }

    try {
      const session = await getSession();
      const res = await fetch("http://localhost:3000/api/quiz", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          showResult: result,
          quizDuration: timer,
          questions: quizQuestions,
          createdBy: session.user._id,
        }),
      });

      if (res.ok) {
        router.push("/quizzes");
        router.refresh();
      } else {
        throw new Error("Failed to add quiz");
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
          className={`flex-1 py-2 ${activeTab === 1 ? "bg-primary text-white" : "text-black dark:text-white"}`}
          onClick={() => setActiveTab(1)}
        >
          Quiz Settings
        </button>
        <button
          className={`flex-1 py-2 ${activeTab === 2 ? "bg-primary text-white" : "text-black dark:text-white"}`}
          onClick={() => setActiveTab(2)}
        >
          Questions
        </button>
      </div>
      <form onSubmit={handleSubmit} className="p-6.5">
        {activeTab === 1 && (
          <div>
            <div className="mb-4.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Quiz Title
              </label>
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
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Quiz Description
              </label>
              <textarea
                rows={3}
                placeholder="Enter quiz description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              ></textarea>
            </div>
            <div className="mb-4.5">
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Quiz Duration
              </label>
              <input
                type="text"
                placeholder="Enter quiz duration"
                value={timer}
                onChange={(e) => setTimer(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                required
              />
            </div>
            <div className="mb-4.5 flex">
              <label className="block py-2 text-sm font-medium text-black dark:text-white">
                Show Results
              </label>
              &nbsp;&nbsp;&nbsp;
              <SwitcherThree {...{ result, setResult }} />
            </div>
          </div>
        )}
        {activeTab === 2 && (
          <>
            {quizQuestions.length < 50 && (
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="mb-4 flex w-fit justify-center rounded p-2 font-medium text-white hover:bg-opacity-90"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke={"grey"}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
                <div className="flex">
                  <button
                    type="button"
                    onClick={() => handleNavigation("prev")}
                    className={`text-primary ${currentQuestionIndex === 0 ? "opacity-50" : ""}`}
                    disabled={currentQuestionIndex === 0}
                  >
                    <FaAngleLeft size={32} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigation("next")}
                    className={`text-primary ${
                      currentQuestionIndex === quizQuestions.length - 1
                        ? "opacity-50"
                        : ""
                    }`}
                    disabled={currentQuestionIndex === quizQuestions.length - 1}
                  >
                    <FaAngleRight size={32} />
                  </button>
                </div>
              </div>
            )}
            {quizQuestions.length > 0 && (
              <div
              key={currentQuestionIndex}
                className="mb-4 rounded border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(currentQuestionIndex)}
                  className="mb-2 text-meta-1"
                >
                  <IoRemoveCircleOutline size="2rem" />
                </button>
                {/* Question fields */}
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdar">
                  Question {currentQuestionIndex + 1}/{quizQuestions.length}
                  </label>
                  <input
                        type="text"
                        placeholder="Enter question text"
                        value={quizQuestions[currentQuestionIndex].question}
                        onChange={(e) =>
                            handleQuestionChange(currentQuestionIndex, "question", e.target.value)
                        }
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                </div>
                {/* Question type */}
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Question Type
                  </label>
                  <select
                        value={quizQuestions[currentQuestionIndex].questionType}
                        onChange={(e) =>
                            handleQuestionChange(currentQuestionIndex, "questionType", e.target.value)
                        }
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
                  {quizQuestions[currentQuestionIndex].answers.map((answer, aIndex) => (
                        <input
                            key={aIndex}
                            type="text"
                            placeholder={`Choice ${aIndex + 1}`}
                            value={answer}
                            onChange={(e) =>
                                handleAnswerChange(currentQuestionIndex, aIndex, e.target.value)
                            }
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            disabled={quizQuestions[currentQuestionIndex].questionType === "TRUE/FALSE"}
                        />
                    ))}
                </div>
                {/* Correct Answer */}
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Correct Answer
                  </label>
                  <select
                        value={quizQuestions[currentQuestionIndex].correctAnswer}
                        onChange={(e) =>
                            handleQuestionChange(
                                currentQuestionIndex,
                                "correctAnswer",
                                e.target.value,
                            )
                        }
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        >
                        <option value="">Select Correct Answer</option>
                        {quizQuestions[currentQuestionIndex].answers.map((answer, aIndex) => (
                            <option key={aIndex} value={answer}>
                                {answer || `Choice ${aIndex + 1}`}
                            </option>
                        ))}
                    </select>
                </div>
                </div>
            )}
       
          </>
        )}
        <div className="flex flex-row">
          <button
            type="submit"
            className="flex w-fit justify-center rounded bg-green-600 p-2 font-medium text-white hover:bg-opacity-90"
          >
            Add Quiz
          </button>
          &nbsp;&nbsp;
          <button
            type="button"
            onClick={() => router.push("/quizzes")}
            className="flex w-fit justify-center rounded bg-primary p-2 font-medium text-white hover:bg-opacity-90"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
