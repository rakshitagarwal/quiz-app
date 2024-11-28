import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ActiveQuiz from "../../../components/Quiz/ActiveQuiz";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

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

const findEntry = async (id: string, userId: string) => {
  try {
    const res = await fetch("http://localhost:3000/api/test", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        quiz: id,
        playedBy: userId,
      }),
    });

    if (res.status === 404) {
      return null; // No entry found
    }

    if (!res.ok) {
      throw new Error("Failed to fetch entry");
    }

    const data = await res.json();
    return data.analytics._id; // Return the existing entry's ID
  } catch (error) {
    console.error(error);
    return null;
  }
};

const addEntry = async (id: string, userId: string) => {
  try {
    const res = await fetch("http://localhost:3000/api/test", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        quiz: id,
        playedBy: userId,
        score: 0,
        correctResponses: 0,
        incorrectResponses: 0,
        status: "Fail",
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      console.error("Failed to create entry:", data.message);
      throw new Error("Failed to create entry");
    }
  } catch (error) {
    console.error(error);
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
  const { title, description, questions } = quiz;
  let analyticsId;
  const session = await getServerSession(options);
//   if (!session) {
//     redirect(`/signup?callbackUrl=/quiz/${id}`);
//   }

  if (session?.user?.role === "STUDENT") {
    const entryId = await findEntry(id, session?.user?._id as string);

    if (!entryId) {
      await addEntry(id, session?.user?._id as string);
    }
    analyticsId = entryId;
  }

  return (
    <DefaultLayout>
      <ActiveQuiz
        quizId={id}
        userId={session?.user._id}
        entryId={analyticsId}
        title={title}
        description={description}
        questions={questions}
      />
    </DefaultLayout>
  );
}