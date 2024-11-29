import { Metadata } from "next";
import AddQuiz from "../../../components/Quiz/AddQuiz";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Add Quiz",
  description: "Add Quiz",
};

export default function QuizAdd() {
  return (
    <DefaultLayout>
      <AddQuiz />
    </DefaultLayout>
  );
}
