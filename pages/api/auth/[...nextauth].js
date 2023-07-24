import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export const authOptions = {
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_ID,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET
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
    async signIn(user, account, profile) {
      const res = await fetch('https://careyayapersonalblog.vercel.app/api/userinfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          bio: 'No bio yet',
          resume_link: '',
        }),
      });
  
      // If the user is not created for some reason, we deny the login
      if (res.status !== 200) {
        return false;
      }
  
      // If everything is fine, we proceed
      return true;
    },
  },
}

export default NextAuth(authOptions)