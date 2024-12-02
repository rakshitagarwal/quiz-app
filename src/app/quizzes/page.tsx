import TableThree from "@/components/Tables/TableThree";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quizzes",
  description:
    "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <div>
        <Link href={"/quiz/add"}>
          <button className="flex w-fit mt-10 justify-center rounded bg-primary p-2 font-medium text-gray hover:bg-opacity-90">
            Add Quiz
          </button>
        </Link>
        {/* <Link href={"/quiz/pdf"}>
          <button className="flex w-fit mt-10 justify-center rounded bg-primary p-2 font-medium text-gray hover:bg-opacity-90">
            View PDF
          </button>
        </Link> */}
      </div>
      <div className="flex flex-col gap-10 mt-4">
        <TableThree />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
