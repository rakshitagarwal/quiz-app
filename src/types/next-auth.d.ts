import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string; // Extend user object with role
    };
  }
}
