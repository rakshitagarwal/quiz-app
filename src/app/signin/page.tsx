import React from "react";

import { Metadata } from "next";
import UserLogin from "@/components/Authentication/UserLogin";

export const metadata: Metadata = {
  title: "Sign In",
  description: "This is Next.js Signin Page TailAdmin Dashboard Template",
};

const SignInPage: React.FC = () => {
 
  return (
    <UserLogin />
  )
};

export default SignInPage;
