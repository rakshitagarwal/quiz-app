"use client";

import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { MdDelete, MdModeEditOutline } from "react-icons/md";

const TableThree = () => {
  const router = useRouter()
  const [quizes, setQuizes] = useState([]);

  const getQuizes = async () => {
    try {
      const session = await getSession()
      const res = await fetch("http://localhost:3000/api/quiz", {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ createdBy: session.user._id }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch quizzes");
      }
      const { quizes } = await res.json();
      setQuizes(quizes);
      return;
    } catch (error) {
      console.log("Error loading quizzes: ", error);
    }
  };

  useEffect(() => {
    getQuizes();
  }, []);

  const removeQuiz = async (id) => {
    const confirmed = confirm("Are you sure?");
    if (confirmed) {
      const res = await fetch(`http://localhost:3000/api/quiz/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await getQuizes();
      } else console.log("Failed to delete the quiz.");
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Name
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Description
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Total Questions
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {quizes.map((quiz, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {quiz.title}
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {quiz.description}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p>{quiz.questions.length}</p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button onClick={() => router.push(`/quiz/${quiz._id}`)} className="hover:text-primary">
                      <FaEye />
                    </button>
            
                      <button onClick={() => removeQuiz(quiz._id)} className="hover:text-primary">
                        <MdDelete />
                      </button>

                      <button onClick={() => router.push(`/quiz/edit/${quiz._id}`)} className="hover:text-primary">
                        <MdModeEditOutline />
                      </button>
                   
                 
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableThree;
