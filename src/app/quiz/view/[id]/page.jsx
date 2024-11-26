import DefaultLayout from "@/components/Layouts/DefaultLayout";


const getQuizById = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/quiz/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch topic");
    }

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export default async function ViewQuiz({ params }) {
  const { id } = params;
  const { quiz } = await getQuizById(id);
  const { title, description, questions } = quiz;

  return (
    <DefaultLayout>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">Quiz Details</h3>
        </div>
        <div className="p-6.5">
          <div className="mb-4.5">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Quiz Title</label>
            <input
              type="text"
              placeholder="Enter quiz title"
              value={title}

              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
          <div className="mb-4.5">
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Quiz Description</label>
            <input
              type="text"
              placeholder="Enter quiz description"
              value={description}
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
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">Question Type</label>
                <select
                  value={question.type}
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
                        className="flex-grow rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      <input
                        type="checkbox"
                        checked={option.isCorrect}
                        className="w-5 h-5"
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );

}
