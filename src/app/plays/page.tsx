import QuizAccess from "@/components/Tables/QuizAccess";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Available quizzes",
  description:
    "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <div className="flex flex-col gap-10 mt-4">
        <QuizAccess />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
