import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export const authOptions = {
  secret: '8daab06adc82da5225d47102e86e0fd0',
  providers: [
    GithubProvider({
      clientId: '0ae75bbfb9e3d585d72e',
      clientSecret: 'fb24571af8e2647ef10af965f96a6368bd7fc27e'
    })
  ],
  theme: {
    colorScheme: "dark",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({session, token}){
      if (session.user) {
        session.user.id = token.id
      }
      return session
    },
  },
}

export default NextAuth(authOptions)