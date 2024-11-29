"use client";

import CardDataStats from "../CardDataStats";
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
  const [quizes, setQuizes] = useState([]);

  // const processQuizes = (data) => {
  //   const grouped = data.reduce((acc, quiz) => {
  //     if (!acc[quiz.quiz]) {
  //       acc[quiz.quiz] = {
  //         ...quiz,
  //         count: 1,
  //       };
  //     } else {
  //       acc[quiz.quiz].count += 1;
  //       acc[quiz.quiz].score += quiz.score;
  //       acc[quiz.quiz].correctResponses += quiz.correctResponses;
  //       acc[quiz.quiz].incorrectResponses += quiz.incorrectResponses;
  //     }
  //     return acc;
  //   }, {});
  //   return Object.values(grouped);
  // };

  // const totalScore = quizes.reduce((acc, item) => acc + item.score, 0);
  // const totalCorrectResponses = quizes.reduce((acc, item) => acc + item.correctResponses, 0);
  // const totalIncorrectResponses = quizes.reduce((acc, item) => acc + item.incorrectResponses, 0);

  // const numberOfEntries = quizes.length;
  // const averageScore = Math.floor(totalScore / numberOfEntries)
  // const averageCorrectResponses = Math.floor(totalCorrectResponses / numberOfEntries);
  // const averageIncorrectResponses = Math.floor(totalIncorrectResponses / numberOfEntries);

  useEffect(() => {
    async function fetchData() {
      const data = await quizAnalytics();
      setQuizes(data);
    }
    fetchData();
  }, []);

  console.log("quizes",quizes);
  

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-3">
        {/* <CardDataStats title="Average Score" total={averageScore}  >
        </CardDataStats>
        <CardDataStats title="Average Correct Responses" total={averageCorrectResponses}  >
        </CardDataStats>
        <CardDataStats title="Average Incorrect Responses" total={averageIncorrectResponses}  >
        </CardDataStats>
        <CardDataStats title="Total Entries" total={numberOfEntries}  >
        </CardDataStats> */}
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                  Quiz
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                  Count
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                  Total Score
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Total Correct Responses
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Total Incorrect Responses
                </th>
              </tr>
            </thead>
            <tbody>
              {quizes.map((quiz, key) => (
                <tr key={key}>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {quiz.quizName}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {quiz.count}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {quiz.score}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {quiz.correctResponses}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {quiz.incorrectResponses}
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