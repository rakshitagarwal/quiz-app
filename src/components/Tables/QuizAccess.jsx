"use client";

import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaRegCirclePlay } from "react-icons/fa6";

const QuizAccess = () => {
  const router = useRouter()
  const [entries, setEntries] = useState([]);

  const getQuizes = async () => {
    try {
      const session = await getSession()
      const res = await fetch(`http://localhost:3000/api/test/${session.user._id}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ playedBy: session.user._id }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch quizzes");
      }
      const { analytics } = await res.json();
      setEntries(analytics);
      return;
    } catch (error) {
      console.log("Error loading quizzes: ", error);
    }
  };

  useEffect(() => {
    getQuizes();
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Quiz Available
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Score
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {entry.quizName}
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {entry.status}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {entry.score}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button onClick={() => router.push(`/quiz/${entry.quiz}`)} className="hover:text-primary">
                    <FaRegCirclePlay />
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

export default QuizAccess;
