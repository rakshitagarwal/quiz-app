import React from "react";

import { Metadata } from "next";
import UserAdd from "@/components/Authentication/UserAdd";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "This is Next.js SignUp Page TailAdmin Dashboard Template",
};

const SignUp: React.FC = () => {
  return (
   <UserAdd/>
  );
};

export default SignUp;
