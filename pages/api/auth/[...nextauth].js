import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: '0ae75bbfb9e3d585d72e',
      clientSecret: 'fb24571af8e2647ef10af965f96a6368bd7fc27e'
    }),
    GoogleProvider({
      clientId: '456922698011-4pv47u72g6nonk8bbnq292io0g2pk7vi.apps.googleusercontent.com',
      clientSecret: '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',
    })
  ],
  theme: {
    colorScheme: "light",
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
