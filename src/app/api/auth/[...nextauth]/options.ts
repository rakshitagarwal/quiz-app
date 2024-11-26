import type { NextAuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'

export const options: NextAuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username:",
                    type: "text",
                    placeholder: "your-cool-username"
                },
                password: {
                    label: "Password:",
                    type: "password",
                    placeholder: "your-awesome-password"
                }
            },
            async authorize(credentials) {
                // This is where you need to retrieve user data 
                // to verify with credentials
                // Docs: https://next-auth.js.org/configuration/providers/credentials

                const res = await fetch(`http://localhost:3000/api/user/`, {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({ username: credentials?.username, password: credentials?.password }),
                });
                const { userFound } = await res.json()
                if (credentials?.username === userFound.username && credentials?.password === userFound.password) {
                    return userFound
                } else {
                    return null
                }
            }
        })
    ],
    pages: {
        signIn: '/signin', 
      },
}