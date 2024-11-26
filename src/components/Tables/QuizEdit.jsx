"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import DefaultLayout from "../Layouts/DefaultLayout";

export default function EditQuizForm({ id, title, description, questions }) {
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [newQuestions, setQuestions] = useState(questions);

  const router = useRouter();

  const handleAddQuestion = () => {
    setQuestions([
      ...newQuestions,
      { questionText: "", type: "Multiple Choice", options: [{ text: "", isCorrect: false }] },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(newQuestions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...newQuestions];
    updatedQuestions[index][field] = value;

    if (field === "type" && value !== "Multiple Choice") {
      updatedQuestions[index].options = []; // Clear options for non-MCQ types
    }

    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const updatedQuestions = [...newQuestions];
    updatedQuestions[qIndex].options[oIndex][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (qIndex) => {
    const updatedQuestions = [...newQuestions];
    updatedQuestions[qIndex].options.push({ text: "", isCorrect: false });
    setQuestions(updatedQuestions);
  };

  const handleRemoveOption = (qIndex, oIndex) => {
    const updatedQuestions = [...newQuestions];
    updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.filter((_, i) => i !== oIndex);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/api/temp/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ title: newTitle, description: newDescription, questions: newQuestions }),
      });

      if (!res.ok) {
        throw new Error("Failed to update quiz");
      }

      router.refresh();
      router.push("/tables");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DefaultLayout>
 
    <form onSubmit={handleSubmit} className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
  <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
    <h3 className="font-medium text-black dark:text-white">Update Quiz</h3>
  </div>
  <div className="p-6.5">
    <div className="mb-4.5">
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">Quiz Title</label>
      <input
        type="text"
        placeholder="Enter quiz title"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      />
    </div>
    <div className="mb-4.5">
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">Quiz Description</label>
      <input
        type="text"
        placeholder="Enter quiz description"
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
      />
    </div>
    {newQuestions.map((question, qIndex) => (
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
                <input
                  type="checkbox"
                  checked={option.isCorrect}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, "isCorrect", e.target.checked)}
                  className="w-5 h-5"
                />
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
    {newQuestions.length < 50 && (
      <button
        type="button"
        onClick={handleAddQuestion}
        className="mb-4 w-fit flex justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90"
      >
        Add Question
      </button>
    )}
    <button
      type="submit"
      className="w-fit flex justify-center rounded bg-green-600 p-3 font-medium text-white hover:bg-opacity-90"
    >
      Update Quiz
    </button>
  </div>
</form>

    </DefaultLayout>
  );
}
