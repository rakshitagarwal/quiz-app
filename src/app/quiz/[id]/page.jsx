import ActiveQuiz from '../../../components/ActiveQuiz'

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

export default async function PlayQuiz({ params }) {
    const { id } = params;
    const { quiz } = await getQuizById(id);
    const { title, description, questions } = quiz;

    return <ActiveQuiz id={id} title={title} description={description} questions={questions} />
}
