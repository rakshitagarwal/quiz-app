"use client";

import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

const quizAnalytics = async () => {
  try {
    const session = await getSession();
    const res = await fetch(`http://localhost:3000/api/test/${session.user._id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ createdBy: session.user._id }),
    });
    if (!res.ok) {
      throw new Error("Failed to get analytics");
    }
    const { analytics } = await res.json();
    return analytics;
  } catch (error) {
    console.error(error);
  }
};

const ECommerce = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await quizAnalytics();

      const groupedData = data.reduce((acc, quiz) => {
        if (!acc[quiz.quizName]) {
          acc[quiz.quizName] = {
            quizName: quiz.quizName,
            totalScore: 0,
            totalCorrectResponses: 0,
            totalIncorrectResponses: 0,
            count: 0,
          };
        }
        acc[quiz.quizName].totalScore += quiz.score;
        acc[quiz.quizName].totalCorrectResponses += quiz.correctResponses;
        acc[quiz.quizName].totalIncorrectResponses += quiz.incorrectResponses;
        acc[quiz.quizName].count += 1;
        return acc;
      }, {});

      const result = Object.values(groupedData).map((quiz) => ({
        quizName: quiz.quizName,
        avgScore: (quiz.totalScore / quiz.count).toFixed(2),
        avgCorrectResponses: (quiz.totalCorrectResponses / quiz.count).toFixed(2),
        avgIncorrectResponses: (quiz.totalIncorrectResponses / quiz.count).toFixed(2),
        totalCount: quiz.count
      }));

      setQuizzes(result);
    }
    fetchData();
  }, []);

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                  Quiz
                </th>
                <th className="min-w-[220px] px-0 py-4 font-medium text-black dark:text-white xl:pl-11">
                  Played
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                  Average Score
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Average Correct Responses
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Average Incorrect Responses
                </th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz, key) => (
                <tr key={key}>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {quiz.quizName}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] pl-10 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {quiz.totalCount}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {quiz.avgScore}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {quiz.avgCorrectResponses}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {quiz.avgIncorrectResponses}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ECommerce;