import DefaultLayout from "@/components/Layouts/DefaultLayout";
import EditQuiz from "@/components/Quiz/EditQuiz";
import { Metadata } from "next";

const getQuizById = async (id: string) => {
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

export const metadata: Metadata = {
  title: "Edit Quiz",
  description: "Edit Quiz",
};

type QuizEditParams = {
  params: {
    id: string;
  };
};

export default async function QuizEdit({ params }: QuizEditParams) {
  const { id } = params;
  const { quiz } = await getQuizById(id);
  const { title, description, questions } = quiz;

  return (
    <>
      <DefaultLayout>
        <EditQuiz
          id={id}
          title={title}
          description={description}
          questions={questions}
        />
      </DefaultLayout>
    </>
  );
}
