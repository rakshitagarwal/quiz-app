import DefaultLayout from '@/components/Layouts/DefaultLayout';
import ActiveQuiz from '../../../components/Quiz/ActiveQuiz'
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
    title: "View Quiz",
    description: "View Quiz",
};


type QuizViewParams = {
    params: {
        id: string;
    };
};
export default async function PlayQuiz({ params }: QuizViewParams) {
    const { id } = params;
    const { quiz } = await getQuizById(id);
    const { title, description, questions, privacy } = quiz;

    return (
        <DefaultLayout>
        <ActiveQuiz id={id} title={title} description={description} questions={questions} privacy={privacy} />
        </DefaultLayout>
    )
}
