import EditQuizForm from '../../../../components/Quiz/QuizEdit'

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

export default async function EditQuiz({ params }) {
  const { id } = params;
  const { quiz } = await getQuizById(id);
  const { title, description, questions, privacy } = quiz;

  return <EditQuizForm id={id} title={title} description={description} questions={questions} privacy={privacy} />;
}
